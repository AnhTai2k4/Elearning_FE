"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosClient from "@/utils/axiosClient";
import Header from "@/components/layout/Header";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const router = useRouter();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<string>("momo");

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
            className="text-blue-600 hover:underline mt-4 inline-block"
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
        <div className="bg-white rounded shadow-sm border border-gray-200">
          
          {/* Section 1: Chi tiết đơn hàng */}
          <div className="p-6">
            <h2 className="text-blue-600 font-bold text-[15px] border-b border-gray-200 pb-3 mb-4">
              1 khoá học
            </h2>

            <div className="flex justify-between items-center pb-4 border-b border-gray-200 border-dashed mb-4">
              <div className="font-bold text-[15px] text-gray-800">
                {course.title}
                <div className="mt-1">{course.price?.toLocaleString("vi-VN")} VND</div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                ✕
              </button>
            </div>

            <div className="flex justify-between items-center mb-4 text-[15px] font-bold text-gray-800">
              <span>Tạm tính</span>
              <span>{course.price?.toLocaleString("vi-VN")} VND</span>
            </div>

            <div className="mb-6">
              <h3 className="font-bold text-[15px] text-gray-800 mb-2">Mã Khuyến mại</h3>
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Nhập mã khuyến mại" 
                  className="flex-1 border border-gray-300 rounded-l px-4 py-2 text-sm focus:outline-none focus:border-red-500"
                />
                <button className="bg-red-600 text-white font-bold px-6 py-2 rounded-r hover:bg-red-700 transition-colors text-sm">
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="font-bold text-[15px] text-gray-800">Tổng cộng</span>
              <span className="font-bold text-[18px] text-[#f15a24]">
                {course.price?.toLocaleString("vi-VN")} VND
              </span>
            </div>
          </div>

          {/* Section 2: Phương thức thanh toán */}
          <div className="p-6 border-t border-gray-200 bg-gray-50/30">
            <h2 className="text-gray-800 text-[15px] mb-4">
              2. Chọn phương thức thanh toán
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <label 
                className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-all ${
                  paymentMethod === 'momo' ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="momo"
                  checked={paymentMethod === 'momo'}
                  onChange={() => setPaymentMethod('momo')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[14px] text-gray-800">Thanh toán qua ví MoMo</span>
              </label>

              <label 
                className={`flex items-center gap-3 p-4 border rounded cursor-pointer transition-all ${
                  paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="bank"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[14px] text-gray-800">Thanh toán trực tuyến qua ngân hàng</span>
              </label>
            </div>

            <div className="text-[14px] text-gray-800 leading-relaxed space-y-1 mb-6">
              <p>- Kiểm tra lại thông tin đơn hàng trước khi nhấn <strong className="font-bold">tiếp tục</strong>.</p>
              <p>- Sau khi thanh toán thành công, Bạn vào trang lịch sử giao dịch để kiểm tra đơn hàng hoặc kiểm tra email của bạn.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-100 p-6 rounded-b flex justify-center gap-4">
            <button 
              onClick={() => router.back()}
              className="px-8 py-2.5 border-2 border-black text-black font-bold text-sm bg-white hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </button>
            <button 
              onClick={() => {
                alert(`Sẽ chuyển hướng thanh toán qua ${paymentMethod === 'momo' ? 'MoMo' : 'Ngân hàng'}!`);
              }}
              className="px-8 py-2.5 bg-red-600 text-white font-bold text-sm border-2 border-black hover:bg-red-700 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Tiếp tục
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
