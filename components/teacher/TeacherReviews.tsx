'use client';

import React, { useState } from 'react';
import { PlanService } from '@/services/PlanService';

interface TeacherReviewsProps {
  plans: any[];
  loading: boolean;
  filter: 'submitted' | 'reviewed';
  onFilterChange: (filter: 'submitted' | 'reviewed') => void;
  onRefresh: () => void;
}

export default function TeacherReviews({
  plans,
  loading,
  filter,
  onFilterChange,
  onRefresh
}: TeacherReviewsProps) {
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [teacherScore, setTeacherScore] = useState<number>(10);
  const [teacherComment, setTeacherComment] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    try {
      const res = await PlanService.reviewDailyAction({
        actionId: selectedPlan._id,
        teacherComment,
        teacherScore
      });
      if (res.status === 'OK') {
        alert('Gửi nhận xét thành công!');
        setSelectedPlan(null);
        setTeacherComment('');
        setTeacherScore(10);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi gửi nhận xét.');
    }
  };

  const handleAICopilot = async () => {
    if (!selectedPlan) return;
    try {
      setIsAiLoading(true);
      const res = await PlanService.generateAIComment({
        tasks: selectedPlan.tasks || [],
        reflection: selectedPlan.reflection || '',
        selfScore: selectedPlan.selfScore || 10,
        date: selectedPlan.date
      });
      if (res.status === 'OK') {
        setTeacherComment(res.data);
        setTeacherScore(selectedPlan.selfScore || 10);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi gọi AI Co-pilot.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* List section */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#1e3a8a]">Kế hoạch ngày học sinh nộp</h2>
            <p className="text-gray-500 text-xs mt-0.5">Chọn học sinh để bắt đầu nhận xét và cho điểm kỷ luật.</p>
          </div>
          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-lg self-start">
            <button
              onClick={() => { onFilterChange('submitted'); setSelectedPlan(null); }}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'submitted' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Chờ nhận xét
            </button>
            <button
              onClick={() => { onFilterChange('reviewed'); setSelectedPlan(null); }}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${filter === 'reviewed' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Đã nhận xét
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Đang tải kế hoạch...</div>
        ) : plans.length === 0 ? (
          <div className="py-20 text-center text-gray-400">Không có kế hoạch nào.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-medium">
                  <th className="py-3 font-semibold">Học sinh</th>
                  <th className="py-3 font-semibold">Ngày nộp</th>
                  <th className="py-3 font-semibold text-center">Thời gian thực tế</th>
                  <th className="py-3 font-semibold text-center">Tự đánh giá</th>
                  {filter === 'reviewed' && <th className="py-3 font-semibold text-center">G.Viên chấm</th>}
                  <th className="py-3 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => {
                  const actHrs = p.tasks?.reduce((sum: number, t: any) => sum + (Number(t.actualTime) || 0), 0) || 0;
                  return (
                    <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <div className="font-semibold text-gray-900">{p.studentId?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-400">@{p.studentId?.username || 'user'}</div>
                      </td>
                      <td className="py-4 text-gray-600">
                        {new Date(p.date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="py-4 text-center font-bold text-[#1e3a8a]">{actHrs} giờ</td>
                      <td className="py-4 text-center">
                        <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded text-xs">
                          {p.selfScore || 0}/10
                        </span>
                      </td>
                      {filter === 'reviewed' && (
                        <td className="py-4 text-center">
                          <span className="bg-green-50 text-green-700 font-bold px-2 py-0.5 rounded text-xs">
                            {p.teacherScore || 0}/10
                          </span>
                        </td>
                      )}
                      <td className="py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedPlan(p);
                            setTeacherScore(p.teacherScore || p.selfScore || 10);
                            setTeacherComment(p.teacherComment || '');
                          }}
                          className="bg-[#1e3a8a] text-white hover:bg-[#fbbf24] hover:text-[#1e3a8a] transition-all text-xs font-bold py-1.5 px-3 rounded-full"
                        >
                          {filter === 'submitted' ? 'Đánh giá' : 'Xem lại'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review details sidebar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {selectedPlan ? (
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
              <div>
                <h3 className="font-bold text-base text-gray-900">Chi tiết tự học</h3>
                <p className="text-xs text-gray-400">{selectedPlan.studentId?.name} | {new Date(selectedPlan.date).toLocaleDateString('vi-VN')}</p>
              </div>
              <button onClick={() => setSelectedPlan(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="mb-5 overflow-hidden">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bảng công việc ngày</h4>
              <div className="border border-gray-100 rounded-lg overflow-x-auto text-[11px]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                      <th className="p-2 font-bold">Khía cạnh</th>
                      <th className="p-2 font-bold text-center">Dự kiến</th>
                      <th className="p-2 font-bold text-center">Thực tế</th>
                      <th className="p-2 font-bold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPlan.tasks?.map((task: any, idx: number) => (
                      <tr key={idx} className="border-b border-gray-50">
                        <td className="p-2 font-semibold text-gray-900">{task.aspect}</td>
                        <td className="p-2 text-center text-gray-600">{task.time}h</td>
                        <td className="p-2 text-center font-bold text-green-700">{task.actualTime}h</td>
                        <td className="p-2 text-gray-600 truncate max-w-[120px]">{task.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-5 bg-blue-50/40 border border-blue-100/50 rounded-xl p-3.5">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Rút kinh nghiệm học sinh</h4>
              <p className="text-xs text-blue-950 italic">"{selectedPlan.reflection || 'Không có.'}"</p>
            </div>

            {filter === 'submitted' && (
              <div className="mb-5 bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <span className="text-[11px] font-extrabold text-[#d97706] uppercase tracking-wider">
                  ✨ AI Co-pilot Suggestions
                </span>
                <button
                  type="button"
                  onClick={handleAICopilot}
                  disabled={isAiLoading}
                  className="bg-[#1e3a8a] text-white hover:bg-[#3b82f6] disabled:bg-gray-400 text-[10px] font-bold px-2.5 py-1 rounded transition-colors"
                >
                  {isAiLoading ? 'Đang phân tích...' : 'Dùng nhận xét AI'}
                </button>
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 mb-1">Điểm đánh giá kỷ luật (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={teacherScore}
                  onChange={(e) => setTeacherScore(Number(e.target.value))}
                  disabled={filter === 'reviewed'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-500 mb-1">Lời khuyên của giáo viên</label>
                <textarea
                  rows={4}
                  value={teacherComment}
                  onChange={(e) => setTeacherComment(e.target.value)}
                  disabled={filter === 'reviewed'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-blue-500"
                  placeholder="Nhập nhận xét..."
                  required
                ></textarea>
              </div>

              {filter === 'submitted' && (
                <button
                  type="submit"
                  className="w-full bg-[#1e3a8a] hover:bg-[#fbbf24] hover:text-[#1e3a8a] text-white font-bold py-2 rounded-full transition-all text-xs shadow-sm"
                >
                  Lưu & Gửi Nhận Xét
                </button>
              )}
            </form>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400 text-xs">
            Chưa chọn kế hoạch học sinh để nhận xét.
          </div>
        )}
      </div>
    </div>
  );
}
