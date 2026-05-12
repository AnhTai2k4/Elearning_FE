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
                <div className="relative w-full h-full">
                  <img 
                    src="https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Fmacpic2.png&w=1080&q=100" 
                    alt="Kết quả chấm bài 1" 
                     
                    className="object-cover object-top" 
                  />
                </div>
              </SwiperSlide>

              {/* Slide 2 */}
              <SwiperSlide>
                <div className="relative w-full h-full">
                  <img 
                    src="https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Fmacpic2.png&w=1080&q=100" 
                    alt="Kết quả chấm bài 2" 
                    
                    className="object-cover object-top" 
                  />
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
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#f15a24] mb-2">
              Chấm Chữa Bài Từ Giảng Viên
            </h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-[#004a80]">
              Giàu Kinh Nghiệm
            </h3>
          </div>
          <p className="text-base text-gray-700 leading-relaxed text-justify">
            Với kinh nghiệm giảng dạy, vận hành, làm giám thị cho các kỳ thi chứng chỉ 
            quốc tế và đã tham gia tập huấn giám khảo, biên soạn đề thi VSTEP, thầy 
            hiểu rõ cấu trúc đề thi và soạn ra những bộ đề sát với đề thi thật nhất. Giúp 
            các em luyện tập và chấm chữa chi tiết cho 4 kỹ năng của đề thi.
          </p>
          <div>
            <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full border-2 border-[#f15a24] text-[#f15a24] font-semibold hover:bg-[#f15a24] hover:text-white transition-all duration-300 group">
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