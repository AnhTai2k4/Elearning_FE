"use client";
import Link from "next/link";
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

  // Tự động đóng Dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
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
      // Gọi API xóa session ở Backend
      await fetch("http://localhost:3001/api/user/log-out", {
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
    <header className="flex items-center justify-around p-4 bg-white shadow-md sticky top-0 z-50">
      {/* GIỮ NGUYÊN BỘ LOGO VÀ NAV CỦA EM */}
      <img
        src="https://onthivstep.vn/images/icon/nn6b/logo.svg"
        alt="logo"
        className="w-30 h-16"
      />
      <nav className="hidden md:flex gap-6 relative left-40">
        <Link href="/" className="text-lg font-bold hover:text-orange-500">
          Trang chủ
        </Link>
        <Link
          href="/khoa-hoc"
          className="text-lg font-bold hover:text-orange-500"
        >
          Khóa học
        </Link>
        <Link
          href="/thi-thu"
          className="text-lg font-bold hover:text-orange-500"
        >
          Thi thử
        </Link>
        <Link
          href="/so-tay"
          className="text-lg font-bold hover:text-orange-500"
        >
          Sổ tay
        </Link>
        <Link
          href="/tin-tuc"
          className="text-lg font-bold hover:text-orange-500"
        >
          Tin tức
        </Link>
      </nav>

      {/* --- KHU VỰC TÀI KHOẢN --- */}
      <div className="flex items-center gap-4">
        {/* Nếu đã đăng nhập (có user.name trong Redux) */}
        {user.name ? (
          // Thêm ref={dropdownRef} vào đây để bắt sự kiện click ra ngoài
          <div className="flex items-center gap-5 relative" ref={dropdownRef}>
            {/* Icon cái chuông thông báo màu cam */}
            <button className="text-[#f15a24] hover:text-[#d94e1d] transition-colors relative">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
              </svg>
            </button>

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
                {/* Header Popup Gradient Xanh */}
                <div className="bg-gradient-to-r from-[#5D75D4] to-[#4CB5C8] p-5 flex items-center gap-4">
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
              className="text-gray-700 font-semibold hover:text-[#0072BC] transition-colors"
            >
              Đăng ký
            </button>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-[#f15a24] text-white px-5 py-2 rounded-full font-bold hover:bg-[#d94e1d] transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        )}
      </div>

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
