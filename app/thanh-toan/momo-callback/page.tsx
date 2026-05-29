"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateUser } from "@/store/userSlice";
import axiosClient from "@/utils/axiosClient";
import Link from "next/link";

function MomoCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Đang xác minh giao dịch MoMo...");
  const [courseSlug, setCourseSlug] = useState("");
  const [courseTitle, setCourseTitle] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const paramsObj: Record<string, string> = {};
        searchParams.forEach((value, key) => {
          paramsObj[key] = value;
        });

        if (!paramsObj.signature) {
          setStatus("error");
          setMessage("Không tìm thấy thông tin giao dịch từ MoMo.");
          return;
        }

        // Gọi API xác minh chữ ký MoMo và cập nhật DB trên backend
        const response = await axiosClient.post("/payment/momo-verify", paramsObj);

        if (response.data?.success) {
          setStatus("success");
          setMessage("Khóa học của bạn đã được kích hoạt thành công qua ví MoMo!");
          setCourseSlug(response.data.courseSlug);
          setCourseTitle(response.data.courseTitle);

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
        } else {
          setStatus("error");
          setMessage(response.data?.message || "Xác minh giao dịch MoMo thất bại.");
        }
      } catch (error: any) {
        console.error("Lỗi xác minh MoMo:", error);
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Có lỗi xảy ra trong quá trình xác minh giao dịch MoMo."
        );
      }
    };

    verifyPayment();
  }, [searchParams, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-gray-700">Đang kiểm tra kết quả MoMo...</h2>
        <p className="text-gray-500 mt-2">Vui lòng không đóng trình duyệt hoặc tải lại trang.</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mb-4 text-3xl font-bold shadow-md animate-bounce">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-pink-600">Thanh toán MoMo thành công!</h2>
        <p className="text-gray-700 mt-2 max-w-md">{message}</p>
        {courseTitle && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100 max-w-md w-full">
            <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Khóa học đã mua</span>
            <span className="text-md font-bold text-gray-800">{courseTitle}</span>
          </div>
        )}
        <div className="mt-8 flex gap-4">
          <Link
            href={courseSlug ? `/khoa-hoc/${courseSlug}` : "/khoa-hoc"}
            className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded transition-colors shadow-sm text-sm"
          >
            Vào học ngay
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded transition-colors text-sm"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-3xl font-bold">
        ✕
      </div>
      <h2 className="text-2xl font-bold text-red-600">Thanh toán MoMo thất bại</h2>
      <p className="text-gray-700 mt-2 max-w-md">{message}</p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/khoa-hoc"
          className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded transition-colors text-sm"
        >
          Xem các khóa học khác
        </Link>
        <Link
          href="/"
          className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded transition-colors text-sm"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default function MomoCallbackPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold text-gray-700">Đang chuẩn bị...</h2>
          </div>
        }>
          <MomoCallbackContent />
        </Suspense>
      </div>
    </div>
  );
}
