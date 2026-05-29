import axios from 'axios';

// 1. TẠO TRẠM KIỂM SOÁT VỚI CẤU HÌNH MẶC ĐỊNH
const axiosClient = axios.create({
  // Đảm bảo cổng 3001 này khớp với cổng Backend Node.js của em đang chạy
  baseURL: 'http://localhost:3001/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Tối đa chờ 10 giây, lâu quá thì báo lỗi mạng
});

// 2. REQUEST INTERCEPTOR: CAN THIỆP TRƯỚC KHI GỬI ĐI
axiosClient.interceptors.request.use(
  (config) => {
    // Mở ổ cứng (localStorage) ra tìm thông tin User
    const userInfoStr = typeof window !== 'undefined' ? localStorage.getItem('user_info') : null;
    
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        // Nếu có Token, tự động gắn vào Header để chứng minh thân phận với Backend
        if (userInfo.access_token) {
          config.headers.Authorization = `Bearer ${userInfo.access_token}`;
          config.headers.token = `Bearer ${userInfo.access_token}`;
        }
      } catch (error) {
        console.error('Lỗi khi đọc token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. RESPONSE INTERCEPTOR: CAN THIỆP SAU KHI NHẬN KẾT QUẢ VỀ
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu gọi API thành công, trả thẳng cục data ra ngoài cho component dùng luôn
    // Đỡ phải gõ response.data ở nhiều nơi
    return response; 
  },
  (error) => {
    // Xử lý lỗi chung ở đây
    if (error.response) {
      if (error.response.status === 401) {
        // Lỗi 401: Token hết hạn hoặc sai lệch -> Có thể tự động đá user ra ngoài
        console.error("Phiên đăng nhập đã hết hạn!");
        // typeof window !== 'undefined' && localStorage.removeItem('user_info');
        // window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;