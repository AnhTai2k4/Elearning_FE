'use client'; // Phải có vì mình dùng hooks của Redux (Client Side)

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCourses } from '../../store/courseSlice';
import Link from 'next/link';
import { CourseService } from '@/services/CourseService';

export default function CourseList() {
  const dispatch = useDispatch();
  const courses = useSelector((state: RootState) => state.courses.items);
  const [activeGrade, setActiveGrade] = useState<number>(12);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await CourseService.getAllCourses();
        if (Array.isArray(res)) {
          dispatch(setCourses(res));
        } else if (res && Array.isArray(res.data)) {
          dispatch(setCourses(res.data));
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [dispatch]);

  const getCourseImage = (course: any) => {
    return course.imageUrl || "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop";
  };

  const examYear = 2026 + (12 - activeGrade);
  const birthYear = 2008 + (12 - activeGrade);
  
  const getStepNumber = (slug: string) => {
    const match = slug.match(/step-(\d+)/i);
    if (match) {
      return parseInt(match[1], 10);
    }
    return 99; // Các khóa học khác (không có từ khóa step) sẽ hiển thị ở cuối
  };

  const filteredCourses = [...courses]
    .filter(c => c.grade === activeGrade)
    .sort((a, b) => getStepNumber(a.slug) - getStepNumber(b.slug));

  return (
    <section className="bg-white py-7 px-4 font-sans">
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
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#00a2b8] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#00a2b8] font-bold">Đang tải dữ liệu khóa học...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-bold text-lg">
            Hiện chưa có khóa học nào cho lớp {activeGrade}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <Link href={`/khoa-hoc/${course.slug}`} key={course._id || course.id} className="group">
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer h-full flex flex-col p-3">
                  
                  <div className="relative h-48 w-full rounded-xl overflow-hidden bg-[#00a2b8] flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                    <img src={getCourseImage(course)} alt={course.title} className="h-full w-auto object-cover rounded shadow-md z-10" />
                  </div>

                  <div className="pt-4 pb-2 px-2 flex flex-col flex-grow">
                    <h3 className="font-bold text-[17px] text-[#1e3a8a] mb-1 group-hover:text-yellow-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course.overview}
                    </p>
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
        )}
      </div>
    </section>
  );
}
