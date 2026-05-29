"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/userSlice"; // Nhớ trỏ đúng đường dẫn file slice của em
import { useGoogleLogin } from "@react-oauth/google";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const dispatch = useDispatch();

  // 1. State lưu thông tin nhập liệu
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // State quản lý UI
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Hàm Call API Đăng nhập
  const handleLogin = async () => {
    setMessage(null);

    if (!formData.username || !formData.password) {
      setMessage({
        text: "Vui lòng nhập đầy đủ tài khoản và mật khẩu!",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/user/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const res = await response.json();
      const data = res.data; // Dữ liệu user trả về từ BE (có thể là user info + token)
      const userData = data.userData; // Nếu BE trả về user info trong trường userData

      console.log("Response from server:", data);

      if (response.ok) {
        // Đăng nhập thành công
        setMessage({ text: "Đăng nhập thành công!", type: "success" });

        const userInfo = {
          id: userData._id || userData.user?._id || userData.id || userData.user?.id || "",
          name: userData.name || userData.user?.name || "",
          username: userData.username || userData.user?.username || "",
          email: userData.email || userData.user?.email || "",
          access_token: data.access_token || data.token || "",
          isAdmin: userData.isAdmin || userData.user?.isAdmin || false,
          phone: userData.phone || userData.user?.phone || "",
          courseBuyed: userData.courseBuyed || userData.user?.courseBuyed || [],
        };

        dispatch(updateUser(userInfo));
        localStorage.setItem("user_info", JSON.stringify(userInfo));

        setTimeout(() => onClose(), 50);
      } else {
        setMessage({
          text: data.message || "Tài khoản hoặc mật khẩu không chính xác!",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({ text: "Lỗi kết nối đến máy chủ.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Khai báo hàm xử lý Google Login
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setMessage(null);

      try {
        // tokenResponse.access_token chính là cái vé Google cấp cho Front-end
        // Giờ mình ném cái vé này xuống Backend của em để BE xác thực với Google
        const response = await fetch(
          "http://localhost:3001/api/user/google-login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",

            body: JSON.stringify({
              token: tokenResponse.access_token,
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          setMessage({ text: "Đăng nhập Google thành công!", type: "success" });

          // Đóng gói data giống hệt lúc đăng nhập thường
          const userInfo = {
            name: data.name || data.user?.name,
            username: data.username || data.user?.username,
            email: data.email || data.user?.email,
            access_token: data.access_token || data.token,
            isAdmin: data.isAdmin || data.user?.isAdmin || false,
            phone: data.phone || data.user?.phone || "",
          };

          // Lưu Redux và LocalStorage
          dispatch(updateUser(userInfo));
          localStorage.setItem("user_info", JSON.stringify(userInfo));

          setTimeout(() => {
            onClose();
          }, 1000);
        } else {
          setMessage({
            text: data.message || "Lỗi xác thực từ server.",
            type: "error",
          });
        }
      } catch (error) {
        setMessage({ text: "Lỗi kết nối đến máy chủ.", type: "error" });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setMessage({
        text: "Đăng nhập Google thất bại. Vui lòng thử lại!",
        type: "error",
      });
    },
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl p-8 mx-4 shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng nhập
        </h2>

        {/* Thông báo lỗi / thành công */}
        {message && (
          <div
            className={`mb-6 p-3 rounded-lg text-sm font-medium text-center ${message.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
          >
            {message.text}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <InputField
            name="username"
            value={formData.username}
            onChange={handleChange}
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            }
            placeholder="Tài khoản đăng nhập"
          />
          <InputField
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            icon={
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            }
            placeholder="Mật khẩu"
          />

          <div className="flex justify-start mt-[-4px]">
            <a
              href="#"
              className="text-[#0072BC] hover:underline text-sm font-medium"
            >
              Quên mật khẩu
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-5">
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-[#f15a24] text-white font-bold py-3.5 rounded-xl hover:bg-[#d94e1d] transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="flex items-center gap-4 w-full">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-gray-500 text-sm">HOẶC</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button
            onClick={() => loginWithGoogle()} // 3. Gắn hàm vào sự kiện onClick
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Đăng nhập với Google
          </button>

          <div className="text-gray-600 mt-2 text-sm">
            Không có tài khoản?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-[#0072BC] hover:underline font-medium"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cập nhật InputField để bind được name và onChange
interface InputFieldProps {
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({
  icon,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div className="flex items-center gap-3 bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange-400 focus-within:bg-white transition-colors">
      <svg
        className="w-5 h-5 text-gray-500 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        {icon}
      </svg>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
      />
    </div>
  );
}
