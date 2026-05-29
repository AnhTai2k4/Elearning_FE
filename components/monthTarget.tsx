'use client';

import React, { useState, useEffect } from 'react';

export interface TargetRow {
  aspect: string;
  duration: string;
  action: string;
  expectedScore: number;
}

interface MonthTargetProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (targets: TargetRow[]) => void;
  initialTargets?: TargetRow[];
  selectedMonthLabel?: string;
}

export default function MonthTarget({
  isOpen,
  onClose,
  onSave,
  initialTargets = [],
  selectedMonthLabel = 'Tháng 5, 2026',
}: MonthTargetProps) {
  const [rows, setRows] = useState<TargetRow[]>([]);

  // Sync initial targets when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialTargets && initialTargets.length > 0) {
        setRows(initialTargets);
      } else {
        setRows([]);
      }
    }
  }, [isOpen, initialTargets]);

  if (!isOpen) return null;

  const handleInputChange = (index: number, field: keyof TargetRow, value: any) => {
    setRows((prev) =>
      prev.map((row, idx) => (idx === index ? { ...row, [field]: value } : row))
    );
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      { aspect: '', duration: '', action: '', expectedScore: 10 },
    ]);
  };

  const handleRemoveRow = (index: number) => {
    setRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    // Filter out rows that are completely empty
    const filteredRows = rows.filter(
      (row) => row.aspect.trim() || row.duration.trim() || row.action.trim()
    );
    onSave(filteredRows);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
      {/* Modal Container */}
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[1050px] overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">Lập mục tiêu</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-full px-4 py-1 text-[13px] font-medium text-gray-600">
              {selectedMonthLabel}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="border border-[#f15a24] text-[#f15a24] hover:bg-orange-50 font-bold text-[13px] px-5 py-2 rounded-full transition-all"
            >
              Hủy thao tác
            </button>
            <button
              onClick={handleSave}
              className="bg-[#f15a24] hover:bg-[#d94e1d] text-white font-bold text-[13px] px-5 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all"
            >
              Lưu mục tiêu <span className="text-base leading-none">→</span>
            </button>
          </div>
        </div>

        {/* Modal Body Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="bg-[#eef4f8] text-[#002b49] text-[13px] font-bold border-b border-gray-200">
                  <th className="p-4 w-[60px] text-center">STT</th>
                  <th className="p-4 w-[220px]">Khía cạnh</th>
                  <th className="p-4 w-[200px]">Thời gian dự kiến /Tuần</th>
                  <th className="p-4">Hành động cụ thể</th>
                  <th className="p-4 w-[130px] text-center">Điểm kỳ vọng</th>
                  <th className="p-4 w-[50px] text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-[14px]">
                {rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* STT */}
                    <td className="p-3 text-center font-bold text-gray-400">
                      {idx + 1}
                    </td>

                    {/* Khía cạnh */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.aspect}
                        onChange={(e) => handleInputChange(idx, 'aspect', e.target.value)}
                        placeholder="Nhập khía cạnh..."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC]/20 outline-none"
                      />
                    </td>

                    {/* Thời gian dự kiến / Tuần */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.duration}
                        onChange={(e) => handleInputChange(idx, 'duration', e.target.value)}
                        placeholder="Ví dụ: 15 tiếng/Tuần"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC]/20 outline-none"
                      />
                    </td>

                    {/* Hành động cụ thể */}
                    <td className="p-2">
                      <input
                        type="text"
                        value={row.action}
                        onChange={(e) => handleInputChange(idx, 'action', e.target.value)}
                        placeholder="Nhập hành động cụ thể..."
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[13px] focus:border-[#0072BC] focus:ring-1 focus:ring-[#0072BC]/20 outline-none"
                      />
                    </td>

                    {/* Điểm kỳ vọng */}
                    <td className="p-2">
                      <div className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2 py-1.5 w-full max-w-[100px] mx-auto">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={row.expectedScore}
                          onChange={(e) =>
                            handleInputChange(
                              idx,
                              'expectedScore',
                              Math.min(10, Math.max(1, Number(e.target.value) || 0))
                            )
                          }
                          className="w-10 text-center font-bold text-[#f15a24] bg-transparent outline-none text-[13px]"
                        />
                        <span className="text-gray-400 text-[12px] font-medium">/10</span>
                      </div>
                    </td>

                    {/* Delete action */}
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleRemoveRow(idx)}
                        className="text-gray-400 hover:text-red-500 font-bold transition-colors text-sm"
                        title="Xóa dòng"
                      >
                        ✕
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add new row button */}
          <button
            onClick={handleAddRow}
            className="mt-4 border border-[#0072BC] text-[#0072BC] hover:bg-blue-50 font-bold text-[12px] px-5 py-2.5 rounded-full flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="text-sm font-black">+</span> Thêm dòng mới
          </button>
        </div>

      </div>
    </div>
  );
}
