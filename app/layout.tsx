
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; 
import './globals.css';
import StoreProvider from '@/components/providers/StoreProvider'; 
import AuthProvider from '@/components/providers/AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hệ thống ôn thi VSTEP - Trang chủ',
  description: 'Nền tảng học và thi thử VSTEP hàng đầu',
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