'use client';

import React from 'react';

export default function TeacherAnalytics() {
  return (
    <div className="flex flex-col gap-8">
      {/* Alarms center */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="text-amber-800 font-bold text-lg mb-2 flex items-center gap-2">
          ⚠️ Warning Center (Cảnh báo Kỷ luật Học sinh)
        </h3>
        <p className="text-amber-900 text-sm mb-4">Danh sách những học sinh chưa lập kế hoạch ngày hoặc chưa nộp bài đánh giá ngày hôm nay:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-xs">
            <span className="text-red-600 font-bold text-xs">Chưa tạo kế hoạch hôm nay:</span>
            <ul className="list-disc list-inside mt-2 text-xs text-gray-700 space-y-1">
              <li>Nguyễn Văn A (a@toanmath.vn)</li>
              <li>Trần Thị B (b@toanmath.vn)</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg border border-amber-100 shadow-xs">
            <span className="text-amber-600 font-bold text-xs">Đang soạn thảo (Chưa nộp):</span>
            <ul className="list-disc list-inside mt-2 text-xs text-gray-700 space-y-1">
              <li>Hoàng Văn C (c@toanmath.vn)</li>
              <li>Lê Văn D (d@toanmath.vn)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* KPI Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Tỉ lệ hoàn thành kế hoạch</h4>
          <div className="text-3xl font-extrabold text-blue-600">87.5%</div>
          <p className="text-xs text-gray-400 mt-2">Tổng số kế hoạch đã hoàn thành tuần này</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Trung bình điểm tự giác</h4>
          <div className="text-3xl font-extrabold text-[#fbbf24]">9.2 / 10</div>
          <p className="text-xs text-gray-400 mt-2">Dựa trên 24 lượt học sinh tự đánh giá</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Số giờ tự học đã tích lũy</h4>
          <div className="text-3xl font-extrabold text-emerald-600">142 giờ</div>
          <p className="text-xs text-gray-400 mt-2">Tổng thời gian học tập thực tế</p>
        </div>
      </div>
    </div>
  );
}
