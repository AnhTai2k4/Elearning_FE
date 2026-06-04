'use client';

import React, { useState, useEffect } from 'react';
import { ExamService, ExamData } from '@/services/ExamService';
import { useSelector } from 'react-redux';

interface TeacherExamsProps {
  exams: ExamData[];
  onRefresh: () => void;
}

export default function TeacherExams({ exams, onRefresh }: TeacherExamsProps) {
  const user = useSelector((state: any) => state.user);

  const [selectedExam, setSelectedExam] = useState<ExamData | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [examForm, setExamForm] = useState<ExamData>({
    title: '', description: '', fileUrl: '', duration: 90, questionsCount: 22, answers: {}, type: 'exam', grade: 12, createdBy: ''
  });
  const [isThptFormat, setIsThptFormat] = useState(true);

  useEffect(() => {
    if (selectedExam?._id) {
      ExamService.getSubmissions(selectedExam._id).then(res => {
        if (res.status === 'OK') setSubmissions(res.data || []);
      });
    }
  }, [selectedExam]);

  // Handle local file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await ExamService.uploadFile(file);
      if (res.status === 'OK' && res.fileUrl) {
        setExamForm(prev => ({ ...prev, fileUrl: res.fileUrl }));
        alert('Tải file lên thành công!');
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi tải file.');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleThptFormat = (checked: boolean) => {
    setIsThptFormat(checked);
    if (checked) {
      // Initialize standard 22 questions for THPT Math
      const initAns: Record<string, string> = {};
      for (let i = 1; i <= 12; i++) initAns[String(i)] = 'A';
      for (let i = 13; i <= 16; i++) {
        ['a', 'b', 'c', 'd'].forEach(sub => initAns[`${i}_${sub}`] = 'Đúng');
      }
      for (let i = 17; i <= 22; i++) initAns[String(i)] = '';
      setExamForm(prev => ({ ...prev, questionsCount: 22, answers: initAns }));
    } else {
      // Standard linear 10 questions
      const initAns: Record<string, string> = {};
      for (let i = 1; i <= 10; i++) initAns[String(i)] = 'A';
      setExamForm(prev => ({ ...prev, questionsCount: 10, answers: initAns }));
    }
  };

  const handleSaveExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...examForm, createdBy: user._id || '65c2b8c56c2d1b827e8a93ef' };
      if (examForm._id) {
        await ExamService.updateExam(examForm._id, data);
        alert('Cập nhật đề thi thành công!');
      } else {
        await ExamService.createExam(data);
        alert('Tạo đề thi mới thành công!');
      }
      setIsExamModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Lỗi lưu đề thi.');
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa đề thi này?')) return;
    try {
      await ExamService.deleteExam(id);
      alert('Đã xóa đề thi!');
      setSelectedExam(null);
      onRefresh();
    } catch (err) {
      alert('Lỗi xóa đề thi.');
    }
  };

  // Check if an answers object looks like THPT format
  const checkThptFormat = (ansObj: any) => {
    if (!ansObj) return false;
    return ansObj['13_a'] !== undefined || ansObj['17'] !== undefined;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
      {/* Sidebar List */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-[#1e3a8a] text-lg">Đề thi & Bài tập</h2>
          <button
            onClick={() => {
              setExamForm({ title: '', description: '', fileUrl: '', duration: 90, questionsCount: 22, answers: {}, type: 'exam', grade: 12, createdBy: '' });
              handleToggleThptFormat(true);
              setIsExamModalOpen(true);
            }}
            className="bg-[#1e3a8a] text-white hover:bg-[#fbbf24] hover:text-[#1e3a8a] transition-all text-xs font-bold py-1.5 px-3 rounded-full"
          >
            + Đề mới
          </button>
        </div>

        {exams.length === 0 ? (
          <p className="text-gray-400 text-center py-6">Chưa có đề thi nào.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {exams.map((ex) => (
              <div
                key={ex._id}
                onClick={() => setSelectedExam(ex)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${selectedExam?._id === ex._id ? 'border-[#1e3a8a] bg-[#1e3a8a]/5 shadow-sm font-semibold' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
              >
                <div className="truncate pr-2">
                  <div className="text-gray-900 truncate font-semibold">{ex.title}</div>
                  <div className="text-xs text-gray-400 mt-1 flex gap-2">
                    <span>{ex.type === 'exam' ? 'Đề thi' : 'Bài tập'}</span>
                    <span>• Lớp {ex.grade || 12}</span>
                    <span>• {ex.duration} phút</span>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); setExamForm(ex); setIsThptFormat(checkThptFormat(ex.answers)); setIsExamModalOpen(true); }} className="p-1 text-gray-400 hover:text-blue-500 font-bold">✏️</button>
                  <button onClick={(e) => { e.stopPropagation(); if (ex._id) handleDeleteExam(ex._id); }} className="p-1 text-gray-400 hover:text-red-500 font-bold">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main details display */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {selectedExam ? (
          <div>
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h3 className="font-extrabold text-xl text-gray-900">{selectedExam.title}</h3>
              <p className="text-gray-500 text-xs mt-1">{selectedExam.description || 'Không có mô tả.'}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold">Dạng bài: {selectedExam.type === 'exam' ? 'Đề thi' : 'Bài tập'}</span>
                <span className="bg-purple-50 text-purple-700 text-xs px-2.5 py-1 rounded-full font-bold">Khối lớp: Lớp {selectedExam.grade || 12}</span>
                <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold">Thời gian: {selectedExam.duration} phút</span>
                {selectedExam.fileUrl && (
                  <a href={selectedExam.fileUrl} target="_blank" rel="noreferrer" className="bg-emerald-50 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-bold hover:underline flex items-center gap-1">
                    📄 Tải / Xem Đề Thi
                  </a>
                )}
              </div>
            </div>

            {/* Answer Display */}
            <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-700 mb-2">Đáp án đúng đã thiết lập:</h4>
              {checkThptFormat(selectedExam.answers) ? (
                <div className="space-y-4">
                  <div>
                    <span className="font-bold text-xs text-blue-600 block mb-1">Phần I: Trắc nghiệm (1 - 12)</span>
                    <div className="grid grid-cols-6 gap-2">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="bg-white border p-1 rounded text-center text-xs">C{i+1}: <strong>{selectedExam.answers[String(i+1)]}</strong></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-amber-600 block mb-1">Phần II: Đúng/Sai (1 - 4)</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[13, 14, 15, 16].map(q => (
                        <div key={q} className="bg-white border p-2 rounded">
                          <span className="font-bold block mb-1">Câu {q - 12}:</span>
                          <div className="grid grid-cols-4 gap-1">
                            {['a', 'b', 'c', 'd'].map(sub => (
                              <span key={sub} className="bg-gray-50 p-1 text-[10px] rounded text-center">{sub}: <strong>{selectedExam.answers[`${q}_${sub}`]}</strong></span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-emerald-600 block mb-1">Phần III: Trả lời ngắn (1 - 6)</span>
                    <div className="grid grid-cols-3 gap-2">
                      {Array.from({ length: 6 }).map((_, i) => {
                        const qNum = String(17 + i);
                        return <div key={i} className="bg-white border p-1.5 rounded text-xs">C{Number(qNum) - 16}: <strong>{selectedExam.answers[qNum] || '(Chưa cài)'}</strong></div>;
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-2">
                  {Object.keys(selectedExam.answers).map((key) => (
                    <div key={key} className="bg-white border p-1.5 rounded text-center text-xs">
                      C{key}: <strong>{selectedExam.answers[key]}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submissions list */}
            <div>
              <h4 className="font-extrabold text-base text-gray-800 mb-3">Kết quả làm bài của học sinh</h4>
              {submissions.length === 0 ? (
                <p className="text-gray-400 text-center py-6 bg-gray-50/50 rounded-xl border border-dashed border-gray-100">Chưa có học sinh làm bài.</p>
              ) : (
                <div className="overflow-x-auto border border-gray-100 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                        <th className="p-3">Học sinh</th>
                        <th className="p-3 text-center">Thời gian nộp</th>
                        <th className="p-3 text-right">Điểm số</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub) => (
                        <tr key={sub._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="p-3 font-semibold text-gray-900">{sub.studentId?.name} (@{sub.studentId?.username})</td>
                          <td className="p-3 text-center text-gray-500">{new Date(sub.completedAt).toLocaleString('vi-VN')}</td>
                          <td className="p-3 text-right font-black text-green-700 text-sm">{sub.score} / 10</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400">Chọn đề thi bên trái để xem chi tiết.</div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isExamModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 relative shadow-2xl my-8">
            <button onClick={() => setIsExamModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg">✕</button>
            <h3 className="font-extrabold text-[#1e3a8a] text-lg mb-4">{examForm._id ? 'Chỉnh sửa đề thi' : 'Thêm đề thi mới'}</h3>
            <form onSubmit={handleSaveExam} className="flex flex-col gap-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Tiêu đề đề thi</label>
                  <input type="text" value={examForm.title} onChange={(e) => setExamForm({ ...examForm, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none" required />
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Dạng bài</label>
                  <select value={examForm.type} onChange={(e: any) => setExamForm({ ...examForm, type: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none">
                    <option value="exam">Đề thi (Exam)</option>
                    <option value="homework">Bài tập về nhà (Homework)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Khối Lớp</label>
                  <select value={examForm.grade || 12} onChange={(e: any) => setExamForm({ ...examForm, grade: Number(e.target.value) as any })} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none">
                    <option value={10}>Lớp 10</option>
                    <option value={11}>Lớp 11</option>
                    <option value={12}>Lớp 12</option>
                  </select>
                </div>
              </div>

              {/* Upload local file */}
              <div>
                <label className="block font-bold text-gray-500 mb-1">Tải file đề thi lên (từ thiết bị)</label>
                <div className="flex items-center gap-2">
                  <input type="file" accept=".pdf,.docx" onChange={handleFileUpload} className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50" />
                  {uploading && <span className="text-blue-600 font-bold shrink-0">Đang tải...</span>}
                </div>
                {examForm.fileUrl && <p className="text-[10px] text-green-600 mt-1 truncate">File đã chọn: {examForm.fileUrl}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Thời gian làm bài (Phút)</label>
                  <input type="number" value={examForm.duration} onChange={(e) => setExamForm({ ...examForm, duration: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none" required />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input type="checkbox" id="thptToggle" checked={isThptFormat} onChange={(e) => handleToggleThptFormat(e.target.checked)} className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
                  <label htmlFor="thptToggle" className="font-bold text-gray-700 cursor-pointer select-none">Định dạng đề THPT QG</label>
                </div>
              </div>

              {/* Dynamic Answer Key Setter */}
              <div>
                <label className="block font-bold text-gray-500 mb-2">Đáp án đúng cài đặt:</label>
                {isThptFormat ? (
                  <div className="space-y-4 max-h-[220px] overflow-y-auto bg-gray-50 p-4 rounded-xl border border-gray-150">
                    <div>
                      <span className="font-bold text-blue-600 block mb-1">Phần I: Trắc nghiệm (1-12)</span>
                      <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 12 }).map((_, i) => {
                          const key = String(i + 1);
                          return (
                            <div key={i} className="bg-white p-1 rounded border flex justify-between items-center">
                              <span className="font-bold text-gray-400">Câu {key}</span>
                              <select value={examForm.answers[key] || 'A'} onChange={(e) => setExamForm(prev => ({ ...prev, answers: { ...prev.answers, [key]: e.target.value } }))} className="font-bold text-blue-700">
                                {['A','B','C','D'].map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-amber-600 block mb-1">Phần II: Đúng / Sai (1 - 4)</span>
                      <div className="space-y-2">
                        {[13, 14, 15, 16].map(q => (
                          <div key={q} className="bg-white p-2 rounded border">
                            <span className="font-bold text-gray-700 block mb-1">Câu {q - 12}:</span>
                            <div className="grid grid-cols-4 gap-2">
                              {['a', 'b', 'c', 'd'].map(sub => {
                                const key = `${q}_${sub}`;
                                return (
                                  <div key={sub} className="flex flex-col items-center bg-gray-50 p-1 rounded">
                                    <span className="text-[10px] text-gray-400">{sub}</span>
                                    <select value={examForm.answers[key] || 'Đúng'} onChange={(e) => setExamForm(prev => ({ ...prev, answers: { ...prev.answers, [key]: e.target.value } }))} className="font-bold text-amber-700">
                                      <option value="Đúng">Đúng</option>
                                      <option value="Sai">Sai</option>
                                    </select>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-green-600 block mb-1">Phần III: Trả lời ngắn (1 - 6)</span>
                      <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: 6 }).map((_, i) => {
                          const key = String(17 + i);
                          return (
                            <div key={i} className="bg-white p-2 rounded border flex items-center justify-between gap-2">
                              <span className="font-bold text-gray-500 shrink-0">Câu {Number(key) - 16}:</span>
                              <input type="text" placeholder="Đáp án" value={examForm.answers[key] || ''} onChange={(e) => setExamForm(prev => ({ ...prev, answers: { ...prev.answers, [key]: e.target.value } }))} className="w-full bg-gray-50 border p-1 rounded focus:outline-none font-bold text-center" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-gray-400 text-xs">Tổng số câu: {examForm.questionsCount}</span>
                      <input type="number" value={examForm.questionsCount} onChange={(e) => {
                        const count = Math.max(1, Number(e.target.value));
                        setExamForm(prev => ({ ...prev, questionsCount: count }));
                      }} className="w-16 border rounded p-1 text-center" />
                    </div>
                    <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto bg-gray-50 p-3 rounded-xl border">
                      {Array.from({ length: examForm.questionsCount }).map((_, idx) => {
                        const key = String(idx + 1);
                        return (
                          <div key={idx} className="bg-white p-1 rounded border flex justify-between items-center">
                            <span className="font-bold text-gray-400">Câu {key}</span>
                            <select value={examForm.answers[key] || 'A'} onChange={(e) => setExamForm(prev => ({ ...prev, answers: { ...prev.answers, [key]: e.target.value } }))} className="font-bold text-blue-700">
                              {['A','B','C','D'].map(o => <option key={o} value={o}>{o}</option>)}
                            </select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <button type="button" onClick={() => setIsExamModalOpen(false)} className="px-4 py-2 border border-gray-200 rounded-full font-bold hover:bg-gray-50">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-[#1e3a8a] text-white rounded-full font-bold hover:bg-[#fbbf24] hover:text-[#1e3a8a] transition-all">Lưu đề thi</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
