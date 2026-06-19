// app/page.tsx
import Header from '../components/layout/Header';
import HeroBanner from '../components/home/HeroBanner';
import CourseList from '../components/home/CourseList';
import NewsSection from '../components/home/NewSection';
import TeacherSlider from '../components/home/TeacherSlider';
import FeedbackSlider from '../components/home/FeedbackSlider';
import Footer from '../components/layout/Footer';
import BenefitsSection from '../components/home/BenefitsSection';
import ClassSection from '../components/home/ClassSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Ốp cái Hero Banner vào đây */}
      <HeroBanner />
      <CourseList />
      <TeacherSlider />
      <BenefitsSection/>
      <ClassSection />
      <FeedbackSlider />
      <Footer />

      {/* Sau này thêm danh sách khóa học, v.v. */}
    </main>
  );
}