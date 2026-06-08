import axiosClient from '@/utils/axiosClient';

export interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  isAdmin: boolean;
  isTeacher: boolean;
  courseBuyed: string[];
  createdAt?: string;
  status?: string;
}

export const UserService = {
  getAllUsers: async () => {
    const response = await axiosClient.get('/user/getAllUser');
    return response.data;
  }
};
