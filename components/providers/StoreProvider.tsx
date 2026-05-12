'use client'; // Chỉ thị cực kỳ quan trọng, báo cho Next.js biết đây là Client Component

import { Provider } from 'react-redux';
import { store } from '../../store/store'; // Đường dẫn trỏ tới file store.ts em đã tạo ở bước trước
import React from 'react';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}