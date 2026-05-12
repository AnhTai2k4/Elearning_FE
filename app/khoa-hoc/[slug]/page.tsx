"use client";

// 1. Nhớ import thêm 'use' từ react
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import axiosClient from "@/utils/axiosClient";
import Header from "@/components/layout/Header";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/auth/LoginModal";

// 2. Sửa lại kiểu dữ liệu của params thành Promise
export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // 3. BÓC GÓI HÀNG (Unwrap Promise) bằng React.use()
  const resolvedParams = use(params);
  const slug = resolvedParams.slug; // Bây giờ em đã lấy được slug an toàn!

  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const user = useSelector((state: any) => state.user);

  // State quản lý dữ liệu và trạng thái trang
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("noidung");
  const [openSections, setOpenSections] = useState<number[]>([0]);

  // Gọi API lấy dữ liệu
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        // 4. Thay thế params.slug bằng biến slug đã bóc ở trên
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
  }, [slug]); // 5. Cập nhật mảng dependency thành biến slug

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const getInitial = (name: string) => {
    if (!name) return "A";
    const words = name.trim().split(" ");
    return words[words.length - 1].charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-gray-600">Đang tải khóa học...</p>
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
          <Link
            href="/khoa-hoc"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7f6] min-h-screen pb-20 font-sans text-gray-800">
      <Header />

      {/* 1. BREADCRUMB FULL WIDTH (Sửa lại tràn viền, text nhỏ gọn) */}
      <div className="w-full bg-[#eef4f8] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 text-[13px] flex gap-2 items-center text-gray-500">
          <Link href="/" className="text-[#0072BC] hover:underline">
            Trang chủ
          </Link>
          <span className="text-gray-400">›</span>
          <Link href="/khoa-hoc" className="text-[#0072BC] hover:underline">
            Danh mục khoá học
          </Link>
          <span className="text-gray-400">›</span>
          <span className="text-[#f15a24] font-medium truncate">
            {course.title}
          </span>
        </div>
      </div>

      {/* 2. GRID BỐ CỤC CHÍNH (Thu hẹp max-width lại cho giống ảnh) */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ================= CỘT TRÁI: NỘI DUNG ================= */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden">
            <h1 className="text-2xl font-bold text-[#002b49] px-6 pt-6 pb-4 uppercase leading-tight">
              {course.title}
            </h1>

            {/* Tabs Navigation (Căn lề, đổi màu gạch dưới chuẩn ảnh) */}
            <div className="flex border-b border-gray-200 px-6 gap-6">
              <button
                onClick={() => setActiveTab("noidung")}
                className={`py-3 font-bold text-[15px] border-b-2 transition-all ${activeTab === "noidung" ? "border-[#f15a24] text-[#f15a24]" : "border-transparent text-[#0072BC] hover:text-[#f15a24]"}`}
              >
                Nội dung
              </button>
              <button
                onClick={() => setActiveTab("binhluan")}
                className={`py-3 font-bold text-[15px] border-b-2 transition-all ${activeTab === "binhluan" ? "border-[#f15a24] text-[#f15a24]" : "border-transparent text-[#0072BC] hover:text-[#f15a24]"}`}
              >
                Bình luận
              </button>
            </div>

            {activeTab === "noidung" && (
              <div className="p-6">
                {/* Góc Thống Kê Bên Phải */}
                <div className="flex justify-end text-[13px] text-gray-600 mb-8 text-right leading-relaxed">
                  <div>
                    <p className="font-medium text-gray-800">
                      Cập nhật:{" "}
                      {new Date(
                        course.updatedAt || Date.now(),
                      ).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="flex items-center justify-end gap-1">
                      Đánh giá: {course.rating || "4,8"}/5
                      <span className="text-[#facc15] text-base tracking-widest">
                        ★★★★★
                      </span>
                    </p>
                    <p>
                      Học viên: {course.students?.toLocaleString() || "99"}% đỗ
                      B1
                    </p>
                  </div>
                </div>

                {/* Nội dung bài viết từ Database */}
                <article className="prose prose-blue max-w-none text-[15px] text-gray-700 leading-relaxed">
                  <div
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                </article>

                {/* Nút Xem thêm */}
                <div className="mt-8 flex justify-end">
                  <button className="text-[#0072BC] font-medium flex items-center gap-1 hover:underline text-sm">
                    Xem thêm
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* DANH SÁCH BÀI HỌC (CSS lại gọn gàng hơn) */}
          <div className="bg-white rounded-md shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 mb-6">
              <span className="font-bold text-[#002b49]">
                DANH SÁCH BÀI HỌC
              </span>
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài học..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-[13px] focus:border-orange-400 outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              {course.sections?.map((section: any, sIdx: number) => (
                <div
                  key={sIdx}
                  className="border border-gray-200 rounded-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(sIdx)}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-all text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-gray-500 transform transition-transform ${openSections.includes(sIdx) ? "rotate-180" : ""}`}
                      >
                        ▼
                      </span>
                      <div>
                        <h3 className="font-bold text-[14px] text-gray-800">
                          {section.sectionTitle}
                        </h3>
                        <p className="text-[12px] text-gray-500">
                          {section.lessons?.length || 0} bài học
                        </p>
                      </div>
                    </div>
                  </button>

                  {openSections.includes(sIdx) && (
                    <div className="p-2 bg-white divide-y divide-gray-50">
                      {section.lessons?.map((lesson: any, lIdx: number) => (
                        <Link 
                          href={{
                            pathname: `/bai-hoc/${lesson.slug}`,
                            query: { courseSlug: slug }
                          }} 
                          key={lIdx}
                          onClick={(e) => {
                            // Kiểm tra đăng nhập
                            const isLoggedIn = !!user?.access_token || !!user?.username;

                            if (!isLoggedIn) {
                              if (!lesson.isFree) {
                                e.preventDefault();
                                setShowLoginModal(true); // Chưa đăng nhập -> Hiện modal yêu cầu đăng nhập
                              }
                              return; // Cho phép qua nếu bài học free
                            }

                            // Nếu đã đăng nhập thì kiểm tra đã mua hay chưa
                            const hasPurchased = user?.courseBuyed && 
                              (user.courseBuyed.includes(course?._id) || user.courseBuyed.includes(course?.slug));
                              
                            // Nếu CHƯA MUA và bài học KHÔNG PHẢI FREE thì chặn
                            if (!hasPurchased && !lesson.isFree) {
                              e.preventDefault();
                              setShowPaymentModal(true);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-all">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-full bg-[#f15a24] text-white flex items-center justify-center text-xs font-bold shrink-0">
                                {(lIdx + 1).toString().padStart(2, "0")}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800 text-[14px] hover:text-[#f15a24] transition-colors">
                                  {lesson.title}
                                  {lesson.isNew && (
                                    <span className="ml-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded italic uppercase">
                                      Mới
                                    </span>
                                  )}
                                </h4>
                                <p className="text-[12px] text-gray-500 mt-1">
                                  {lesson.subtitle}
                                </p>
                              </div>
                            </div>
                            {lesson.isFree && (
                              <span className="text-[10px] font-bold text-[#f15a24] bg-orange-100 px-2 py-0.5 rounded">
                                FREE
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI: SIDEBAR ================= */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-5">
            {/* GIÁ & MUA HÀNG (Style bo góc vừa phải, nút chuẩn màu) */}
            <div className="bg-white rounded-md shadow-sm p-6 border border-gray-200">
              <h3 className="font-bold text-[15px] text-gray-800 border-b border-gray-200 pb-3 mb-4">
                Tổng quan khóa học
              </h3>

              <div className="flex items-center gap-1 mb-5 text-[13px]">
                <span className="text-red-500 font-bold text-sm">5.0</span>
                <span className="text-[#facc15] text-base tracking-widest">
                  ★★★★★
                </span>
                <span className="text-[#0072BC]">(1169)</span>
              </div>

              <div className="flex items-center gap-2 mb-4 font-bold text-gray-800 text-[15px]">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Học phí: {course.price?.toLocaleString("vi-VN")} VNĐ
              </div>

              <div className="flex items-start gap-2 mb-6 text-[13px] text-gray-600 leading-relaxed">
                <svg
                  className="w-4 h-4 mt-1 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>
                  <span className="font-bold text-gray-700">
                    Cấu trúc khóa học:
                  </span>{" "}
                  Khóa học tập trung vào 4 kỹ năng thi VSTEP B1: Nghe, Đọc, Nói,
                  Viết - theo đúng cấu trúc và thang điểm của đề thi thật. Cập
                  nhật tháng 3.2026
                </p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => router.push(`/thanh-toan/${slug}`)}
                  className="w-full bg-[#2e7d32] text-white font-bold py-2.5 rounded hover:bg-green-700 transition-colors text-sm"
                >
                  MUA NGAY
                </button>
                <button className="w-full bg-[#f15a24] text-white font-bold py-2.5 rounded hover:bg-[#d94e1d] transition-colors text-sm">
                  Kích hoạt khoá học
                </button>
              </div>
            </div>

            {/* PROFILE SIDEBAR */}
            {user && user.name && (
              <div className="bg-white rounded-md shadow-sm p-5 border border-gray-200">
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-[#7E96A0] text-white flex items-center justify-center font-normal text-xl shrink-0">
                    {getInitial(user.name)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-800 truncate text-[14px]">
                      {user.name}
                    </p>
                    <p className="text-[13px] text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="pt-4 flex items-center gap-2 text-[13px] text-gray-700">
                  <div className="w-4 h-4 rounded-full bg-[#facc15] text-white text-[10px] font-bold flex items-center justify-center">
                    $
                  </div>
                  <span>
                    Số xu: <span className="font-bold text-gray-900">0</span>
                  </span>
                </div>
              </div>
            )}

            {/* TIỆN ÍCH */}
            <div className="bg-white rounded-md shadow-sm p-5 border border-gray-200">
              <h3 className="font-bold text-[15px] text-gray-800 border-b border-gray-200 pb-3 mb-4">
                Tiện ích
              </h3>
              <div className="flex items-center gap-3 text-gray-700 hover:text-[#f15a24] cursor-pointer transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="font-medium text-[14px]">Tài liệu</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thông báo yêu cầu mua khóa học */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Thông báo</h3>
            <p className="text-gray-600 mb-6">Bạn cần phải mua khóa học để xem tiếp video bài học này nhé.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  router.push(`/thanh-toan/${slug}`);
                }}
                className="px-4 py-2 bg-[#f15a24] text-white rounded hover:bg-[#d94e1d] font-medium transition-colors"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal thông báo yêu cầu ĐĂNG NHẬP */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Yêu cầu đăng nhập</h3>
            <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem nội dung bài học tính phí.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={() => {
                  setShowLoginModal(false);
                  setIsLoginModalOpen(true); 
                }}
                className="px-4 py-2 bg-[#0072BC] text-white rounded hover:bg-[#005a96] font-medium transition-colors"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal từ components */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}
