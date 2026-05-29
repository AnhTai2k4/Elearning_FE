"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const ChevronLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 18-6-6 6-6"></path>
  </svg>
);

const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"></path>
  </svg>
);

const QuoteIcon = ({ size = 24 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
  </svg>
);

const SparklesIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    <path d="M5 3v4"></path>
    <path d="M19 17v4"></path>
    <path d="M3 5h4"></path>
    <path d="M17 19h4"></path>
  </svg>
);

export default function FeedbackSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      image: "/images/math_assets/9d658ea6d8327bc9490e1829f8861bb4221904ef.png",
      name: "Phạm Quang Anh",
      school: "THPT Việt Đức",
      title: "Anh Thành luôn sẵn sàng giúp đỡ mỗi khi học sinh cần",
      description: "Anh Thành luôn sẵn sàng giúp đỡ mỗi khi học sinh cần, tạo cảm giác thoải mái trong lúc học tập. Anh luôn tạo ra một môi trường học lành mạnh, thoải mái. GPA Toán lớp 12: 10.0. Đỗ khoa Phân tích Kinh doanh (NEU)"
    },
    {
      id: 2,
      image: "/images/math_assets/GiaHan.jpg",
      name: "Gia Hân",
      school: "THPT Gia Hân",
      title: "Bí quyết ôn thi DGNL đạt điểm cao của học sinh Gia Hân",
      description: "Bí quyết ôn thi ĐGNL đạt điểm cao luôn là điều mà nhiều học sinh và phụ huynh quan tâm mỗi mùa thi. Tại Trung tâm ToánMath, học sinh Gia Hân đã xuất sắc giành 105+ điểm thi HSA, vào được ngôi trường Ngoại Thương mơ ước [...]"
    },
    {
      id: 3,
      image: "/images/math_assets/e65f7186f6bc7a7850301b3d3ae8015d83670579.png",
      name: "Nguyễn Việt Bảo Linh",
      school: "THPT HN - Amsterdam",
      title: "Mình luôn cảm thấy biết ơn và tự hào",
      description: "Mình luôn cảm thấy biết ơn và tự hào khi thầy đã biến mình từ một đứa không dám đối diện với nỗi sợ môn Toán trở thành một Bảo Linh sẵn sàng đi học 5 buổi toán/tuần trong những ngày chạy nước rút. GPA lớp 12: 9.9. Đỗ FTU, AJC, HLU, DAV."
    },
    {
      id: 4,
      image: "/images/math_assets/fb.jpg",
      name: "Học sinh Ẩn Danh",
      school: "Học sinh THPT",
      title: "ToánMath - Nơi lớp học là nhà",
      description: "Em xin cảm ơn thầy vì sự tận tâm và gần gũi trong từng buổi học. Nhờ thầy, lớp học luôn ấm áp và thân thiện, khiến em cảm thấy như đang học ở chính ngôi nhà của mình. Em rất trân trọng những gì thầy đã dành cho chúng em.",
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getPrevIndex = (index: number) => (index - 1 + testimonials.length) % testimonials.length;
  const getNextIndex = (index: number) => (index + 1) % testimonials.length;

  return (
    <section id="feedback" className="py-14 bg-gradient-to-br from-yellow-50 to-white relative overflow-hidden" aria-labelledby="feedback-heading">
      {/* Decorative Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <SparklesIcon className="absolute top-10 right-20 text-yellow-300 opacity-40" size={40} />
        <SparklesIcon className="absolute top-32 right-40 text-yellow-400 opacity-30" size={24} />
        <SparklesIcon className="absolute top-20 left-32 text-orange-300 opacity-35" size={32} />
        <SparklesIcon className="absolute bottom-40 right-60 text-yellow-300 opacity-25" size={28} />
        <SparklesIcon className="absolute top-1/2 left-20 text-orange-200 opacity-30" size={36} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#fbbf24] to-orange-500 text-white px-5 py-1.5 rounded-full mb-3 shadow-lg">
            <QuoteIcon size={18} />
            <span className="font-bold text-lg md:text-2xl">PHẢN HỒI</span>
          </div>
          <h2 id="feedback-heading" className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-3">
            HALL OF FAME - <span className="text-[#fbbf24]">Câu Chuyện Thành Công</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Những câu chuyện truyền cảm hứng từ các học sinh xuất sắc của ToánMath
          </p>
        </header>

        <div className="max-w-4xl mx-auto relative mt-10">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-32 -translate-x-4 md:-translate-x-16 z-30 bg-white hover:bg-gray-100 text-gray-500 rounded-full p-3 shadow-lg transition-all duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeftIcon />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-32 translate-x-4 md:translate-x-16 z-30 bg-white hover:bg-gray-100 text-gray-500 rounded-full p-3 shadow-lg transition-all duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRightIcon />
          </button>

          {/* Overlapping Circular Images */}
          <div className="flex justify-center items-center mb-8 relative h-64 overflow-hidden md:overflow-visible">
            {/* Left Image (Previous) */}
            <div className="absolute left-1/2 -translate-x-32 md:-translate-x-64 z-10 transition-all duration-500">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl opacity-60">
                <img
                  src={testimonials[getPrevIndex(currentSlide)].image}
                  alt={testimonials[getPrevIndex(currentSlide)].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Center Image (Current) */}
            <div className="relative z-20 transition-all duration-500 transform scale-110">
              <div className="w-48 h-48 md:w-72 md:h-72 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                <img
                  src={testimonials[currentSlide].image}
                  alt={testimonials[currentSlide].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Image (Next) */}
            <div className="absolute right-1/2 translate-x-32 md:translate-x-64 z-10 transition-all duration-500">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl opacity-60">
                <img
                  src={testimonials[getNextIndex(currentSlide)].image}
                  alt={testimonials[getNextIndex(currentSlide)].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Text Content Box */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl border-4 border-[#fbbf24] p-8 shadow-lg mb-6 relative z-20 mt-8 md:mt-0">
            <h3 className="text-[#1e3a8a] font-bold mb-3 text-center text-lg md:text-xl">
              "{testimonials[currentSlide].title}"
            </h3>
            <p className="text-gray-600 text-center leading-relaxed italic mb-4">
              {testimonials[currentSlide].description}
            </p>
            <div className="text-center mt-4 border-t pt-4 border-gray-100">
              <p className="font-bold text-[#1e3a8a]">{testimonials[currentSlide].name}</p>
              <p className="text-sm text-gray-500">{testimonials[currentSlide].school}</p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mb-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? "bg-[#fbbf24] w-8" 
                    : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}