import axios from 'axios';

// 1. TẠO TRẠM KIỂM SOÁT VỚI CẤU HÌNH MẶC ĐỊNH
const apiBase = process.env.BE_API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://eleaning-be.vercel.app/api';

const axiosClient = axios.create({
  baseURL: apiBase, 
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Tối đa chờ 10 giây, lâu quá thì báo lỗi mạng
});

// Các biến để xử lý hàng đợi khi đang làm mới token
let isRefreshing = false;
let failedQueue: Array<any> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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
    return response; 
  },
  async (error) => {
    const originalRequest = error.config;

    // Xử lý tự động làm mới Token nếu lỗi 401 (Hết hạn Token)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        // Nếu đang có một request khác đang xin token rồi thì cho request này vào hàng đợi
        return new Promise(function(resolve, reject) {
          failedQueue.push({resolve, reject})
        }).then(token => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          originalRequest.headers.token = 'Bearer ' + token;
          return axiosClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Dùng fetch thuần để xin lại token mới từ cookie (không qua axiosClient để tránh loop)
        const refreshResponse = await fetch(`${apiBase}/user/refreshToken`, {
          method: 'POST',
          credentials: 'include',
        });
        
        const refreshData = await refreshResponse.json();

        if (refreshResponse.ok && refreshData.data && refreshData.data.access_token) {
          const newAccessToken = refreshData.data.access_token;
          
          // Lưu token mới vào localStorage
          const userInfoStr = typeof window !== 'undefined' ? localStorage.getItem('user_info') : null;
          if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            userInfo.access_token = newAccessToken;
            localStorage.setItem('user_info', JSON.stringify(userInfo));
          }

          // Kích hoạt các request đang chờ
          processQueue(null, newAccessToken);
          
          // Gửi lại request vừa bị lỗi bằng token mới
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.token = `Bearer ${newAccessToken}`;
          
          return axiosClient(originalRequest);
        } else {
          // Token làm mới cũng tịt -> Đăng xuất thật
          processQueue(error, null);
          console.error("Phiên đăng nhập đã hết hạn toàn bộ!");
          return Promise.reject(error);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        console.error("Phiên đăng nhập đã hết hạn toàn bộ!");
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;