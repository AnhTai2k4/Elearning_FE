'use client';

import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const feedbacks = [
  { id: 1, image: "https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Ffeedback1.png&w=1920&q=100" },
  { id: 2, image: "https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Ffeedback3.png&w=1920&q=100" },
  { id: 3, image: "https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Ffeedback5.png&w=1920&q=100" },
  { id: 4, image: "https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Ffeedback6.png&w=1920&q=100" },
  { id: 5, image: "https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Ffeedback7.png&w=1920&q=100" },
];

export default function FeedbackSlider() {
  return (
    <section className="relative w-full py-20 px-4 overflow-hidden">
      
      <div className="absolute inset-0 z-0 opacity-80">
        <Image 
          src="https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Ffeedback-bg.png&w=3840&q=75"
          alt="Feedback Background"
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto flex flex-col items-center">
        
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#004a80] mb-12 text-center drop-shadow-sm">
          Cảm Nhận Của <span className="text-[#f15a24]">Học Viên</span>
        </h2>

        <div className="w-full max-w-4xl">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            // Bật các dấu chấm tròn bên dưới
            pagination={{ clickable: true, dynamicBullets: true }} 
            navigation={true} 
            className="w-full pb-14"
          >
            {feedbacks.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="relative w-full max-w-[800px] mx-auto flex justify-center items-center">
                  
                  <div className="absolute top-[15%] left-[6%] right-[3%] bottom-[0%] z-0 rounded-2xl overflow-hidden">
                    <Image 
                      src={item.image} 
                      alt={`Feedback ${item.id}`} 
                      fill 
                      className="object-cover" 
                    />
                  </div>

                  <Image 
                    src="https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Ffeedbackframe.png&w=1920&q=75"
                    alt="Frame"
                    width={946}
                    height={540}
                    className="relative z-10 w-full h-auto pointer-events-none drop-shadow-xl"
                  />
                  
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}