'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { ExamService, ExamData } from '@/services/ExamService';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import LoginModal from '@/components/auth/LoginModal';

// --- INLINE SVG ICONS ---
const ExamIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const HomeworkIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const HistoryIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 8v4l3 3" />
    <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
  </svg>
);

const GradeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2.5 3 6 3s6-1 6-3v-5" />
  </svg>
);

const Home = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const Bell = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ChevronRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function MockExamPage() {
  const user = useSelector((state: any) => state.user);

  const [exams, setExams] = useState<ExamData[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [phase, setPhase] = useState<'overview' | 'inProgress' | 'review'>('overview');
  const [activeTab, setActiveTab] = useState<'grade-10' | 'grade-11' | 'grade-12' | 'homework' | 'exam' | 'history'>('exam');
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [countdown, setCountdown] = useState(0);
  const [violations, setViolations] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [historySubmissions, setHistorySubmissions] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleExamClick = (e: React.MouseEvent) => {
    if (!user || (!user.id && !user._id)) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    ExamService.getAllExams().then(res => {
      if (res.status === 'OK') setExams(res.data || []);
    }).catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const fetchHistory = () => {
    const studentId = user?._id || user?.id;
    if (studentId) {
      setIsHistoryLoading(true);
      ExamService.getStudentSubmissions(studentId).then(res => {
        if (res.status === 'OK') setHistorySubmissions(res.data || []);
      }).catch(err => console.error(err))
        .finally(() => setIsHistoryLoading(false));
    } else {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'inProgress' || countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, countdown]);

  // Proctoring violations tab switch tracker
  useEffect(() => {
    if (phase !== 'inProgress') return;
    const handleBlur = () => {
      setViolations(v => {
        const next = v + 1;
        alert(`⚠️ CẢNH BÁO: Rời màn hình làm bài (${next}/15)`);
        return next;
      });
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [phase]);

  const isThpt = (exam: ExamData) => exam?.answers?.['13_a'] !== undefined || exam?.answers?.['17'] !== undefined;

  const getQuestionsList = (exam: ExamData) => {
    const list = [];
    if (isThpt(exam)) {
      for (let i = 1; i <= 12; i++) list.push({ id: String(i), label: `Câu ${i}`, type: 'choice', group: 'I' });
      for (let i = 13; i <= 16; i++) list.push({ id: String(i), label: `Câu ${i - 12}`, type: 'true_false', group: 'II' });
      for (let i = 17; i <= 22; i++) list.push({ id: String(i), label: `Câu ${i - 16}`, type: 'short', group: 'III' });
    } else {
      for (let i = 1; i <= exam.questionsCount; i++) list.push({ id: String(i), label: `Câu ${i}`, type: 'choice', group: '' });
    }
    return list;
  };

  const handleStartExam = (exam: ExamData) => {
    setSelectedExam(exam);
    setAnswers({});
    setCountdown(exam.duration * 60);
    setViolations(0);
    setPhase('inProgress');
    setSubmissionResult(null);
  };

  const handleSubmit = async () => {
    if (!selectedExam?._id) return;
    try {
      const res = await ExamService.submitExam({
        examId: selectedExam._id,
        studentId: user.id || '65c2b8c56c2d1b827e8a93ef',
        studentAnswers: answers
      });
      if (res.status === 'OK') {
        setSubmissionResult(res.data);
        setPhase('review');
      }
    } catch (err) {
      alert('Lỗi nộp bài.');
    }
  };

  const isAnswered = (q: any) => {
    if (q.type === 'true_false') {
      return ['a','b','c','d'].every(sub => answers[`${q.id}_${sub}`]);
    }
    return !!answers[q.id];
  };

  const filteredExams = exams.filter(ex => {
    if (activeTab === 'grade-10') return ex.grade === 10;
    if (activeTab === 'grade-11') return ex.grade === 11;
    if (activeTab === 'grade-12') return ex.grade === 12;
    if (activeTab === 'homework') return ex.type === 'homework';
    if (activeTab === 'exam') return ex.type === 'exam';
    return true;
  });

  const getInitial = (name: string) => {
    if (!name) return "H";
    const words = name.trim().split(" ");
    return words[words.length - 1].charAt(0).toUpperCase();
  };

  const studentName = user.name || "Học sinh";

  const sectionTitles: Record<string, string> = {
    exam: "Phòng Thi Online",
    homework: "Bài Tập Về Nhà",
    history: "Lịch Sử Làm Bài",
    'grade-12': "Chuyên đề Lớp 12",
    'grade-11': "Chuyên đề Lớp 11",
    'grade-10': "Chuyên đề Lớp 10"
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800 text-sm">
      {phase !== 'inProgress' && <Header />}
      
      {/* Main content below Header */}
      {phase === 'overview' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 hidden md:flex">
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#7E96A0] text-white flex items-center justify-center font-bold text-sm">
                {getInitial(studentName)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm leading-tight">{studentName}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Thành viên</p>
              </div>
            </div>

            {/* Sidebar navigation */}
            <nav className="flex-1 py-3 space-y-1">
              <button
                onClick={() => setActiveTab('exam')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${activeTab === 'exam' ? 'bg-[#1e3a8a] text-white' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <ExamIcon />
                Phòng Thi Online
              </button>
              <button
                onClick={() => setActiveTab('homework')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${activeTab === 'homework' ? 'bg-[#1e3a8a] text-white' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <HomeworkIcon />
                Bài Tập Về Nhà
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-[#1e3a8a] text-white' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <HistoryIcon />
                Lịch Sử Làm Bài
              </button>

              <div className="pt-2">
                <span className="text-[10px] text-gray-450 font-extrabold uppercase tracking-widest block mb-1 px-4">Luyện tập khối</span>
                {[12, 11, 10].map(g => (
                  <button
                    key={g}
                    onClick={() => setActiveTab(`grade-${g}` as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${activeTab === `grade-${g}` ? 'bg-[#1e3a8a] text-white' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <GradeIcon />
                    Đề thi Lớp {g}
                  </button>
                ))}
              </div>
            </nav>

            {/* Back to Home */}
            <div className="border-t border-gray-200 p-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-gray-600 hover:text-[#1e3a8a] rounded-xl hover:bg-blue-50 transition-all"
              >
                <Home size={16} />
                Về Trang Chủ
              </Link>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Top Toolbar */}
            <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Thi thử</span>
                <ChevronRight size={14} />
                <span className="text-gray-800 font-bold">{sectionTitles[activeTab]}</span>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Selection content */}
              {activeTab === 'history' ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
                  <h3 className="font-bold text-base text-gray-900 mb-4">
                    Lịch sử bài làm của bạn
                  </h3>
                  {(!user || (!user.id && !user._id)) ? (
                    <div className="text-center py-12">
                      <p className="text-gray-450 font-medium mb-4">Vui lòng đăng nhập để xem lịch sử bài làm.</p>
                      <button 
                        onClick={() => setShowLoginModal(true)}
                        className="bg-[#1e3a8a] text-white px-6 py-2.5 rounded-full font-bold hover:bg-[#fbbf24] hover:text-[#1e3a8a] transition-all"
                      >
                        Đăng nhập ngay
                      </button>
                    </div>
                  ) : isHistoryLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <div className="w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-[#1e3a8a] font-bold">Đang tải lịch sử bài làm...</p>
                    </div>
                  ) : historySubmissions.filter(s => s.status === 'completed').length === 0 ? (
                    <div className="text-center py-12 text-gray-450 font-medium">Bạn chưa thực hiện nộp bài thi hay bài tập nào.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 text-gray-400 font-bold">
                            <th className="pb-3 pl-3">Đề thi / Bài tập</th>
                            <th className="pb-3">Khối</th>
                            <th className="pb-3 text-center">Nộp ngày</th>
                            <th className="pb-3 text-right">Điểm số</th>
                            <th className="pb-3 text-center">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {historySubmissions.filter(s => s.status === 'completed').map((sub) => (
                            <tr key={sub._id} className="hover:bg-gray-50/50">
                              <td className="py-3.5 pl-3 font-semibold text-[#1e3a8a]">{sub.examId?.title}</td>
                              <td className="py-3.5 text-gray-500 font-medium">Lớp {sub.examId?.grade || 12}</td>
                              <td className="py-3.5 text-center text-gray-500">{new Date(sub.completedAt).toLocaleDateString('vi-VN')}</td>
                              <td className="py-3.5 text-right font-black text-emerald-600">{sub.score} / 10</td>
                              <td className="py-3.5 text-center">
                                <Link
                                  href={`/thi-thu/${sub.examId._id}?review=true`}
                                  className="inline-block px-4 py-2 bg-[#1e3a8a]/10 text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white rounded-full font-bold transition-all text-xs"
                                >
                                  Xem lại bài làm
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900">
                      Danh sách học liệu sẵn có ({filteredExams.length})
                    </h2>
                  </div>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-2xl">
                      <div className="w-12 h-12 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-[#1e3a8a] font-bold">Đang tải danh sách học liệu...</p>
                    </div>
                  ) : filteredExams.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl text-gray-400 font-semibold">
                      Chưa có đề thi hoặc bài tập nào được phân phối cho thẻ này.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredExams.map((exam) => {
                        const examSub = historySubmissions.find(sub => 
                          sub.status === 'completed' && 
                          sub.examId && 
                          (sub.examId._id === exam._id || sub.examId === exam._id)
                        );
                        return (
                          <div key={exam._id} className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all">
                            <div>
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700">Lớp {exam.grade || 12}</span>
                                <span className={`font-bold px-2.5 py-0.5 rounded ${exam.type === 'exam' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>{exam.type === 'exam' ? 'Đề thi' : 'Bài tập'}</span>
                              </div>
                              <h3 className="font-extrabold text-base text-gray-900 mt-3 line-clamp-1">{exam.title}</h3>
                              <p className="text-gray-400 text-xs mt-1.5 line-clamp-2">{exam.description || 'Không có mô tả chi tiết từ giáo viên.'}</p>
                              
                              <div className="mt-4 border-t pt-3 text-gray-500 font-bold flex gap-4 text-xs">
                                <span>Thời gian: {exam.duration} phút</span>
                                <span>{isThpt(exam) ? 'Đề THPT QG' : `${exam.questionsCount} câu hỏi`}</span>
                              </div>
                            </div>

                            {examSub ? (
                              <div className="mt-4 flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                  <span>✓ Đã hoàn thành</span>
                                  <span>Điểm: {examSub.score}/10</span>
                                </div>
                                <Link
                                  href={`/thi-thu/${exam._id}`}
                                  onClick={handleExamClick}
                                  className="w-full mt-2 bg-gray-500 hover:bg-[#fbbf24] hover:text-[#1e3a8a] text-white font-bold py-2.5 rounded-xl transition-all text-center block"
                                >
                                  Làm lại
                                </Link>
                              </div>
                            ) : (
                              <Link
                                href={`/thi-thu/${exam._id}`}
                                onClick={handleExamClick}
                                className="w-full mt-5 bg-[#1e3a8a] hover:bg-[#fbbf24] hover:text-[#1e3a8a] text-white font-bold py-2.5 rounded-xl transition-all text-center block"
                              >
                                Bắt đầu làm bài
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* 2. FULLSCREEN IMMERSIVE EXAM LAYOUT */}
      {phase === 'inProgress' && selectedExam && (
        <div className="fixed inset-0 bg-[#f1f5f9] z-50 flex flex-col overflow-hidden select-none text-sm">
          <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-3 overflow-x-auto shrink-0 shadow-xs">
            <span className="font-bold text-[#1e3a8a] shrink-0 border-r pr-3">Danh sách câu:</span>
            <div className="flex gap-1">
              {getQuestionsList(selectedExam).map((q) => (
                <button
                  key={q.id}
                  onClick={() => document.getElementById(`q-card-${q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className={`w-9 h-9 rounded font-bold text-center border transition-all ${isAnswered(q) ? 'bg-orange-500 text-white border-transparent' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  {q.label.replace('Câu ', '')}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            <div className="w-[50%] border-r border-gray-200 bg-white p-3 flex flex-col overflow-hidden">
              {selectedExam.fileUrl ? (
                <iframe src={selectedExam.fileUrl} className="w-full h-full rounded-xl border border-gray-105" title="Đề thi PDF" />
              ) : (
                <div className="m-auto text-gray-400 font-bold">Không có tệp xem trước đề thi.</div>
              )}
            </div>

            <div className="w-[30%] bg-slate-50 border-r border-gray-200 overflow-y-auto p-5 space-y-4">
              <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">Bảng lựa chọn đáp số</h3>
              <div className="space-y-4">
                {getQuestionsList(selectedExam).map((q) => (
                  <div key={q.id} id={`q-card-${q.id}`} className={`bg-white p-4 rounded-xl border transition-all ${isAnswered(q) ? 'border-orange-200 shadow-xs' : 'border-gray-150'}`}>
                    <div className="font-bold text-gray-800 mb-2">{q.label} {q.group && <span className="text-xs text-gray-400 font-semibold">(Phần {q.group})</span>}</div>
                    
                    {q.type === 'choice' && (
                      <div className="flex justify-around gap-2">
                        {['A','B','C','D'].map(o => (
                          <button key={o} onClick={() => setAnswers(p => ({ ...p, [q.id]: o }))} className={`w-9 h-9 rounded-full font-bold border transition-all ${answers[q.id] === o ? 'bg-orange-500 text-white border-transparent' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}>{o}</button>
                        ))}
                      </div>
                    )}

                    {q.type === 'true_false' && (
                      <div className="space-y-2.5">
                        {['a','b','c','d'].map(sub => {
                          const key = `${q.id}_${sub}`;
                          return (
                            <div key={sub} className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-gray-500">{sub})</span>
                              <div className="flex gap-2">
                                {['Đúng', 'Sai'].map(ansVal => (
                                  <button key={ansVal} onClick={() => setAnswers(p => ({ ...p, [key]: ansVal }))} className={`px-4 py-1.5 rounded-md font-bold border transition-all ${answers[key] === ansVal ? 'bg-orange-500 text-white border-transparent' : 'bg-gray-50 hover:bg-gray-100 text-gray-655'}`}>{ansVal}</button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'short' && (
                      <input type="text" value={answers[q.id] || ''} onChange={(e) => setAnswers(p => ({ ...p, [q.id]: e.target.value }))} className="w-full bg-slate-50 border p-2.5 rounded-lg font-bold text-center focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm" placeholder="Nhập đáp số trắc nghiệm" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-[20%] bg-white p-6 flex flex-col justify-between overflow-y-auto shrink-0">
              <div className="space-y-6">
                <div>
                  <div className="text-gray-400 font-bold tracking-wider uppercase text-[11px]">Thời gian còn lại</div>
                  <div className="text-3xl font-black text-rose-600 mt-1">⏱️ {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</div>
                </div>

                <div>
                  <div className="font-extrabold text-sm text-[#1e3a8a] truncate">{selectedExam.title}</div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Phòng thi trực tuyến</div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                    <span>Đã hoàn thành</span>
                    <span>{getQuestionsList(selectedExam).filter(isAnswered).length} / {getQuestionsList(selectedExam).length}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mt-1.5 border border-gray-50">
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 h-full rounded-full transition-all" style={{ width: `${(getQuestionsList(selectedExam).filter(isAnswered).length / getQuestionsList(selectedExam).length) * 100}%` }} />
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 flex items-center gap-3">
                  <div>
                    <div className="text-rose-700 font-bold text-sm">Vi phạm: {violations} / 15</div>
                    <div className="text-xs text-rose-500 mt-0.5">Rời tab sẽ bị trừ điểm/cảnh cáo</div>
                  </div>
                </div>
              </div>

              <div className="pt-6 space-y-2 border-t border-gray-100">
                <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm transition-all">Nộp bài thi</button>
                <button onClick={() => { if(confirm('Làm lại đề từ đầu?')) setAnswers({}); }} className="w-full border border-gray-200 hover:bg-slate-50 text-gray-700 font-bold py-2 rounded-xl flex items-center justify-center gap-1 text-xs transition-all">Làm lại</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. REVIEW PHASE */}
      {phase === 'review' && selectedExam && submissionResult && (
        <div className="max-w-2xl mx-auto px-6 py-10 flex-1">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-900">Hoàn thành bài làm!</h2>
            <div className="my-6 bg-gray-50 p-4 rounded-2xl border flex items-center justify-around">
              <div>
                <span className="text-xs font-bold text-gray-400 block">ĐIỂM SỐ</span>
                <span className="text-3xl font-extrabold text-[#1e3a8a] block mt-1">{submissionResult.score} / 10</span>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <span className="text-xs font-bold text-gray-400 block">DẠNG ĐỀ</span>
                <span className="text-sm font-extrabold text-gray-800 block mt-1">{isThpt(selectedExam) ? 'THPT Quốc Gia' : 'Luyện trắc nghiệm'}</span>
              </div>
            </div>

            <div className="text-left mb-6 text-sm">
              <h3 className="font-bold text-gray-800 mb-3 border-b pb-1">Chi tiết kết quả:</h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {getQuestionsList(selectedExam).map((q) => {
                  if (q.type === 'true_false') {
                    return (
                      <div key={q.id} className="bg-gray-50 p-2.5 rounded border space-y-1">
                        <span className="font-bold block">{q.label}:</span>
                        {['a','b','c','d'].map(sub => {
                          const key = `${q.id}_${sub}`;
                          const stdVal = submissionResult.answers?.[key] || 'Trống';
                          const rightVal = selectedExam.answers[key];
                          const isCorrect = stdVal === rightVal;
                          return (
                            <div key={sub} className={`p-1 rounded text-xs flex justify-between ${isCorrect ? 'text-green-700 font-bold' : 'text-red-700'}`}>
                              <span>Ý {sub}: Bạn chọn <strong>{stdVal}</strong></span>
                              <span>Đáp án: <strong>{rightVal}</strong></span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                  const stdVal = submissionResult.answers?.[q.id] || 'Trống';
                  const rightVal = selectedExam.answers[q.id];
                  const isCorrect = String(stdVal).trim().toLowerCase() === String(rightVal).trim().toLowerCase();
                  return (
                    <div key={q.id} className={`p-2.5 rounded border flex justify-between ${isCorrect ? 'bg-green-50 text-green-700 border-green-100 font-bold' : 'bg-red-50 text-red-700 border-red-100'}`}>
                      <span>{q.label}: Bạn chọn <strong>{stdVal}</strong></span>
                      <span>Đáp án đúng: <strong>{rightVal}</strong></span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => { 
                  fetchHistory(); 
                  setPhase('overview'); 
                }} 
                className="bg-[#1e3a8a] text-white font-bold py-2.5 px-5 rounded-full hover:bg-[#fbbf24] hover:text-[#1e3a8a] transition-all"
              >
                Quay lại danh sách
              </button>
              <Link 
                href={`/thi-thu/${selectedExam._id}`} 
                className="border font-bold py-2.5 px-5 rounded-full hover:bg-gray-50 text-gray-700 flex items-center justify-center"
              >
                Làm lại
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal thông báo yêu cầu ĐĂNG NHẬP */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Yêu cầu đăng nhập</h3>
            <p className="text-gray-600 mb-6">Bạn cần đăng nhập để tham gia làm bài thi và bài tập trên hệ thống.</p>
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
                className="px-4 py-2 bg-[#1e3a8a] text-white rounded hover:bg-[#005a96] font-medium transition-colors"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal từ components */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}
