import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0f172a] text-gray-300 pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
            <div className="relative w-[150px] h-[60px]">
              <div className="text-4xl font-black text-white italic">
                <span className="text-[#fbbf24]">Toán</span>Math
              </div> 
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Nền tảng luyện thi Toán online hàng đầu Việt Nam. Giúp học sinh chinh phục mọi kỳ thi 
              với lộ trình bài bản và đội ngũ giáo viên giàu kinh nghiệm.
            </p>

            <ul className="flex flex-col gap-4 mt-2">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-[#fbbf24] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">Hà Nội, Việt Nam</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-[#fbbf24] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@toanmath.edu.vn" className="hover:text-[#fbbf24] transition-colors leading-relaxed">
                  contact@toanmath.edu.vn
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-[#fbbf24] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:0123456789" className="hover:text-[#fbbf24] transition-colors leading-relaxed">
                  0123 456 789
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h3 className="text-xl font-bold text-white mb-6">
              Khám phá
              <div className="w-10 h-1 bg-[#fbbf24] mt-2 rounded-full"></div>
            </h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/" className="hover:text-[#fbbf24] hover:translate-x-1 transition-transform inline-block">Giới thiệu</Link></li>
              <li><Link href="/khoa-hoc" className="hover:text-[#fbbf24] hover:translate-x-1 transition-transform inline-block">Khóa học Toán</Link></li>
              <li><Link href="/thi-thu" className="hover:text-[#fbbf24] hover:translate-x-1 transition-transform inline-block">Thi thử online</Link></li>
              <li><Link href="/tai-lieu" className="hover:text-[#fbbf24] hover:translate-x-1 transition-transform inline-block">Tài liệu miễn phí</Link></li>
              <li><Link href="/so-tay" className="hover:text-[#fbbf24] hover:translate-x-1 transition-transform inline-block">Sổ tay học tập</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-4">
            <h3 className="text-xl font-bold text-white mb-6">
              Lộ trình luyện thi
              <div className="w-10 h-1 bg-[#fbbf24] mt-2 rounded-full"></div>
            </h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/khoa-hoc/toan-10-co-ban" className="hover:text-[#fbbf24] hover:translate-x-1 transition-transform inline-block">Toán 10 - Cơ bản đến Nâng cao</Link></li>
              <li><Link href="/khoa-hoc/toan-11-nang-cao" className="hover:text-[#fbbf24] hover:translate-x-1 transition-transform inline-block">Toán 11 - Nâng cao & Luyện đề</Link></li>
              <li><Link href="/khoa-hoc/toan-12-tong-on" className="hover:text-[#fbbf24] hover:translate-x-1 transition-transform inline-block">Toán 12 - Tổng ôn</Link></li>
              <li><Link href="/khoa-hoc/luyen-thi-thpt-qg" className="hover:text-[#fbbf24] hover:translate-x-1 transition-transform inline-block">Luyện thi THPT Quốc gia 2026</Link></li>
              <li><Link href="/khoa-hoc/toan-chuyen-lop-10" className="hover:text-[#fbbf24] hover:translate-x-1 transition-transform inline-block">Thi vào lớp 10 Chuyên Toán</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700/50 pt-6 text-center text-sm text-gray-400">
          <p className="mb-1 uppercase font-semibold text-gray-300">ToánMath - Nền tảng luyện thi Toán Online</p>
          <p>© {new Date().getFullYear()} ToánMath. Mọi quyền được bảo lưu.</p>
        </div>

      </div>
    </footer>
  );
}