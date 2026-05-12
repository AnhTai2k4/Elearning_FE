'use client'; // Phải có vì mình dùng hooks của Redux (Client Side)

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setCourses } from '../../store/courseSlice';
import { describe } from 'node:test';
import Link from 'next/dist/client/link';

export default function CourseList() {
  const dispatch = useDispatch();
  const courses = useSelector((state: RootState) => state.courses.items);

  useEffect(() => {
    const mockData = [
      { id: '1',slug: 'luyen-thi-vstep-b1', title: 'Khóa luyện thi VSTEP B1', describe: 'Khóa học giúp học viên nâng cao trình độ và ôn luyện các đề thi tiếng Anh theo chuẩn VSTEP B1', price: 990000, image: "https://onthivstep.vn/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fngoaingu6b.appspot.com%2Fimages%2F550489319-1744273723371-1.png&w=750&q=100" },
      { id: '2',slug: 'luyen-thi-vstep-c1', title: 'Khóa luyện thi VSTEP C1', describe: 'Khóa học giúp học viên nâng cao trình độ tiếng Anh và ôn luyện các đề thi tiếng Anh theo chuẩn VSTEP C1', price: 1290000, image: "https://onthivstep.vn/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fngoaingu6b.appspot.com%2Fimages%2F550489319-1744273723371-1.png&w=750&q=100" },
      { id: '3',slug: 'luyen-thi-vstep-b2', title: 'Khóa luyện thi VSTEP B2', describe: 'Khóa học giúp học viên nâng cao trình độ tiếng Anh và ôn luyện các đề thi tiếng Anh theo chuẩn VSTEP B2', price: 1090000, image: "https://onthivstep.vn/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fngoaingu6b.appspot.com%2Fimages%2F550489319-1744273723371-1.png&w=750&q=100" },
      { id: '4',slug: 'luyen-thi-vstep-c2', title: 'Khóa luyện thi VSTEP C2', describe: 'Khóa học giúp học viên nâng cao trình độ tiếng Anh và ôn luyện các đề thi tiếng Anh theo chuẩn VSTEP C2', price: 1490000, image: "https://onthivstep.vn/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fngoaingu6b.appspot.com%2Fimages%2F550489319-1744273723371-1.png&w=750&q=100" },
      { id: '5',slug: 'luyen-thi-vstep-a1', title: 'Khóa luyện thi VSTEP A1', describe: 'Khóa học giúp học viên nâng cao trình độ tiếng Anh và ôn luyện các đề thi tiếng Anh theo chuẩn VSTEP A1', price: 790000, image: "https://onthivstep.vn/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fngoaingu6b.appspot.com%2Fimages%2F550489319-1744273723371-1.png&w=750&q=100" },
      { id: '6',slug: 'luyen-thi-vstep-a2', title: 'Khóa luyện thi VSTEP A2', describe: 'Khóa học giúp học viên nâng cao trình độ tiếng Anh và ôn luyện các đề thi tiếng Anh theo chuẩn VSTEP A2', price: 890000, image: "https://onthivstep.vn/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fngoaingu6b.appspot.com%2Fimages%2F550489319-1744273723371-1.png&w=750&q=100" },
      
    ];
    dispatch(setCourses(mockData));
  }, [dispatch]);

  return (
    <section className="max-w-6xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-4 text-[#f15a24]">Khóa học Vstep <span className="text-blue-800">Online cấp tốc</span></h2>
      <p className='text-center mb-12'>Bộ khóa học được thầy xây dựng với những kiến thức trọng tâm, bám sát định dạng đề thi mới nhất từ bộ giáo dục giúp các em học là đúng, ôn là trúng, đạt điểm cao dễ dàng.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => (
          // 3. Bọc toàn bộ cái Card bằng thẻ Link và truyền slug vào href
          <Link href={`/khoa-hoc/${course.slug}`} key={course.id}>
            <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer h-full flex flex-col">
              <img src={course.image} alt={course.title} className="h-48 w-full object-cover bg-gray-200" />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-2 group-hover:text-orange-500 transition-colors">{course.title}</h3>
                <p className="text-gray-600 mb-4 text-sm flex-grow line-clamp-3">{course.describe}</p>
                <p className="text-red-500 font-semibold mt-auto">{course.price.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

