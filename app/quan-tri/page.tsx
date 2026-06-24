'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { UserService, UserData } from '@/services/UserService';
import { CourseService, CourseData } from '@/services/CourseService';
import { DocumentService, DocumentData } from '@/services/DocumentService';
import { ExamService, ExamData } from '@/services/ExamService';
import { PaymentService, BackendTransaction } from '@/services/PaymentService';

// --- INLINE SVG ICONS ---
const DashboardIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const UsersIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BookOpenIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const CreditCardIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
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

interface Transaction {
  _id: string;
  id: string;
  student: string;
  method: 'VNPay' | 'MoMo';
  amount: number;
  status: 'Thành công' | 'Chờ xử lý' | 'Thất bại';
  date: string;
}

export default function AdminPortal() {
  const user = useSelector((state: any) => state.user);
  const [activeTab, setActiveTab] = useState<'analytics' | 'students' | 'courses' | 'transactions'>('analytics');
  const [searchTerm, setSearchTerm] = useState('');

  // Real database states
  const [users, setUsers] = useState<UserData[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [exams, setExams] = useState<ExamData[]>([]);
  const [dbTransactions, setDbTransactions] = useState<BackendTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, coursesData, docsRes, examsRes, transactionsRes] = await Promise.all([
        UserService.getAllUsers(),
        CourseService.getAllCourses(),
        DocumentService.getAllDocuments(),
        ExamService.getAllExams(),
        PaymentService.getAllTransactions()
      ]);

      if (usersRes && Array.isArray(usersRes.data)) {
        setUsers(usersRes.data);
      }
      
      if (Array.isArray(coursesData)) {
        setCourses(coursesData);
      } else if (coursesData && Array.isArray(coursesData.data)) {
        setCourses(coursesData.data);
      }

      if (docsRes && Array.isArray(docsRes.data)) {
        setDocuments(docsRes.data);
      }
      
      if (examsRes && Array.isArray(examsRes.data)) {
        setExams(examsRes.data);
      }

      if (transactionsRes && Array.isArray(transactionsRes.data)) {
        setDbTransactions(transactionsRes.data);
      }
    } catch (err: any) {
      console.error('Error fetching admin dashboard data:', err.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.isAdmin) {
      fetchAdminData();
    }
  }, [user.isAdmin]);

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-sm">
        <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-red-100 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quyền truy cập bị từ chối</h2>
          <p className="text-gray-650 mb-6">Bạn cần đăng nhập bằng tài khoản Admin để truy cập trang quản trị này.</p>
          <Link href="/" className="inline-block bg-[#1e3a8a] hover:bg-[#fbbf24] hover:text-[#1e3a8a] text-white font-bold py-2.5 px-6 rounded-full transition-all">
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const getInitial = (name: string) => {
    if (!name) return "A";
    const words = name.trim().split(" ");
    return words[words.length - 1].charAt(0).toUpperCase();
  };

  const adminName = user.name || "admin";

  const tabLabels: Record<string, string> = {
    analytics: "Tổng quan hệ thống",
    students: "Quản lý Học viên",
    courses: "Danh sách Khóa học",
    transactions: "Tài chính & Giao dịch"
  };

  // --- STATS COMPUTING ---
  // Derive course purchases strictly from successful transactions to ensure consistency
  const studentPurchasesMap: Record<string, number> = {};
  const coursePurchasesMap: Record<string, number> = {};

  dbTransactions.forEach(tx => {
    if (tx.status === 'Thành công') {
      const sId = tx.user ? (tx.user._id || tx.user) : null;
      const cId = tx.course ? (tx.course._id || tx.course) : null;
      
      if (sId) {
        studentPurchasesMap[sId as string] = (studentPurchasesMap[sId as string] || 0) + 1;
      }
      if (cId) {
        coursePurchasesMap[cId as string] = (coursePurchasesMap[cId as string] || 0) + 1;
      }
    }
  });

  const coursesMap: Record<string, CourseData> = {};
  courses.forEach(c => {
    if (c._id) coursesMap[c._id] = c;
  });

  const studentsList = users.filter(u => !u.isTeacher && !u.isAdmin);
  const activeStudentsCount = studentsList.filter(u => studentPurchasesMap[u._id!] > 0).length;

  let totalLessonsCount = 0;
  courses.forEach(c => {
    if (c.sections) {
      c.sections.forEach(s => {
        if (s.lessons) {
          totalLessonsCount += s.lessons.length;
        }
      });
    }
  });
  const totalContentCount = courses.length + documents.length + exams.length;

  // Total revenue calculated by summing the prices of successful transactions
  let totalRevenue = 0;
  const transactions: Transaction[] = dbTransactions.map(tx => {
    if (tx.status === 'Thành công') {
      totalRevenue += tx.amount;
    }
    return {
      _id: tx._id,
      id: tx.orderId || `#TX${tx._id.substring(18).toUpperCase()}`,
      student: tx.user ? tx.user.name : 'Khách vãng lai',
      method: tx.method as 'MoMo' | 'VNPay',
      amount: tx.amount,
      status: tx.status,
      date: tx.createdAt ? new Date(tx.createdAt).toLocaleString('vi-VN') : 'Vừa qua'
    };
  });

  // --- PAST 5 MONTHS REVENUE GRAPH ---
  const getPast5MonthsRevenue = () => {
    const monthsRevenue = [0, 0, 0, 0, 0];
    const now = new Date();
    
    const monthLabels: string[] = [];
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthLabels.push(`T${d.getMonth() + 1}`);
    }

    dbTransactions.forEach(tx => {
      if (tx.status === 'Thành công' && tx.createdAt) {
        const txDate = new Date(tx.createdAt);
        const diffMonths = (now.getFullYear() - txDate.getFullYear()) * 12 + (now.getMonth() - txDate.getMonth());
        
        const monthIndex = 4 - diffMonths;
        if (monthIndex >= 0 && monthIndex < 5) {
          monthsRevenue[monthIndex] += tx.amount;
        } else if (diffMonths > 4) {
          monthsRevenue[0] += tx.amount;
        }
      }
    });

    return { monthsRevenue, monthLabels };
  };

  const { monthsRevenue, monthLabels } = getPast5MonthsRevenue();
  const maxRevenue = Math.max(...monthsRevenue, 1);

  // --- GRADE DISTRIBUTION ---
  let grade10Count = 0;
  let grade11Count = 0;
  let grade12Count = 0;

  dbTransactions.forEach(tx => {
    if (tx.status === 'Thành công' && tx.course) {
      if (tx.course.grade === 10) grade10Count++;
      else if (tx.course.grade === 11) grade11Count++;
      else grade12Count++;
    }
  });

  const totalGrades = grade10Count + grade11Count + grade12Count || 1;
  const grade10Pct = Math.round((grade10Count / totalGrades) * 100);
  const grade11Pct = Math.round((grade11Count / totalGrades) * 100);
  const grade12Pct = Math.round((grade12Count / totalGrades) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800 text-sm">
      <Header />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Mobile Sidebar Dropdown */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 shrink-0">
           <select 
             value={activeTab} 
             onChange={(e) => setActiveTab(e.target.value as any)}
             className="w-full p-2.5 border border-gray-300 rounded-lg font-bold text-[#1e3a8a] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
           >
             <option value="analytics">Tổng quan hệ thống</option>
             <option value="students">Quản lý Học viên</option>
             <option value="courses">Danh sách Khóa học</option>
             <option value="transactions">Tài chính & Giao dịch</option>
           </select>
        </div>

        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 hidden md:flex">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#7E96A0] text-white flex items-center justify-center font-bold text-sm">
              {getInitial(adminName)}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm leading-tight">{adminName}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Super Admin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-3 space-y-1">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-[#1e3a8a] text-white' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <DashboardIcon />
              Tổng quan hệ thống
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${activeTab === 'students' ? 'bg-[#1e3a8a] text-white' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <UsersIcon />
              Quản lý Học viên
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${activeTab === 'courses' ? 'bg-[#1e3a8a] text-white' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <BookOpenIcon />
              Danh sách Khóa học
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${activeTab === 'transactions' ? 'bg-[#1e3a8a] text-white' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <CreditCardIcon />
              Tài chính & Giao dịch
            </button>
          </nav>

          {/* Back to Home */}
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

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header Bar */}
          <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 text-sm">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Quản trị</span>
              <ChevronRight size={14} />
              <span className="text-gray-800 font-bold">{tabLabels[activeTab]}</span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs w-48 focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] text-gray-700 placeholder-gray-400 transition-all"
              />
              <span className="text-sm text-gray-600 font-bold">Hi, {adminName}</span>
              <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-[#7E96A0] text-white flex items-center justify-center font-bold text-xs">
                {getInitial(adminName)}
              </div>
            </div>
          </header>

          {/* Dashboard Inner Content */}
          <div className="p-6 md:p-8 space-y-6 text-sm">
            {loading ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-bold">Đang tải dữ liệu hệ thống...</p>
              </div>
            ) : (
              <>
                {/* TAB: ANALYTICS */}
                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Doanh thu hệ thống</span>
                        <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{formatCurrency(totalRevenue)}</h3>
                        <div className="mt-2 text-emerald-600 font-bold flex items-center gap-1">
                          <span>↑ 100%</span>
                          <span className="text-gray-400 font-normal text-xs">từ live database</span>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Học viên Active / Tổng</span>
                        <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{activeStudentsCount} / {studentsList.length}</h3>
                        <div className="mt-2 text-emerald-600 font-bold flex items-center gap-1">
                          <span>Tỉ lệ {Math.round((activeStudentsCount / (studentsList.length || 1)) * 100)}%</span>
                          <span className="text-gray-400 font-normal text-xs">đã mua khóa học</span>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Khóa học & Tài nguyên</span>
                        <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{totalContentCount} học liệu</h3>
                        <div className="mt-2 text-[#1e3a8a] font-bold flex items-center gap-1">
                          <span>{courses.length} khóa • {documents.length} tài liệu • {exams.length} đề</span>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Graph / Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                        <h4 className="font-bold text-base text-gray-800 mb-4">Biểu đồ doanh thu 5 tháng qua</h4>
                        <div className="h-44 flex items-end gap-3 pt-6 px-2">
                          {monthsRevenue.map((rev, index) => {
                            const pct = Math.max(8, Math.min(100, Math.round((rev / maxRevenue) * 90)));
                            return (
                              <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                <span className="text-[9px] font-bold text-gray-500 text-center truncate w-full">{rev > 0 ? formatCurrency(rev) : '0đ'}</span>
                                <div className="w-full bg-[#1e3a8a] rounded-t-lg transition-all hover:bg-yellow-400" style={{ height: `${pct}%` }}></div>
                                <span className="text-xs font-bold text-gray-500">{monthLabels[index]}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                        <h4 className="font-bold text-base text-gray-800 mb-4">Tỷ lệ mua khóa học theo khối</h4>
                        <div className="space-y-4 pt-2">
                          <div>
                            <div className="flex justify-between font-bold text-gray-600 mb-1">
                              <span>Lớp 12</span>
                              <span>{grade12Pct}% ({grade12Count} lượt)</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-[#1e3a8a] h-full rounded-full" style={{ width: `${grade12Pct}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between font-bold text-gray-600 mb-1">
                              <span>Lớp 11</span>
                              <span>{grade11Pct}% ({grade11Count} lượt)</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${grade11Pct}%` }}></div>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between font-bold text-gray-600 mb-1">
                              <span>Lớp 10</span>
                              <span>{grade10Pct}% ({grade10Count} lượt)</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${grade10Pct}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Giao Dịch */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-base text-gray-800">Giao dịch gần đây (MoMo)</h4>
                        <button onClick={() => setActiveTab('transactions')} className="text-[#1e3a8a] font-bold hover:underline">Xem tất cả</button>
                      </div>
                      {transactions.length === 0 ? (
                        <div className="py-8 text-center text-gray-400">Chưa có giao dịch nào được thực hiện.</div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-gray-100 text-gray-400 font-bold">
                                <th className="py-2.5">Mã GD</th>
                                <th className="py-2.5">Học viên</th>
                                <th className="py-2.5">Phương thức</th>
                                <th className="py-2.5 text-right">Số tiền</th>
                                <th className="py-2.5 text-center">Trạng thái</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-55">
                              {transactions.slice(0, 5).map((tx) => (
                                <tr key={tx._id} className="hover:bg-gray-50/50">
                                  <td className="py-3 font-bold text-gray-900">{tx.id}</td>
                                  <td className="py-3 font-bold text-gray-700">{tx.student}</td>
                                  <td className="py-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${tx.method === 'VNPay' ? 'bg-blue-50 text-blue-600 border border-blue-150' : 'bg-pink-50 text-pink-600 border border-pink-150'}`}>
                                      {tx.method}
                                    </span>
                                  </td>
                                  <td className="py-3 text-right font-extrabold text-gray-800">{formatCurrency(tx.amount)}</td>
                                  <td className="py-3 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700`}>
                                      {tx.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB: STUDENTS */}
                {activeTab === 'students' && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold">
                            <th className="py-3">Mã HV</th>
                            <th className="py-3">Họ & Tên</th>
                            <th className="py-3">Email</th>
                            <th className="py-3">Ngày gia nhập</th>
                            <th className="py-3 text-center">Khóa đã mua</th>
                            <th className="py-3 text-center">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {studentsList
                            .filter(st => st.name.toLowerCase().includes(searchTerm.toLowerCase()) || st.email.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(st => (
                              <tr key={st._id} className="hover:bg-gray-50/50">
                                <td className="py-3.5 font-bold text-gray-900">{st._id.substring(18).toUpperCase()}</td>
                                <td className="py-3.5 font-bold text-gray-800">{st.name}</td>
                                <td className="py-3.5 text-gray-600">{st.email}</td>
                                <td className="py-3.5 text-gray-500">
                                  {st.createdAt ? new Date(st.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                </td>
                                <td className="py-3.5 text-center font-extrabold text-gray-700">{studentPurchasesMap[st._id!] || 0}</td>
                                <td className="py-3.5 text-center">
                                  <span className={`px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700`}>
                                    Hoạt động
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB: COURSES */}
                {activeTab === 'courses' && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs text-sm">
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-800 flex justify-between items-center">
                        <div>
                          <p className="font-extrabold text-sm">Chế độ phân quyền Giáo viên</p>
                          <p className="text-xs text-blue-600 mt-0.5 font-semibold">Giáo viên được cấp quyền upload nội dung bài học, chấm điểm và tạo kỳ thi tại trang /giao-vien.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courses.map(course => {
                          const purchasesCount = coursePurchasesMap[course._id!] || 0;
                          return (
                            <div key={course._id} className="border border-gray-150 p-4 rounded-xl space-y-2 hover:shadow-sm transition-all bg-slate-50/50">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-800">{course.title}</span>
                                <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded font-extrabold">Hoạt động</span>
                              </div>
                              <p className="text-gray-500 text-xs line-clamp-2">{course.description || 'Không có mô tả chi tiết từ giáo viên.'}</p>
                              <div className="flex justify-between text-gray-450 text-xs pt-1 font-bold">
                                <span>Khối {course.grade || 12} • {formatCurrency(course.price)}</span>
                                <span className="text-[#1e3a8a]">{purchasesCount} học viên đã mua</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: TRANSACTIONS */}
                {activeTab === 'transactions' && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                    {transactions.length === 0 ? (
                      <div className="py-8 text-center text-gray-400">Chưa có giao dịch nào trên hệ thống.</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 text-gray-400 font-bold">
                              <th className="py-3">Mã GD</th>
                              <th className="py-3">Học viên</th>
                              <th className="py-3">Ngày thực hiện</th>
                              <th className="py-3">Phương thức</th>
                              <th className="py-3 text-right">Số tiền</th>
                              <th className="py-3 text-center">Trạng thái</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {transactions
                              .filter(tx => tx.student.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.toLowerCase().includes(searchTerm.toLowerCase()))
                              .map((tx) => (
                                <tr key={tx._id} className="hover:bg-gray-50/50">
                                  <td className="py-3.5 font-bold text-gray-900">{tx.id}</td>
                                  <td className="py-3.5 font-bold text-gray-800">{tx.student}</td>
                                  <td className="py-3.5 text-gray-500">{tx.date}</td>
                                  <td className="py-3.5">
                                    <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${tx.method === 'VNPay' ? 'bg-blue-50 text-blue-600 border border-blue-150' : 'bg-pink-50 text-pink-600 border border-pink-150'}`}>
                                      {tx.method}
                                    </span>
                                  </td>
                                  <td className="py-3.5 text-right font-extrabold text-gray-800">{formatCurrency(tx.amount)}</td>
                                  <td className="py-3.5 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700`}>
                                      {tx.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
