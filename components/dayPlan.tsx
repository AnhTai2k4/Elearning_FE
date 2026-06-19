'use client';

import React, { useState, useEffect } from 'react';

export interface DayPlanRow {
  aspect: string;
  startTime: string;
  endTime: string;
  actualTime: number;
  action: string;
  score: number;
}

interface DayPlanProps {
  dateLabel: string;
  onBack: () => void;
  onSavePlan: (plan: { rows: DayPlanRow[]; reflection: string; status: 'draft' | 'submitted' }) => void;
  initialPlan?: {
    rows: DayPlanRow[];
    reflection: string;
    status: 'draft' | 'submitted' | 'reviewed';
    aiScore?: number;
    aiFeedback?: string;
    teacherComment?: string;
    teacherScore?: number;
    teacherCommentAt?: string;
  };
  categories?: string[];
}

export default function DayPlan({
  dateLabel,
  onBack,
  onSavePlan,
  initialPlan,
  categories = [],
}: DayPlanProps) {
  const [activeTab, setActiveTab] = useState<'draft' | 'mentor'>('draft');
  const [rows, setRows] = useState<DayPlanRow[]>([]);
  const [reflection, setReflection] = useState('');
  const [status, setStatus] = useState<'draft' | 'submitted' | 'reviewed'>('draft');
  const [validationError, setValidationError] = useState('');

  // Sync initialPlan when it changes or loads
  useEffect(() => {
    if (initialPlan) {
      setRows(initialPlan.rows || []);
      setReflection(initialPlan.reflection || '');
      setStatus(initialPlan.status || 'draft');
    } else {
      setRows([]);
      setReflection('');
      setStatus('draft');
    }
  }, [initialPlan]);

  const handleInputChange = (index: number, field: keyof DayPlanRow, value: any) => {
    setRows((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
    );
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, { aspect: categories[0] || '', startTime: '', endTime: '', actualTime: 0, action: '', score: 10 }]);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveDraft = () => {
    onSavePlan({ rows, reflection, status: 'draft' });
  };

  const handleSubmitTeacher = () => {
    if (!reflection.trim()) {
      setValidationError('Vui lòng nhập Bài học & Đúc kết trong ngày trước khi nộp cho giáo viên đánh giá!');
      return;
    }
    setStatus('submitted');
    onSavePlan({ rows, reflection, status: 'submitted' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-6">
      
      {/* Navigation and Title */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
        >
          ←
        </button>
        <h1 className="text-[22px] font-black text-[#005082]">Lập kế hoạch</h1>
        <div className="bg-white border border-gray-200 rounded-full px-4 py-1.5 text-[13px] font-bold text-gray-700 shadow-sm">
          {dateLabel}
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-2 p-1 bg-gray-200/50 rounded-full w-fit mb-6">
        <button
          onClick={() => setActiveTab('draft')}
          className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all ${
            activeTab === 'draft'
              ? 'bg-white text-[#0072BC] shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Đang lập (Kế hoạch)
        </button>
        
        <button
          onClick={() => setActiveTab('mentor')}
          className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all ${
            activeTab === 'mentor'
              ? 'bg-white text-[#0072BC] shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Giáo viên nhận xét
        </button>
      </div>

      {/* Main Tab Contents */}
      {activeTab === 'draft' && (
        <div className="space-y-6">
          {/* Card Table */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-black text-gray-800">
                  Kế hoạch ngày {dateLabel}
                </h2>
                <span className="bg-gray-100 text-gray-500 font-bold text-[11px] px-2.5 py-1 rounded-full">
                  {status === 'draft' ? 'Đang lưu nháp' : status === 'reviewed' ? 'Đã nhận xét' : 'Đã nộp'}
                </span>
              </div>

              {status === 'draft' && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveDraft}
                    className="border border-[#0072BC] text-[#0072BC] hover:bg-blue-50 font-bold text-[13px] px-5 py-2.5 rounded-full transition-all"
                  >
                    Lưu kế hoạch ngày
                  </button>
                  <button
                    onClick={handleSubmitTeacher}
                    className="bg-[#f15a24] hover:bg-[#d94e1d] text-white font-bold text-[13px] px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-all"
                  >
                    Nộp cho giáo viên đánh giá <span className="text-base leading-none">→</span>
                  </button>
                </div>
              )}
            </div>

            {/* Table wrapper */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-inner mb-4 overflow-x-auto">
              <table className="w-full text-left border-collapse table-fixed min-w-[1050px]">
                <thead>
                  <tr className="bg-[#eef4f8] text-[#002b49] text-[13px] font-bold border-b border-gray-200">
                    <th className="p-4 w-[60px] text-center">STT</th>
                    <th className="p-4 w-[180px]">Khía cạnh</th>
                    <th className="p-4 w-[250px]">Thời gian dự kiến</th>
                    <th className="p-4">Hành động cụ thể</th>
                    <th className="p-4 w-[180px]">Thời gian đã thực hiện (Cuối ngày)</th>
                    <th className="p-4 w-[110px] text-center">Chấm điểm</th>
                    <th className="p-4 w-[50px] text-center"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-[14px]">
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400 font-medium bg-gray-50/20">
                        Chưa có hành động nào trong danh sách. Click "+ Thêm dòng mới" để bắt đầu!
                      </td>
                    </tr>
                  ) : (
                    rows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 text-center font-bold text-gray-400">{idx + 1}</td>
                        
                        {/* Khía cạnh */}
                        <td className="p-2">
                          {categories.length > 0 ? (
                            <select
                              value={row.aspect}
                              onChange={(e) => handleInputChange(idx, 'aspect', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC]/20 outline-none"
                            >
                              <option value="">Chọn khía cạnh...</option>
                              {categories.map((cat, i) => (
                                <option key={i} value={cat}>{cat}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={row.aspect}
                              onChange={(e) => handleInputChange(idx, 'aspect', e.target.value)}
                              placeholder="Luyện nghe, Từ vựng..."
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC]/20 outline-none"
                            />
                          )}
                        </td>

                        {/* Thời gian dự kiến */}
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <input
                              type="time"
                              value={row.startTime}
                              onChange={(e) => handleInputChange(idx, 'startTime', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-[13px] focus:border-[#0072BC] outline-none"
                            />
                            <span className="text-gray-400 font-bold">-</span>
                            <input
                              type="time"
                              value={row.endTime}
                              onChange={(e) => handleInputChange(idx, 'endTime', e.target.value)}
                              className="w-full bg-white border border-gray-200 rounded-lg px-2 py-2 text-[13px] focus:border-[#0072BC] outline-none"
                            />
                          </div>
                        </td>

                        {/* Hành động */}
                        <td className="p-2">
                          <input
                            type="text"
                            value={row.action}
                            onChange={(e) => handleInputChange(idx, 'action', e.target.value)}
                            placeholder="Nhập chi tiết hành động..."
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC]/20 outline-none"
                          />
                        </td>

                        {/* Thời gian đã thực hiện (Cuối ngày) */}
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={row.actualTime || ''}
                            onChange={(e) => handleInputChange(idx, 'actualTime', Number(e.target.value) || 0)}
                            placeholder="Số giờ (ví dụ: 1.5)"
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC]/20 outline-none"
                          />
                        </td>

                        {/* Chấm điểm */}
                        <td className="p-2">
                          <div className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-1.5 w-full max-w-[85px] mx-auto">
                            <input
                              type="number"
                              min="1"
                              max="10"
                              value={row.score}
                              onChange={(e) =>
                                handleInputChange(
                                  idx,
                                  'score',
                                  Math.min(10, Math.max(1, Number(e.target.value) || 0))
                                )
                              }
                              className="w-8 text-center font-bold text-[#f15a24] bg-transparent outline-none text-[13px]"
                            />
                            <span className="text-gray-400 text-[11px] font-medium">/10</span>
                          </div>
                        </td>

                        {/* Delete button */}
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleRemoveRow(idx)}
                            className="text-gray-400 hover:text-red-500 font-bold transition-colors text-sm"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Add row */}
            <button
              onClick={handleAddRow}
              className="border border-[#0072BC] text-[#0072BC] hover:bg-blue-50 font-bold text-[12px] px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span className="text-sm font-black">+</span> Thêm dòng mới
            </button>
          </div>

          {/* Reflection section */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-black text-gray-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#0072BC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Bài học & Đúc kết trong ngày
            </h3>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Nhập bài học & đúc kết..."
              className="w-full bg-[#fcfcfc] border border-gray-200 rounded-xl p-4 min-h-[100px] text-sm focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC]/20 outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      )}


      {/* Mentor feedback Tab */}
      {activeTab === 'mentor' && (
        <div className="max-w-3xl">
          {initialPlan?.teacherComment ? (
            <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm ring-1 ring-green-50/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl shrink-0 font-bold text-green-700">
                  H
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-[15px]">Giáo viên nhận xét</h3>
                  {initialPlan.teacherCommentAt && (
                    <p className="text-[12px] text-gray-500">
                      Đã nhận xét lúc {new Date(initialPlan.teacherCommentAt).toLocaleTimeString()} ngày {new Date(initialPlan.teacherCommentAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="text-[14px] text-gray-700 leading-relaxed bg-green-50/50 p-5 rounded-xl border-l-4 border-green-500">
                "{initialPlan.teacherComment}"
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center shadow-sm">
              <div className="text-4xl mb-4">👨‍🏫</div>
              <p className="text-gray-500 font-bold text-[14px]">Giáo viên chưa đánh giá.</p>
            </div>
          )}
        </div>
      )}

      {/* Validation Alert Popup */}
      {validationError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-[400px] overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Thiếu thông tin</h3>
              <p className="text-[14px] text-gray-600 leading-relaxed mb-6">
                {validationError}
              </p>
              <button
                onClick={() => setValidationError('')}
                className="w-full bg-[#0072BC] hover:bg-[#005e9c] text-white font-bold text-[14px] py-3 rounded-xl transition-all shadow-sm"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
