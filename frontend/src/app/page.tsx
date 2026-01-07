"use client";

import Header from "@/components/organisms/header";
import CategorySidebar from "@/components/organisms/category-sidebar";
import MainSlider from "@/components/organisms/main-slider";
import Link from 'next/link';
import ProductCard from "@/components/molecules/product-card";
import { useQuery } from '@tanstack/react-query';
import axiosClient from "@/lib/api/axios-client";
import { Product } from "@/types";

export default function Home() {
  const { data: products = [], isLoading: loading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => axiosClient.get('/products')
  });

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <Header />

      <main className="container py-4">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 h-[400px]">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <CategorySidebar />
          </div>

          {/* Main Slider */}
          <div className="md:col-span-3 lg:col-span-3 h-full">
            <MainSlider />
          </div>

          {/* Right Ads */}
          <div className="hidden md:flex flex-col gap-3 md:col-span-1">
            <div className="bg-white rounded-xl flex-grow shadow-md overflow-hidden">
              <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/right-banner-ipad-mini-7.jpg" className="w-full h-full object-cover" alt="Ad" />
            </div>
            <div className="bg-white rounded-xl flex-grow shadow-md overflow-hidden">
              <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/macbook-m4-right-001.jpg" className="w-full h-full object-cover" alt="Ad" />
            </div>
            <div className="bg-white rounded-xl flex-grow shadow-md overflow-hidden">
              <img src="https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:10/plain/https://dashboard.cellphones.com.vn/storage/m-right-asus-vivobook-new.png" className="w-full h-full object-cover" alt="Ad" />
            </div>
          </div>
        </div>

        {/* Categories / Products Section */}
        <section className="mt-10">
          <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-t-xl border-b border-red-100 shadow-sm">
            <h2 className="text-xl font-bold uppercase text-red-600 flex items-center gap-2">
              <span className="text-2xl animate-bounce">🔥</span> Săn Sale Online
              <div className="ml-4 flex items-center gap-2 text-sm text-gray-500 font-normal normal-case">
                Kết thúc sau:
                <span className="bg-black text-white px-1.5 py-0.5 rounded font-mono">02</span>:
                <span className="bg-black text-white px-1.5 py-0.5 rounded font-mono">15</span>:
                <span className="bg-black text-white px-1.5 py-0.5 rounded font-mono">45</span>
              </div>
            </h2>
            <Link href="/deal" className="text-sm font-semibold hover:text-red-600">Xem tất cả</Link>
          </div>

          <div className="bg-white p-4 rounded-b-xl shadow-md min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-600 mb-4"></div>
                Đang tải sản phẩm siêu rẻ...
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products?.length > 0 ? products.map((product: Product) => (
                  <ProductCard key={product?._id} product={product} />
                )) : (
                  <div className="col-span-full text-center py-20 bg-gray-50 rounded-xl">
                    <p className="text-gray-400 italic mb-4">Chưa có sản phẩm nào được crawl.</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-[#D70018] text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
                    >
                      Thử lại ngay
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Hot Categories Grid */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6 text-gray-800 uppercase">Danh mục nổi bật</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-10 gap-3">
            {[
              { name: 'iPhone', icon: '📱' },
              { name: 'Samsung', icon: '📱' },
              { name: 'Xiaomi', icon: '📱' },
              { name: 'Oppo', icon: '📱' },
              { name: 'Laptop', icon: '💻' },
              { name: 'MacBook', icon: '🍎' },
              { name: 'iPad', icon: '🍎' },
              { name: 'Tai nghe', icon: '🎧' },
              { name: 'Loa', icon: '🔊' },
              { name: 'Đồng hồ', icon: '⌚' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center cursor-pointer">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-[11px] font-bold text-gray-600">{item.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-20 bg-white border-t border-gray-200 py-10">
        <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-4">Tổng đài hỗ trợ</h4>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>Gọi mua hàng: <strong>1800.2097</strong></li>
              <li>Khiếu nại: <strong>1800.2063</strong></li>
              <li>Bảo hành: <strong>1800.2064</strong></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Thông tin và chính sách</h4>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>Mua hàng và thanh toán Online</li>
              <li>Mua hàng trả góp Online</li>
              <li>Tra thông tin bảo hành</li>
              <li>Tra cứu hóa đơn điện tử</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Dịch vụ và thông tin khác</h4>
            <ul className="text-sm space-y-2 text-gray-600">
              <li>Khách hàng doanh nghiệp (B2B)</li>
              <li>Ưu đãi thanh toán</li>
              <li>Quy chế hoạt động</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Kết nối với CellphoneS</h4>
            <div className="flex gap-4">
              <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white">f</span>
              <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white">yt</span>
              <span className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">tk</span>
              <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white">ig</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
