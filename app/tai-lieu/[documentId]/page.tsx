'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DocumentService, DocumentData } from '@/services/DocumentService';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId as string;

  const [selectedDoc, setSelectedDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await DocumentService.getDocumentDetail(documentId);
        if (res.status === 'OK') {
          setSelectedDoc(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch document:', error);
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchDocument();
    }
  }, [documentId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!selectedDoc) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-center text-white">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy tài liệu</h1>
        <p className="text-gray-400 mb-6">Tài liệu này có thể đã bị xóa hoặc không tồn tại.</p>
        <button 
          onClick={() => router.push('/tai-lieu')}
          className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-6 rounded-xl transition-all"
        >
          Quay lại thư viện
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col overflow-hidden text-sm">
      {/* Reader Topbar */}
      <div className="bg-slate-800 text-white px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-slate-700 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/tai-lieu')}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-xl transition-all"
          >
            Quay lại
          </button>
          <div>
            <h2 className="font-extrabold text-base truncate max-w-lg">{selectedDoc.title}</h2>
            <p className="text-xs text-gray-400">Lớp {selectedDoc.grade} • Học liệu MTMath</p>
          </div>
        </div>
        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider hidden sm:flex items-center gap-4">
          MTMath Document Viewer
          <a 
            href={selectedDoc.fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-[#1e3a8a] hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-lg transition-all flex items-center gap-2"
            download
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Tải xuống
          </a>
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
  );
}
