'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { useSelector } from 'react-redux';
import { DocumentService, DocumentData } from '@/services/DocumentService';

export default function DocumentPage() {
  const user = useSelector((state: any) => state.user);

  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'grade-10' | 'grade-11' | 'grade-12' | 'upload'>('all');
  
  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadGrade, setUploadGrade] = useState<'10' | '11' | '12'>('12');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await DocumentService.getAllDocuments();
      if (res.status === 'OK') {
        setDocuments(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      alert('Vui lòng nhập tiêu đề tài liệu');
      return;
    }
    if (!uploadFile) {
      alert('Vui lòng chọn tệp tài liệu để tải lên');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload file to get fileUrl
      const fileRes = await DocumentService.uploadFile(uploadFile);
      if (fileRes.status !== 'OK' || !fileRes.fileUrl) {
        throw new Error(fileRes.message || 'Lỗi tải tệp lên máy chủ');
      }

      // 2. Create document record
      const docRes = await DocumentService.createDocument({
        title: uploadTitle,
        description: uploadDescription,
        fileUrl: fileRes.fileUrl,
        grade: Number(uploadGrade) as 10 | 11 | 12,
        createdBy: user.id || '65c2b8c56c2d1b827e8a93ef'
      });

      if (docRes.status === 'OK') {
        alert('Tải lên tài liệu thành công!');
        setUploadTitle('');
        setUploadDescription('');
        setUploadFile(null);
        setActiveTab('all');
        fetchDocuments();
      } else {
        alert(docRes.message || 'Lỗi thêm tài liệu');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi kết nối máy chủ khi đăng tài liệu');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) return;
    try {
      const res = await DocumentService.deleteDocument(id);
      if (res.status === 'OK') {
        alert('Xóa tài liệu thành công');
        fetchDocuments();
      }
    } catch (err) {
      alert('Không thể xóa tài liệu');
    }
  };

  const filteredDocs = documents.filter(doc => {
    if (activeTab === 'grade-10') return doc.grade === 10;
    if (activeTab === 'grade-11') return doc.grade === 11;
    if (activeTab === 'grade-12') return doc.grade === 12;
    return true;
  });

  const isTeacherOrAdmin = user.isTeacher || user.isAdmin;

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6] text-gray-800 text-sm">
      {/* Top Navigation Header */}
      {!selectedDoc && <Header />}

      {selectedDoc ? (
        /* PDF READER VIEW MODE */
        <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col overflow-hidden text-sm">
          {/* Reader Topbar */}
          <div className="bg-slate-800 text-white px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-slate-700 shadow-sm">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedDoc(null)}
                className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-xl transition-all"
              >
                Quay lại
              </button>
              <div>
                <h2 className="font-extrabold text-base truncate max-w-lg">{selectedDoc.title}</h2>
                <p className="text-xs text-gray-400">Lớp {selectedDoc.grade} • Học liệu MTMath</p>
              </div>
            </div>
            <div className="text-xs text-gray-400 font-bold uppercase tracking-wider hidden sm:block">
              MTMath Document Viewer
            </div>
          </div>
          
          {/* PDF Viewer Frame */}
          <div className="flex-1 bg-slate-950 p-4 flex justify-center items-center">
            {selectedDoc.fileUrl ? (
              <iframe
                src={selectedDoc.fileUrl}
                className="w-full max-w-5xl h-full rounded-2xl border border-slate-800 shadow-2xl bg-white"
                title={selectedDoc.title}
              />
            ) : (
              <div className="text-center text-gray-400">Không tìm thấy liên kết tệp tài liệu.</div>
            )}
          </div>
        </div>
      ) : (
        /* MAIN LIST & UPLOAD GRID */
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - White Background */}
          <aside className="w-64 bg-white text-gray-800 shrink-0 border-r border-gray-200 flex flex-col justify-between hidden md:flex">
            <div>
              {/* Profile Block */}
              <div className="p-5 border-b border-gray-200 flex items-center gap-3 bg-gray-50/60">
                <div className="w-10 h-10 rounded-full bg-[#7E96A0] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-gray-200">
                  {user.name ? user.name[0].toUpperCase() : 'H'}
                </div>
                <div className="overflow-hidden">
                  <p className="font-extrabold text-gray-900 truncate text-sm">{user.name || 'Học sinh'}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">Thành viên</p>
                </div>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="p-4 space-y-6">
                <div>
                  <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-2.5 px-2">Khối lớp học</span>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`w-full text-left px-4 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'all' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      Tất cả tài liệu
                    </button>
                    {[10, 11, 12].map(g => (
                      <button
                        key={g}
                        onClick={() => setActiveTab(`grade-${g}` as any)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl font-bold transition-all ${activeTab === `grade-${g}` ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                        Tài liệu Lớp {g}
                      </button>
                    ))}
                  </div>
                </div>

                {isTeacherOrAdmin && (
                  <div className="pt-4 border-t border-gray-200">
                    <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider block mb-2.5 px-2">Khu vực giáo viên</span>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className={`w-full text-left px-4 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'upload' ? 'bg-[#1e3a8a] text-white shadow-sm' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      Đăng tải tài liệu mới
                    </button>
                  </div>
                )}
              </nav>
            </div>

            {/* Back to Home */}
            <div className="p-4 border-t border-gray-200">
              <a href="/" className="w-full inline-flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-gray-900 font-bold transition-all text-center">
                Về Trang Chủ
              </a>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Top Toolbar */}
            <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-gray-400 font-medium">
                <span>Tài liệu</span>
                <span>/</span>
                <span className="text-gray-800 font-bold">
                  {activeTab === 'all' && 'Tất cả tài liệu'}
                  {activeTab.startsWith('grade-') ? `Lớp ${activeTab.split('-')[1]}` : ''}
                  {activeTab === 'upload' && 'Đăng tải tài liệu mới'}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-bold text-gray-700">Hi, {user.name || 'Học sinh'}</span>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Info banner */}
              <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] text-white p-8 shadow-sm border border-blue-900/10">
                <span className="bg-[#fbbf24]/20 text-[#fbbf24] text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-[#fbbf24]/30">
                  MTMath Library
                </span>
                <h1 className="text-2xl font-extrabold mt-3">Thư Viện Tài Liệu Học Tập & Chuyên Đề</h1>
                <p className="mt-1.5 text-blue-100 text-sm">Tổng hợp các file chuyên đề toán học nâng cao, tài liệu ôn thi THPT Quốc Gia chia sẻ trực tiếp từ giáo viên.</p>
              </div>

              {activeTab === 'upload' ? (
                /* UPLOAD NEW DOCUMENT INTERFACE */
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs max-w-xl mx-auto">
                  <h2 className="font-bold text-base text-gray-900 mb-4 pb-2 border-b">Đăng tải tài liệu mới lên thư viện</h2>
                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tiêu đề tài liệu</label>
                      <input
                        type="text"
                        value={uploadTitle}
                        onChange={e => setUploadTitle(e.target.value)}
                        placeholder="Ví dụ: Chuyên đề khảo sát hàm số 12 cực hay"
                        className="w-full bg-slate-50 border p-2.5 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mô tả chi tiết</label>
                      <textarea
                        value={uploadDescription}
                        onChange={e => setUploadDescription(e.target.value)}
                        placeholder="Mô tả nội dung tài liệu..."
                        rows={3}
                        className="w-full bg-slate-50 border p-2.5 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Khối lớp học</label>
                      <select
                        value={uploadGrade}
                        onChange={e => setUploadGrade(e.target.value as any)}
                        className="w-full bg-slate-50 border p-2.5 rounded-lg font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      >
                        <option value="10">Lớp 10</option>
                        <option value="11">Lớp 11</option>
                        <option value="12">Lớp 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chọn tệp tài liệu (PDF, Word, Ảnh...)</label>
                      <input
                        type="file"
                        onChange={e => setUploadFile(e.target.files ? e.target.files[0] : null)}
                        className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none text-sm"
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="w-full bg-[#1e3a8a] text-white hover:bg-[#fbbf24] hover:text-[#1e3a8a] py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        {isUploading ? 'Đang tải lên...' : 'Đăng tải tài liệu'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* DOCUMENTS LIST VIEW */
                <div>
                  <h2 className="text-base font-bold text-gray-900 mb-4">
                    Học liệu thư viện hiện tại ({filteredDocs.length})
                  </h2>
                  {filteredDocs.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl text-gray-400 font-semibold">
                      Chưa có tài liệu học tập nào trong mục này.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredDocs.map(doc => (
                        <div
                          key={doc._id}
                          onClick={() => setSelectedDoc(doc)}
                          className="bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all cursor-pointer relative group"
                        >
                          <div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-700">Lớp {doc.grade}</span>
                              {isTeacherOrAdmin && (
                                <button
                                  onClick={(e) => handleDelete(doc._id!, e)}
                                  className="text-red-500 hover:text-red-700 font-bold p-1 z-10 transition-all opacity-0 group-hover:opacity-100"
                                >
                                  Xóa
                                </button>
                              )}
                            </div>
                            <h3 className="font-extrabold text-base text-gray-900 mt-3 line-clamp-2">{doc.title}</h3>
                            <p className="text-gray-400 text-xs mt-1.5 line-clamp-2">
                              {doc.description || 'Không có mô tả chi tiết từ giáo viên.'}
                            </p>
                          </div>
                          
                          <div className="mt-5 border-t pt-4 flex items-center justify-between text-xs text-gray-400 font-medium">
                            <span>Ngày đăng: {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : 'Mới'}</span>
                            <span className="text-[#1e3a8a] font-bold group-hover:underline">Đọc tài liệu →</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}
