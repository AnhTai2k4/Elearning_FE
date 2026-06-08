'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import Header from '@/components/layout/Header';

import TeacherCourses from '@/components/teacher/TeacherCourses';
import TeacherAnalytics from '@/components/teacher/TeacherAnalytics';
import TeacherExams from '@/components/teacher/TeacherExams';
import TeacherReviews from '@/components/teacher/TeacherReviews';
import TeacherDocuments from '@/components/teacher/TeacherDocuments';
import { PlanService } from '@/services/PlanService';
import { CourseService, CourseData } from '@/services/CourseService';
import { ExamService, ExamData } from '@/services/ExamService';

// --- INLINE SVG ICONS ---
const LayoutDashboard = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const BookOpen = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const FileText = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const BarChart2 = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const Home = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const Bell = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ChevronRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const FileUp = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <polyline points="9 15 12 12 15 15" />
  </svg>
);

// --- TYPES ---
type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const menuItems: MenuItem[] = [
  { id: "review", label: "Nhận xét kế hoạch", icon: <LayoutDashboard size={18} /> },
  { id: "courses", label: "Quản lý khóa học", icon: <BookOpen size={18} /> },
  { id: "exams", label: "Quản lý Đề thi & BT", icon: <FileText size={18} /> },
  { id: "docs", label: "Đăng tải tài liệu", icon: <FileUp size={18} /> },
  { id: "stats", label: "Thống kê & Cảnh báo", icon: <BarChart2 size={18} /> },
];



export default function TeacherPage() {
  const user = useSelector((state: any) => state.user);

  // Layout states
  const [activeMenu, setActiveMenu] = useState("review");
  const [plans, setPlans] = useState<any[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [planFilter, setPlanFilter] = useState<'submitted' | 'reviewed'>('submitted');

  // Dynamic backend data states
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [exams, setExams] = useState<ExamData[]>([]);

  const sectionTitle: Record<string, string> = {
    review: "Nhận xét kế hoạch",
    courses: "Quản lý khóa học",
    exams: "Quản lý Đề thi & BT",
    docs: "Đăng tải tài liệu",
    stats: "Thống kê & Cảnh báo",
  };

  const getInitial = (name: string) => {
    if (!name) return "A";
    const words = name.trim().split(" ");
    return words[words.length - 1].charAt(0).toUpperCase();
  };

  const fetchPlans = async () => {
    try {
      setPlansLoading(true);
      const res = await PlanService.getDailyActionsForTeacher(planFilter);
      if (res.status === 'OK' && Array.isArray(res.data)) {
        setPlans(res.data);
      } else {
        setPlans([]);
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
      setPlans([]);
    } finally {
      setPlansLoading(false);
    }
  };

  // Fetch course & exam data in background
  const fetchData = async () => {
    try {
      const coursesData = await CourseService.getAllCourses();
      if (Array.isArray(coursesData)) setCourses(coursesData);

      const examsRes = await ExamService.getAllExams();
      if (examsRes.status === 'OK' && Array.isArray(examsRes.data)) {
        setExams(examsRes.data);
      }
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    }
  };

  useEffect(() => {
    if (user.isTeacher || user.isAdmin) {
      fetchData();
    }
  }, [user.isTeacher, user.isAdmin]);

  useEffect(() => {
    if ((user.isTeacher || user.isAdmin) && activeMenu === "review") {
      fetchPlans();
    }
  }, [user.isTeacher, user.isAdmin, activeMenu, planFilter]);

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

  const adminName = user.name || "admin";

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800 text-sm">
      {/* Site Header */}
      <Header />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 hidden md:flex">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#7E96A0] text-white flex items-center justify-center font-bold text-sm">
              {getInitial(adminName)}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm leading-tight">{adminName}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Teacher Mode</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-3 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${
                  activeMenu === item.id
                    ? "bg-[#1e3a8a] text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          {/* Bottom link */}
          <div className="border-t border-gray-200 p-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-gray-600 hover:text-[#1e3a8a] rounded-xl hover:bg-blue-50 transition-all"
            >
              <Home size={16} />
              Về Trang Chủ
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top bar */}
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Giáo viên</span>
              <ChevronRight size={14} />
              <span className="text-gray-800 font-bold">{sectionTitle[activeMenu]}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 font-bold">Hi, {adminName}</span>
              <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-[#7E96A0] text-white flex items-center justify-center font-bold text-xs">
                {getInitial(adminName)}
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="p-6 flex-1 min-h-0">
            {activeMenu === "review" && (
              <TeacherReviews
                plans={plans}
                loading={plansLoading}
                filter={planFilter}
                onFilterChange={setPlanFilter}
                onRefresh={fetchPlans}
              />
            )}

            {/* Other Portal Sections */}
            {activeMenu === "courses" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <TeacherCourses courses={courses} onRefresh={fetchData} />
              </div>
            )}

            {activeMenu === "exams" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <TeacherExams exams={exams} onRefresh={fetchData} />
              </div>
            )}

            {activeMenu === "docs" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <TeacherDocuments />
              </div>
            )}

            {activeMenu === "stats" && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs">
                <TeacherAnalytics />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
