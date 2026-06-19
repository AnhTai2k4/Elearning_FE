import axiosClient from "../utils/axiosClient";

export const CommentService = {
  createComment: async (lessonId: string, user: any, content: string, images: string[] = [], parentCommentId: string | null = null) => {
    const response = await axiosClient.post("/comment/create", {
      lessonId,
      user,
      content,
      images,
      parentCommentId
    });
    return response.data;
  },

  getCommentsByLesson: async (lessonId: string, page: number = 1, limit: number = 5) => {
    const response = await axiosClient.get(`/comment/get-by-lesson/${lessonId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  uploadImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    
    const response = await axiosClient.post("/comment/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  }
};
