import axiosClient from '@/utils/axiosClient';

export interface ExamData {
  _id?: string;
  title: string;
  description?: string;
  fileUrl?: string;
  duration: number;
  questionsCount: number;
  answers: Record<string, string>; // e.g. { "1": "A", "13_a": "Đúng", "17": "12" }
  type: 'exam' | 'homework';
  grade?: 10 | 11 | 12;
  createdBy: string;
}

export const ExamService = {
  getAllExams: async () => {
    const response = await axiosClient.get('/exam/all');
    return response.data;
  },

  getExamDetail: async (id: string) => {
    const response = await axiosClient.get(`/exam/${id}`);
    return response.data;
  },

  createExam: async (data: ExamData) => {
    const response = await axiosClient.post('/exam/create', data);
    return response.data;
  },

  updateExam: async (id: string, data: Partial<ExamData>) => {
    const response = await axiosClient.put(`/exam/update/${id}`, data);
    return response.data;
  },

  deleteExam: async (id: string) => {
    const response = await axiosClient.delete(`/exam/delete/${id}`);
    return response.data;
  },

  submitExam: async (data: {
    examId: string;
    studentId: string;
    studentAnswers: Record<string, string>;
  }) => {
    const response = await axiosClient.post('/exam/submit', data);
    return response.data;
  },

  startAttempt: async (data: { examId: string; studentId: string }) => {
    const response = await axiosClient.post('/exam/start-attempt', data);
    return response.data;
  },

  saveProgress: async (data: {
    examId: string;
    studentId: string;
    studentAnswers: Record<string, string>;
  }) => {
    const response = await axiosClient.post('/exam/save-progress', data);
    return response.data;
  },

  getSubmissions: async (examId: string) => {
    const response = await axiosClient.get(`/exam/submissions/${examId}`);
    return response.data;
  },

  getStudentSubmissions: async (studentId: string) => {
    const response = await axiosClient.get(`/exam/student-submissions/${studentId}`);
    return response.data;
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post('/exam/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
