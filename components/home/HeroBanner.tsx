"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HeroBanner() {
  const scrollToRegister = () => {
    // Tạm thời chưa có form đăng ký, scroll đến khu vực khoa học
    const element = document.getElementById("courses-section") || document.documentElement;
    element.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="pt-10 md:pt-10 pb-10 relative overflow-hidden min-h-[90vh] flex items-center" aria-labelledby="hero-heading">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/math_assets/3a0a47e483030d752b74a16044b2bd5c5183d3ba.png" 
          alt="Lớp học ToánMath" 
          className="w-full h-full object-cover blur-[3px] opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/10 to-[#3b82f6]/10"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10 z-[1]">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <article className="space-y-6 text-white text-center lg:text-left">
            <div className="flex justify-center lg:justify-start">
              <span className="inline-block bg-[#fbbf24] text-[#1e3a8a] px-5 py-2 rounded-full font-bold shadow-lg text-sm" role="text">
                🎓 Trung Tâm Toán Uy Tín Hàng Đầu
              </span>
            </div>
            
            <h1 id="hero-heading" className="text-4xl md:text-4xl lg:text-4xl font-bold text-[#1e3a8a] leading-tight">
              Chinh Phục Môn Toán Cùng <br className="hidden md:block"/>
              Thầy Giáo 10+ Năm Kinh Nghiệm <br className="hidden md:block"/>
              <span className="text-[#fbbf24]">ToánMath</span>
            </h1>
            
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Lớp học sĩ số nhỏ - Xây dựng tư duy toán - Học bản chất - Bứt phá kết quả học trong thời gian ngắn.
            </p>

            <nav className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8" aria-label="Call to action">
              <button 
                onClick={scrollToRegister} 
                className="flex items-center gap-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-[#1e3a8a] font-bold shadow-lg text-base px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                aria-label="Đăng ký học thử miễn phí"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                <span>Đăng Ký Học Thử Miễn Phí</span>
              </button>
              <Link 
                href="/khoa-hoc" 
                className="flex items-center justify-center border-2 border-[#fbbf24] text-[#d97706] hover:bg-[#fbbf24] hover:text-[#1e3a8a] font-bold text-base px-8 py-4 rounded-full transition-all duration-300"
                aria-label="Xem thông tin khóa học"
              >
                Xem Khóa Học
              </Link>
            </nav>

            {/* Stats */}
            <aside className="grid grid-cols-3 gap-6 pt-10 mt-8 border-t-2 border-gray-200/60" aria-label="Thống kê trung tâm">
              <div className="text-center">
                <strong className="text-3xl md:text-4xl font-bold text-[#fbbf24] block">10.000+</strong>
                <p className="text-[#1e3a8a] font-semibold text-sm md:text-base mt-2">Học Sinh</p>
              </div>
              <div className="text-center">
                <strong className="text-3xl md:text-4xl font-bold text-[#fbbf24] block">95%</strong>
                <p className="text-[#1e3a8a] font-semibold text-sm md:text-base mt-2">Đạt Điểm 8+</p>
              </div>
              <div className="text-center">
                <strong className="text-3xl md:text-4xl font-bold text-[#fbbf24] block">10+</strong>
                <p className="text-[#1e3a8a] font-semibold text-sm md:text-base mt-2">Năm Kinh Nghiệm</p>
              </div>
            </aside>
          </article>

          {/* Right Content - Teacher Image */}
          <aside className="mt-12 lg:mt-0 flex justify-center lg:justify-end" aria-label="Giáo viên ToánMath">
            <div className="relative inline-block">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-[#fbbf24] max-w-[320px] md:max-w-[400px] lg:max-w-[450px]">
                <img 
                  src="/images/math_assets/avatar.jpg"
                  alt="Giáo viên ToánMath - Tự tin giỏi toán, hiểu sâu nhớ lâu" 
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 bg-[#fbbf24] text-[#1e3a8a] px-6 py-3 rounded-2xl shadow-2xl transform rotate-12 font-black text-lg whitespace-nowrap z-20" aria-label="Top 1">
                ⭐ Top 1 Uy Tín
              </div>
              <div className="absolute -bottom-2 -left-2 md:-bottom-2 md:-left-2 bg-white text-[#1e3a8a] px-2 py-2 rounded-2xl shadow-2xl font-black text-lg whitespace-nowrap z-20 flex items-center gap-2 border-2 border-gray-100" aria-label="Chất lượng">
                <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                Uy tín 100%
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
