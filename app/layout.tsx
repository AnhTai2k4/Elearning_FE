
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; 
import './globals.css';
import StoreProvider from '@/components/providers/StoreProvider'; 
import AuthProvider from '@/components/providers/AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToánMath - Luyện Thi Toán Online',
  description: 'Nền tảng luyện thi Toán THPT, Đại học hàng đầu Việt Nam. Học Toán cùng giáo viên giỏi, lộ trình bài bản.',
};

const GOOGLE_CLIENT_ID = "648771989226-jqag928fbnml6tamn44ca6u0lvd86oap.apps.googleusercontent.com"
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {/* Bọc StoreProvider ngay bên trong body */}
        <StoreProvider>
          <AuthProvider>
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              {children}
            </GoogleOAuthProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}