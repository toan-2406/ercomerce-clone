"use client";
import React from 'react';
import Link from 'next/link';
import Header from '@/components/organisms/header';
import { useCart } from '@/context/cart-context';

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />
            <main className="container max-w-4xl py-8">
                <div className="flex items-center gap-2 mb-6 text-gray-600">
                    <Link href="/" className="hover:text-red-600 flex items-center gap-1">
                        <span className="text-xl">‹</span> Tiếp tục mua sắm
                    </Link>
                </div>

                <h1 className="text-2xl font-bold mb-6 flex items-center justify-between">
                    <span>Giỏ hàng của bạn</span>
                    <span className="text-sm font-normal text-gray-500">{totalItems} sản phẩm</span>
                </h1>

                {items.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <p className="text-gray-500 mb-6">Giỏ hàng của bạn đang trống</p>
                        <Link href="/" className="inline-block bg-[#D70018] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all">
                            QUAY LẠI TRANG CHỦ
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 relative group">
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="absolute top-2 right-2 text-gray-300 hover:text-red-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                    <div className="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden p-2">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-grow">
                                        <h3 className="font-bold text-sm line-clamp-2 pr-6 mb-2">{item.name}</h3>
                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="text-red-600 font-bold">
                                                {item.price.toLocaleString('vi-VN')}₫
                                            </div>
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 text-gray-600 font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 text-sm font-bold border-x border-gray-200 min-w-[40px] text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-3 py-1 hover:bg-gray-100 text-gray-600 font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
                                <h3 className="font-bold mb-4 border-b pb-4">Chi tiết thanh toán</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Tổng tiền sản phẩm</span>
                                        <span className="font-medium">{totalPrice.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Phí vận chuyển</span>
                                        <span className="text-green-600 font-medium">Miễn phí</span>
                                    </div>
                                    <div className="border-t pt-3 flex justify-between">
                                        <span className="font-bold">Cần thanh toán</span>
                                        <span className="text-red-600 font-bold text-lg">{totalPrice.toLocaleString('vi-VN')}₫</span>
                                    </div>
                                </div>

                                <Link href="/checkout" className="w-full bg-[#D70018] text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100 mb-4 animate-pulse block text-center">
                                    TIẾN HÀNH ĐẶT HÀNG
                                </Link>
                                <p className="text-[10px] text-center text-gray-400">
                                    Bằng cách nhấn đặt hàng, bạn đồng ý với Điều khoản của CellphoneS
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
