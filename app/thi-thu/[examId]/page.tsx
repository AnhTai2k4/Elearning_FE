'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ExamService, ExamData } from '@/services/ExamService';
import { useSelector } from 'react-redux';
import Header from '@/components/layout/Header';

export default function ExamRoomPage() {
  const { examId } = useParams() as { examId: string };
  const router = useRouter();
  const user = useSelector((state: any) => state.user);

  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [phase, setPhase] = useState<'inProgress' | 'review'>('inProgress');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [countdown, setCountdown] = useState(0);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [activeQIndex, setActiveQIndex] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examId) return;
    const init = async () => {
      try {
        const resDetail = await ExamService.getExamDetail(examId);
        if (resDetail.status !== 'OK' || !resDetail.data) {
          router.push('/thi-thu');
          return;
        }
        const exam = resDetail.data;
        setSelectedExam(exam);

        const studentId = user.id || '65c2b8c56c2d1b827e8a93ef';
        const resAttempt = await ExamService.startAttempt({ examId, studentId });
        if (resAttempt.status === 'OK' && resAttempt.data) {
          const elapsed = (Date.now() - new Date(resAttempt.data.startedAt).getTime()) / 1000;
          if (elapsed < exam.duration * 60) {
            setAnswers(resAttempt.data.answers || {});
            setCountdown(Math.floor(exam.duration * 60 - elapsed));
            setPhase('inProgress');
          } else {
            alert('Thời gian làm bài của lượt thi này đã kết thúc.');
            router.push('/thi-thu');
          }
        }
      } catch (err) {
        router.push('/thi-thu');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [examId, user.id, router]);

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
    if (phase !== 'inProgress' || !selectedExam?._id) return;
    const studentId = user.id || '65c2b8c56c2d1b827e8a93ef';
    ExamService.saveProgress({ examId: selectedExam._id!, studentId, studentAnswers: answers });
  }, [answers, phase, selectedExam, user.id]);

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
    const studentId = user.id || '65c2b8c56c2d1b827e8a93ef';
    try {
      const res = await ExamService.submitExam({ examId: selectedExam._id!, studentId, studentAnswers: answers });
      if (res.status === 'OK') {
        setSubmissionResult(res.data);
        setPhase('review');
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

  return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-800 text-xs">
      {phase !== 'inProgress' && <Header />}

      {phase === 'inProgress' && activeQ && (
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
            <div className="w-[30%] bg-white flex flex-col justify-between overflow-y-auto border-l border-gray-150">
              <div className="p-5 space-y-6">
                <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl text-sky-950">
                  <div className="text-[10px] text-sky-800 font-bold uppercase tracking-wider">Thời gian còn lại</div>
                  <div className="text-xl font-black mt-0.5">{formatCountdown(countdown)}</div>
                </div>

                <div className="border border-gray-100 p-3 rounded-xl flex items-center gap-3 bg-slate-50">
                  <span className="text-2xl">📕</span>
                  <div className="truncate">
                    <div className="font-extrabold text-xs text-gray-900 truncate">{selectedExam.title}</div>
                  </div>
                </div>

                <div className="border-b pb-3">
                  <div className="text-sm font-black text-gray-900">{activeQ.label} ({activeQ.pts} điểm):</div>
                  <div className="text-[10px] text-gray-400 font-semibold mt-0.5">Nhập đáp án để trả lời</div>
                </div>

                <div className="space-y-3">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center">Phiếu trả lời</div>
                  <div className="grid grid-cols-7 gap-2 max-h-[170px] overflow-y-auto p-1 bg-gray-50 border rounded-xl">
                    {qList.map((q, idx) => (
                      <button
                        key={q.id}
                        onClick={() => setActiveQIndex(idx + 1)}
                        className={`py-2 rounded font-bold text-center border text-[10px] transition-all truncate px-0.5 ${activeQIndex === idx + 1 ? 'border-2 border-blue-600 bg-white text-blue-700 shadow-sm' : isThpt(selectedExam) && q.type === 'true_false' && ['a','b','c','d'].some(s => answers[`${q.id}_${s}`]) ? 'bg-blue-50 text-blue-700 border-blue-100' : answers[q.id] ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-200'}`}
                      >
                        {getCellLabel(q)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-gray-100 space-y-4">
                  {activeQ.type === 'choice' && (
                    <>
                      <input type="text" readOnly value={`Đáp án câu ${activeQIndex}: ${answers[activeQ.id] || 'Chưa chọn'}`} className="w-full bg-white border p-2 rounded-lg font-bold text-center text-xs text-gray-700 focus:outline-none" />
                      <div className="grid grid-cols-4 gap-2">
                        {['A','B','C','D'].map(o => (
                          <button key={o} onClick={() => { setAnswers(p => ({ ...p, [activeQ.id]: o })); if (activeQIndex < qList.length) setActiveQIndex(activeQIndex + 1); }} className={`py-3 rounded-lg font-black border transition-all text-xs ${answers[activeQ.id] === o ? 'bg-blue-600 text-white border-transparent shadow-sm' : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'}`}>{o}</button>
                        ))}
                      </div>
                    </>
                  )}

                  {activeQ.type === 'true_false' && (
                    <div className="space-y-3">
                      {activeQ.sub?.map((s: string) => {
                        const key = `${activeQ.id}_${s}`;
                        return (
                          <div key={s} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100">
                            <span className="font-bold text-gray-500 uppercase">Ý {s})</span>
                            <div className="flex gap-2">
                              {['Đúng', 'Sai'].map(val => (
                                <button key={val} onClick={() => setAnswers(p => ({ ...p, [key]: val }))} className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold border transition-all ${answers[key] === val ? 'bg-blue-600 text-white border-transparent' : 'bg-slate-50 text-gray-600 hover:bg-slate-100 border-gray-200'}`}>{val}</button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {activeQ.type === 'short' && (
                    <div className="space-y-2">
                      <input type="text" placeholder="Nhập đáp số trắc nghiệm" value={answers[activeQ.id] || ''} onChange={(e) => setAnswers(p => ({ ...p, [activeQ.id]: e.target.value }))} className="w-full bg-white border p-2.5 rounded-lg font-extrabold text-center text-xs focus:outline-none focus:ring-1 focus:ring-blue-600" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-gray-150 grid grid-cols-2 gap-3 bg-slate-50 shrink-0">
                <button onClick={() => { if(confirm('Rời khỏi phòng thi? Tiến trình làm bài sẽ được lưu.')) router.push('/thi-thu'); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-extrabold py-3.5 rounded-xl text-center transition-all shadow-xs">Rời khỏi</button>
                <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 rounded-xl text-center transition-all shadow-md">Nộp bài</button>
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
              <button onClick={() => { setPhase('inProgress'); setAnswers({}); setCountdown(selectedExam.duration * 60); }} className="border font-bold py-2.5 px-5 rounded-full hover:bg-gray-50 text-gray-700">Làm lại</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
