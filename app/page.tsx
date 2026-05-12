// app/page.tsx
import Header from '../components/layout/Header.js'; // Giả sử em có Header
import HeroBanner from '../components/home/HeroBanner.js';
import CourseList from '../components/home/CourseList.js';
import NewsSection from '../components/home/NewSection.js';
import TeacherSlider from '../components/home/TeacherSlider.js';
import FeedbackSlider from '../components/home/FeedbackSlider.js';
import Footer from '../components/layout/Footer.js';
import FeatureSection from '../components/home/FeatureSection.js';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Ốp cái Hero Banner vào đây */}
      <HeroBanner />
      <CourseList />
      <FeatureSection />
      <TeacherSlider />
      <FeedbackSlider />
      <NewsSection />
      <Footer />

      {/* Sau này thêm danh sách khóa học, v.v. */}
    </main>
  );
}