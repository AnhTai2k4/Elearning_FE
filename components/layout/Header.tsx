"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react"; // Thêm useRef và useEffect
import RegisterModal from "../auth/RegisterModal";
import LoginModal from "../auth/LoginModal";
import { useSelector, useDispatch } from "react-redux"; // Thêm useDispatch
import { updateUser } from "@/store/userSlice"; // Nhớ trỏ đúng đường dẫn file Redux của em

export default function Header() {
  const dispatch = useDispatch();
  // Lấy dữ liệu user từ Redux Store
  const user = useSelector((state: any) => state.user);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // --- LOGIC MỚI: QUẢN LÝ DROPDOWN ---
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- LOGIC THÔNG BÁO ---
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // --- LOGIC MOBILE MENU ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch thông báo
  const fetchNotifications = async () => {
    if (!user.access_token) return;
    try {
      const apiBase = process.env.BE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://eleaning-be.vercel.app/api';
      const res = await fetch(`${apiBase}/notification/get-all`, {
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'token': `Bearer ${user.access_token}`
        }
      });
      const data = await res.json();
      if (data.data) {
        setNotifications(data.data);
        setUnreadCount(data.data.filter((n: any) => !n.isRead).length);
      }
    } catch (err) {
      console.error("Lỗi fetch thông báo", err);
    }
  };

  useEffect(() => {
    if (user.access_token) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // Polling mỗi 30s
      return () => clearInterval(interval);
    }
  }, [user.access_token]);

  const handleMarkAsRead = async (notif: any) => {
    if (!notif.isRead) {
      try {
        const apiBase = process.env.BE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://eleaning-be.vercel.app/api';
        await fetch(`${apiBase}/notification/mark-read/${notif._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${user.access_token}`,
            'token': `Bearer ${user.access_token}`
          }
        });
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Lỗi mark read", err);
      }
    }
    if (notif.targetUrl) {
      setIsNotifOpen(false);
      window.location.href = notif.targetUrl;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const apiBase = process.env.BE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://eleaning-be.vercel.app/api';
      await fetch(`${apiBase}/notification/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.access_token}`,
          'token': `Bearer ${user.access_token}`
        }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Lỗi mark all read", err);
    }
  };

  // Tự động đóng Dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Hàm xử lý Đăng xuất
  const handleLogout = async () => {
    try {
      const apiBase = process.env.BE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://eleaning-be.vercel.app/api';
      // Gọi API xóa session ở Backend
      await fetch(`${apiBase}/user/log-out`, {
        method: "POST",
        credentials: "include",
      });

      // Xóa dữ liệu user trong Redux
      dispatch(
        updateUser({
          name: "",
          username: "",
          email: "",
          access_token: "",
          isAdmin: false,
          password: "",
          phone: "",
        }),
      );

      // Đóng dropdown
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  // Hàm lấy chữ cái đầu của tên để làm Avatar
  const getInitial = (name: string) => {
    if (!name) return "A";
    const words = name.trim().split(" ");
    return words[words.length - 1].charAt(0).toUpperCase();
  };
  // ------------------------------------

  return (
    <header className="flex items-center justify-around p-4 bg-white shadow-md sticky top-0 z-50 border-b-4 border-[#fbbf24]">
      {/* LOGO MTMath */}
      <Link href="/" className="flex items-center gap-3 select-none">
        <div className="relative w-10 h-10 shrink-0">
          <Image 
            src="/images/math_assets/logo.png" 
            alt="MTMath Logo" 
            fill 
            className="object-contain" 
            priority 
          />
        </div>
        <div className="flex flex-col justify-center leading-none">
          <span className="text-2xl font-bold text-[#1a367c] tracking-tight">
            MTMath
          </span>
          <span className="text-[11px] font-bold text-[#fbbf24] tracking-wide mt-1 uppercase">
            LUYỆN THI TOÁN THCS - THPT
          </span>
        </div>
      </Link>

      {/* MAIN NAV (Desktop) */}
      <nav className="hidden lg:flex gap-6 relative xl:left-20">
        <Link href="/" className="text-lg font-bold hover:text-yellow-500">
          Trang chủ
        </Link>
        <Link
          href="/khoa-hoc"
          className="text-lg font-bold hover:text-yellow-500"
        >
          Khóa học
        </Link>
        <Link
          href="/thi-thu"
          className="text-lg font-bold hover:text-yellow-500"
        >
          Thi thử
        </Link>
        <Link
          href="/so-tay"
          className="text-lg font-bold hover:text-yellow-500"
        >
          Sổ tay
        </Link>
        <Link
          href="/tai-lieu"
          className="text-lg font-bold hover:text-yellow-500"
        >
          Tài liệu
        </Link>
        {(user.isTeacher || user.isAdmin) && (
          <Link
            href="/giao-vien"
            className="text-lg font-bold hover:text-yellow-500 text-blue-600"
          >
            Giáo viên
          </Link>
        )}
        {user.isAdmin && (
          <Link
            href="/quan-tri"
            className="text-lg font-bold hover:text-yellow-500 text-purple-600"
          >
            Quản trị
          </Link>
        )}
      </nav>

      {/* --- KHU VỰC TÀI KHOẢN --- */}
      <div className="flex items-center gap-4">
        {/* Nếu đã đăng nhập (có user.name trong Redux) */}
        {user.name ? (
          // Thêm ref={dropdownRef} vào đây để bắt sự kiện click ra ngoài
          <div className="flex items-center gap-5 relative" ref={dropdownRef}>
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="text-[#fbbf24] hover:text-[#f59e0b] transition-colors relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* DROPDOWN THÔNG BÁO KIỂU FACEBOOK */}
              {isNotifOpen && (
                <div className="absolute top-[120%] right-0 w-[360px] bg-white shadow-2xl border border-gray-100 rounded-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-800">Thông báo</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        Đánh dấu đã đọc tất cả
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                        <p>Chưa có thông báo nào</p>
                      </div>
                    ) : (
                      notifications.map((notif: any) => (
                        <div 
                          key={notif._id}
                          onClick={() => handleMarkAsRead(notif)}
                          className={`flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${!notif.isRead ? 'bg-[#f0f4f8]/50' : ''}`}
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                            {notif.senderId?.avatar ? (
                              <img src={notif.senderId.avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                              getInitial(notif.senderId?.name || notif.senderId?.username || "A")
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 leading-snug">
                              {notif.message}
                            </p>
                            <span className="text-xs text-blue-600 font-semibold mt-1 block">
                              {new Date(notif.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          {!notif.isRead && (
                            <div className="w-3 h-3 bg-blue-600 rounded-full shrink-0 self-center"></div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Khung Avatar tròn có thể Click */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden bg-[#7E96A0] flex items-center justify-center text-white font-bold text-xl border-2 border-transparent hover:border-gray-300 cursor-pointer transition-all select-none"
            >
              {/* Thay bằng hàm lấy chữ cái đầu tiên theo thiết kế của em */}
              {getInitial(user.name)}
            </div>

            {/* --- POPUP DROPDOWN MENU MỚI THÊM --- */}
            {isDropdownOpen && (
              <div className="absolute top-[130%] right-0 w-[300px] bg-white shadow-2xl border border-gray-100 rounded-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Header Popup Gradient Navy Blue */}
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] p-5 flex items-center gap-4">
                  <div className="w-14 h-14 shrink-0 rounded-full border border-white/50 text-white flex items-center justify-center text-3xl font-normal bg-white/20">
                    {getInitial(user.name)}
                  </div>
                  <div className="flex flex-col text-white overflow-hidden">
                    <span className="font-bold text-lg truncate">
                      {user.name}
                    </span>
                    <span className="text-sm truncate opacity-90">
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* Danh sách Menu */}
                <div className="flex flex-col text-[#002b49] font-bold text-sm">
                  {(user.isTeacher || user.isAdmin) && (
                    <Link
                      href="/giao-vien"
                      onClick={() => setIsDropdownOpen(false)}
                      className="px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-blue-600 font-extrabold"
                    >
                      GIÁO VIÊN
                    </Link>
                  )}
                  {user.isAdmin && (
                    <Link
                      href="/quan-tri"
                      onClick={() => setIsDropdownOpen(false)}
                      className="px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-purple-600 font-extrabold"
                    >
                      QUẢN TRỊ
                    </Link>
                  )}
                  <Link
                    href="/lich-su-giao-dich"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    LỊCH SỬ GIAO DỊCH
                  </Link>
                  <Link
                    href="/khoa-hoc-cua-toi"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    KHOÁ HỌC CỦA TÔI
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    ĐĂNG XUẤT
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Nếu chưa đăng nhập (Redux rỗng) -> Hiện nút bấm (Giữ nguyên của em) */
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="text-gray-700 font-semibold hover:text-[#1e3a8a] transition-colors"
            >
              Đăng ký
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-[#fbbf24] text-[#1e3a8a] px-5 py-2 rounded-full font-bold hover:bg-[#f59e0b] hover:text-white transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        )}

        {/* MOBILE MENU BUTTON (Hamburger) */}
        <button 
          className="lg:hidden p-2 text-[#1a367c] hover:bg-gray-100 rounded-md transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* MOBILE NAV DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 lg:hidden flex flex-col font-bold text-lg">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="p-4 border-b border-gray-100 hover:text-yellow-500 hover:bg-gray-50 text-[#1a367c]">
            Trang chủ
          </Link>
          <Link href="/khoa-hoc" onClick={() => setIsMobileMenuOpen(false)} className="p-4 border-b border-gray-100 hover:text-yellow-500 hover:bg-gray-50 text-[#1a367c]">
            Khóa học
          </Link>
          <Link href="/thi-thu" onClick={() => setIsMobileMenuOpen(false)} className="p-4 border-b border-gray-100 hover:text-yellow-500 hover:bg-gray-50 text-[#1a367c]">
            Thi thử
          </Link>
          <Link href="/so-tay" onClick={() => setIsMobileMenuOpen(false)} className="p-4 border-b border-gray-100 hover:text-yellow-500 hover:bg-gray-50 text-[#1a367c]">
            Sổ tay
          </Link>
          <Link href="/tai-lieu" onClick={() => setIsMobileMenuOpen(false)} className="p-4 border-b border-gray-100 hover:text-yellow-500 hover:bg-gray-50 text-[#1a367c]">
            Tài liệu
          </Link>
          {(user.isTeacher || user.isAdmin) && (
            <Link href="/giao-vien" onClick={() => setIsMobileMenuOpen(false)} className="p-4 border-b border-gray-100 hover:bg-blue-50 text-blue-600">
              Giáo viên
            </Link>
          )}
          {user.isAdmin && (
            <Link href="/quan-tri" onClick={() => setIsMobileMenuOpen(false)} className="p-4 hover:bg-purple-50 text-purple-600">
              Quản trị
            </Link>
          )}
        </div>
      )}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </header>
  );
}
