import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'onthivstep.vn',
        port: '',
        pathname: '/**',
      },
      // Thêm tên miền mới cho cái logo Bộ Công Thương vào đây
      {
        protocol: 'https',
        hostname: 'onthisinhvien.appspot.com',
        port: '',
        pathname: '/**',
      }, {
        protocol: 'http', // Chú ý link em đưa là http chứ không phải https
        hostname: 'googleusercontent.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;