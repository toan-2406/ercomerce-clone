"use client";

import Header from "@/components/organisms/header";
import Link from 'next/link';
import { useParams } from 'next/navigation';
import axiosClient from "@/lib/api/axios-client";
import ProductCard from "@/components/molecules/product-card";
import { Product } from "@/types";
import { ROUTES } from "@/constants";
import { useQuery } from "@tanstack/react-query";

const categoryTitles: Record<string, string> = {
    'mobile': 'Điện thoại',
    'laptop': 'Laptop',
    'tablet': 'Máy tính bảng',
    'apple': 'Apple',
    'audio': 'Âm thanh',
    'watch': 'Đồng hồ',
    'smart-home': 'Nhà thông minh',
    'accessories': 'Phụ kiện',
    'pc-monitor': 'PC - Màn hình',
    'tv': 'Tivi',
};

export default function CategoryPage() {
    const { slug } = useParams();
    const categorySlug = slug as string;

    const { data: products = [], isLoading: loading } = useQuery<Product[]>({
        queryKey: ['products', 'category', categorySlug],
        queryFn: () => axiosClient.get(`/products/category/${categorySlug}`),
        enabled: !!categorySlug
    });

    const title = categoryTitles[categorySlug] || categorySlug;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container py-8">
                <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center border-b-2 border-red-600">
                    <h1 className="text-xl font-bold uppercase">{title}</h1>
                    <div className="flex gap-4 text-xs font-medium text-gray-500">
                        <span className="hover:text-red-600 cursor-pointer">Mới nhất</span>
                        <span className="hover:text-red-600 cursor-pointer">Giá thấp - cao</span>
                        <span className="hover:text-red-600 cursor-pointer">Giá cao - thấp</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600 mb-4"></div>
                        <p className="text-gray-400">Đang tìm kiếm sản phẩm cho bạn...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products?.length > 0 ? products.map(product => (
                            <ProductCard key={product?._id} product={product} />
                        )) : (
                            <div className="col-span-full bg-white p-20 rounded-xl text-center shadow-sm">
                                <p className="text-gray-400 italic mb-4">Chưa có sản phẩm nào trong danh mục này.</p>
                                <div className="flex gap-4 justify-center">
                                    <Link href={ROUTES.HOME} className="text-sm text-blue-500 font-bold">Về trang chủ</Link>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={() => window.location.reload()} className="text-sm text-red-500 font-bold underline">Thử lại</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
