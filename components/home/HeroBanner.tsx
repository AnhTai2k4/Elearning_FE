// src/components/HeroBanner.tsx

import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="w-full bg-[#fdf8f4] py-16 md:py-6 px-16 overflow-hidden relative">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center justify-around">
        <div className="flex flex-col gap-y-4">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-[#f15a24]">
            Luyện Thi VSTEP
          </h2>

          <p className="text-2xl md:text-5xl lg:text-5xl font-extrabold text-[#004a80] leading-tight mt-2">
            Cùng Cô Thuỳ Dương
            <span className="block mt-2">Và Thầy Dương Nguyễn Anh</span>
          </p>

          <p className="text-xl text-gray-700 max-w-xl leading-relaxed mt-4">
            Ôn thi Vstep - Ngoại ngữ 6 bậc dành cho thị trường Việt Nam từ thầy
            Dương Nguyễn Anh giúp các em tổng hợp kiến thức và bài học sát đề
            thi dễ dàng đạt điểm cao.
          </p>

          <div className="mt-8">
            <Link
              href="/luyen-thi"
              className="inline-flex items-center gap-x-2 px-10 py-3 bg-[#fdf8f4] border border-[#f15a24] rounded-full text-[#f15a24] font-medium hover:bg-[#faeae0] transition-colors group"
            >
              Luyện thi ngay
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center md:justify-end">
          <img
            src="https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Fteacher1New.png&w=750&q=100" // Đường dẫn ảnh của em
            alt="Giảng viên luyện thi VSTEP"
            className="relative z-10 w-[80%] h-[80%] max-w-[550px] object-contain mt-5"
          />

          <div className="absolute top-6 right-0 translate-x-1/4 -translate-y-1/4 p-4 pr-12 bg-white rounded-full border border-gray-100 shadow-xl z-20 text-xs">
            <p className="text-gray-500 font-medium">
              <span className="font-bold text-lg text-[#f15a24]">5000+</span>
              <br />
              học viên theo học
            </p>
          </div>

          <div className="absolute bottom-10 left-10 -translate-x-1/4 translate-y-1/4 p-4 bg-[#faeae0] rounded-full border border-[#faeae0] z-20 text-xs shadow-xl">
            <p className="text-[#004a80] font-medium">
              Chấm, chữa bài <span className="text-[#f15a24]">chi tiết</span>
            </p>
          </div>

          <div className="absolute bottom-10 right-0 translate-x-1/4 translate-y-1/4 p-4 bg-[#faeae0] rounded-full border border-[#faeae0] z-20 text-xs shadow-xl">
            <p className="text-[#004a80] font-medium">
              Ôn luyện{" "}
              <span className="text-[#f15a24]">đa nền tảng, thiết bị</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
