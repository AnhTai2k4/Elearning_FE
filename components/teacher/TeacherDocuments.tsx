'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DocumentService, DocumentData } from '@/services/DocumentService';

// --- INLINE ICONS ---
const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default function TeacherDocuments() {
  const user = useSelector((state: any) => state.user);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [grade, setGrade] = useState<'10' | '11' | '12'>('12');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await DocumentService.getAllDocuments();
      if (res.status === 'OK') {
        setDocuments(res.data || []);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề tài liệu');
      return;
    }
    if (!file) {
      alert('Vui lòng chọn tệp tài liệu để tải lên');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload file to get fileUrl
      const fileRes = await DocumentService.uploadFile(file);
      if (fileRes.status !== 'OK' || !fileRes.fileUrl) {
        throw new Error(fileRes.message || 'Lỗi tải tệp lên máy chủ');
      }

      // 2. Create document record
      const docRes = await DocumentService.createDocument({
        title,
        description,
        fileUrl: fileRes.fileUrl,
        grade: Number(grade) as 10 | 11 | 12,
        createdBy: user.id || '65c2b8c56c2d1b827e8a93ef'
      });

      if (docRes.status === 'OK') {
        alert('Tải lên tài liệu thành công!');
        setTitle('');
        setDescription('');
        setFile(null);
        // Reset file input element if found
        const fileInput = document.getElementById('doc-file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
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

  const handleDelete = async (id: string) => {
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left side: Upload Form */}
        <div className="md:w-1/3 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <UploadIcon />
            </div>
            <h2 className="font-bold text-base text-gray-900">Đăng tài liệu mới</h2>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tiêu đề tài liệu</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ví dụ: Đề cương khảo sát hàm số 12"
                className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mô tả chi tiết</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Mô tả nội dung tài liệu..."
                rows={3}
                className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Khối lớp học</label>
              <select
                value={grade}
                onChange={e => setGrade(e.target.value as any)}
                className="w-full bg-slate-50 border p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-medium"
              >
                <option value="12">Lớp 12</option>
                <option value="11">Lớp 11</option>
                <option value="10">Lớp 10</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chọn tệp tài liệu (PDF)</label>
              <input
                id="doc-file-input"
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full bg-slate-50 border p-2 rounded-lg text-xs"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-[#1e3a8a] text-white hover:bg-[#fbbf24] hover:text-[#1e3a8a] py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs shadow-sm"
            >
              {isUploading ? 'Đang tải lên...' : 'Đăng tải tài liệu'}
            </button>
          </form>
        </div>

        {/* Right side: Documents List */}
        <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Tất cả tài liệu thư viện ({documents.length})
          </h2>

          {loading ? (
            <div className="py-12 text-center text-gray-400">Đang tải danh sách tài liệu...</div>
          ) : documents.length === 0 ? (
            <div className="py-12 text-center text-gray-400">Chưa có tài liệu nào được tải lên.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-500">
                <thead className="text-[10px] text-gray-700 uppercase bg-gray-55 font-bold border-b">
                  <tr>
                    <th scope="col" className="px-4 py-3">Tài liệu</th>
                    <th scope="col" className="px-4 py-3">Khối lớp</th>
                    <th scope="col" className="px-4 py-3">Ngày đăng</th>
                    <th scope="col" className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="bg-white hover:bg-gray-50/50">
                      <td className="px-4 py-3.5 font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-blue-50 rounded">
                            <FileIcon />
                          </div>
                          <div>
                            <div className="font-bold text-gray-800">{doc.title}</div>
                            <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{doc.description || 'Không có mô tả'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">
                          Lớp {doc.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : 'Mới'}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-bold"
                          >
                            Xem tệp
                          </a>
                          <span className="text-gray-200">|</span>
                          <button
                            onClick={() => handleDelete(doc._id!)}
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50"
                            title="Xóa tài liệu"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
