'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PlanService } from '@/services/PlanService';
import { CourseService, CourseData } from '@/services/CourseService';
import Header from '@/components/layout/Header';

import TeacherReviews from '@/components/teacher/TeacherReviews';
import TeacherCourses from '@/components/teacher/TeacherCourses';
import TeacherAnalytics from '@/components/teacher/TeacherAnalytics';
import TeacherExams from '@/components/teacher/TeacherExams';
import { ExamService, ExamData } from '@/services/ExamService';

export default function TeacherPage() {
  const user = useSelector((state: any) => state.user);

  // Tab controls
  const [activeTab, setActiveTab] = useState<'reviews' | 'courses' | 'exams' | 'analytics'>('reviews');
  const [loading, setLoading] = useState<boolean>(true);

  // Data storage
  const [plans, setPlans] = useState<any[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [exams, setExams] = useState<ExamData[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'submitted' | 'reviewed'>('submitted');

  const fetchData = async () => {
    const hasPrivileges = user.isTeacher || user.isAdmin;
    if (!hasPrivileges) return;
    setLoading(true);
    try {
      // Fetch plans by active filter
      const plansRes = await PlanService.getDailyActionsForTeacher(reviewFilter);
      if (plansRes.status === 'OK' && plansRes.data) {
        setPlans(plansRes.data);
      }
      
      // Fetch courses list
      const coursesData = await CourseService.getAllCourses();
      if (Array.isArray(coursesData)) {
        setCourses(coursesData);
      }

      // Fetch exams list
      const examsRes = await ExamService.getAllExams();
      if (examsRes.status === 'OK' && Array.isArray(examsRes.data)) {
        setExams(examsRes.data);
      }
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.isTeacher, user.isAdmin, reviewFilter]);

  // Auth restriction check
  const hasPrivileges = user.isTeacher || user.isAdmin;
  if (!hasPrivileges) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-sm">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quyền truy cập bị từ chối</h2>
          <p className="text-gray-650 mb-6">Bạn cần đăng nhập bằng tài khoản Giáo viên hoặc Quản trị để xem trang này.</p>
          <a href="/" className="inline-block bg-[#1e3a8a] hover:bg-[#fbbf24] hover:text-[#1e3a8a] text-white font-bold py-2.5 px-6 rounded-full transition-all">
            Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-gray-800 text-sm">
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - White Background */}
        <aside className="w-64 bg-white text-gray-800 shrink-0 border-r border-gray-200 flex flex-col justify-between hidden md:flex">
          <div>
            {/* Profile Block */}
            <div className="p-5 border-b border-gray-200 flex items-center gap-3 bg-gray-50/60">
              <div className="w-10 h-10 rounded-full bg-[#7E96A0] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-gray-200">
                {user.name ? user.name[0].toUpperCase() : 'G'}
              </div>
              <div className="overflow-hidden">
                <p className="font-extrabold text-gray-900 truncate text-sm">{user.name || 'Giáo viên'}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Teacher Mode</p>
              </div>
            </div>

            {/* Sidebar Menu Items */}
            <nav className="p-4 space-y-2">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === 'reviews' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                Nhận xét kế hoạch
              </button>
              <button
                onClick={() => setActiveTab('courses')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === 'courses' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                Quản lý khóa học
              </button>
              <button
                onClick={() => setActiveTab('exams')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === 'exams' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                Quản lý Đề thi & BT
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-3 ${activeTab === 'analytics' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                Thống kê & Cảnh báo
              </button>
            </nav>
          </div>

          {/* Back to Home */}
          <div className="p-4 border-t border-gray-200">
            <a href="/" className="w-full inline-flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-gray-900 font-bold transition-all text-center">
              Về Trang Chủ
            </a>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header Bar */}
          <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 text-sm">
            <div className="flex items-center gap-2 text-gray-400 font-medium">
              <span>Giáo viên</span>
              <span>/</span>
              <span className="text-gray-800 font-bold">
                {activeTab === 'reviews' && 'Nhận xét kế hoạch'}
                {activeTab === 'courses' && 'Quản lý khóa học'}
                {activeTab === 'exams' && 'Quản lý Đề thi & BT'}
                {activeTab === 'analytics' && 'Thống kê & Cảnh báo'}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-700">Hi, {user.name || 'Giáo viên'}</span>
            </div>
          </header>

          {/* Dashboard Inner Content */}
          <div className="p-6 md:p-8">
            {activeTab === 'reviews' && (
              <TeacherReviews
                plans={plans}
                loading={loading}
                filter={reviewFilter}
                onFilterChange={setReviewFilter}
                onRefresh={fetchData}
              />
            )}

            {activeTab === 'courses' && (
              <TeacherCourses
                courses={courses}
                onRefresh={fetchData}
              />
            )}

            {activeTab === 'exams' && (
              <TeacherExams
                exams={exams}
                onRefresh={fetchData}
              />
            )}

            {activeTab === 'analytics' && (
              <TeacherAnalytics />
            )}
          </div>
        </main>
      </div>

    </div>
  );
}
