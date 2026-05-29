"use client";

import React, { useState, useEffect, use as reactUse } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "@/store/userSlice";
import axiosClient from "@/utils/axiosClient";
import Header from "@/components/layout/Header";
import LoginModal from "@/components/auth/LoginModal";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = reactUse(params);
  const slug = resolvedParams.slug;
  const router = useRouter();
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user);

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/course/get-course/${slug}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Lỗi khi tải thông tin khóa học:", error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  const handlePayment = async () => {
    // Kiểm tra trạng thái đăng nhập của người dùng
    const isLoggedIn = !!user?.access_token || !!user?.username;
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      setProcessing(true);
      const endpoint = "/payment/create-momo-url";

      const response = await axiosClient.post(endpoint, {
        courseId: course._id,
      });

      if (response.data?.success && response.data?.paymentUrl) {
        // Chuyển hướng người dùng đến trang thanh toán của MoMo
        window.location.href = response.data.paymentUrl;
      } else {
        alert(
          response.data?.message ||
            "Không lấy được link thanh toán. Vui lòng thử lại."
        );
      }
    } catch (error: any) {
      console.error("Lỗi thanh toán:", error);
      alert(
        error.response?.data?.message ||
          "Đã xảy ra lỗi trong quá trình xử lý thanh toán."
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleMockPayment = async () => {
    const isLoggedIn = !!user?.access_token || !!user?.username;
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      setProcessing(true);
      const response = await axiosClient.post("/payment/mock-success", {
        courseId: course._id,
      });

      if (response.data?.success) {
        // Đồng bộ hóa thông tin user vào localStorage & Redux store
        const userInfoStr = localStorage.getItem("user_info");
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          const boughtList = userInfo.courseBuyed || [];
          if (!boughtList.includes(response.data.courseId)) {
            userInfo.courseBuyed = [...boughtList, response.data.courseId];
            localStorage.setItem("user_info", JSON.stringify(userInfo));
            dispatch(updateUser(userInfo));
          }
        }
        alert("Mock thanh toán thành công! Khóa học của bạn đã được kích hoạt.");
        router.push(`/khoa-hoc/${response.data.courseSlug}`);
      } else {
        alert(response.data?.message || "Lỗi mock thanh toán");
      }
    } catch (error: any) {
      console.error("Lỗi mock thanh toán:", error);
      alert(error.response?.data?.message || "Đã xảy ra lỗi.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Không tìm thấy khóa học!
          </h2>
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:underline mt-4 inline-block bg-transparent border-0 cursor-pointer"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7f6] min-h-screen pb-20 font-sans text-gray-800">
      <Header />

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
          {/* Section 1: Chi tiết đơn hàng */}
          <div className="p-6">
            <h2 className="text-blue-600 font-bold text-[15px] border-b border-gray-200 pb-3 mb-4">
              1 khoá học
            </h2>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200 border-dashed mb-4">
              <div className="font-bold text-[15px] text-gray-800">
                {course.title}
                <div className="mt-1 font-normal text-gray-600">
                  {course.price?.toLocaleString("vi-VN")} VND
                </div>
              </div>
              <button
                onClick={() => router.back()}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex justify-between items-center mb-4 text-[15px] font-bold text-gray-800">
              <span>Tạm tính</span>
              <span>{course.price?.toLocaleString("vi-VN")} VND</span>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-[15px] text-gray-800 mb-2">
                Mã Khuyến mại
              </h3>
              <div className="flex">
                <input
                  type="text"
                  placeholder="Nhập mã khuyến mại"
                  className="flex-1 border border-gray-300 rounded-l px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                />
                <button className="bg-red-600 text-white font-bold px-6 py-2 rounded-r hover:bg-red-700 transition-colors text-sm border-0 cursor-pointer">
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="font-bold text-[15px] text-gray-800">
                Tổng cộng
              </span>
              <span className="font-bold text-[18px] text-[#f15a24]">
                {course.price?.toLocaleString("vi-VN")} VND
              </span>
            </div>
          </div>

          {/* Section 2: Phương thức thanh toán */}
          <div className="p-6 border-t border-gray-200 bg-gray-50/30">
            <h2 className="text-gray-800 text-[15px] mb-4 font-bold">
              2. Phương thức thanh toán
            </h2>

            <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg flex items-center gap-4 mb-6 shadow-sm">
              <div className="w-12 h-12 bg-[#a50064] rounded-xl flex items-center justify-center font-bold text-white text-base shadow-inner">
                MoMo
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-[14px]">Thanh toán qua Ví điện tử MoMo</h4>
                <p className="text-xs text-gray-500 mt-0.5">Hỗ trợ thanh toán nhanh chóng bằng mã QR MoMo Sandbox.</p>
              </div>
            </div>

            <div className="text-[14px] text-gray-600 leading-relaxed space-y-1 mb-6">
              <p>
                - Kiểm tra lại thông tin đơn hàng trước khi nhấn{" "}
                <strong className="font-bold text-gray-800">tiếp tục</strong>.
              </p>
              <p>
                - Sau khi thanh toán thành công, hệ thống sẽ tự động kích hoạt
                khóa học và chuyển hướng bạn về lại trang bài học.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-100 p-6 rounded-b flex justify-center gap-4">
            <button
              onClick={() => router.back()}
              disabled={processing}
              className="px-8 py-2.5 border-2 border-black text-black font-bold text-sm bg-white hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Quay lại
            </button>
            <button
              onClick={handlePayment}
              disabled={processing}
              className="px-8 py-2.5 bg-red-600 text-white font-bold text-sm border-2 border-black hover:bg-red-700 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý...
                </>
              ) : (
                "Tiếp tục"
              )}
            </button>
            <button
              onClick={handleMockPayment}
              disabled={processing}
              className="px-8 py-2.5 bg-[#6c5ce7] text-white font-bold text-sm border-2 border-black hover:bg-[#5b4dbf] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50"
            >
              Test Thanh Toán (Mock)
            </button>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}
