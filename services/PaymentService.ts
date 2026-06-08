import axiosClient from '@/utils/axiosClient';

export interface BackendTransaction {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  } | null;
  course: {
    _id: string;
    title: string;
    price: number;
    grade?: number;
  } | null;
  amount: number;
  method: string;
  status: 'Thành công' | 'Chờ xử lý' | 'Thất bại';
  orderId?: string;
  createdAt: string;
}

export const PaymentService = {
  getAllTransactions: async () => {
    const response = await axiosClient.get('/payment/all-transactions');
    return response.data;
  }
};
