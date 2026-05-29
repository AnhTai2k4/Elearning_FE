'use client'; // Bắt buộc phải có dòng này ở trên cùng

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// Import CSS mặc định của Swiper (Bắt buộc)
import 'swiper/css';
import 'swiper/css/effect-fade';

export default function FeatureSection() {
  return (
    <section className="w-full py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <div className="relative w-full max-w-xl mx-auto flex justify-center">
          
          {/* Lớp hiển thị Slider (Nằm lọt thỏm bên dưới viền Macbook) */}
          <div className="absolute top-[8.5%] left-[11.5%] right-[11.5%] bottom-[12%] bg-gray-100 z-0 overflow-hidden rounded-sm">
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade" 
              autoplay={{ 
                delay: 1000, 
                disableOnInteraction: false 
              }}
              loop={true} 
              className="w-full h-full"
            >
              {/* Slide 1 */}
              <SwiperSlide>
                <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-sm font-bold text-[#1e3a8a]">Chấm bài chi tiết từng bước giải</p>
                  </div>
                </div>
              </SwiperSlide>

              {/* Slide 2 */}
              <SwiperSlide>
                <div className="relative w-full h-full bg-gradient-to-br from-yellow-50 to-blue-50 flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-4xl mb-2">✅</div>
                    <p className="text-sm font-bold text-[#1e3a8a]">Phân tích lỗi sai & hướng dẫn sửa</p>
                  </div>
                </div>
              </SwiperSlide>
              
            </Swiper>
          </div>

          <img 
            src="https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Fmacbookframe.png&w=1920&q=100" 
            alt="Macbook Frame" 
            width={800} 
            height={450} 
            className="relative z-10 w-full h-auto drop-shadow-2xl pointer-events-none" 
        
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#fbbf24] mb-2">
              Chấm Chữa Bài Từ Giáo Viên
            </h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#1e3a8a]">
              Giàu Kinh Nghiệm
            </h3>
          </div>
          <p className="text-base text-gray-700 leading-relaxed text-justify">
            Với đội ngũ giáo viên Toán giàu kinh nghiệm từ các trường chuyên, 
            trường đại học hàng đầu, thầy cô sẽ chấm và chữa bài chi tiết từng bước giải, 
            phân tích lỗi sai thường gặp và hướng dẫn phương pháp tư duy đúng. 
            Giúp các em không chỉ biết cách giải mà còn hiểu sâu bản chất Toán học.
          </p>
          <div>
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#fbbf24] text-[#fbbf24] font-semibold hover:bg-[#fbbf24] hover:text-white transition-all duration-300 group">
              Thi thử ngay
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}