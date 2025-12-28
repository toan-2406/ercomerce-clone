"use client";

import Header from "@/components/organisms/header";
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import ProductReviews from '@/components/organisms/product-reviews'; // Import Reviews Component
import { useProduct } from '@/hooks/use-product';

import { Product } from '@/types';

export default function ProductDetail() {
    const { id } = useParams();
    // Ensure id is a string, even if useParams returns string | string[]
    const productId = Array.isArray(id) ? id[0] : id;
    const { data: product, isLoading: loading } = useProduct(productId || '');
    const [activeImage, setActiveImage] = useState(0);
    const { addToCart } = useCart();
    const router = useRouter();

    const handleAddToCart = () => {
        if (product) {
            addToCart({
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0] || '',
                quantity: 1
            });
        }
    };

    const handleBuyNow = () => {
        if (product) {
            addToCart({
                id: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0] || '',
                quantity: 1
            });
            router.push('/cart');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-grow flex items-center justify-center">
                <div className="animate-pulse text-red-600 font-bold">Đang tải thông tin sản phẩm...</div>
            </div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <div className="flex-grow flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm!</h1>
                <Link href="/" className="bg-[#D70018] text-white px-6 py-2 rounded-lg">Quay lại trang chủ</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container py-6">
                {/* Breadcrumbs */}
                <div className="text-xs text-gray-500 mb-4 flex gap-2">
                    <Link href="/">Trang chủ</Link> <span>/</span>
                    <Link href="/mobile">Điện thoại</Link> <span>/</span>
                    <span className="text-gray-800 font-medium">{product.name}</span>
                </div>

                {/* Product Info Section */}
                <div className="bg-white rounded-2xl shadow-sm p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Images Section */}
                    <div className="lg:col-span-5">
                        <div className="border rounded-xl p-4 mb-4 flex items-center justify-center min-h-[400px]">
                            <img
                                src={product.images[activeImage] || 'https://via.placeholder.com/400'}
                                alt={product.name}
                                className="max-w-full max-h-[350px] object-contain"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-16 h-16 border-2 rounded-lg overflow-hidden flex-shrink-0 bg-white ${idx === activeImage ? 'border-red-500 shadow-sm' : 'border-gray-200'}`}
                                >
                                    <img src={img} className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="lg:col-span-7">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2 uppercase">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-3xl font-bold text-red-600">
                                {product.price > 0 ? product.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}
                            </span>
                            {product.priceString && (
                                <span className="text-gray-400 line-through text-lg">{product.priceString}</span>
                            )}
                            <span className="bg-red-50 text-red-600 text-[10px] px-2 py-1 rounded border border-red-100 font-bold uppercase">
                                Trả góp 0%
                            </span>
                        </div>

                        {/* Promo Box */}
                        <div className="border border-red-200 rounded-xl overflow-hidden mb-8 shadow-sm">
                            <div className="bg-red-50 px-4 py-2 border-b border-red-100 flex items-center gap-2">
                                <span className="text-red-600">🎁</span>
                                <span className="font-bold text-red-700 text-sm uppercase">Khuyến mãi</span>
                            </div>
                            <div className="p-4 bg-white text-sm space-y-3">
                                <p className="flex items-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Thu cũ đổi mới: Trợ giá lên đến 2.000.000đ (Tùy model)</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Giảm thêm 500k khi thanh toán qua thẻ tín dụng VIB</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-green-500">✓</span>
                                    <span>Tặng bao da/ốp lưng chính hãng cho khách hàng đặt trước</span>
                                </p>
                            </div>
                        </div>

                        {/* Buy Action Buttons */}
                        <div className="grid grid-cols-5 gap-3">
                            <button
                                onClick={handleBuyNow}
                                className="col-span-4 bg-[#D70018] text-white py-3 rounded-xl font-bold text-lg shadow-md hover:bg-red-700 active:scale-95 transition-all"
                            >
                                MUA NGAY
                                <p className="text-[10px] font-normal uppercase opacity-80">(Giao nhanh từ 2 giờ hoặc nhận tại cửa hàng)</p>
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="col-span-1 border-2 border-red-600 text-red-600 rounded-xl flex flex-col items-center justify-center hover:bg-red-50 transition-colors"
                            >
                                <span className="text-2xl">🛒</span>
                                <span className="text-[8px] font-bold uppercase">Thêm giỏ</span>
                            </button>
                            <button className="col-span-2 bg-blue-600 text-white py-2 rounded-xl flex flex-col items-center justify-center hover:bg-blue-700 transition-colors">
                                <span className="font-bold">TRẢ GÓP 0%</span>
                                <span className="text-[10px]">Duyệt nhanh qua điện thoại</span>
                            </button>
                            <button className="col-span-3 bg-blue-600 text-white py-2 rounded-xl flex flex-col items-center justify-center hover:bg-blue-700 transition-colors">
                                <span className="font-bold">TRẢ GÓP QUA THẺ</span>
                                <span className="text-[10px]">(Visa, Mastercard, JCB)</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ProductReviews productId={product._id} />

                {/* Technical Specs Section */}
                <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm min-h-[200px]">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span className="text-blue-600 font-serif text-2xl">i</span>
                            Đặc điểm nổi bật
                        </h2>
                        <div className="prose prose-sm max-w-none text-gray-700">
                            <p className="mb-4">Thông tin sản phẩm đang được cập nhật...</p>
                            {/* Dynamically generated content could go here */}
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-white rounded-2xl p-6 shadow-sm h-fit">
                        <h2 className="text-xl font-bold mb-6">Thông số kỹ thuật</h2>
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-gray-100">
                                {product.specs.length > 0 ? product.specs.map((spec: { label: string; value: string }, idx: number) => (
                                    <tr key={idx}>
                                        <td className="py-2.5 font-medium text-gray-600 w-1/3 align-top">{spec.label}</td>
                                        <td className="py-2.5 text-gray-800 w-2/3">{spec.value}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={2} className="py-10 text-center text-gray-400 italic">Đang cập nhật thông số...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <button className="w-full mt-6 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50">
                            Xem cấu hình chi tiết ⌄
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}
