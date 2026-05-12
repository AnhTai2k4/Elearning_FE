'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';

export default function NotebookPage() {
  const [activeTab, setActiveTab] = useState<'goals' | 'actions' | 'summary'>('goals');
  const [status, setStatus] = useState<'draft' | 'submitted' | 'reviewed'>('draft');

  // --- DỮ LIỆU MẪU ---
  const [goals, setGoals] = useState('Mục tiêu tuần 2 (Tháng 4):\n- Hoàn thành nghe chép chính tả 3 bài test.\n- Thuộc 200 từ vựng chủ đề Giáo dục và Môi trường.\n- Viết 2 bài luận Task 2 (Target 6.0).');
  
  const [tasks, setTasks] = useState([
    { id: 1, aspect: 'Luyện Nghe VSTEP', time: '08:00 - 09:30', action: 'Nghe chép chính tả Part 1', score: 8 },
    { id: 2, aspect: 'Từ vựng', time: '14:00 - 15:00', action: 'Học 50 từ vựng chủ đề Giáo dục', score: 7 },
    { id: 3, aspect: 'Thể thao', time: '17:30 - 18:30', action: 'Chạy bộ 3km', score: 9 },
  ]);
  const [reflection, setReflection] = useState('Hôm nay nghe còn sai nhiều âm đuôi s/ed, nhưng đã hoàn thành đủ target chạy bộ.');

  const [summary, setSummary] = useState('Tổng kết tuần:\n- Đã hoàn thành 80% mục tiêu đề ra.\n- Từ vựng học khá tốt nhưng phần Viết luận vẫn còn chậm, chưa kiểm soát tốt thời gian.\n- Cần cải thiện tốc độ tư duy ý tưởng trong tuần tới.');

  const handleSubmit = () => {
    setStatus('submitted');
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] font-sans text-gray-800 pb-20">
      <Header />

      {/* TOOLBAR TEST (Chỉ dùng cho Dev) */}
      <div className="bg-yellow-100 border-b border-yellow-300 p-3 flex justify-center gap-4 text-sm font-bold">
        <span>Góc Test UI:</span>
        <button onClick={() => setStatus('draft')} className={`px-3 py-1 rounded ${status === 'draft' ? 'bg-yellow-400' : 'bg-white'}`}>1. Đang viết (Nháp)</button>
        <button onClick={() => setStatus('submitted')} className={`px-3 py-1 rounded ${status === 'submitted' ? 'bg-yellow-400' : 'bg-white'}`}>2. Đã gửi (Chờ duyệt)</button>
        <button onClick={() => setStatus('reviewed')} className={`px-3 py-1 rounded ${status === 'reviewed' ? 'bg-yellow-400' : 'bg-white'}`}>3. GV/AI đã nhận xét</button>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Tên Học viên & Tiêu đề chung */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#002b49]">Sổ tay Học tập</h1>
            <p className="text-gray-500 mt-2">Học viên: <span className="font-bold text-[#f15a24]">Thành Công Trần</span></p>
          </div>
          {status === 'draft' && <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold border border-gray-200">Đang lưu nháp</span>}
          {status === 'submitted' && <span className="bg-blue-50 text-[#0072BC] px-4 py-1.5 rounded-full text-sm font-bold border border-blue-200">Đã gửi thành công</span>}
          {status === 'reviewed' && <span className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-sm font-bold border border-green-200">Đã có nhận xét</span>}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          <button 
            onClick={() => setActiveTab('goals')}
            className={`pb-3 font-bold text-[16px] border-b-2 transition-all ${activeTab === 'goals' ? 'border-[#f15a24] text-[#f15a24]' : 'border-transparent text-gray-500 hover:text-[#f15a24]'}`}
          >
            1. Mục tiêu (Tuần/Tháng)
          </button>
          <button 
            onClick={() => setActiveTab('actions')}
            className={`pb-3 font-bold text-[16px] border-b-2 transition-all ${activeTab === 'actions' ? 'border-[#f15a24] text-[#f15a24]' : 'border-transparent text-gray-500 hover:text-[#f15a24]'}`}
          >
            2. Hành động (Hàng ngày)
          </button>
          <button 
            onClick={() => setActiveTab('summary')}
            className={`pb-3 font-bold text-[16px] border-b-2 transition-all ${activeTab === 'summary' ? 'border-[#f15a24] text-[#f15a24]' : 'border-transparent text-gray-500 hover:text-[#f15a24]'}`}
          >
            3. Tổng kết
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ================= CỘT TRÁI: VÙNG NHẬP LIỆU (8 Cột) ================= */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              
              {/* TAB MỤC TIÊU */}
              {activeTab === 'goals' && (
                <div>
                  <h2 className="text-xl font-bold text-[#002b49] mb-4">Mục tiêu của bạn</h2>
                  <p className="text-sm text-gray-500 mb-4">Hãy viết ra những mục tiêu bạn muốn đạt được trong tuần hoặc tháng tới. Giáo viên sẽ xem và tư vấn cho bạn.</p>
                  <textarea 
                    value={goals}
                    disabled={status !== 'draft'}
                    onChange={(e) => setGoals(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-4 h-48 outline-none focus:border-[#0072BC] text-[15px] resize-none disabled:bg-gray-50 disabled:text-gray-700"
                    placeholder="Ví dụ: Tuần này tôi muốn hoàn thành 3 đề thi đọc..."
                  />
                </div>
              )}

              {/* TAB HÀNH ĐỘNG */}
              {activeTab === 'actions' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-[#002b49]">Kế hoạch hành động ngày 10/04/2026</h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                          <th className="p-3 font-semibold">Khía cạnh</th>
                          <th className="p-3 font-semibold w-32">Thời gian</th>
                          <th className="p-3 font-semibold">Hành động cụ thể</th>
                          <th className="p-3 font-semibold text-center w-24">Chấm điểm</th>
                        </tr>
                      </thead>
                      <tbody className="text-[15px]">
                        {tasks.map((task) => (
                          <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3">
                              <input type="text" value={task.aspect} disabled={status !== 'draft'} className="w-full bg-transparent outline-none disabled:text-gray-700 font-medium text-[#0072BC]" />
                            </td>
                            <td className="p-3">
                              <input type="text" value={task.time} disabled={status !== 'draft'} className="w-full bg-transparent outline-none disabled:text-gray-700" />
                            </td>
                            <td className="p-3">
                              <input type="text" value={task.action} disabled={status !== 'draft'} className="w-full bg-transparent outline-none disabled:text-gray-700" />
                            </td>
                            <td className="p-3 text-center">
                              <input type="number" value={task.score} disabled={status !== 'draft'} className="w-12 text-center border border-gray-200 rounded py-1 disabled:bg-gray-50 disabled:border-transparent outline-none font-bold text-[#f15a24]" />
                              <span className="text-gray-400 text-sm ml-1">/10</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {status === 'draft' && (
                    <button className="mt-4 text-[14px] text-[#0072BC] font-medium flex items-center gap-1 hover:underline">
                      + Thêm việc mới
                    </button>
                  )}

                  <div className="mt-8">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      💡 Bài học & Đúc kết trong ngày
                    </h3>
                    <textarea 
                      value={reflection}
                      disabled={status !== 'draft'}
                      onChange={(e) => setReflection(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-4 h-32 outline-none focus:border-[#0072BC] text-[15px] resize-none disabled:bg-gray-50 disabled:text-gray-700"
                      placeholder="Ghi lại những điều bạn học được hoặc niềm vui hôm nay..."
                    />
                  </div>
                </div>
              )}

              {/* TAB TỔNG KẾT */}
              {activeTab === 'summary' && (
                <div>
                  <h2 className="text-xl font-bold text-[#002b49] mb-4">Tổng kết chu kỳ</h2>
                  <p className="text-sm text-gray-500 mb-4">Hãy nhìn lại quá trình học tập của bạn, những gì làm tốt và những gì cần khắc phục.</p>
                  <textarea 
                    value={summary}
                    disabled={status !== 'draft'}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-4 h-48 outline-none focus:border-[#0072BC] text-[15px] resize-none disabled:bg-gray-50 disabled:text-gray-700"
                    placeholder="Ví dụ: Tuần qua tôi đã cố gắng hoàn thành 80% kế hoạch..."
                  />
                </div>
              )}

              {/* Vùng Nút Hành Động Chung */}
              {status === 'draft' && (
                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button className="px-6 py-2 rounded-lg text-gray-600 font-bold hover:bg-gray-100 transition-colors">
                    Lưu nháp
                  </button>
                  <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-[#f15a24] text-white font-bold hover:bg-[#d94e1d] transition-colors shadow-md">
                    Gửi nộp cho Giáo viên
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ================= CỘT PHẢI: VÙNG ĐÁNH GIÁ (4 Cột) ================= */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              
              {/* TRẠNG THÁI CHƯA NỘP */}
              {status === 'draft' && (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl text-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📝</div>
                  <h3 className="font-bold text-[#002b49] mb-2">Chưa gửi nội dung</h3>
                  <p className="text-sm text-gray-600">Hãy hoàn thiện phần nội dung bên trái và bấm Gửi để nhận được đánh giá từ Giáo viên và AI nhé!</p>
                </div>
              )}

              {/* TRẠNG THÁI ĐÃ NỘP, CHỜ CHẤM (SUMBITTED) */}
              {status === 'submitted' && (
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl text-center">
                  <div className="w-12 h-12 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl animate-pulse">⏳</div>
                  <h3 className="font-bold text-yellow-800 mb-2">Đang chờ nhận xét</h3>
                  <p className="text-sm text-yellow-700">Giáo viên đã nhận được bài nộp của bạn và sẽ phản hồi sớm nhất có thể.</p>
                </div>
              )}

              {/* FEEDBACK CỦA AI TRONG TAB HÀNH ĐỘNG */}
              {activeTab === 'actions' && (status === 'submitted' || status === 'reviewed') && (
                <div className="bg-white border border-[#e0e7ff] p-6 rounded-xl shadow-sm ring-1 ring-indigo-50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#4f46e5] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">AI Trợ Giảng</div>
                  
                  <div className="flex items-start gap-4 mb-4 mt-2">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl shrink-0">🤖</div>
                    <div>
                      <h3 className="font-bold text-gray-800">Đánh giá ngày 10/04</h3>
                      <div className="flex items-center gap-1 mt-1 text-sm">
                        Điểm kỷ luật: <span className="font-black text-indigo-600 text-lg ml-1">8.0</span>/10
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg text-[14px] text-gray-700 leading-relaxed italic border-l-4 border-indigo-400">
                    "Tiến độ rất tuyệt vời! Bạn đã hoàn thành xuất sắc mục tiêu Thể thao và Nghe chép chính tả. Lần tới, hãy cố gắng phân bổ thêm thời gian 15 phút ôn lại từ vựng vào buổi tối để khắc sâu trí nhớ nhé!"
                  </div>
                </div>
              )}

              {/* FEEDBACK CỦA GIÁO VIÊN */}
              {status === 'reviewed' && (
                <div className="bg-white border border-green-200 p-6 rounded-xl shadow-sm ring-1 ring-green-50 relative overflow-hidden animate-fade-in-up">
                  <div className="absolute top-0 right-0 bg-[#16a34a] text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">Mentor Nhận Xét</div>
                  
                  <div className="flex items-start gap-4 mb-4 mt-2">
                    <img src="https://ui-avatars.com/api/?name=Co+Giao&background=dcfce7&color=16a34a" alt="Avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                    <div>
                      <h3 className="font-bold text-gray-800 text-[15px]">Cô Mai VSTEP</h3>
                      <p className="text-[12px] text-gray-500">Đã nhận xét lúc 21:45</p>
                    </div>
                  </div>
                  
                  <div className="text-[14px] text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    {activeTab === 'goals' && `"Mục tiêu tuần này của em rất rõ ràng và khả thi. Em hãy chú ý cân đối giữa việc học từ vựng và luyện đề để không bị quá tải nhé. Cô ủng hộ em!"`}
                    {activeTab === 'actions' && `"Chào Công, cô thấy phần nghe chép chính tả em chấm 8/10 là rất trung thực. Về âm s/ed em lưu ý quy tắc 'Thôi phanh phui...' cô đã dạy ở bài 3 nhé. Tuần này duy trì phong độ tốt lắm!"`}
                    {activeTab === 'summary' && `"Nhìn lại tuần qua, em đã làm rất tốt việc theo sát kế hoạch đề ra. Việc viết luận chậm là bình thường, sang tuần sau cô sẽ gửi thêm template Writing cho em tham khảo thêm."`}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}