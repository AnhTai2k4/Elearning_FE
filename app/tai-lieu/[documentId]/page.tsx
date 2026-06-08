'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DocumentService, DocumentData } from '@/services/DocumentService';
import Link from 'next/link';

export default function DocumentDetailPage() {
  const { documentId } = useParams() as { documentId: string };
  const router = useRouter();
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocDetail = async () => {
      try {
        setLoading(true);
        const res = await DocumentService.getDocumentDetail(documentId);
        if (res.status === 'OK' && res.data) {
          setDoc(res.data);
        }
      } catch (err) {
        console.error('Error fetching document:', err);
      } finally {
        setLoading(false);
      }
    };

    if (documentId) {
      fetchDocDetail();
    }
  }, [documentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold">Đang tải tài liệu...</p>
        </div>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-xl font-bold mb-4">Không tìm thấy tài liệu</h2>
        <button
          onClick={() => router.push('/tai-lieu')}
          className="bg-[#1e3a8a] text-white hover:bg-[#fbbf24] hover:text-[#1e3a8a] font-bold py-2 px-6 rounded-full transition-all"
        >
          Quay lại thư viện
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-sm overflow-hidden">
      {/* Topbar */}
      <header className="bg-slate-800 text-white px-6 py-3.5 flex items-center justify-between shrink-0 border-b border-slate-700 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/tai-lieu')}
            className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-xl transition-all"
          >
            Quay lại
          </button>
          <div>
            <h2 className="font-extrabold text-base truncate max-w-lg">{doc.title}</h2>
            <p className="text-xs text-gray-400">Lớp {doc.grade} • Học liệu ToánMath</p>
          </div>
        </div>
        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider hidden sm:block">
          ToánMath Document Viewer
        </div>
      </header>

      {/* PDF View Container */}
      <div className="flex-1 relative bg-slate-950">
        {doc.fileUrl ? (
          <iframe
            src={`${doc.fileUrl}#toolbar=0&navpanes=0&view=FitH`}
            className="absolute inset-0 bg-white w-full h-full"
            style={{
              transformOrigin: 'top center',
              border: 'none',
              backgroundColor: 'white'
            }}
            title={doc.title}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Không tìm thấy liên kết tệp tài liệu.
          </div>
        )}
      </div>
    </div>
  );
}
