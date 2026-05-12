'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const teachers = [
  {
    id: 1,
    name: "CÔ LÊ THÙY DƯƠNG",
    title: "10 năm kinh nghiệm luyện thi VSTEP",
    desc1: "Giảng viên giảng dạy tại khoa Sư phạm Tiếng Anh, ĐH Ngoại Ngữ, ĐHQGHN và THPT Chuyên Ngoại Ngữ, ĐHQGHN (2017 – nay), có nhiều năm kinh nghiệm giảng dạy sinh viên và tập huấn giáo viên tại các tỉnh thành (Hải Phòng, Yên Bái, Phú Thọ, Quảng Ninh, …) về bài thi VSTEP 3-5. Hiện là NCS ngành Ngôn Ngữ Học, ĐHQGHN.",
    desc2: "Tốt nghiệp bằng Xuất sắc hệ CLC ngành Sư phạm Tiếng Anh tại ĐH Ngoại Ngữ, ĐHQGHN. Thạc sĩ ngành Giảng dạy Tiếng Anh của trường Southern New Hampshire, Hoa Kỳ, GPA 4.0/4.0. Ngoài ra, cô cũng là Cựu học sinh chuyên Anh đạt nhiều giải Nhất, Nhì học sinh giỏi Tiếng Anh các cấp Tỉnh, thành phố.",
    stats: [
      { label: "VSTEP", score: "9.5/10" },
      { label: "IELTS", score: "8.0/9.0" }
    ],
    image: "https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Fteacher0.png&w=1200&q=75"
  },
  {
    id: 2,
    name: "THẦY DƯƠNG NGUYỄN ANH",
    title: "Chuyên gia luyện thi VSTEP",
    desc1: "Hiện nay là Giảng viên Khoa Sư phạm Tiếng Anh tại Đại Học Ngoại ngữ - Đại Học Quốc Gia Hà Nội. Với profile khủng: Là Thạc sỹ lí luận phương pháp giảng dạy bộ môn Tiếng Anh...",
    desc2: "Trong suốt 9 năm giảng dạy, bằng sự tận tâm, nhiệt huyết và chuyên môn cao, Thầy đã dìu dắt hàng ngàn học viên đạt được chứng chỉ VSTEP.",
    stats: [], 
    image: "https://onthivstep.vn/_next/image?url=%2Fimages%2Ficon%2Fnn6b%2Fteacher1.png&w=1200&q=75"
  }
];

export default function TeacherSlider() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="w-full bg-[#fdf8f4] py-16 px-4 rounded-tl-[100px] overflow-hidden">
      <div className="max-w-6xl mx-auto relative">
        
        <Swiper
          modules={[Navigation, Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }} 
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-full"
        >
          {teachers.map((teacher) => (
            <SwiperSlide key={teacher.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[500px] pb-24 md:pb-20">
                
                <div className="flex flex-col relative z-10">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#f15a24] uppercase mb-2">
                    {teacher.name}
                  </h2>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#0072BC] mb-6">
                    {teacher.title}
                  </h3>
                  
                  <p className="text-gray-700 leading-relaxed text-justify mb-4">
                    {teacher.desc1}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-justify mb-8">
                    {teacher.desc2}
                  </p>

                  {teacher.stats && teacher.stats.length > 0 && (
                    <div className="flex gap-8">
                      {teacher.stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col">
                          <span className="text-sm font-bold text-[#0072BC] uppercase">{stat.label}</span>
                          <span className="text-3xl font-bold text-[#0072BC]">{stat.score}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative w-full h-full flex justify-center items-end">
                  <div className="absolute right-0 bottom-10 w-48 h-48 border-[24px] border-[#f15a24] rounded-full border-l-transparent -rotate-45 z-0" />
                  
                  <div className="absolute left-10 top-0 w-32 h-32 opacity-30 z-0">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#f15a24 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
                  </div>

                  <div className="relative w-full max-w-[400px] h-[500px] z-10">
                    <Image 
                      src={teacher.image} 
                      alt={teacher.name} 
                      fill 
                      className="object-contain object-bottom drop-shadow-2xl" 
                    />
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

       
        <div className="absolute bottom-4 left-0 z-20 flex gap-4">
          <button 
            onClick={() => swiperRef.current?.slidePrev()}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#0072BC] shadow-md hover:bg-[#0072BC] hover:text-white transition-colors border border-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={() => swiperRef.current?.slideNext()}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-[#0072BC] shadow-md hover:bg-[#0072BC] hover:text-white transition-colors border border-gray-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

      </div>
    </section>
  );
}