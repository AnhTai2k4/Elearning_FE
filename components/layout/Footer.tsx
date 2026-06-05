import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#132c6b] text-gray-200 pt-16 pb-6 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-4 flex flex-col items-start gap-4">
            <div className="bg-white p-3 rounded-xl w-24 h-24 flex items-center justify-center shadow-lg border border-white/20">
              <Image 
                src="/images/math_assets/logo.png" 
                alt="MTMath Logo" 
                width={80} 
                height={80} 
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-xl font-black text-white tracking-wide mt-2 uppercase">
              MTMATH
            </h2>
            <p className="text-blue-100/80 text-sm leading-relaxed max-w-xs">
              Đồng hành cùng học sinh chinh phục đỉnh cao tri thức toán học
            </p>

            {/* Social Badges */}
            <div className="flex gap-3 mt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h3v-9h2.72l.4-3H12V6.36C12 5.56 12.3 5 13.56 5H15V2h-2.44C9.72 2 8 3.5 8 6.4V8z" />
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555a3.002 3.002 0 0 0-2.11 2.108C0 8.03 0 12 0 12s0 3.97.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.97 24 12 24 12s0-3.97-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center hover:opacity-90 transition-opacity shadow-sm"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-base font-bold text-white tracking-wide">
              Liên Kết Nhanh
            </h3>
            <div className="w-16 h-0.5 bg-[#fbbf24] mt-2 mb-6"></div>
            
            <ul className="flex flex-col gap-3 text-sm text-blue-100/90 font-medium">
              <li>
                <Link href="/" className="hover:text-[#fbbf24] transition-colors flex items-center">
                  <span className="text-[#fbbf24] text-xs mr-2">▸</span> Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/khoa-hoc" className="hover:text-[#fbbf24] transition-colors flex items-center">
                  <span className="text-[#fbbf24] text-xs mr-2">▸</span> Khóa học
                </Link>
              </li>
              <li>
                <Link href="/thi-thu" className="hover:text-[#fbbf24] transition-colors flex items-center">
                  <span className="text-[#fbbf24] text-xs mr-2">▸</span> Thi thử
                </Link>
              </li>
              <li>
                <Link href="/so-tay" className="hover:text-[#fbbf24] transition-colors flex items-center">
                  <span className="text-[#fbbf24] text-xs mr-2">▸</span> Sổ tay
                </Link>
              </li>
              <li>
                <Link href="/tai-lieu" className="hover:text-[#fbbf24] transition-colors flex items-center">
                  <span className="text-[#fbbf24] text-xs mr-2">▸</span> Tài liệu
                </Link>
              </li>
            </ul>
          </div>

          {/* Courses Links */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-base font-bold text-white tracking-wide">
              Khóa Học
            </h3>
            <div className="w-12 h-0.5 bg-[#fbbf24] mt-2 mb-6"></div>
            
            <ul className="flex flex-col gap-3 text-sm text-blue-100/90 font-medium">
              <li>
                <Link href="/khoa-hoc" className="hover:text-[#fbbf24] transition-colors flex items-center">
                  <span className="text-[#fbbf24] font-bold mr-2 text-xs">✓</span> Toán lớp 10
                </Link>
              </li>
              <li>
                <Link href="/khoa-hoc" className="hover:text-[#fbbf24] transition-colors flex items-center">
                  <span className="text-[#fbbf24] font-bold mr-2 text-xs">✓</span> Toán lớp 11
                </Link>
              </li>
              <li>
                <Link href="/khoa-hoc" className="hover:text-[#fbbf24] transition-colors flex items-center">
                  <span className="text-[#fbbf24] font-bold mr-2 text-xs">✓</span> Toán lớp 12
                </Link>
              </li>
              <li>
                <Link href="/khoa-hoc" className="hover:text-[#fbbf24] transition-colors flex items-center">
                  <span className="text-[#fbbf24] font-bold mr-2 text-xs">✓</span> Luyện thi THPT Quốc gia
                </Link>
              </li>
              <li>
                <Link href="/khoa-hoc" className="hover:text-[#fbbf24] transition-colors flex items-center">
                  <span className="text-[#fbbf24] font-bold mr-2 text-xs">✓</span> Học thử miễn phí
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-base font-bold text-white tracking-wide">
              Liên Hệ
            </h3>
            <div className="w-10 h-0.5 bg-[#fbbf24] mt-2 mb-6"></div>
            
            <ul className="flex flex-col gap-4 text-sm text-blue-100/90 font-medium">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#fbbf24] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:0964345413" className="hover:text-[#fbbf24] transition-colors">
                  0964345413
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#fbbf24] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@minhthanhmath.com" className="hover:text-[#fbbf24] transition-colors truncate">
                  contact@minhthanhmath.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#fbbf24] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">
                  82 Chùa Láng, Láng Thượng, Đống Đa, Hà Nội
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-900/40 pt-6 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/70 font-semibold">
          <p>© {new Date().getFullYear()} <span className="text-[#fbbf24]">MTMath</span>. Bảo lưu mọi quyền.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Điều khoản sử dụng</Link>
          </div>
        </div>

      </div>

      {/* Floating Circles on Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a 
          href="tel:0964345413" 
          title="Gọi điện" 
          className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
        <a 
          href="https://m.me/minhthanhmath" 
          target="_blank" 
          rel="noreferrer" 
          title="Messenger" 
          className="w-12 h-12 rounded-full bg-[#0084FF] text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.447 5.517 3.715 7.147V22l3.413-1.875A12.022 12.022 0 0 0 12 20.516c5.523 0 10-4.146 10-9.258S17.523 2 12 2zm1.086 12.03-2.585-2.762-5.045 2.762 5.545-5.885 2.585 2.762 5.045-2.762z" />
          </svg>
        </a>
        <a 
          href="https://zalo.me/0964345413" 
          target="_blank" 
          rel="noreferrer" 
          title="Zalo" 
          className="w-12 h-12 rounded-full bg-[#2F80ED] text-white flex items-center justify-center font-bold text-sm shadow-lg hover:scale-105 transition-transform"
        >
          Zalo
        </a>
      </div>
    </footer>
  );
}