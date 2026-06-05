'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Header from '@/components/layout/Header';
import Link from 'next/link';

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
  id: string;
  student: string;
  method: 'VNPay' | 'MoMo';
  amount: number;
  status: 'Thành công' | 'Chờ xử lý' | 'Thất bại';
  date: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'Active' | 'Locked';
  purchasedCourses: number;
}

export default function AdminPortal() {
  const user = useSelector((state: any) => state.user);
  const [activeTab, setActiveTab] = useState<'analytics' | 'students' | 'courses' | 'transactions'>('analytics');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample transactions
  const transactions: Transaction[] = [
    { id: '#VN8823', student: 'Nguyễn Văn A', method: 'VNPay', amount: 1450000, status: 'Thành công', date: '2026-06-03 14:23' },
    { id: '#MM9012', student: 'Trần Thị B', method: 'MoMo', amount: 890000, status: 'Thành công', date: '2026-06-03 11:15' },
    { id: '#VN8824', student: 'Lê Hoàng C', method: 'VNPay', amount: 1450000, status: 'Chờ xử lý', date: '2026-06-02 21:05' },
    { id: '#MM9013', student: 'Phạm Văn D', method: 'MoMo', amount: 500000, status: 'Thất bại', date: '2026-06-02 16:45' },
    { id: '#VN8825', student: 'Bùi Minh E', method: 'VNPay', amount: 2000000, status: 'Thành công', date: '2026-06-01 09:30' },
  ];

  // Sample student list
  const students: Student[] = [
    { id: 'ST001', name: 'Nguyễn Văn A', email: 'vana@gmail.com', joinDate: '2026-04-12', status: 'Active', purchasedCourses: 3 },
    { id: 'ST002', name: 'Trần Thị B', email: 'thib@gmail.com', joinDate: '2026-04-15', status: 'Active', purchasedCourses: 1 },
    { id: 'ST003', name: 'Lê Hoàng C', email: 'hoangc@gmail.com', joinDate: '2026-05-01', status: 'Active', purchasedCourses: 2 },
    { id: 'ST004', name: 'Phạm Văn D', email: 'vand@gmail.com', joinDate: '2026-05-18', status: 'Locked', purchasedCourses: 0 },
    { id: 'ST005', name: 'Bùi Minh E', email: 'minhe@gmail.com', joinDate: '2026-06-01', status: 'Active', purchasedCourses: 4 },
  ];

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
          <a href="/" className="inline-block bg-[#1e3a8a] hover:bg-[#fbbf24] hover:text-[#1e3a8a] text-white font-bold py-2.5 px-6 rounded-full transition-all">
            Quay lại trang chủ
          </a>
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800 text-sm">
      <Header />

      <div className="flex-1 flex overflow-hidden">
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
            
            {/* TAB: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Doanh thu tháng này</span>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">{formatCurrency(145500000)}</h3>
                    <div className="mt-2 text-emerald-600 font-bold flex items-center gap-1">
                      <span>↑ 12%</span>
                      <span className="text-gray-400 font-normal text-xs">so với tháng trước</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Học viên Active</span>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">1,240 học viên</h3>
                    <div className="mt-2 text-emerald-600 font-bold flex items-center gap-1">
                      <span>↑ 5%</span>
                      <span className="text-gray-400 font-normal text-xs">tương tác tuần này</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Khóa học & Tài liệu</span>
                    <h3 className="text-2xl font-extrabold text-gray-900 mt-1">385 bài học</h3>
                    <div className="mt-2 text-[#1e3a8a] font-bold flex items-center gap-1">
                      <span>↑ 18%</span>
                      <span className="text-gray-400 font-normal text-xs">mới cập nhật</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Graph / Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                    <h4 className="font-bold text-base text-gray-800 mb-4">Biểu đồ doanh thu 5 tháng qua</h4>
                    <div className="h-44 flex items-end gap-3 pt-6 px-2">
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-blue-100 rounded-t-lg transition-all hover:bg-blue-200" style={{ height: '30%' }}></div>
                        <span className="text-xs font-bold text-gray-500">T2</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-blue-200 rounded-t-lg transition-all hover:bg-blue-300" style={{ height: '55%' }}></div>
                        <span className="text-xs font-bold text-gray-500">T3</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-blue-300 rounded-t-lg transition-all hover:bg-blue-450" style={{ height: '45%' }}></div>
                        <span className="text-xs font-bold text-gray-500">T4</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-blue-400 rounded-t-lg transition-all hover:bg-blue-500" style={{ height: '70%' }}></div>
                        <span className="text-xs font-bold text-gray-500">T5</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-[#1e3a8a] rounded-t-lg transition-all" style={{ height: '90%' }}></div>
                        <span className="text-xs font-bold text-gray-800">T6</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                    <h4 className="font-bold text-base text-gray-800 mb-4">Tỷ lệ học sinh theo khối lớp</h4>
                    <div className="space-y-4 pt-2">
                      <div>
                        <div className="flex justify-between font-bold text-gray-600 mb-1">
                          <span>Lớp 12</span>
                          <span>48%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-[#1e3a8a] h-full rounded-full" style={{ width: '48%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-bold text-gray-600 mb-1">
                          <span>Lớp 11</span>
                          <span>32%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: '32%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between font-bold text-gray-600 mb-1">
                          <span>Lớp 10</span>
                          <span>20%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '20%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Giao Dịch */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-base text-gray-800">Giao dịch gần đây (VNPay/MoMo)</h4>
                    <button onClick={() => setActiveTab('transactions')} className="text-[#1e3a8a] font-bold hover:underline">Xem tất cả</button>
                  </div>
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
                      <tbody className="divide-y divide-gray-50">
                        {transactions.slice(0, 4).map((tx) => (
                          <tr key={tx.id} className="hover:bg-gray-50/50">
                            <td className="py-3 font-bold text-gray-900">{tx.id}</td>
                            <td className="py-3 font-bold text-gray-700">{tx.student}</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${tx.method === 'VNPay' ? 'bg-blue-50 text-blue-600 border border-blue-150' : 'bg-pink-50 text-pink-600 border border-pink-150'}`}>
                                {tx.method}
                              </span>
                            </td>
                            <td className="py-3 text-right font-extrabold text-gray-800">{formatCurrency(tx.amount)}</td>
                            <td className="py-3 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                                tx.status === 'Thành công' ? 'bg-emerald-50 text-emerald-700' :
                                tx.status === 'Chờ xử lý' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
                        <th className="py-3 text-center">Khóa mua</th>
                        <th className="py-3 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {students
                        .filter(st => st.name.toLowerCase().includes(searchTerm.toLowerCase()) || st.email.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(st => (
                          <tr key={st.id} className="hover:bg-gray-50/50">
                            <td className="py-3.5 font-bold text-gray-900">{st.id}</td>
                            <td className="py-3.5 font-bold text-gray-800">{st.name}</td>
                            <td className="py-3.5 text-gray-655">{st.email}</td>
                            <td className="py-3.5 text-gray-500">{st.joinDate}</td>
                            <td className="py-3.5 text-center font-extrabold text-gray-700">{st.purchasedCourses}</td>
                            <td className="py-3.5 text-center">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${st.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                {st.status}
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
                      <p className="text-xs text-blue-600 mt-0.5">Giáo viên được cấp quyền upload nội dung bài học, chấm điểm và tạo kỳ thi tại trang /giao-vien.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-150 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">Chuyên đề Toán học Lớp 12</span>
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded font-extrabold">Active</span>
                      </div>
                      <p className="text-gray-500 text-xs">Giáo trình nâng cao thi thử tốt nghiệp THPT Quốc Gia môn Toán.</p>
                      <div className="flex justify-between text-gray-400 text-xs pt-1">
                        <span>Lớp 12</span>
                        <span>42 học viên đã mua</span>
                      </div>
                    </div>

                    <div className="border border-gray-150 p-4 rounded-xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800">Hình học Không gian Lớp 11</span>
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded font-extrabold">Active</span>
                      </div>
                      <p className="text-gray-500 text-xs">Luyện kỹ năng vẽ hình, tư duy hình học không gian 11.</p>
                      <div className="flex justify-between text-gray-400 text-xs pt-1">
                        <span>Lớp 11</span>
                        <span>25 học viên đã mua</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TRANSACTIONS */}
            {activeTab === 'transactions' && (
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
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
                          <tr key={tx.id} className="hover:bg-gray-50/50">
                            <td className="py-3.5 font-bold text-gray-900">{tx.id}</td>
                            <td className="py-3.5 font-bold text-gray-800">{tx.student}</td>
                            <td className="py-3.5 text-gray-550">{tx.date}</td>
                            <td className="py-3.5">
                              <span className={`px-2 py-0.5 rounded text-xs font-extrabold ${tx.method === 'VNPay' ? 'bg-blue-50 text-blue-600 border border-blue-150' : 'bg-pink-50 text-pink-600 border border-pink-150'}`}>
                                {tx.method}
                              </span>
                            </td>
                            <td className="py-3.5 text-right font-extrabold text-gray-800">{formatCurrency(tx.amount)}</td>
                            <td className="py-3.5 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                                tx.status === 'Thành công' ? 'bg-emerald-50 text-emerald-700' :
                                tx.status === 'Chờ xử lý' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                              }`}>
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
