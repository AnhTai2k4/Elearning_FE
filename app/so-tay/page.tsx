'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import { useSelector } from 'react-redux';
import MonthTarget, { TargetRow } from '@/components/monthTarget';
import DayPlan, { DayPlanRow } from '@/components/dayPlan';
import { PlanService } from '@/services/PlanService';

export default function NotebookPage() {
  const user = useSelector((state: any) => state.user);
  
  // Date and selector states
  const [selectedMonth, setSelectedMonth] = useState<number>(5); // May
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  
  // Goals state using modal TargetRow type
  const [goals, setGoals] = useState<TargetRow[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Active view controller: 'dashboard' | 'day-plan'
  const [activeView, setActiveView] = useState<'dashboard' | 'day-plan'>('dashboard');

  // Currently selected day in the calendar grid
  const [selectedDay, setSelectedDay] = useState<number>(22);

  // Store day plan details mapping: "day-month-year" -> plan data
  const [dayPlans, setDayPlans] = useState<Record<string, { 
    rows: DayPlanRow[]; 
    reflection: string; 
    status: 'draft' | 'submitted' | 'reviewed';
    selfScore?: number;
    aiScore?: number;
    aiFeedback?: string;
    teacherComment?: string;
    teacherScore?: number;
    teacherCommentAt?: string;
  }>>({});

  // Calendar marked days: mapping day number -> state ('completed' | 'planned' | 'none')
  const [markedDays, setMarkedDays] = useState<Record<number, 'completed' | 'planned' | 'none'>>({});

  // Sync data from database using useEffect and PlanService
  React.useEffect(() => {
    if (!user.id) return;

    // 1. Fetch Monthly Goal
    PlanService.getGoal(user.id, selectedMonth, selectedYear)
      .then(res => {
        if (res.status === 'OK' && res.data) {
          setGoals(res.data.goals || []);
        } else {
          setGoals([]);
        }
      })
      .catch(err => console.error("Error fetching goals:", err));

    // 2. Fetch all Daily Actions for this month
    const startStr = `${selectedYear}-${selectedMonth < 10 ? '0' + selectedMonth : selectedMonth}-01`;
    const endStr = `${selectedYear}-${selectedMonth < 10 ? '0' + selectedMonth : selectedMonth}-31`;
    PlanService.getDailyActions(user.id, startStr, endStr)
      .then(res => {
        if (res.status === 'OK' && res.data) {
          const newMarked: Record<number, 'completed' | 'planned' | 'none'> = {};
          const newPlansMap: Record<string, { 
            rows: DayPlanRow[]; 
            reflection: string; 
            status: 'draft' | 'submitted' | 'reviewed';
            selfScore?: number;
            aiScore?: number;
            aiFeedback?: string;
            teacherComment?: string;
            teacherScore?: number;
            teacherCommentAt?: string;
          }> = {};
          
          res.data.forEach((action: any) => {
            const actDate = new Date(action.date);
            const dayNum = actDate.getDate();
            newMarked[dayNum] = (action.status === 'submitted' || action.status === 'reviewed')
              ? 'completed'
              : 'planned';
            
            const dateKey = `${dayNum}-${selectedMonth}-${selectedYear}`;
            newPlansMap[dateKey] = {
              rows: action.tasks || [],
              reflection: action.reflection || '',
              status: action.status || 'draft',
              selfScore: action.selfScore,
              aiScore: action.aiScore,
              aiFeedback: action.aiFeedback,
              teacherComment: action.teacherComment,
              teacherScore: action.teacherScore,
              teacherCommentAt: action.teacherCommentAt
            };
          });
          setMarkedDays(newMarked);
          setDayPlans(newPlansMap);
        } else {
          setMarkedDays({});
          setDayPlans({});
        }
      })
      .catch(err => console.error("Error fetching daily actions:", err));
  }, [user.id, selectedMonth, selectedYear]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  const handleSaveGoals = (newGoals: TargetRow[]) => {
    if (!user.id) return;
    PlanService.createOrUpdateGoal({
      studentId: user.id,
      month: selectedMonth,
      year: selectedYear,
      goals: newGoals,
      status: 'draft'
    })
    .then(res => {
      if (res.status === 'OK') {
        setGoals(newGoals);
      }
    })
    .catch(err => console.error("Error saving goals:", err));
  };

  const handleSaveDayPlan = (plan: { rows: DayPlanRow[]; reflection: string; status: 'draft' | 'submitted' }) => {
    if (!user.id) return;
    const dateStr = `${selectedYear}-${selectedMonth < 10 ? '0' + selectedMonth : selectedMonth}-${selectedDay < 10 ? '0' + selectedDay : selectedDay}`;
    
    PlanService.createOrUpdateDailyAction({
      studentId: user.id,
      date: new Date(dateStr),
      tasks: plan.rows,
      reflection: plan.reflection,
      selfScore: plan.rows.length > 0 ? Math.round(plan.rows.reduce((acc, r) => acc + r.score, 0) / plan.rows.length) : 10,
      status: plan.status
    })
    .then(res => {
      if (res.status === 'OK' && res.data) {
        const dateKey = `${selectedDay}-${selectedMonth}-${selectedYear}`;
        const savedAction = res.data;
        setDayPlans(prev => ({
          ...prev,
          [dateKey]: {
            rows: savedAction.tasks || [],
            reflection: savedAction.reflection || '',
            status: savedAction.status || 'draft',
            selfScore: savedAction.selfScore,
            aiScore: savedAction.aiScore,
            aiFeedback: savedAction.aiFeedback,
            teacherComment: savedAction.teacherComment,
            teacherScore: savedAction.teacherScore,
            teacherCommentAt: savedAction.teacherCommentAt
          }
        }));
        setMarkedDays(prev => ({
          ...prev,
          [selectedDay]: ((plan.status as string) === 'submitted' || (plan.status as string) === 'reviewed')
            ? 'completed'
            : 'planned'
        }));
        setActiveView('dashboard');
      }
    })
    .catch(err => console.error("Error saving daily action:", err));
  };

  // Get calendar days for chosen month dynamically
  const getCalendarDays = () => {
    const firstDayIndex = (new Date(selectedYear, selectedMonth - 1, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const prevDaysInMonth = new Date(selectedYear, selectedMonth - 1, 0).getDate();
    
    const days = [];
    // Prev month padding
    for (let i = firstDayIndex; i > 0; i--) {
      days.push({ day: prevDaysInMonth - i + 1, isCurrentMonth: false, isToday: false });
    }
    // Current month days
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = today.getDate() === i && 
                      today.getMonth() === selectedMonth - 1 && 
                      today.getFullYear() === selectedYear;
      days.push({ day: i, isCurrentMonth: true, isToday });
    }
    // Next month padding (up to 35 or 42 cells dynamically to avoid empty 6th row)
    const totalCells = days.length <= 35 ? 35 : 42;
    const nextPadding = totalCells - days.length;
    for (let i = 1; i <= nextPadding; i++) {
      days.push({ day: i, isCurrentMonth: false, isToday: false });
    }
    return days;
  };

  const calendarDays = getCalendarDays();

  // Statistics values
  const plannedDaysCount = Object.values(markedDays).filter(v => v === 'completed').length;
  const completedWeeks = plannedDaysCount >= 4 ? 1 : 0;
  const totalHours = Object.values(dayPlans)
    .filter(plan => plan.status === 'submitted' || plan.status === 'reviewed')
    .reduce((sum, plan) => {
      const planSum = plan.rows.reduce((acc, row) => acc + (Number(row.actualTime) || 0), 0);
      return sum + planSum;
    }, 0);
  const submittedPlans = Object.values(dayPlans).filter(
    plan => plan.status === 'submitted' || plan.status === 'reviewed'
  );
  const disciplineScore = submittedPlans.length > 0
    ? (submittedPlans.reduce((sum, plan) => sum + (plan.selfScore ?? 10), 0) / submittedPlans.length).toFixed(1)
    : '0';

  if (activeView === 'day-plan') {
    return (
      <div className="min-h-screen bg-[#faf8f6] font-sans text-gray-800 pb-20">
        <Header />
        <DayPlan
          dateLabel={`${selectedDay < 10 ? '0' + selectedDay : selectedDay}/${selectedMonth < 10 ? '0' + selectedMonth : selectedMonth}/${selectedYear}`}
          onBack={() => setActiveView('dashboard')}
          onSavePlan={handleSaveDayPlan}
          initialPlan={dayPlans[`${selectedDay}-${selectedMonth}-${selectedYear}`]}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f6] font-sans text-gray-800 pb-20">
      <Header />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8">
        
        {/* Top Header section: Title and Month dropdown */}
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-[26px] font-black text-[#005082]">Tổng quan</h1>
          <div className="relative">
            <select
              value={`${selectedMonth}-${selectedYear}`}
              onChange={(e) => {
                const [m, y] = e.target.value.split('-').map(Number);
                setSelectedMonth(m);
                setSelectedYear(y);
              }}
              className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-1.5 pr-10 text-[13px] font-medium text-gray-600 outline-none shadow-sm cursor-pointer hover:border-gray-300 transition-all"
            >
              <option value="5-2026">Tháng 5, 2026</option>
              <option value="6-2026">Tháng 6, 2026</option>
              <option value="7-2026">Tháng 7, 2026</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* 4 Statistics Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          
          {/* Card 1: Ngày đã lập kế hoạch */}
          <div className="bg-[#e6f4ff]/50 rounded-2xl p-5 flex items-center gap-4 border border-blue-100/50 shadow-sm">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-black text-blue-600 leading-none mb-1">{plannedDaysCount}</p>
              <p className="text-[12px] text-gray-500 font-medium">Ngày đã lập kế hoạch</p>
            </div>
          </div>

          {/* Card 2: Tuần hoàn thành mục tiêu */}
          <div className="bg-[#f0edff]/50 rounded-2xl p-5 flex items-center gap-4 border border-purple-100/50 shadow-sm">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-purple-500 shadow-sm shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-black text-purple-600 leading-none mb-1">{completedWeeks}</p>
              <p className="text-[12px] text-gray-500 font-medium">Tuần hoàn thành mục tiêu</p>
            </div>
          </div>

          {/* Card 3: Giờ thực hiện */}
          <div className="bg-[#e6f7ed]/50 rounded-2xl p-5 flex items-center gap-4 border border-green-100/50 shadow-sm">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-500 shadow-sm shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-black text-green-600 leading-none mb-1">{totalHours}</p>
              <p className="text-[12px] text-gray-500 font-medium">Giờ thực hiện</p>
            </div>
          </div>

          {/* Card 4: Điểm kỷ luật trung bình */}
          <div className="bg-[#ffebe6]/50 rounded-2xl p-5 flex items-center gap-4 border border-red-100/50 shadow-sm">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <p className="text-3xl font-black text-red-500 leading-none mb-1">{disciplineScore}</p>
              <p className="text-[12px] text-gray-500 font-medium">Điểm kỷ luật trung bình</p>
            </div>
          </div>

        </div>

        {/* 2-Column Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column Left (Calendar tracker) - 5 Cols */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            
            {/* Calendar header info */}
            <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-6">
              <svg className="w-5 h-5 text-[#0072BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-bold text-[15px] text-[#002b49]">Theo dõi kế hoạch</span>
            </div>

            {/* Calendar Grid wrapper */}
            <div className="text-center">
              {/* Calendar Navigator */}
              <div className="flex items-center justify-between mb-4 px-2">
                <button 
                  onClick={handlePrevMonth} 
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 font-bold"
                >
                  &lt;
                </button>
                <span className="font-bold text-gray-800 text-[14px]">
                  Tháng {selectedMonth}, {selectedYear}
                </span>
                <button 
                  onClick={handleNextMonth} 
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600 font-bold"
                >
                  &gt;
                </button>
              </div>

              {/* Day Titles */}
              <div className="grid grid-cols-7 gap-2 mb-2 text-[12px] font-bold text-gray-500">
                <div>T.2</div>
                <div>T.3</div>
                <div>T.4</div>
                <div>T.5</div>
                <div>T.6</div>
                <div>T.7</div>
                <div>CN</div>
              </div>

              {/* Days Numbers */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((item, idx) => {
                  const isCompleted = markedDays[item.day] === 'completed' && item.isCurrentMonth;
                  const isPlanned = markedDays[item.day] === 'planned' && item.isCurrentMonth;
                  const isSelected = selectedDay === item.day && item.isCurrentMonth;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.isCurrentMonth) {
                          setSelectedDay(item.day);
                        }
                      }}
                      className={`h-10 rounded-md border flex items-center justify-center text-[13px] font-bold transition-all relative ${
                        !item.isCurrentMonth 
                          ? 'border-transparent text-gray-300 cursor-default' 
                          : isSelected
                          ? 'border-gray-400 bg-gray-200/80 text-gray-800 ring-2 ring-gray-300/40'
                          : isCompleted
                          ? 'border-green-500 bg-green-50/30 text-green-700'
                          : isPlanned
                          ? 'border-blue-300 bg-blue-50/20 text-[#0072BC]'
                          : 'border-gray-100 bg-white hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {item.day}
                    </button>
                  );
                })}
              </div>

              {/* Calendar Legend */}
              <div className="mt-6 pt-4 border-t border-gray-50 flex flex-wrap gap-4 items-center justify-center text-[12px] text-gray-600">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded border border-green-500 bg-green-50/30"></div>
                  <span>Đã hoàn thành</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded border border-blue-300 bg-blue-50/20"></div>
                  <span>Đã lên kế hoạch</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded border border-gray-200 bg-white"></div>
                  <span>Chưa lập kế hoạch</span>
                </div>
              </div>

              {/* Lập kế hoạch button for the selected day */}
              {selectedDay && (
                <button
                  onClick={() => setActiveView('day-plan')}
                  className="w-full mt-5 bg-[#0072BC] hover:bg-[#005e9c] text-white font-bold text-[13px] py-2.5 rounded-full flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  {(markedDays[selectedDay] === 'completed' || markedDays[selectedDay] === 'planned') ? 'Xem kế hoạch hôm nay' : 'Lập kế hoạch ngày hôm nay'}{' '}
                  <span className="text-base leading-none">→</span>
                </button>
              )}
            </div>

          </div>

          {/* Column Right (Monthly targets) - 7 Cols */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[420px] flex flex-col">
            
            {/* Header section with title and Add button */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#0072BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-bold text-[15px] text-[#002b49]">Mục tiêu trong tháng</span>
              </div>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0072BC] hover:bg-[#005e9c] text-white font-bold text-[12px] px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>+</span> Lập mục tiêu tháng
              </button>
            </div>

            {/* Goal list or Empty state */}
            <div className="flex-1 flex flex-col justify-center">

              {goals.length > 0 ? (
                <div className="flex-1 overflow-x-auto w-full pr-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[#002b49] text-[12px] font-bold border-b border-gray-200">
                        <th className="p-3 w-12 text-center">STT</th>
                        <th className="p-3">Khía cạnh</th>
                        <th className="p-3">Dự kiến /Tuần</th>
                        <th className="p-3">Hành động</th>
                        <th className="p-3 text-center">Kỳ vọng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-[13px]">
                      {goals.map((goal, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-3 text-center font-bold text-gray-400">{idx + 1}</td>
                          <td className="p-3 font-semibold text-gray-700">{goal.aspect}</td>
                          <td className="p-3 text-gray-600">{goal.duration}</td>
                          <td className="p-3 text-gray-600">{goal.action}</td>
                          <td className="p-3 text-center font-black text-[#f15a24]">{goal.expectedScore}/10</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center flex-1">
                  <div className="relative w-28 h-28 mb-4 flex items-center justify-center bg-blue-50/50 rounded-full">
                    {/* Illustration design */}
                    <svg className="w-16 h-16 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="11" cy="11" r="8" strokeWidth="2" strokeLinecap="round" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="11" cy="11" r="3" strokeWidth="1.5" strokeDasharray="3 3" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-[14px] font-medium max-w-[280px] leading-relaxed">
                    Bạn chưa lập mục tiêu nào trong tháng này!
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Month Target Modal */}
      <MonthTarget
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGoals}
        initialTargets={goals}
        selectedMonthLabel={`Tháng ${selectedMonth}, ${selectedYear}`}
      />
    </div>
  );
}