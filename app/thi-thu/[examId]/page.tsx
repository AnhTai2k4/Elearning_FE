'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ExamService, ExamData } from '@/services/ExamService';
import { useSelector } from 'react-redux';
import Header from '@/components/layout/Header';

export default function ExamRoomPage() {
  const { examId } = useParams() as { examId: string };
  const router = useRouter();
  const searchParams = useSearchParams();
  const isReviewMode = searchParams.get('review') === 'true';
  const user = useSelector((state: any) => state.user);

  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [phase, setPhase] = useState<'inProgress' | 'review' | 'reviewUI'>('inProgress');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [countdown, setCountdown] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [activeQIndex, setActiveQIndex] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!examId || !user || (!user.id && !user._id)) return;
    const studentId = user.id || user._id;
    const init = async () => {
      try {
        const resDetail = await ExamService.getExamDetail(examId);
        if (resDetail.status !== 'OK' || !resDetail.data) {
          router.push('/thi-thu');
          return;
        }
        const exam = resDetail.data;
        setSelectedExam(exam);

        if (isReviewMode) {
          const resSub = await ExamService.getStudentSubmissions(studentId);
          if (resSub.status === 'OK') {
            const sub = resSub.data.find((s: any) => s.status === 'completed' && (s.examId._id === examId || s.examId === examId));
            if (sub) {
              setAnswers(sub.answers || {});
              setSubmissionResult(sub);
              setPhase('reviewUI');
              setIsInitialized(true);
            } else {
              alert('Không tìm thấy bài làm để xem lại.');
              router.push('/thi-thu');
            }
          }
        } else {
          const resAttempt = await ExamService.startAttempt({ examId, studentId });
          if (resAttempt.status === 'OK' && resAttempt.data) {
            const elapsed = (Date.now() - new Date(resAttempt.data.startedAt).getTime()) / 1000;
            if (elapsed < exam.duration * 60) {
              // Khôi phục answers từ BE hoặc nếu không có thì {}
              setAnswers(resAttempt.data.answers || {});
              setCountdown(Math.floor(exam.duration * 60 - elapsed));
              setPhase('inProgress');
              setIsInitialized(true);
            } else {
              alert('Thời gian làm bài của lượt thi này đã kết thúc.');
              router.push('/thi-thu');
            }
          }
        }
      } catch (err) {
        router.push('/thi-thu');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [examId, user.id, user._id, router]);

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

  useEffect(() => {
    if (!isInitialized || phase !== 'inProgress' || !selectedExam?._id) return;
    const studentId = user.id || user._id;
    if (!studentId) return;
    ExamService.saveProgress({ examId: selectedExam._id!, studentId, studentAnswers: answers });
  }, [answers, phase, selectedExam, user.id, user._id, isInitialized]);

  const isThpt = (exam: ExamData) => exam.answers['13_a'] !== undefined || exam.answers['17'] !== undefined;

  const getQuestionsList = (exam: ExamData) => {
    const list = [];
    if (isThpt(exam)) {
      for (let i = 1; i <= 12; i++) list.push({ id: String(i), label: `Câu ${i}`, type: 'choice', pts: 0.25 });
      for (let i = 13; i <= 16; i++) list.push({ id: String(i), label: `Câu ${i - 12}`, type: 'true_false', pts: 1.0, sub: ['a','b','c','d'] });
      for (let i = 17; i <= 22; i++) list.push({ id: String(i), label: `Câu ${i - 16}`, type: 'short', pts: 0.5 });
    } else {
      const pts = exam.questionsCount > 0 ? 10 / exam.questionsCount : 1;
      for (let i = 1; i <= exam.questionsCount; i++) list.push({ id: String(i), label: `Câu ${i}`, type: 'choice', pts });
    }
    return list;
  };

  const handleSubmit = async () => {
    if (!selectedExam?._id) return;
    const studentId = user.id || user._id;
    if (!studentId) return;
    
    try {
      const res = await ExamService.submitExam({ examId: selectedExam._id!, studentId, studentAnswers: answers });
      if (res.status === 'OK') {
        setSubmissionResult(res.data);
        setPhase('reviewUI');
      }
    } catch (err) {
      alert('Lỗi nộp bài.');
    }
  };

  const formatCountdown = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return hrs > 0 ? `${hrs} giờ ${mins} phút` : `${mins} phút ${s} giây`;
  };

  const getCellLabel = (q: any) => {
    if (q.type === 'true_false') {
      const count = q.sub.filter((s: string) => answers[`${q.id}_${s}`]).length;
      return count === 4 ? `${q.label.replace('Câu ', '')}: ✓` : q.label.replace('Câu ', '');
    }
    return answers[q.id] ? `${q.label.replace('Câu ', '')}: ${answers[q.id]}` : q.label.replace('Câu ', '');
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Đang tải đề thi...</div>;
  if (!selectedExam) return null;

  const qList = getQuestionsList(selectedExam);
  const activeQ = qList[activeQIndex - 1];

  const checkIsCorrect = (q: any, stdAns: any, correctAns: any) => {
    if (q.type === 'true_false') {
      return ['a','b','c','d'].every(sub => stdAns[`${q.id}_${sub}`] === correctAns[`${q.id}_${sub}`]);
    }
    const stdVal = stdAns[q.id] ? stdAns[q.id].toString().trim().toLowerCase() : '';
    const rightVal = correctAns[q.id] ? correctAns[q.id].toString().trim().toLowerCase() : '';
    return stdVal !== '' && stdVal === rightVal;
  };

  const checkIsWrong = (q: any, stdAns: any, correctAns: any) => {
    if (q.type === 'true_false') {
      return ['a','b','c','d'].some(sub => stdAns[`${q.id}_${sub}`] && stdAns[`${q.id}_${sub}`] !== correctAns[`${q.id}_${sub}`]);
    }
    const stdVal = stdAns[q.id] ? stdAns[q.id].toString().trim().toLowerCase() : '';
    const rightVal = correctAns[q.id] ? correctAns[q.id].toString().trim().toLowerCase() : '';
    return stdVal !== '' && stdVal !== rightVal;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      {/* 1. LAYOUT LÀM BÀI HOẶC XEM LẠI BÀI */}
      {(phase === 'inProgress' || phase === 'reviewUI') && selectedExam && (
        <div className="fixed inset-0 bg-[#f1f5f9] z-50 flex flex-col overflow-hidden select-none">
          <div className="flex-1 flex overflow-hidden">
            {/* Left side: PDF Viewer */}
            <div className="w-[70%] border-r border-gray-200 bg-white p-3 flex flex-col overflow-hidden">
              <div className="flex-1 relative overflow-hidden bg-white rounded-xl border border-gray-100">
                {selectedExam.fileUrl ? (
                  <iframe
                    src={`${selectedExam.fileUrl}#toolbar=0&navpanes=0&view=FitH`}
                    className="absolute inset-0 bg-white w-full h-full"
                    style={{
                      transformOrigin: 'top center',
                      border: 'none',
                      backgroundColor: 'white'
                    }}
                    title="Đề thi PDF"
                  />
                ) : (
                  <div className="m-auto text-gray-400 font-bold text-sm">📄 Không có tệp xem trước đề thi.</div>
                )}
              </div>           
            </div>
            {/* Right side: Interactive answer panel */}
            <div className="w-[30%] bg-white flex flex-col justify-between overflow-y-auto border-l border-gray-200">
              <div className="flex flex-col h-full">
                {/* Header Timer */}
                <div className="bg-[#1877f2] px-5 py-4 text-white shrink-0">
                  {phase === 'reviewUI' ? (
                    <>
                      <div className="text-sm font-medium">Kết quả bài làm</div>
                      <div className="text-2xl font-bold mt-1">{submissionResult?.score} / 10</div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-medium">Thời gian còn lại</div>
                      <div className="text-2xl font-bold mt-1">{formatCountdown(countdown)}</div>
                    </>
                  )}
                </div>

                <div className="p-5 flex flex-col gap-6 flex-grow overflow-y-auto">
                  {/* PDF File Title Box */}
                  <div className="border border-gray-200 shadow-sm p-4 rounded-lg flex items-center gap-3 bg-white shrink-0">
                    <div className="bg-red-600 text-white text-[11px] font-bold px-2 py-1 rounded shadow-sm shrink-0">PDF</div>
                    <div className="font-bold text-sm text-gray-900 truncate">{selectedExam.title}</div>
                  </div>

                  {/* Question Info */}
                  <div className="shrink-0">
                    <div className="text-[15px] font-bold text-gray-900">{activeQ.label} ({activeQ.pts} điểm):</div>
                    <div className="text-sm text-gray-600 mt-0.5">Nhập đáp án để trả lời</div>
                  </div>

                  {/* Answer Sheet Grid */}
                  <div className="flex flex-col shrink-0">
                    <div className="text-[15px] text-gray-800 font-bold text-center mb-4">Phiếu trả lời</div>
                    <div className="grid grid-cols-7 gap-2.5 max-h-[300px] overflow-y-auto py-2 px-1">
                      {qList.map((q, idx) => {
                        const isCorrect = phase === 'reviewUI' && checkIsCorrect(q, answers, selectedExam.answers);
                        const isWrong = phase === 'reviewUI' && checkIsWrong(q, answers, selectedExam.answers);

                        let btnClass = 'bg-white text-gray-700 border-gray-300 hover:border-gray-400';
                        if (phase === 'reviewUI') {
                          if (isCorrect) btnClass = 'bg-green-100 border-green-500 text-green-800 font-bold shadow-sm';
                          else if (isWrong) btnClass = 'bg-red-100 border-red-500 text-red-800 font-bold shadow-sm';
                          else btnClass = 'bg-gray-100 border-gray-300 text-gray-400';
                        } else {
                          if (activeQIndex === idx + 1) btnClass = 'border-[1.5px] border-[#1877f2] bg-white text-[#1877f2]';
                          else if (isThpt(selectedExam) && q.type === 'true_false' && ['a','b','c','d'].some(s => answers[`${q.id}_${s}`])) btnClass = 'bg-[#e7f0fd] text-[#1877f2] border-[#c0d6f9]';
                          else if (answers[q.id]) btnClass = 'bg-[#e7f0fd] text-[#1877f2] border-[#c0d6f9]';
                        }

                        if (phase === 'reviewUI' && activeQIndex === idx + 1) btnClass += ' ring-2 ring-blue-400 border-blue-400';

                        return (
                          <button
                            key={q.id}
                            onClick={() => setActiveQIndex(idx + 1)}
                            className={`py-2 rounded font-medium text-center border text-[13px] transition-all truncate px-0.5 ${btnClass}`}
                          >
                            {getCellLabel(q)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="mt-auto pt-4 shrink-0">
                    {activeQ.type === 'choice' && (
                      <div className="space-y-4">
                        <input type="text" readOnly placeholder={`Đáp án câu ${activeQIndex}: A, B, C, D...`} value={answers[activeQ.id] ? `Đáp án câu ${activeQIndex}: ${answers[activeQ.id]}` : ''} className="w-full bg-white border border-gray-300 px-4 py-3 rounded-lg text-sm text-gray-500 font-medium focus:outline-none" />
                        <div className="grid grid-cols-4 gap-3">
                          {['A','B','C','D'].map(o => {
                            let btnClass = 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50';
                            if (phase === 'reviewUI') {
                              if (selectedExam.answers[activeQ.id] === o) btnClass = 'bg-green-500 text-white border-green-500 shadow-sm';
                              else if (answers[activeQ.id] === o) btnClass = 'bg-red-500 text-white border-red-500 shadow-sm';
                            } else {
                              if (answers[activeQ.id] === o) btnClass = 'bg-[#1877f2] text-white border-[#1877f2]';
                            }
                            return (
                              <button 
                                key={o} 
                                onClick={() => { if (phase !== 'reviewUI') { setAnswers(p => ({ ...p, [activeQ.id]: o })); if (activeQIndex < qList.length) setActiveQIndex(activeQIndex + 1); } }} 
                                className={`py-2.5 rounded-lg font-bold border transition-all text-sm ${btnClass}`}
                              >
                                {o}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {activeQ.type === 'true_false' && (
                      <div className="space-y-3">
                        {activeQ.sub?.map((s: string) => {
                          const key = `${activeQ.id}_${s}`;
                          return (
                            <div key={s} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-300">
                              <span className="font-bold text-gray-600 uppercase">Ý {s})</span>
                              <div className="flex gap-2">
                                {['Đúng', 'Sai'].map(val => {
                                  let btnClass = 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300';
                                  if (phase === 'reviewUI') {
                                    if (selectedExam.answers[key] === val) btnClass = 'bg-green-500 text-white border-green-500 shadow-sm';
                                    else if (answers[key] === val) btnClass = 'bg-red-500 text-white border-red-500 shadow-sm';
                                  } else {
                                    if (answers[key] === val) btnClass = 'bg-[#1877f2] text-white border-[#1877f2]';
                                  }
                                  return (
                                    <button 
                                      key={val} 
                                      onClick={() => { if (phase !== 'reviewUI') setAnswers(p => ({ ...p, [key]: val })) }} 
                                      className={`px-5 py-2 rounded-lg text-sm font-bold border transition-all ${btnClass}`}
                                    >
                                      {val}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {activeQ.type === 'short' && (
                      <div className="space-y-2 mt-2">
                        <input type="text" readOnly={phase === 'reviewUI'} placeholder="Nhập đáp số trắc nghiệm" value={answers[activeQ.id] || ''} onChange={(e) => { if (phase !== 'reviewUI') setAnswers(p => ({ ...p, [activeQ.id]: e.target.value })) }} className={`w-full bg-white border p-3 rounded-lg font-bold text-center text-sm focus:outline-none focus:ring-2 focus:ring-[#1877f2] focus:border-transparent ${phase === 'reviewUI' ? (answers[activeQ.id]?.trim().toLowerCase() === selectedExam.answers[activeQ.id]?.trim().toLowerCase() ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700') : 'border-gray-300'}`} />
                        {phase === 'reviewUI' && (
                          <div className="text-xs font-bold text-green-600 mt-2 text-center">Đáp án đúng: {selectedExam.answers[activeQ.id]}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 border-t border-gray-200 bg-white shrink-0">
                  {phase === 'reviewUI' ? (
                    <button onClick={() => router.push('/thi-thu')} className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold py-3 rounded-lg text-center transition-all">Quay lại lịch sử</button>
                  ) : (
                    <div className="grid grid-cols-[1fr_2fr] gap-3">
                      <button onClick={() => { if(confirm('Rời khỏi phòng thi? Tiến trình làm bài sẽ được lưu.')) router.push('/thi-thu'); }} className="bg-[#e4e6eb] hover:bg-[#d8dadf] text-[#050505] font-bold py-3 rounded-lg text-center transition-all">Rời khỏi</button>
                      <button onClick={handleSubmit} className="bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold py-3 rounded-lg text-center transition-all">Nộp bài</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === 'review' && submissionResult && (
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="bg-white border rounded-3xl p-8 shadow-md text-center">
            <h2 className="text-xl font-bold text-gray-900">Hoàn thành bài làm!</h2>
            <div className="my-6 bg-gray-50 p-4 rounded-2xl border flex items-center justify-around">
              <div>
                <span className="text-[10px] font-bold text-gray-400 block">ĐIỂM SỐ</span>
                <span className="text-3xl font-extrabold text-[#1e3a8a] block mt-1">{submissionResult.score} / 10</span>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div>
                <span className="text-[10px] font-bold text-gray-400 block">DẠNG ĐỀ</span>
                <span className="text-sm font-extrabold text-gray-800 block mt-1">{isThpt(selectedExam) ? 'THPT Quốc Gia' : 'Luyện trắc nghiệm'}</span>
              </div>
            </div>

            <div className="text-left mb-6 text-xs">
              <h3 className="font-bold text-gray-800 mb-3 border-b pb-1">Chi tiết kết quả:</h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {qList.map((q) => {
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
                            <div key={sub} className={`p-1 rounded text-[10px] flex justify-between ${isCorrect ? 'text-green-700 font-bold' : 'text-red-700'}`}>
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
              <button onClick={() => router.push('/thi-thu')} className="bg-[#1e3a8a] text-white font-bold py-2.5 px-5 rounded-full hover:bg-amber-500">Quay lại danh sách</button>
              <button
                onClick={async () => {
                  try {
                    const studentId = user.id || user._id || '65c2b8c56c2d1b827e8a93ef';
                    const res = await ExamService.startAttempt({ examId: selectedExam._id!, studentId });
                    if (res.status === 'OK') {
                      setAnswers({});
                      setCountdown(selectedExam.duration * 60);
                      setPhase('inProgress');
                    } else {
                      alert('Không thể bắt đầu lượt thi mới.');
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Lỗi kết nối máy chủ.');
                  }
                }}
                className="border font-bold py-2.5 px-5 rounded-full hover:bg-gray-50 text-gray-700"
              >
                Làm lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
