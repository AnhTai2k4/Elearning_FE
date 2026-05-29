'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PlanService } from '@/services/PlanService';
import { CourseService, CourseData } from '@/services/CourseService';

import TeacherReviews from '@/components/teacher/TeacherReviews';
import TeacherCourses from '@/components/teacher/TeacherCourses';
import TeacherAnalytics from '@/components/teacher/TeacherAnalytics';

export default function TeacherPage() {
  const user = useSelector((state: any) => state.user);

  // Tab controls
  const [activeTab, setActiveTab] = useState<'reviews' | 'courses' | 'analytics'>('reviews');
  const [loading, setLoading] = useState<boolean>(true);

  // Data storage
  const [plans, setPlans] = useState<any[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [reviewFilter, setReviewFilter] = useState<'submitted' | 'reviewed'>('submitted');

  const fetchData = async () => {
    if (!user.isAdmin) return;
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
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.isAdmin, reviewFilter]);

  // Auth restriction check
  if (!user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quyền truy cập bị từ chối</h2>
          <p className="text-gray-600 mb-6">Bạn cần đăng nhập bằng tài khoản Giáo viên để xem trang này.</p>
          <a href="/" className="inline-block bg-[#1e3a8a] hover:bg-[#fbbf24] hover:text-[#1e3a8a] text-white font-bold py-2.5 px-6 rounded-full transition-all">
            Quay lại trang chủ
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Dashboard banner */}
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white py-12 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="bg-[#fbbf24]/20 border border-[#fbbf24]/30 text-[#fbbf24] text-[12px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Teacher Dashboard
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-2">Trang Quản Trị & Đánh Giá</h1>
            <p className="text-blue-100 mt-1">Quản lý lộ trình học tập, nhận xét kế hoạch và theo dõi kỷ luật học sinh.</p>
          </div>
          <div className="flex gap-2 bg-white/10 p-1.5 rounded-full border border-white/15">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'reviews' ? 'bg-[#fbbf24] text-[#1e3a8a]' : 'hover:bg-white/10 text-white'}`}
            >
              Nhận xét kế hoạch
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'courses' ? 'bg-[#fbbf24] text-[#1e3a8a]' : 'hover:bg-white/10 text-white'}`}
            >
              Quản lý khóa học
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all ${activeTab === 'analytics' ? 'bg-[#fbbf24] text-[#1e3a8a]' : 'hover:bg-white/10 text-white'}`}
            >
              Thống kê & Cảnh báo
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
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

        {activeTab === 'analytics' && (
          <TeacherAnalytics />
        )}
      </div>
    </div>
  );
}
