'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = [
  "Đại số",
  "Hình học",
  "Giải tích",
  "Tổ hợp - Xác suất",
  "Đề thi & Đáp án",
  "Mẹo giải nhanh",
  "Tin tức thi cử",
  "Vinh danh học viên"
];


const newsData = [
  {
    id: 1,
    category: "Đại số",
    day: "T7",
    date: "10/05",
    title: "Tổng hợp 30 dạng bài Phương trình - Bất phương trình thường gặp trong đề thi",
    link: "/dai-so-pt-bpt"
  },
  {
    id: 2,
    category: "Đại số",
    day: "T6",
    date: "09/05",
    title: "Phương pháp giải nhanh bài toán Logarit - Mũ trong đề THPT Quốc gia",
    link: "/logarit-mu"
  },
  {
    id: 3,
    category: "Đại số",
    day: "T5",
    date: "08/05",
    title: "Chuyên đề Số phức: Từ cơ bản đến nâng cao, bài tập có lời giải chi tiết",
    link: "/so-phuc"
  },
  {
    id: 4,
    category: "Hình học",
    day: "T5",
    date: "08/05",
    title: "Tổng hợp các dạng bài Hình học không gian Oxyz thường gặp trong đề thi",
    link: "/hinh-hoc-oxyz"
  },
  {
    id: 5,
    category: "Giải tích",
    day: "T4",
    date: "07/05",
    title: "Phương pháp tính Nguyên hàm - Tích phân: 10 dạng bài quan trọng nhất",
    link: "/tich-phan"
  },
  {
    id: 6,
    category: "Đề thi & Đáp án",
    day: "T3",
    date: "06/05",
    title: "Đề thi thử THPT Quốc gia 2026 môn Toán - Sở GD&ĐT Hà Nội (có đáp án)",
    link: "/de-thi-thu-hn-2026"
  }
];

export default function NewsSection() {
  const [activeTab, setActiveTab] = useState(categories[0]);

  const filteredNews = newsData.filter(news => news.category === activeTab);

  return (
    <section className="w-full py-16 px-4 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#fbbf24] mb-8 text-center">
          Tài Liệu & <span className="text-[#1e3a8a]">Tin Tức Mới Nhất</span>
        </h2>

        <div className="w-full max-w-5xl mb-12 bg-white rounded-full shadow-sm p-2 flex overflow-x-auto hide-scrollbar border border-gray-100">
          <div className="flex gap-2 min-w-max mx-auto">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap
                  ${activeTab === cat 
                    ? 'bg-[#fbbf24] text-white shadow-md' 
                    : 'text-gray-700 hover:text-[#fbbf24] hover:bg-yellow-50'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((news) => (
            <Link 
              href={news.link} 
              key={news.id}
              className="group bg-white rounded-2xl p-6 flex items-center gap-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col items-center justify-center min-w-[70px] border-r border-gray-200 pr-6">
                <span className="text-3xl font-black text-[#fbbf24]">{news.day}</span>
                <span className="text-gray-600 text-sm font-medium mt-1">{news.date}</span>
              </div>
              
              <div className="text-gray-800 font-semibold text-base leading-relaxed group-hover:text-[#3b82f6] transition-colors line-clamp-3">
                {news.title}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}