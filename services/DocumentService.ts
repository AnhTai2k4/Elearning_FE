import axiosClient from '@/utils/axiosClient';

export interface DocumentData {
  _id?: string;
  title: string;
  description?: string;
  fileUrl?: string;
  grade: 10 | 11 | 12;
  createdBy: string;
  createdAt?: string;
}

export const DocumentService = {
  getAllDocuments: async () => {
    const response = await axiosClient.get('/document/all');
    return response.data;
  },

  getDocumentDetail: async (id: string) => {
    const response = await axiosClient.get(`/document/${id}`);
    return response.data;
  },

  createDocument: async (data: DocumentData) => {
    const response = await axiosClient.post('/document/create', data);
    return response.data;
  },

  updateDocument: async (id: string, data: Partial<DocumentData>) => {
    const response = await axiosClient.put(`/document/update/${id}`, data);
    return response.data;
  },

  deleteDocument: async (id: string) => {
    const response = await axiosClient.delete(`/document/delete/${id}`);
    return response.data;
  },

  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosClient.post('/document/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
