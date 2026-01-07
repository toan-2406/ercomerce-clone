"use client";
import { useState, useEffect } from 'react';
import Header from '@/components/organisms/header';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';

import { ROUTES, ORDER_STATUS } from '@/constants';
import { useCreateOrder } from '@/hooks/use-orders';

export default function CheckoutPage() {
    const { user } = useAuth();
    const { items, totalPrice, clearCart } = useCart();
    const router = useRouter();
    const createOrder = useCreateOrder();

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        city: '',
        note: ''
    });

    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData(prev => ({
                ...prev,
                fullName: user.fullName || '',
                phoneNumber: user.phoneNumber || ''
            }));
        }
    }, [user]);

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pb-20">
                <Header />
                <div className="container py-20 text-center">
                    <h2 className="text-2xl font-bold mb-4">Giỏ hàng trống</h2>
                    <button onClick={() => router.push(ROUTES.HOME)} className="text-red-600 font-bold hover:underline">Quay lại mua sắm</button>
                </div>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userId = user?.id || user?._id;

        if (!user || !userId) {
            alert("Vui lòng đăng nhập để đặt hàng");
            router.push(ROUTES.LOGIN);
            return;
        }

        const orderData = {
            userId: userId as string,
            items: items.map(item => ({
                productId: item?.id || '',
                name: item?.name || '',
                price: item?.price || 0,
                quantity: item?.quantity || 1,
                image: item?.image || ''
            })),
            totalPrice: totalPrice,
            shippingAddress: {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                city: formData.city
            },
            paymentMethod: 'cod' as const,
            status: ORDER_STATUS.PENDING
        };

        createOrder.mutate(orderData, {
            onSuccess: () => {
                clearCart();
                router.push(ROUTES.ACCOUNT);
                alert("Đặt hàng thành công!");
            },
            onError: (error) => {
                console.error("Order error:", error);
                alert("Có lỗi xảy ra khi đặt hàng.");
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />
            <main className="container max-w-4xl py-8">
                <h1 className="text-xl font-bold mb-6 text-center uppercase">Thông tin đặt hàng</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Form Info */}
                    <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-sm h-fit">
                        <h3 className="font-bold mb-4 border-b pb-2">1. Thông tin người nhận</h3>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Họ và tên</label>
                                <input
                                    type="text" required
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-red-500 outline-none text-sm"
                                    placeholder="Nhập họ tên người nhận"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Số điện thoại</label>
                                <input
                                    type="text" required
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-red-500 outline-none text-sm"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Tỉnh/Thành phố</label>
                                <input
                                    type="text" required
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-red-500 outline-none text-sm"
                                    placeholder="Nhập Tỉnh/Thành phố"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Địa chỉ cụ thể</label>
                                <textarea
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-red-500 outline-none text-sm h-20"
                                    placeholder="Số nhà, tên đường, phường/xã..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Ghi chú (nếu có)</label>
                                <input
                                    type="text"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-1 focus:ring-red-500 outline-none text-sm"
                                    placeholder="Yêu cầu khác..."
                                />
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold mb-4 border-b pb-2">2. Danh sách sản phẩm</h3>
                            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-16 border rounded-lg p-1 flex-shrink-0">
                                            <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-xs font-bold line-clamp-2">{item.name}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <p className="text-red-600 font-bold text-sm">{item.price.toLocaleString('vi-VN')}₫</p>
                                                <p className="text-xs text-gray-500">x{item.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-4 pt-4">
                                <div className="flex justify-between font-bold text-gray-700 mb-2">
                                    <span>Tổng tiền:</span>
                                    <span className="text-red-600 text-lg">{totalPrice.toLocaleString('vi-VN')}₫</span>
                                </div>
                                <button
                                    type="submit"
                                    form="checkout-form"
                                    disabled={createOrder.isPending}
                                    className="w-full bg-[#D70018] text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
                                >
                                    {createOrder.isPending ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY'}
                                </button>
                                <p className="text-[10px] text-center text-gray-400 mt-2">Thanh toán khi nhận hàng (COD)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
