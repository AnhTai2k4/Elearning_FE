'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { ExamService, ExamData } from '@/services/ExamService';
import { useRouter } from 'next/navigation';

export default function MockExamsListPage() {
  const router = useRouter();
  const [exams, setExams] = useState<ExamData[]>([]);

  useEffect(() => {
    ExamService.getAllExams().then(res => res.status === 'OK' && setExams(res.data || []));
  }, []);

  const isThpt = (exam: ExamData) => exam.answers['13_a'] !== undefined || exam.answers['17'] !== undefined;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-800 text-xs">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="rounded-[32px] overflow-hidden bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white p-8 md:p-12 mb-10 shadow-lg">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Hệ Thống Luyện Đề ToánMath</h1>
          <p className="mt-4 text-blue-100 text-sm max-w-2xl">Luyện tập trực tuyến, chấm điểm tự động chuẩn Bộ Giáo dục & Đào tạo.</p>
        </div>
        <h2 className="text-lg font-bold text-[#1e3a8a] mb-6">Danh sách Đề thi của lớp học</h2>
        {exams.length === 0 ? (
          <p className="text-gray-400 py-10 text-center bg-white rounded-2xl border">Chưa có đề thi được xuất bản.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div key={exam._id} className="bg-white border rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all">
                <div>
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${exam.type === 'exam' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>{exam.type === 'exam' ? 'Đề thi' : 'Bài tập'}</span>
                  <h3 className="font-bold text-base text-gray-900 mt-3 line-clamp-1">{exam.title}</h3>
                  <p className="text-gray-400 text-[10px] mt-1.5 line-clamp-2">{exam.description || 'Không có mô tả.'}</p>
                  <div className="mt-4 flex gap-4 text-gray-500 font-semibold">
                    <span>⏱️ {exam.duration} phút</span>
                    <span>❓ {isThpt(exam) ? 'Cấu trúc THPT' : `${exam.questionsCount} câu`}</span>
                  </div>
                </div>
                <button onClick={() => router.push(`/thi-thu/${exam._id}`)} className="w-full mt-6 bg-[#1e3a8a] hover:bg-[#fbbf24] hover:text-[#1e3a8a] text-white font-bold py-2.5 rounded-full transition-all">Bắt đầu làm bài</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
