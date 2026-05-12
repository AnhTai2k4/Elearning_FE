'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export default function LessonDetailPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ courseSlug?: string }>;
}) {
  // Bóc tách Promise trong Next.js 15
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug; 

  const resolvedSearchParams = React.use(searchParams);
  const courseSlugQuery = resolvedSearchParams.courseSlug;

  const [activeTab, setActiveTab] = useState('thaoluan');
  const [isClient, setIsClient] = useState(false);

  // Thêm state cho lesson data từ API
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Gọi API để lấy lesson data
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        // Lấy courseSlug từ searchParams (được truyền qua link ở trang khóa học)
        const courseSlug = courseSlugQuery ; // Giá trị fallback nếu không có courseSlug truyền vào
        const response = await fetch(`http://localhost:3001/api/course/get-lesson/${courseSlug}/${slug}`);
        
        if (!response.ok) {
          throw new Error('Không tìm thấy bài học');
        }
        
        const data = await response.json();
        setLesson(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Lỗi khi tải bài học:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isClient && slug) {
      fetchLesson();
    }
  }, [isClient, slug, courseSlugQuery]);

  // MOCK DATA giả lập playlist (có thể lấy từ API sau)
  const mockPlaylist = [
    { id: 1, title: "1. Cấu trúc thư và Các bước viết thư", isPlaying: true },
    { id: 2, title: "2. Thư cung cấp thông tin", isPlaying: false },
    { id: 3, title: "3. Thư đưa lời khuyên & gợi ý", isPlaying: false },
  ];

  if (!isClient) return null;

  // Hiển thị loading
  if (loading) {
    return (
      <div className="bg-[#f0f4f8] min-h-screen font-sans text-gray-800 flex flex-col">
        <Header />
        <div className="flex justify-center items-center flex-grow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f15a24] mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải bài học...</p>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị error
  if (error) {
    return (
      <div className="bg-[#f0f4f8] min-h-screen font-sans text-gray-800 flex flex-col">
        <Header />
        <div className="flex justify-center items-center flex-grow">
          <div className="text-center">
            <p className="text-red-600">Lỗi: {error}</p>
            <Link href="/khoa-hoc" className="mt-4 inline-block text-[#0072BC] hover:underline">
              Quay lại danh sách khóa học
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Nếu không có lesson, hiển thị not found
  if (!lesson) {
    return (
      <div className="bg-[#f0f4f8] min-h-screen font-sans text-gray-800 flex flex-col">
        <Header />
        <div className="flex justify-center items-center flex-grow">
          <div className="text-center">
            <p className="text-gray-600">Không tìm thấy bài học</p>
            <Link href="/khoa-hoc" className="mt-4 inline-block text-[#0072BC] hover:underline">
              Quay lại danh sách khóa học
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen font-sans text-gray-800 flex flex-col">
      <Header />
      
      {/* BREADCRUMB */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-2.5 text-[13px] flex gap-2 items-center text-gray-500 truncate">
          <Link href="/" className="text-[#0072BC] hover:underline">Trang chủ</Link>
          <span className="text-gray-400">›</span>
          <Link href="/khoa-hoc" className="text-[#0072BC] hover:underline">Danh mục khoá học</Link>
          <span className="text-gray-400">›</span>
          <span className="text-[#0072BC]">{lesson.courseTitle || 'VSTEP B1 - Cho người sợ tiếng Anh'}</span>
          <span className="text-gray-400">›</span>
          <span className="text-[#0072BC]">{lesson.sectionTitle || 'WRITING PART 1: VIẾT THƯ'}</span>
          <span className="text-gray-400">›</span>
          <span className="text-[#f15a24] font-medium">{lesson.title}</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto px-4 w-full py-6 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ================= CỘT TRÁI: VIDEO PLAYER ================= */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h1 className="font-bold text-[15px] text-gray-800">{lesson.title}</h1>
              {lesson.subtitle && <p className="text-[13px] text-gray-600 mt-1">{lesson.subtitle}</p>}
            </div>
            
            {/* KHUNG VIDEO (Sử dụng IFRAME BẢN ĐỊA) */}
            <div className="relative w-full pt-[56.25%] bg-black">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`${lesson.videoUrl}?rel=0&showinfo=0`} // rel=0 để không hiện video linh tinh khi xem xong
                title={lesson.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-4 flex items-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors">
               <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" /></svg>
               <span className="text-[14px] font-medium text-gray-800">Tài liệu tham khảo</span>
            </div>
          </div>
        </div>

        {/* ================= CỘT PHẢI: SIDEBAR (Giữ nguyên) ================= */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-white rounded shadow-sm border border-gray-200 p-2 flex flex-col h-[600px]">
            {/* Thanh công cụ */}
            <div className="flex items-center gap-3 p-2 border-b border-gray-100 text-gray-500">
               <span className="text-[13px] font-medium">Chế độ xem:</span>
               <button className="p-1 hover:text-[#0072BC] bg-gray-100 rounded"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg></button>
            </div>

            {/* Thảo luận Chat Box */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-[16px] text-gray-800 mb-3">Thảo luận</h3>
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-4 py-2 shadow-inner">
                <div className="w-8 h-8 rounded-full bg-[#7E96A0] text-white flex items-center justify-center text-sm shrink-0">A</div>
                <input type="text" placeholder="Bình luận" className="w-full text-[13px] outline-none bg-transparent" />
                <button className="text-gray-400 hover:text-[#0072BC]"><svg className="w-4 h-4 transform rotate-45" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></button>
              </div>
            </div>

            {/* Danh sách Playlist */}
            <div className="overflow-y-auto flex-grow p-2 space-y-1 mt-2">
              {mockPlaylist.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center gap-3 p-3 rounded cursor-pointer transition-colors ${item.isPlaying ? 'bg-orange-50/50 border-l-2 border-[#f15a24]' : 'hover:bg-gray-50'}`}
                >
                  <svg className={`w-4 h-4 shrink-0 ${item.isPlaying ? 'text-[#f15a24]' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  <span className={`text-[13px] font-medium ${item.isPlaying ? 'text-[#f15a24]' : 'text-gray-700'}`}>{item.title}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}