'use client';

import React, { useState } from 'react';
import { CourseService, CourseData, Lesson } from '@/services/CourseService';

interface TeacherCoursesProps {
  courses: CourseData[];
  onRefresh: () => void;
}

const generateSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^a-z0-9\s-]+)/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export default function TeacherCourses({ courses, onRefresh }: TeacherCoursesProps) {
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  
  // Modals visibility
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);

  // Forms
  const [courseForm, setCourseForm] = useState<CourseData>({ title: '', slug: '', price: 0, grade: 12, overview: '', description: '' });
  const [sectionForm, setSectionForm] = useState({ sectionTitle: '' });
  const [lessonForm, setLessonForm] = useState({
    title: '', subtitle: '', slug: '', videoType: 'youtube' as 'youtube' | 'vimeo' | 'bunny', videoId: '', duration: '', isFree: false
  });

  const [secIndex, setSecIndex] = useState(-1);
  const [lesIndex, setLesIndex] = useState(-1);
  const [isEditingLesson, setIsEditingLesson] = useState(false);

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (courseForm._id) {
        const originalSlug = courses.find(c => c._id === courseForm._id)?.slug || courseForm.slug;
        await CourseService.updateCourse(originalSlug, courseForm);
        alert('Cập nhật khóa học thành công!');
      } else {
        await CourseService.createCourse(courseForm);
        alert('Tạo khóa học mới thành công!');
      }
      setIsCourseModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Lỗi lưu khóa học');
    }
  };

  const handleDeleteCourse = async (slug: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa khóa học này?')) return;
    try {
      await CourseService.deleteCourse(slug);
      alert('Đã xóa khóa học!');
      setSelectedCourse(null);
      onRefresh();
    } catch (err) {
      alert('Lỗi khi xóa khóa học.');
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      const updatedSections = [...(selectedCourse.sections || []), { sectionTitle: sectionForm.sectionTitle, lessons: [] }];
      const updatedCourse = { ...selectedCourse, sections: updatedSections };
      await CourseService.updateCourse(selectedCourse.slug, updatedCourse);
      setSelectedCourse(updatedCourse);
      setIsSectionModalOpen(false);
      setSectionForm({ sectionTitle: '' });
      onRefresh();
    } catch (err) {
      alert('Lỗi lưu chương.');
    }
  };

  const handleDeleteSection = async (idx: number) => {
    if (!selectedCourse || !confirm('Xóa chương học này?')) return;
    try {
      const updatedSections = (selectedCourse.sections || []).filter((_, i) => i !== idx);
      const updatedCourse = { ...selectedCourse, sections: updatedSections };
      await CourseService.updateCourse(selectedCourse.slug, updatedCourse);
      setSelectedCourse(updatedCourse);
      onRefresh();
    } catch (err) {
      alert('Lỗi xóa chương.');
    }
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || secIndex === -1) return;
    try {
      const updatedSections = [...(selectedCourse.sections || [])];
      const section = { ...updatedSections[secIndex] };
      const lessons = [...(section.lessons || [])];

      if (isEditingLesson && lesIndex !== -1) {
        lessons[lesIndex] = { ...lessonForm };
      } else {
        lessons.push({ ...lessonForm });
      }

      section.lessons = lessons;
      updatedSections[secIndex] = section;
      const updatedCourse = { ...selectedCourse, sections: updatedSections };

      await CourseService.updateCourse(selectedCourse.slug, updatedCourse);
      setSelectedCourse(updatedCourse);
      setIsLessonModalOpen(false);
      onRefresh();
    } catch (err) {
      alert('Lỗi lưu bài học.');
    }
  };

  const handleEditLesson = (sIdx: number, lIdx: number, lesson: Lesson) => {
    setSecIndex(sIdx);
    setLesIndex(lIdx);
    setLessonForm({
      title: lesson.title, subtitle: lesson.subtitle || '', slug: lesson.slug,
      videoType: lesson.videoType, videoId: lesson.videoId, duration: lesson.duration || '', isFree: !!lesson.isFree
    });
    setIsEditingLesson(true);
    setIsLessonModalOpen(true);
  };

  const handleDeleteLesson = async (sIdx: number, lIdx: number) => {
    if (!selectedCourse || !confirm('Xóa bài học này?')) return;
    try {
      const updatedSections = [...(selectedCourse.sections || [])];
      const section = { ...updatedSections[sIdx] };
      section.lessons = (section.lessons || []).filter((_, i) => i !== lIdx);
      updatedSections[sIdx] = section;
      const updatedCourse = { ...selectedCourse, sections: updatedSections };
      await CourseService.updateCourse(selectedCourse.slug, updatedCourse);
      setSelectedCourse(updatedCourse);
      onRefresh();
    } catch (err) {
      alert('Lỗi xóa bài học.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Side course list */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit text-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-[#1e3a8a] text-lg">Danh sách khóa học</h2>
          <button
            onClick={() => { setCourseForm({ title: '', slug: '', price: 0, grade: 12, overview: '', description: '' }); setIsCourseModalOpen(true); }}
            className="bg-[#1e3a8a] text-white hover:bg-[#fbbf24] hover:text-[#1e3a8a] transition-all text-xs font-bold py-1.5 px-3 rounded-full"
          >
            + Khóa mới
          </button>
        </div>
        {courses.length === 0 ? (
          <p className="text-gray-400 text-center py-6">Chưa có khóa học nào.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {courses.map((course) => (
              <div
                key={course._id}
                onClick={() => setSelectedCourse(course)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${selectedCourse?.slug === course.slug ? 'border-[#1e3a8a] bg-[#1e3a8a]/5 shadow-sm font-semibold' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
              >
                <div className="truncate pr-2">
                  <div className="text-gray-900 truncate">{course.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">/{course.slug}</div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); setCourseForm(course); setIsCourseModalOpen(true); }} className="p-1 text-gray-400 hover:text-blue-500">✏️</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(course.slug); }} className="p-1 text-gray-400 hover:text-red-500">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Chapters / Syllabus block */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-sm">
        {selectedCourse ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{selectedCourse.title}</h3>
                <p className="text-xs text-gray-400">Giá: <span className="text-green-700 font-semibold">{selectedCourse.price?.toLocaleString()}đ</span> | Slug: /{selectedCourse.slug}</p>
              </div>
              <button onClick={() => setIsSectionModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-1.5 px-3 rounded-full mt-2 sm:mt-0 transition-colors">
                + Thêm Chương Học
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {(!selectedCourse.sections || selectedCourse.sections.length === 0) ? (
                <p className="text-gray-400 text-center py-10">Chưa có chương học nào.</p>
              ) : (
                selectedCourse.sections.map((section, sIdx) => (
                  <div key={sIdx} className="border border-gray-100 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2.5 flex items-center justify-between border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#1e3a8a] text-white text-[10px] font-bold px-2 py-0.5 rounded">Chương {sIdx + 1}</span>
                        <span className="font-bold text-xs text-gray-800">{section.sectionTitle}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <button onClick={() => { setSecIndex(sIdx); setIsEditingLesson(false); setLessonForm({ title: '', subtitle: '', slug: '', videoType: 'youtube', videoId: '', duration: '', isFree: false }); setIsLessonModalOpen(true); }} className="text-blue-600 hover:underline">Thêm bài</button>
                        <button onClick={() => handleDeleteSection(sIdx)} className="text-red-500 hover:underline">Xóa chương</button>
                      </div>
                    </div>

                    <div className="p-1 bg-white">
                      {(!section.lessons || section.lessons.length === 0) ? (
                        <p className="text-gray-400 text-[11px] py-3 text-center">Chưa có bài học.</p>
                      ) : (
                        section.lessons.map((lesson, lIdx) => (
                          <div key={lIdx} className="flex items-center justify-between p-2 rounded-lg border border-gray-50 hover:bg-gray-50/50 transition-colors text-xs">
                            <div className="truncate pr-2">
                              <div className="font-semibold text-gray-800 flex items-center gap-1">
                                {lesson.isFree && <span className="bg-emerald-50 text-emerald-700 text-[9px] px-1 py-0.5 rounded font-bold">Miễn Phí</span>}
                                {lesson.title}
                              </div>
                              <div className="text-[10px] text-gray-400 mt-0.5">{lesson.videoType}: {lesson.videoId} ({lesson.duration || '00:00'})</div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => handleEditLesson(sIdx, lIdx, lesson)} className="text-blue-500 hover:underline">Sửa</button>
                              <button onClick={() => handleDeleteLesson(sIdx, lIdx)} className="text-red-500 hover:underline">Xóa</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400 text-xs">
            Chọn một khóa học từ thanh bên trái để xem nội dung chi tiết.
          </div>
        )}
      </div>

      {/* Modals details */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button onClick={() => setIsCourseModalOpen(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
            <h3 className="font-bold text-[#1e3a8a] mb-4 text-base">{courseForm._id ? 'Sửa thông tin khóa học' : 'Tạo khóa học mới'}</h3>
            <form onSubmit={handleSaveCourse} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-500 mb-1">Tên khóa học</label>
                <input 
                  type="text" 
                  value={courseForm.title} 
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setCourseForm({ 
                      ...courseForm, 
                      title: newTitle, 
                      slug: generateSlug(newTitle) 
                    });
                  }} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none" 
                  required 
                />
              </div>
              <div>
                <label className="block font-bold text-gray-400 mb-1">Slug URL (Tự động tạo)</label>
                <input 
                  type="text" 
                  value={courseForm.slug} 
                  disabled 
                  className="w-full bg-gray-100 border border-gray-200 text-gray-400 rounded-lg py-2 px-3 focus:outline-none cursor-not-allowed" 
                />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1">Giá Bán (VNĐ)</label>
                <input type="number" value={courseForm.price} onChange={(e) => setCourseForm({ ...courseForm, price: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none" required />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1">Khối Lớp</label>
                <select 
                  value={courseForm.grade || 12} 
                  onChange={(e) => setCourseForm({ ...courseForm, grade: Number(e.target.value) })} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
                >
                  <option value="10">Lớp 10</option>
                  <option value="11">Lớp 11</option>
                  <option value="12">Lớp 12</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1">Mô tả tóm tắt</label>
                <input type="text" value={courseForm.overview || ''} onChange={(e) => setCourseForm({ ...courseForm, overview: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1">Mô tả khóa học (Viết thẻ HTML)</label>
                <textarea 
                  value={courseForm.description || ''} 
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })} 
                  rows={4}
                  placeholder="<p>Nhập mô tả bằng thẻ HTML ở đây...</p>"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="submit" className="px-4 py-2 bg-[#1e3a8a] text-white rounded-full font-bold hover:bg-[#fbbf24] hover:text-[#1e3a8a] transition-all">Lưu khóa học</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSectionModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-xs p-6 relative">
            <button onClick={() => setIsSectionModalOpen(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
            <h3 className="font-bold text-[#1e3a8a] mb-4 text-base">Thêm chương học mới</h3>
            <form onSubmit={handleSaveSection} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-500 mb-1">Tên chương học</label>
                <input type="text" value={sectionForm.sectionTitle} onChange={(e) => setSectionForm({ sectionTitle: e.target.value })} placeholder="Ví dụ: Chương 1..." className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none" required />
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="submit" className="px-4 py-2 bg-[#1e3a8a] text-white rounded-full font-bold">Lưu chương</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLessonModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative">
            <button onClick={() => setIsLessonModalOpen(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
            <h3 className="font-bold text-[#1e3a8a] mb-4 text-base">{isEditingLesson ? 'Sửa bài học' : 'Thêm bài học'}</h3>
            <form onSubmit={handleSaveLesson} className="flex flex-col gap-3 text-xs">
              <div>
                <label className="block font-bold text-gray-500 mb-1">Tiêu đề bài</label>
                <input type="text" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none" required />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-1">Slug URL</label>
                <input type="text" value={lessonForm.slug} onChange={(e) => setLessonForm({ ...lessonForm, slug: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none" required />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Loại video</label>
                  <select value={lessonForm.videoType} onChange={(e: any) => setLessonForm({ ...lessonForm, videoType: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none">
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="bunny">Bunny Stream</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-500 mb-1">ID Video</label>
                  <input type="text" value={lessonForm.videoId} onChange={(e) => setLessonForm({ ...lessonForm, videoId: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 items-center">
                <div>
                  <label className="block font-bold text-gray-500 mb-1">Thời lượng</label>
                  <input type="text" value={lessonForm.duration} onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-3 focus:outline-none" />
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input type="checkbox" id="isFreeCheck" checked={lessonForm.isFree} onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })} />
                  <label htmlFor="isFreeCheck" className="font-bold text-gray-600 cursor-pointer">Miễn phí</label>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-4">
                <button type="submit" className="px-4 py-2 bg-[#1e3a8a] text-white rounded-full font-bold">Lưu bài học</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
