import CourseList from "@/components/home/CourseList";
import Header from "@/components/layout/Header";
export default function CoursesPage() {
  return (
    <main className="min-h-screen bg-gray-50 ">
      <Header />

      <div className="max-w-6xl mx-auto">
        {/* Tái sử dụng lại component CourseList em đã tạo */}
        <CourseList />
      </div>
    </main>
  );
}
