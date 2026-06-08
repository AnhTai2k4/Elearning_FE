'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import { useSelector } from 'react-redux';
import { DocumentService, DocumentData } from '@/services/DocumentService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- INLINE SVG ICONS ---
const DocIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const GradeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2.5 3 6 3s6-1 6-3v-5" />
  </svg>
);

const UploadIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const Home = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const Bell = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const ChevronRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function DocumentPage() {
  const user = useSelector((state: any) => state.user);
  const router = useRouter();

  const [documents, setDocuments] = useState<DocumentData[]>([]);
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

  const getInitial = (name: string) => {
    if (!name) return "H";
    const words = name.trim().split(" ");
    return words[words.length - 1].charAt(0).toUpperCase();
  };

  const studentName = user.name || "Học sinh";

  const tabLabels: Record<string, string> = {
    all: "Tất cả tài liệu",
    'grade-12': "Tài liệu Khối 12",
    'grade-11': "Tài liệu Khối 11",
    'grade-10': "Tài liệu Khối 10",
    upload: "Đăng tải tài liệu mới"
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800 text-sm">
      {/* Top Navigation Header */}
      <Header />

      {/* MAIN LIST & UPLOAD GRID */}
      <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 hidden md:flex">
            {/* User Info */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#7E96A0] text-white flex items-center justify-center font-bold text-sm">
                {getInitial(studentName)}
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm leading-tight">{studentName}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Thành viên</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-3 space-y-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-[#1e3a8a] text-white' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <DocIcon />
                Tất cả tài liệu
              </button>

              <div className="pt-2">
                <span className="text-[10px] text-gray-450 font-extrabold uppercase tracking-widest block mb-1 px-4">Khối lớp học</span>
                {[12, 11, 10].map(g => (
                  <button
                    key={g}
                    onClick={() => setActiveTab(`grade-${g}` as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-all ${activeTab === `grade-${g}` ? 'bg-[#1e3a8a] text-white' : 'text-gray-655 hover:bg-gray-50 hover:text-gray-900'}`}
                  >
                    <GradeIcon />
                    Tài liệu Lớp {g}
                  </button>
                ))}
              </div>

            </nav>

            {/* Back to Home */}
            <div className="border-t border-gray-200 p-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-bold text-gray-600 hover:text-[#1e3a8a] rounded-xl hover:bg-blue-50 transition-all"
              >
                <Home size={16} />
                Về Trang Chủ
              </Link>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Top Toolbar */}
            <header className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Tài liệu</span>
                <ChevronRight size={14} />
                <span className="text-gray-800 font-bold">{tabLabels[activeTab]}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 font-bold">Hi, {studentName}</span>
                <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell size={20} />
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-white"></span>
                </button>
                <div className="w-8 h-8 rounded-full bg-[#7E96A0] text-white flex items-center justify-center font-bold text-xs">
                  {getInitial(studentName)}
                </div>
              </div>
            </header>

            {/* Dashboard Content */}
            <div className="p-6 md:p-8 space-y-6">
              {/* DOCUMENTS LIST VIEW */}
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
                          onClick={() => router.push(`/tai-lieu/${doc._id}`)}
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
            </div>
          </main>
        </div>
    </div>
  );
}
