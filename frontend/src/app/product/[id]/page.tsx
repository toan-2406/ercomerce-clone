"use client";

import Header from "@/components/organisms/header";
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import ProductReviews from '@/components/organisms/product-reviews';
import { useProduct } from '@/hooks/use-product';
import { formatPrice, calculateMemberPrice, getMemberDiscountText } from '@/lib/utils/price';

export default function ProductDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const productId = Array.isArray(id) ? id[0] : id;
    const { data: product, isLoading: loading } = useProduct(productId || '');
    const [activeImage, setActiveImage] = useState(0);
    const { addToCart } = useCart();
    const router = useRouter();

    const rank = user?.rank || 'S-Member';
    const memberPrice = product ? calculateMemberPrice(product.price, rank) : 0;
    const discountText = getMemberDiscountText(rank);

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

                <div className="bg-white rounded-2xl shadow-sm p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
                    {/* Images Section */}
                    <div className="lg:col-span-5">
                        <div className="border rounded-xl p-4 mb-4 flex items-center justify-center min-h-[400px] bg-white">
                            <img
                                src={product.images[activeImage] || 'https://via.placeholder.com/400'}
                                alt={product.name}
                                className="max-w-full max-h-[350px] object-contain transition-all duration-300"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                            {product.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`w-16 h-16 border-2 rounded-lg overflow-hidden flex-shrink-0 bg-white hover:border-red-300 transition-colors ${idx === activeImage ? 'border-red-500' : 'border-gray-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-contain" alt={`${product.name} thumbnail ${idx + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="lg:col-span-7">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2 uppercase tracking-tight">{product.name}</h1>

                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="text-3xl font-extrabold text-red-600">
                                {product.price > 0 ? formatPrice(product.price) : 'Liên hệ'}
                            </span>
                            {product.priceString && (
                                <span className="text-gray-400 line-through text-lg">{product.priceString}</span>
                            )}
                            <div className="bg-yellow-400 text-red-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                Smember: {formatPrice(memberPrice)}
                            </div>
                        </div>

                        {/* Trade-in (Thu cũ đổi mới) */}
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 mb-6 border border-blue-200 flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-blue-800">Thu cũ Đổi mới</h4>
                                <p className="text-xs text-blue-600">Trợ giá lên đến 2.000.000đ</p>
                            </div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-blue-700">Định giá ngay</button>
                        </div>

                        {/* Promo Box */}
                        <div className="border border-red-200 rounded-xl overflow-hidden mb-8 shadow-sm">
                            <div className="bg-[#D70018] px-4 py-2 flex items-center gap-2">
                                <span className="text-white">🎁</span>
                                <span className="font-bold text-white text-sm uppercase">Khuyến mãi Smember</span>
                            </div>
                            <div className="p-4 bg-white text-sm space-y-3">
                                <p className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">✓</span>
                                    <span>Giảm thêm <b>{discountText}</b> (tối đa {formatPrice(product.price * 0.05)}) cho thành viên Smember</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">✓</span>
                                    <span>Miễn phí vận chuyển cho đơn hàng từ 300.000đ</span>
                                </p>
                                <p className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">✓</span>
                                    <span>Tặng gói bảo hành kim cương 12 tháng (Trị giá 500k)</span>
                                </p>
                            </div>
                        </div>

                        {/* Buy Action Buttons */}
                        <div className="grid grid-cols-5 gap-3">
                            <button
                                onClick={handleBuyNow}
                                className="col-span-4 bg-[#D70018] text-white py-3 rounded-xl font-bold text-lg shadow-xl shadow-red-100 hover:bg-red-700 active:scale-95 transition-all flex flex-col items-center justify-center"
                            >
                                MUA NGAY
                                <span className="text-[10px] font-normal opacity-90">(Giao nhanh từ 2 giờ hoặc nhận tại cửa hàng)</span>
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="col-span-1 border-2 border-[#D70018] text-[#D70018] rounded-xl flex flex-col items-center justify-center hover:bg-red-50 transition-colors group"
                            >
                                <span className="text-2xl group-hover:scale-125 transition-transform">🛒</span>
                                <span className="text-[8px] font-bold uppercase mt-1">Thêm giỏ</span>
                            </button>
                            <button className="col-span-2 bg-blue-500 text-white py-2 rounded-xl flex flex-col items-center justify-center hover:bg-blue-600 transition-colors">
                                <span className="font-bold">TRẢ GÓP 0%</span>
                                <span className="text-[10px]">Duyệt nhanh qua điện thoại</span>
                            </button>
                            <button className="col-span-3 bg-blue-500 text-white py-2 rounded-xl flex flex-col items-center justify-center hover:bg-blue-600 transition-colors">
                                <span className="font-bold uppercase">Trả góp qua thẻ</span>
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
                            <span className="bg-red-50 text-red-600 w-8 h-8 rounded-lg flex items-center justify-center">i</span>
                            Đặc điểm nổi bật
                        </h2>
                        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                            <p className="mb-4">Sản phẩm <b>{product.name}</b> là lựa chọn hàng đầu tại CellphoneS với chế độ bảo hành cực tốt và nhiều ưu đãi hấp dẫn.</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Thiết kế sang trọng, thời thượng phù hợp với mọi đối tượng khách hàng.</li>
                                <li>Hiệu năng mạnh mẽ vượt trội trong tầm giá.</li>
                                <li>Camera sắc nét, hỗ trợ nhiều chế độ chụp ảnh chuyên nghiệp.</li>
                                <li>Pin dung lượng lớn, hỗ trợ công nghệ sạc nhanh tiên tiến.</li>
                            </ul>
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
                                        <td colSpan={2} className="py-10 text-center text-gray-400 italic font-medium">Thông số đang được cập nhật...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <button className="w-full mt-6 py-2.5 border-2 border-gray-100 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
                            Xem cấu hình chi tiết ⌄
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}
