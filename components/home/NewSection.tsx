'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = [
  "Từ vựng và ngữ pháp",
  "Review đề thi",
  "Thông tin kì thi",
  "Lịch thi",
  "Listening",
  "Reading",
  "Writing",
  "Speaking",
  "Vinh danh học viên"
];


const newsData = [
  {
    id: 1,
    category: "Từ vựng và ngữ pháp",
    day: "T7",
    date: "19/07",
    title: "Đề thi minh họa VSTEP Reading 2025 kèm đáp án chi tiết (Đề số 5)",
    link: "/de-thi-5"
  },
  {
    id: 2,
    category: "Từ vựng và ngữ pháp",
    day: "T7",
    date: "19/07",
    title: "Đề thi minh họa VSTEP Reading 2025 kèm đáp án chi tiết (Đề số 7)",
    link: "/de-thi-7"
  },
  {
    id: 3,
    category: "Từ vựng và ngữ pháp",
    day: "T5",
    date: "17/07",
    title: "TỔNG HỢP 40 ĐỀ THI VSTEP SPEAKING PART 3 THƯỜNG GẶP (PART 4)",
    link: "/speaking-part-4"
  },
  {
    id: 4,
    category: "Từ vựng và ngữ pháp",
    day: "T5",
    date: "17/07",
    title: "TỔNG HỢP 40 ĐỀ THI VSTEP SPEAKING PART 3 THƯỜNG GẶP (PART 3)",
    link: "/speaking-part-3"
  },
  {
    id: 5,
    category: "Từ vựng và ngữ pháp",
    day: "T5",
    date: "17/07",
    title: "TỔNG HỢP 40 ĐỀ THI VSTEP SPEAKING PART 3 THƯỜNG GẶP (PART 2)",
    link: "/speaking-part-2"
  },
  {
    id: 6,
    category: "Từ vựng và ngữ pháp",
    day: "T5",
    date: "17/07",
    title: "TỔNG HỢP 40 ĐỀ THI VSTEP SPEAKING PART 3 THƯỜNG GẶP (PART 1)",
    link: "/speaking-part-1"
  }
];

export default function NewsSection() {
  const [activeTab, setActiveTab] = useState(categories[0]);

  const filteredNews = newsData.filter(news => news.category === activeTab);

  return (
    <section className="w-full py-16 px-4 bg-[#fafafa]">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-[#f15a24] mb-8 text-center">
          Thông Tin <span className="text-[#0072BC]">Mới Nhất</span>
        </h2>

        <div className="w-full max-w-5xl mb-12 bg-white rounded-full shadow-sm p-2 flex overflow-x-auto hide-scrollbar border border-gray-100">
          <div className="flex gap-2 min-w-max mx-auto">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(cat)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap
                  ${activeTab === cat 
                    ? 'bg-[#f15a24] text-white shadow-md' 
                    : 'text-gray-700 hover:text-[#f15a24] hover:bg-orange-50'
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
                <span className="text-3xl font-black text-[#f15a24]">{news.day}</span>
                <span className="text-gray-600 text-sm font-medium mt-1">{news.date}</span>
              </div>
              
              <div className="text-gray-800 font-semibold text-base leading-relaxed group-hover:text-[#0072BC] transition-colors line-clamp-3">
                {news.title}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}