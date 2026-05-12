'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/layout/Header';
import Link from 'next/link';

const sampleQuestions = [
  {
    id: 1,
    title: 'What is TRUE about Mr Khanh’s wife?',
    choices: [
      'She studied at the same high school as him.',
      'She went to Hanoi Law University.',
      'She wants to go to Disneyland.',
      'She takes part in the show “Who is a millionaire”.',
    ],
  },
  {
    id: 2,
    title: 'What position does Tim Robinson hold?',
    choices: [
      'Company receptionist',
      'Marketing manager',
      'Sales adviser',
      'Human resources leader',
    ],
  },
  {
    id: 3,
    title: 'How long is the listening section expected to last?',
    choices: ['10 minutes', '15 minutes', '20 minutes', '30 minutes'],
  },
];

export default function MockExamPage() {
  const [phase, setPhase] = useState<'overview' | 'inProgress' | 'review'>('overview');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [countdown, setCountdown] = useState(30 * 60);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  useEffect(() => {
    if (phase !== 'inProgress') return;
    const timerId = window.setInterval(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [phase]);

  const answeredCount = Object.keys(answers).length;
  const currentQuestionData = sampleQuestions[currentQuestion];

  const score = useMemo(() => {
    if (phase !== 'review') return 0;
    return Object.values(answers).reduce((sum) => sum + 1, 0);
  }, [answers, phase]);

  const renderOverview = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="rounded-[32px] overflow-hidden bg-gradient-to-b from-[#fff7ed] to-white border border-[#f5e1d0] shadow-xl">
        <div className="p-8 md:p-12">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#f15a24] font-semibold">
              Trang chủ &rarr; Thi thử
            </p>
            <h1 className="mt-6 text-4xl md:text-5xl font-bold text-[#06283D] leading-tight">
              Thi Thử Online Vstep Như Thi Thật - Luyện Là Trúng
            </h1>
            <p className="mt-5 max-w-2xl text-base md:text-lg text-[#516076] leading-relaxed">
              Bộ đề thi thử tiếng Anh bậc 3-5 (B1-C1) được biên soạn độc quyền bởi Team thầy Dương Nguyễn Anh.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-col gap-4 p-7 md:flex-row md:items-center md:justify-between bg-[#f8fafc] border-b border-gray-200">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-[#fff4ed] px-4 py-2 text-sm font-semibold text-[#d65912]">
                Mini Test
                <span className="rounded-full bg-[#ecf6ff] px-2.5 py-1 text-xs font-semibold text-[#1768d8]">
                  Miễn phí
                </span>
              </div>
              <p className="mt-3 text-sm text-[#627d98]">
                Thử sức ngay với đề thi thật gần nhất, sau đó nhận đề xuất lộ trình luyện.
              </p>
            </div>
            <button
              onClick={() => setPhase('inProgress')}
              className="rounded-full bg-[#f15a24] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#f15a24]/10 transition hover:bg-[#d94e1d]"
            >
              Bắt đầu ngay
            </button>
          </div>

          <div className="grid gap-4 p-7 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-[#f3f5f9] bg-[#fcfcfd] p-5">
              <p className="text-sm text-[#52606d]">Thời gian làm bài</p>
              <p className="mt-3 text-2xl font-bold text-[#253858]">30 phút</p>
            </div>
            <div className="rounded-3xl border border-[#f3f5f9] bg-[#fcfcfd] p-5">
              <p className="text-sm text-[#52606d]">Cấu trúc đề</p>
              <p className="mt-3 text-2xl font-bold text-[#253858]">Nghe & Đọc</p>
            </div>
            <div className="rounded-3xl border border-[#f3f5f9] bg-[#fcfcfd] p-5">
              <p className="text-sm text-[#52606d]">Số lần làm bài</p>
              <p className="mt-3 text-2xl font-bold text-[#253858]">21543 lượt</p>
            </div>
            <div className="rounded-3xl border border-[#f3f5f9] bg-[#fcfcfd] p-5">
              <p className="text-sm text-[#52606d]">Độ khó</p>
              <p className="mt-3 text-2xl font-bold text-[#253858]">Bậc 3-5/6</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-gray-200 shadow-sm p-7">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0d4e8d]">Thông tin chung</p>
          <div className="mt-6 space-y-4 text-sm text-[#475569]">
            <div className="flex items-center justify-between rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-4">
              <span>Số câu hỏi</span>
              <strong>22 Câu</strong>
            </div>
            <div className="flex items-center justify-between rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-4">
              <span>Thời gian làm bài</span>
              <strong>30 phút</strong>
            </div>
            <div className="flex items-center justify-between rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-4">
              <span>Số lần làm bài</span>
              <strong>Không giới hạn</strong>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={() => setPhase('inProgress')}
              className="rounded-full bg-[#f15a24] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d94e1d]"
            >
              Làm bài ngay
            </button>
            <button className="rounded-full border border-[#d1d5db] px-6 py-3 text-sm font-semibold text-[#334155] hover:bg-gray-50">
              Xem giải chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTest = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        <div className="flex-1 rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="bg-[#fff8f0] px-6 py-5 border-b border-[#fde7d6]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#f15a24]">THI THỬ</p>
                <h2 className="mt-2 text-2xl font-bold text-[#102a43]">Mini Test 1 - Listening & Reading</h2>
              </div>
              <div className="rounded-3xl bg-[#fdf2f8] px-4 py-3 text-sm font-semibold text-[#9d174d]">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
              <p className="font-semibold text-[#1e293b]">Lưu ý khi làm bài</p>
              <ul className="mt-3 space-y-2 text-sm text-[#475569] list-disc list-inside">
                <li>Nhấn Lưu bài thường xuyên để giữ lại đáp án.</li>
                <li>Không thoát trình duyệt nếu đang làm bài.</li>
                <li>Đề thi gồm 22 câu, hoàn thành trong 30 phút.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-[#e2e8f0] p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#475569]">Câu hỏi</p>
                  <h3 className="mt-1 text-xl font-semibold text-[#102a43]">{currentQuestionData.title}</h3>
                </div>
                <div className="rounded-full bg-[#eef2ff] px-4 py-2 text-sm font-semibold text-[#3730a3]">
                  {currentQuestion + 1} / {sampleQuestions.length}
                </div>
              </div>

              <div className="space-y-3">
                {currentQuestionData.choices.map((choice, idx) => (
                  <button
                    key={choice}
                    onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestionData.id]: idx }))}
                    className={`w-full rounded-3xl border px-5 py-4 text-left transition ${answers[currentQuestionData.id] === idx ? 'border-[#f15a24] bg-[#fff4ed] text-[#1f2937]' : 'border-gray-200 bg-white text-[#475569] hover:border-[#cbd5e1] hover:bg-gray-50'}`}
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#cbd5e1] bg-white text-sm font-semibold text-[#334155] mr-4">{String.fromCharCode(65 + idx)}</span>
                    {choice}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => setCurrentQuestion((prev) => Math.max(prev - 1, 0))}
                  disabled={currentQuestion === 0}
                  className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#334155] transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                >
                  Câu trước
                </button>
                <button
                  onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, sampleQuestions.length - 1))}
                  disabled={currentQuestion === sampleQuestions.length - 1}
                  className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-[#334155] transition disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
                >
                  Câu sau
                </button>
                <button
                  onClick={() => setPhase('review')}
                  className="ml-auto rounded-full bg-[#f15a24] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#f15a24]/10 transition hover:bg-[#d94e1d]"
                >
                  Nộp bài
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="w-full xl:w-[360px] rounded-3xl border border-gray-200 bg-white shadow-sm p-6">
          <div className="rounded-3xl bg-[#eff6ff] p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-[#2563eb]">Progress</p>
            <div className="mt-4 flex items-end gap-3">
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#dbeafe]">
                <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${(answeredCount / sampleQuestions.length) * 100}%` }} />
              </div>
              <span className="text-sm font-semibold text-[#0f172a]">{answeredCount}/{sampleQuestions.length}</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <p className="text-sm text-[#475569]">Mức độ</p>
              <p className="mt-2 text-lg font-semibold text-[#111827]">Bậc 3-5</p>
            </div>
            <div className="rounded-3xl border border-[#e2e8f0] p-4">
              <p className="text-sm text-[#475569]">Thông tin đề</p>
              <ul className="mt-3 space-y-2 text-sm text-[#475569]">
                <li>Listening: 12 câu</li>
                <li>Reading: 10 câu</li>
                <li>Thời gian: 30 phút</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-[#e2e8f0] bg-[#fff7ed] p-4">
              <p className="text-sm text-[#975a16]">Giữ gìn tốc độ làm bài</p>
              <p className="mt-3 text-sm text-[#7c5e31]">Lưu đáp án thường xuyên và hạn chế di chuyển giữa tab.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#334155]">Kết quả</p>
              <h2 className="mt-3 text-3xl font-bold text-[#102a43]">Hoàn thành bài thi</h2>
            </div>
            <span className="rounded-full bg-[#e0f2fe] px-4 py-3 text-sm font-semibold text-[#0c4a6e]">Đã nộp</span>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-6 text-center">
              <p className="text-sm text-[#475569]">Listening</p>
              <p className="mt-3 text-3xl font-bold text-[#1d4ed8]">{score}</p>
            </div>
            <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-6 text-center">
              <p className="text-sm text-[#475569]">Reading</p>
              <p className="mt-3 text-3xl font-bold text-[#1d4ed8]">{Math.max(0, sampleQuestions.length - score)}</p>
            </div>
            <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-6 text-center">
              <p className="text-sm text-[#475569]">Tổng câu trả lời</p>
              <p className="mt-3 text-3xl font-bold text-[#1d4ed8]">{answeredCount}</p>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-6">
            <p className="text-sm text-[#475569]">Gợi ý tiếp theo</p>
            <ul className="mt-4 space-y-3 text-sm text-[#334155]">
              <li>🔹 Xem lại phần nghe để tăng tốc độ nắm thông tin.</li>
              <li>🔹 Chú ý keyword để chọn đáp án chính xác.</li>
              <li>🔹 Làm lại đề để cải thiện thời gian phản xạ.</li>
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                setPhase('inProgress');
                setCountdown(30 * 60);
              }}
              className="rounded-full bg-[#f15a24] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d94e1d]"
            >
              Làm lại
            </button>
            <Link href="/khoa-hoc" className="rounded-full border border-[#cbd5e1] px-6 py-3 text-sm font-semibold text-[#334155] hover:bg-gray-50">
              Về khoá học
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.18em] text-[#334155]">Thông tin bài thi</p>
          <div className="mt-6 space-y-4 text-sm text-[#475569]">
            <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <p className="font-semibold text-[#102a43]">Thời gian</p>
              <p className="mt-1">30 phút</p>
            </div>
            <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <p className="font-semibold text-[#102a43]">Độ khó</p>
              <p className="mt-1">Bậc 3-5</p>
            </div>
            <div className="rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
              <p className="font-semibold text-[#102a43]">Số câu</p>
              <p className="mt-1">22 câu</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] text-[#102a43]">
      <Header />
      {phase === 'overview' ? renderOverview() : phase === 'inProgress' ? renderTest() : renderReview()}
    </main>
  );
}
