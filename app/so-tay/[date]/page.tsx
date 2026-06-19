'use client';

import React, { useState, useEffect, use } from 'react';
import Header from '@/components/layout/Header';
import { useSelector } from 'react-redux';
import DayPlan, { DayPlanRow } from '@/components/dayPlan';
import { PlanService } from '@/services/PlanService';
import { useRouter } from 'next/navigation';

export default function DayPlanPage({ params }: { params: Promise<{ date: string }> }) {
  const router = useRouter();
  const user = useSelector((state: any) => state.user);
  
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  // parse date from params (e.g., '2026-06-19' or '19-06-2026')
  const dateStr = resolvedParams.date;
  const [dayPlanData, setDayPlanData] = useState<{
    rows: DayPlanRow[]; 
    reflection: string; 
    status: 'draft' | 'submitted' | 'reviewed';
    selfScore?: number;
    aiScore?: number;
    aiFeedback?: string;
    teacherComment?: string;
    teacherScore?: number;
    teacherCommentAt?: string;
  } | undefined>(undefined);
  
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Parse date string for label
  const parts = dateStr.split('-');
  let displayDate = dateStr;
  let queryDate = dateStr;
  if (parts.length === 3) {
    if (parts[0].length === 4) { // YYYY-MM-DD
      displayDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      queryDate = dateStr;
    } else { // DD-MM-YYYY
      displayDate = `${parts[0]}/${parts[1]}/${parts[2]}`;
      queryDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
  }

  useEffect(() => {
    if (!user.id) return;
    setIsLoading(true);
    
    const [year, month] = queryDate.split('-');
    
    // Fetch both goals and daily action
    Promise.all([
      PlanService.getGoal(user.id, parseInt(month), parseInt(year)),
      PlanService.getDailyActions(user.id, queryDate, queryDate)
    ])
      .then(([goalRes, actionRes]) => {
        // Handle goals -> categories
        if (goalRes.status === 'OK' && goalRes.data && goalRes.data.goals) {
          const aspects = goalRes.data.goals.map((g: any) => g.aspect).filter(Boolean);
          setCategories(Array.from(new Set(aspects)));
        }

        // Handle daily action
        if (actionRes.status === 'OK' && actionRes.data && actionRes.data.length > 0) {
          const action = actionRes.data[0];
          setDayPlanData({
            rows: action.tasks || [],
            reflection: action.reflection || '',
            status: action.status || 'draft',
            selfScore: action.selfScore,
            aiScore: action.aiScore,
            aiFeedback: action.aiFeedback,
            teacherComment: action.teacherComment,
            teacherScore: action.teacherScore,
            teacherCommentAt: action.teacherCommentAt
          });
        } else {
          setDayPlanData({
            rows: [],
            reflection: '',
            status: 'draft'
          });
        }
      })
      .catch(err => console.error("Error fetching day plan data:", err))
      .finally(() => setIsLoading(false));
  }, [user.id, queryDate]);

  const handleSaveDayPlan = (plan: { rows: DayPlanRow[]; reflection: string; status: 'draft' | 'submitted' }) => {
    if (!user.id) return;
    
    PlanService.createOrUpdateDailyAction({
      studentId: user.id,
      date: new Date(queryDate),
      tasks: plan.rows,
      reflection: plan.reflection,
      selfScore: plan.rows.length > 0 ? Math.round(plan.rows.reduce((acc, r) => acc + r.score, 0) / plan.rows.length) : 10,
      status: plan.status
    })
    .then(res => {
      if (res.status === 'OK') {
        router.push('/so-tay');
      }
    })
    .catch(err => console.error("Error saving daily action:", err));
  };

  return (
    <div className="min-h-screen bg-[#faf8f6] font-sans text-gray-800 pb-20">
      <Header />
      {isLoading ? (
        <div className="flex justify-center items-center mt-20">
          <p className="text-gray-500 font-medium">Đang tải kế hoạch...</p>
        </div>
      ) : (
        <DayPlan
          dateLabel={displayDate}
          onBack={() => router.push('/so-tay')}
          onSavePlan={handleSaveDayPlan}
          initialPlan={dayPlanData}
          categories={categories}
        />
      )}
    </div>
  );
}
