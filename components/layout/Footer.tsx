import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1b2a38] text-gray-300 pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-8 mb-12">
          
          <div className="col-span-1 md:col-span-5 flex flex-col gap-6">
            <div className="relative w-[150px] h-[60px]">
              {/* Thay bằng đường dẫn logo thật của em */}
              <div className="text-4xl font-black text-white italic">
                <span className="text-[#f15a24]">V</span>STEP
              </div> 
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Image 
                src="https://onthisinhvien.appspot.com/resources/images/dathongbao.png" 
                alt="Đã thông báo Bộ Công Thương" 
                width={150} 
                height={57} 
                className="object-contain"
              />
             
            </div>

            <ul className="flex flex-col gap-4 mt-2">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-[#f15a24] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">Số 69, ngõ 40 Tạ Quang Bửu, Q.Hai Bà Trưng, TP. Hà Nội</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-[#f15a24] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:02473010929" className="hover:text-[#f15a24] transition-colors leading-relaxed">
                  02473 010 929 - 08 1900 8092
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h3 className="text-xl font-bold text-white mb-6">
              Tiện ích
              <div className="w-10 h-1 bg-[#f15a24] mt-2 rounded-full"></div>
            </h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/" className="hover:text-[#f15a24] hover:translate-x-1 transition-transform inline-block">Giới thiệu</Link></li>
              <li><Link href="/tat-ca-khoa-hoc" className="hover:text-[#f15a24] hover:translate-x-1 transition-transform inline-block">Khóa luyện</Link></li>
              <li><Link href="/tin-tuc" className="hover:text-[#f15a24] hover:translate-x-1 transition-transform inline-block">Tin tức</Link></li>
              <li><Link href="/lien-he" className="hover:text-[#f15a24] hover:translate-x-1 transition-transform inline-block">Liên hệ</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-4">
            <h3 className="text-xl font-bold text-white mb-6">
              Các chính sách
              <div className="w-10 h-1 bg-[#f15a24] mt-2 rounded-full"></div>
            </h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/chinh-sach-chung" className="hover:text-[#f15a24] hover:translate-x-1 transition-transform inline-block">Chính sách chung</Link></li>
              <li><Link href="/bao-mat" className="hover:text-[#f15a24] hover:translate-x-1 transition-transform inline-block">Chính sách bảo mật thông tin</Link></li>
              <li><Link href="/mua-hang" className="hover:text-[#f15a24] hover:translate-x-1 transition-transform inline-block">Hướng dẫn mua hàng</Link></li>
              <li><Link href="/kich-hoat" className="hover:text-[#f15a24] hover:translate-x-1 transition-transform inline-block">Hướng dẫn kích hoạt khóa học</Link></li>
              <li><Link href="/hoan-tra" className="hover:text-[#f15a24] hover:translate-x-1 transition-transform inline-block">Chính sách hoàn trả học phí</Link></li>
              <li><Link href="/vi-pham" className="hover:text-[#f15a24] hover:translate-x-1 transition-transform inline-block">Vi phạm chính sách</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-700/50 pt-6 text-center text-sm text-gray-400">
          <p className="mb-1 uppercase font-semibold text-gray-300">Công ty Cổ phần Đầu tư và Phát triển Koolsoft</p>
          <p>Mã số doanh nghiệp: 0106353044 do Sở Kế hoạch và Đầu tư Thành phố Hà Nội cấp lần đầu ngày 04/11/2013</p>
        </div>

      </div>
    </footer>
  );
}