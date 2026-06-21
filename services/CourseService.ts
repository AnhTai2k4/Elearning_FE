import axiosClient from '@/utils/axiosClient';

export interface Lesson {
  title: string;
  subtitle?: string;
  slug: string;
  videoType: 'youtube' | 'vimeo' | 'bunny';
  videoId: string;
  duration?: string;
  isFree?: boolean;
}

export interface Section {
  sectionTitle: string;
  lessons: Lesson[];
}

export interface CourseData {
  _id?: string;
  title: string;
  slug: string;
  price: number;
  grade?: number;
  overview?: string;
  description?: string;
  sections?: Section[];
}

export const CourseService = {
  getAllCourses: async () => {
    try {
      const response = await axiosClient.get('/course/get-all-courses');
      return response.data;
    } catch (error: any) {
      console.error("CourseService.getAllCourses Error:", error.response?.data || error.message);
      // Return empty array to prevent UI crash if API fails
      return [];
    }
  },

  createCourse: async (data: CourseData) => {
    const response = await axiosClient.post('/course/create-course', data);
    return response.data;
  },

  updateCourse: async (slug: string, data: CourseData) => {
    const response = await axiosClient.put(`/course/update-course/${slug}`, data);
    return response.data;
  },

  deleteCourse: async (slug: string) => {
    const response = await axiosClient.delete(`/course/delete-course/${slug}`);
    return response.data;
  }
};
