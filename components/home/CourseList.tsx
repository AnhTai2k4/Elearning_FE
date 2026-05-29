'use client'; // Phải có vì mình dùng hooks của Redux (Client Side)

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCourses } from '../../store/courseSlice';
import Link from 'next/link';

export default function CourseList() {
  const dispatch = useDispatch();
  const courses = useSelector((state: RootState) => state.courses.items);
  const [activeGrade, setActiveGrade] = useState<number>(12);

  useEffect(() => {
    const mockData = [
      // Lớp 12
      { 
        id: '1', slug: 'nen-tang-toan-12', title: 'STEP 1 | Nền tảng Toán 12', describe: '', price: 1200000, 
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop",
        grade: 12, tags: ['Video']
      },
      { 
        id: '2', slug: 'van-dung-toan-12', title: 'STEP 2 | Vận dụng Toán 12', describe: '', price: 1500000, 
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop",
        grade: 12, tags: ['Video']
      },
      { 
        id: '3', slug: 'van-dung-cao-toan-12', title: 'STEP 3 | Vận dụng cao Toán 12', describe: '', price: 1200000, 
        image: "https://img.freepik.com/vector-cao-cap/cac-dau-toan-hoc-ve-tay-tren-bang-phan-do-hoa-va-cong-thuc-toan-hoc-hinh-hoc-hoac-hinh-anh-vat-ly-tren-bang-den-cac-bieu-tuong-vector-tan-thoi_53562-24899.jpg",
        grade: 12, tags: ['Video', 'Livestream'], releaseDate: '01/12/2025'
      },
      { 
        id: '4', slug: 'tong-on-luyen-de-12', title: 'STEP 4 | Tổng ôn & Luyện đề', describe: '', price: 1500000, 
        image: "https://media.istockphoto.com/id/1805828348/vi/vec-to/ph%C3%A1c-th%E1%BA%A3o-c%C3%A1c-k%C3%BD-hi%E1%BB%87u-to%C3%A1n-h%E1%BB%8Dc-ph%C6%B0%C6%A1ng-tr%C3%ACnh-v%C3%A0-c%C3%B4ng-th%E1%BB%A9c-v%C3%A0-%C4%91%E1%BB%93-h%E1%BB%8Da-v%E1%BA%BD-ngu%E1%BB%87ch-ngo%E1%BA%A1c-vi%E1%BA%BFt-tay.jpg?s=612x612&w=0&k=20&c=jET9lm8WnRdM7n3YXhHofHeII7TJl8H4qrku-xlT6To=",
        grade: 12, tags: ['Video', 'Livestream'], releaseDate: '01/12/2025'
      },
      // Lớp 11
      { 
        id: '5', slug: 'nen-tang-toan-11', title: 'STEP 1 | Nền tảng Toán 11', describe: '', price: 1100000, 
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop",
        grade: 11, tags: ['Video']
      },
      { 
        id: '6', slug: 'van-dung-toan-11', title: 'STEP 2 | Vận dụng Toán 11', describe: '', price: 1500000, 
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop",
        grade: 11, tags: ['Video']
      },
      { 
        id: '7', slug: 'van-dung-cao-toan-11', title: 'STEP 3 | Vận dụng cao Toán 11', describe: '', price: 1100000, 
        image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&h=400&fit=crop",
        grade: 11, tags: ['Video', 'Livestream'], releaseDate: '01/11/2025'
      },
      { 
        id: '8', slug: 'tong-on-luyen-de-11', title: 'STEP 4 | Tổng ôn & Luyện đề', describe: '', price: 1500000, 
        image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=600&h=400&fit=crop",
        grade: 11, tags: ['Video', 'Livestream'], releaseDate: '01/11/2025'
      },
      
      // Lớp 10
      { 
        id: '9', slug: 'nen-tang-toan-10', title: 'STEP 1 | Nền tảng Toán 10', describe: '', price: 1000000, 
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop",
        grade: 10, tags: ['Video']
      },
      { 
        id: '10', slug: 'van-dung-toan-10', title: 'STEP 2 | Vận dụng Toán 10', describe: '', price: 1500000, 
        image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&h=400&fit=crop",
        grade: 10, tags: ['Video']
      },
      { 
        id: '11', slug: 'van-dung-cao-toan-10', title: 'STEP 3 | Vận dụng cao Toán 10', describe: '', price: 1000000, 
        image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&h=400&fit=crop",
        grade: 10, tags: ['Video', 'Livestream'], releaseDate: '01/10/2025'
      },
      { 
        id: '12', slug: 'tong-on-luyen-de-10', title: 'STEP 4 | Tổng ôn & Luyện đề', describe: '', price: 1500000, 
        image: "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=600&h=400&fit=crop",
        grade: 10, tags: ['Video', 'Livestream'], releaseDate: '01/10/2025'
      },
     
    ];
    dispatch(setCourses(mockData));
  }, [dispatch]);

  const examYear = 2026 + (12 - activeGrade);
  const birthYear = 2008 + (12 - activeGrade);
  
  const filteredCourses = courses.filter(c => c.grade === activeGrade);

  return (
    <section className="bg-white py-16 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center gap-4 mb-10">
          {[10, 11, 12].map(grade => (
            <button 
              key={grade}
              onClick={() => setActiveGrade(grade)}
              className={`px-8 py-2 rounded-full font-bold transition-all duration-300 ${activeGrade === grade ? 'bg-[#00a2b8] text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:text-[#00a2b8] hover:bg-gray-200'}`}
            >
              Lớp {grade}
            </button>
          ))}
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#1e3a8a] uppercase tracking-wider font-serif">
          Lộ trình luyện thi {examYear} <span className="text-[#fbbf24]">dành cho {birthYear}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCourses.map(course => (
            <Link href={`/khoa-hoc/${course.slug}`} key={course.id} className="group">
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer h-full flex flex-col p-3">
                
                <div className="relative h-48 w-full rounded-xl overflow-hidden bg-[#00a2b8] p-2 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                  <img src={course.image} alt={course.title} className="h-full w-auto object-cover rounded shadow-md z-10" />
                </div>

                <div className="pt-4 pb-2 px-2 flex flex-col flex-grow">
                  <h3 className="font-bold text-[17px] text-[#1e3a8a] mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <div className="mt-auto">
                    {course.releaseDate && (
                      <div className="bg-[#00a2b8] text-white text-xs font-bold px-2 py-1 rounded w-max mb-3">
                        Phát hành: {course.releaseDate}
                      </div>
                    )}

                    <div className="flex gap-2 justify-end mb-3">
                      {course.tags?.includes('Video') && (
                        <span className="bg-[#00a2b8] text-white text-[11px] font-semibold px-2 py-1 flex items-center gap-1 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
                          Video
                        </span>
                      )}
                      {course.tags?.includes('Livestream') && (
                        <span className="bg-[#b91c52] text-white text-[11px] font-semibold px-2 py-1 flex items-center gap-1 rounded">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                          Livestream
                        </span>
                      )}
                    </div>
                    
                    <hr className="border-t border-dashed border-gray-200 mb-3" />
                    
                    <p className="text-yellow-600 text-right font-bold text-lg">
                      {course.price.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
