'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import LoginModal from '@/components/auth/LoginModal';
import { UserService } from '@/services/UserService';
import { CommentService } from '@/services/CommentService';
import LessonComments from '@/components/lesson/LessonComments';

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
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const resolvedSearchParams = React.use(searchParams);
  const courseSlugQuery = resolvedSearchParams.courseSlug;

  const [activeTab, setActiveTab] = useState('thaoluan');
  const [isClient, setIsClient] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [initialComments, setInitialComments] = useState<any[]>([]);
  const [initialTotal, setInitialTotal] = useState(0);
  const [initialHasMore, setInitialHasMore] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Gọi API để lấy lesson data và thông tin khóa học
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const courseSlug = courseSlugQuery ? decodeURIComponent(courseSlugQuery) : '';
        const decodedSlug = decodeURIComponent(slug);
        const apiBase = process.env.BE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://eleaning-be.vercel.app/api';
        const response = await fetch(`${apiBase}/course/get-lesson/${encodeURIComponent(courseSlug)}/${encodeURIComponent(decodedSlug)}`);
        
        if (!response.ok) {
          throw new Error('Không tìm thấy bài học');
        }
        const data = await response.json();
        setLesson(data);

        const [courseResponse, commentsData] = await Promise.all([
          fetch(`${apiBase}/course/get-course/${encodeURIComponent(courseSlug)}`),
          CommentService.getCommentsByLesson(data._id, 1, 5).catch(() => null)
        ]);

        if (courseResponse.ok) {
          const courseData = await courseResponse.json();
          setCourse(courseData);
        }

        if (commentsData && commentsData.success) {
          setInitialComments(commentsData.data);
          setInitialTotal(commentsData.total);
          setInitialHasMore(commentsData.hasMore);
        }
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

  // Hook theo dõi tiến độ xem video Bunny Stream
  useEffect(() => {
    if (!lesson || !user?.id) return;
    const isCompleted = user.completedLessons?.includes(lesson._id);
    if (isCompleted) return;

    let isRequesting = false;
    let pingInterval: NodeJS.Timeout;

    // Gửi yêu cầu đăng ký event timeupdate đến iframe liên tục cho đến khi nhận được phản hồi
    const subscribeToPlayer = () => {
      const iframe = document.getElementById('bunny-player') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        // Chuẩn Player.js yêu cầu trường "listener"
        iframe.contentWindow.postMessage(JSON.stringify({
          context: 'player.js',
          method: 'addEventListener',
          value: 'timeupdate',
          listener: 'timeupdate-listener'
        }), '*');
      }
    };

    pingInterval = setInterval(subscribeToPlayer, 1000);

    const handleMessage = async (e: MessageEvent) => {
      try {
        if (!e.data) return;
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        
        // Bỏ qua các message rác của React
        if (!data.event) return;

        // Nếu nhận được event từ Bunny Player thì log ra để dễ debug
        if (e.origin.includes('mediadelivery.net') || data.context === 'player.js') {
           console.log('[Bunny Player Event]:', data.event, data);
        }
        
        // Nếu nhận được bất kỳ event timeupdate nào thì dừng việc ping
        if (data.event === 'timeupdate') {
          clearInterval(pingInterval);
          
          const value = data.value || data; // Hỗ trợ cả 2 định dạng
          const currentTime = value.seconds || value.currentTime || value.time || 0;
          let duration = value.duration || 0;
          
          if (!duration && lesson.duration) {
            duration = parseInt(lesson.duration) * 60;
          }

          if (duration > 0) {
            // Log tiến độ để debug
            console.log(`[Bunny Player] Progress: ${Math.floor((currentTime / duration) * 100)}% (${currentTime}s / ${duration}s)`);
            
            if (currentTime / duration >= 0.6 && !isRequesting) {
              console.log('[Bunny Player] Đạt mốc 60%, tiến hành gửi API complete-lesson!');
              isRequesting = true;
              dispatch(markLessonComplete(lesson._id));
              try {
                await UserService.completeLesson(user.id, lesson._id);
                console.log('[Bunny Player] Gửi API thành công!');
              } catch (err) {
                console.error('Failed to mark lesson as complete', err);
              }
            }
          }
        }
      } catch (err) {
        // Bỏ qua lỗi JSON parse
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(pingInterval);
    };
  }, [lesson, user?.id, user?.completedLessons, dispatch]);

  // Lấy danh sách toàn bộ bài học trong khóa học
  const allLessons: any[] = [];
  if (course && course.sections) {
    course.sections.forEach((sec: any) => {
      if (sec.lessons) {
        sec.lessons.forEach((les: any) => {
          allLessons.push(les);
        });
      }
    });
  }

  // Tìm index bài học hiện tại và lấy 3 bài học tiếp theo (so sánh sau khi giải mã URL)
  const decodedSlug = decodeURIComponent(slug);
  const currentIdx = allLessons.findIndex((les) => {
    return decodeURIComponent(les.slug).trim() === decodedSlug.trim();
  });
  const nextLessons = currentIdx !== -1 ? allLessons.slice(currentIdx + 1, currentIdx + 4) : [];

  const hasPurchased = !!(user?.courseBuyed && 
    (user.courseBuyed.includes(course?._id) || user.courseBuyed.includes(course?.slug)));

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
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h1 className="font-bold text-[15px] text-gray-800">{lesson.title}</h1>
              {lesson.subtitle && <p className="text-[13px] text-gray-600 mt-1">{lesson.subtitle}</p>}
            </div>
            
            {/* KHUNG VIDEO (Bunny Stream) */}
            <div className="relative w-full pt-[56.25%] bg-black">
              <iframe
                id="bunny-player"
                className="absolute top-0 left-0 w-full h-full border-0"
                src={lesson.videoUrl}
                loading="lazy"
                title={lesson.title}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
              ></iframe>
            </div>

            <div className="p-4 flex flex-col gap-2 transition-colors">
              
            </div>
          </div>

        </div>

        {/* ================= CỘT PHẢI: SIDEBAR ================= */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* COMMENT SECTION */}
          <LessonComments 
            lessonId={lesson._id} 
            initialComments={initialComments}
            initialTotal={initialTotal}
            initialHasMore={initialHasMore}
          />
          <div className="bg-white rounded shadow-sm border border-gray-200 p-2 flex flex-col">
            {/* Danh sách Playlist */}
            <div className="overflow-y-auto flex-grow p-2 space-y-1 mt-2">
              {/* Bài học hiện tại */}
              {lesson && (
                <div className="flex items-center gap-3 p-3 rounded bg-orange-50/50 border-l-2 border-[#f15a24]">
                  {user?.completedLessons?.includes(lesson._id) ? (
                    <svg className="w-5 h-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 shrink-0 text-[#f15a24]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#f15a24] line-clamp-1">{lesson.title}</span>
                    <span className="text-[10px] text-orange-600 font-medium">Đang học</span>
                  </div>
                </div>
              )}

              {/* Đường chia bài tiếp theo */}
              <div className="pt-3 pb-1 px-3 border-t border-gray-100 mt-2">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Bài học tiếp theo</span>
              </div>

              {/* Các bài tiếp theo */}
              {nextLessons.length === 0 ? (
                <p className="text-[12px] text-gray-400 px-3 py-2 italic">Không có bài học tiếp theo.</p>
              ) : (
                nextLessons.map((item: any) => {
                  const isLocked = !item.isFree && !hasPurchased;
                  return (
                    <Link
                      key={item.slug}
                      href={{
                        pathname: `/bai-hoc/${item.slug}`,
                        query: { courseSlug: courseSlugQuery }
                      }}
                      onClick={(e) => {
                        if (isLocked) {
                          e.preventDefault();
                          if (!user || !user.access_token) {
                            setShowLoginModal(true);
                          } else {
                            setShowPaymentModal(true);
                          }
                        }
                      }}
                      className="flex items-center justify-between p-3 rounded hover:bg-gray-50 transition-colors text-left w-full block"
                    >
                      <div className="flex items-center gap-3">
                        {isLocked ? (
                          <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        ) : user?.completedLessons?.includes(item._id) ? (
                          <svg className="w-5 h-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        )}
                        <div className="flex flex-col">
                          <span className={`text-[13px] font-semibold line-clamp-1 ${isLocked ? 'text-gray-400' : 'text-gray-750'}`}>{item.title}</span>
                          {item.duration && <span className="text-[11px] text-gray-400 mt-0.5">Thời lượng: {item.duration}</span>}
                        </div>
                      </div>
                      {item.isFree && (
                        <span className="text-[10px] font-bold text-[#f15a24] bg-orange-100 px-2 py-0.5 rounded shrink-0">
                          FREE
                        </span>
                      )}
                    </Link>
                  );
                })
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Modal thông báo yêu cầu mua khóa học */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Thông báo</h3>
            <p className="text-gray-600 mb-6">Bạn cần phải mua khóa học để xem tiếp video bài học này nhé.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  router.push(`/thanh-toan/${courseSlugQuery}`);
                }}
                className="px-4 py-2 bg-[#f15a24] text-white rounded hover:bg-[#d94e1d] font-medium transition-colors"
              >
                Mua ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thông báo yêu cầu ĐĂNG NHẬP */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Thông báo</h3>
            <p className="text-gray-600 mb-6">Bạn cần đăng nhập để học tiếp bài học này nhé.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 font-medium transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={() => {
                  setShowLoginModal(false);
                  setIsLoginModalOpen(true);
                }}
                className="px-4 py-2 bg-[#f15a24] text-white rounded hover:bg-[#d94e1d] font-medium transition-colors"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

    </div>
  );
}