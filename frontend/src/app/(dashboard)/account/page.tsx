"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/organisms/header';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';
import { useUserOrders } from '@/hooks/use-orders';
import { ROUTES, ORDER_STATUS } from '@/constants';
import { Order } from '@/types';

export default function AccountPage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const { data: orders = [] } = useUserOrders(user?.id || user?._id || '');
    const [activeTab, setActiveTab] = useState('orders');

    useEffect(() => {
        if (!loading && !user) {
            router.push(ROUTES.LOGIN);
        }
    }, [user, loading, router]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
        </div>
    );

    if (!user) return null;

    const totalSpent = orders.reduce((sum: number, order: Order) => sum + (order?.totalPrice || 0), 0);

    const menuItems = [
        { icon: '📦', label: 'Đơn hàng đã mua', color: 'bg-blue-50 text-blue-600', action: () => setActiveTab('orders') },
        { icon: '🛡️', label: 'Tra cứu bảo hành', color: 'bg-green-50 text-green-600' },
        { icon: '🎁', label: 'Ưu đãi của bạn', color: 'bg-red-50 text-red-600' },
        { icon: '✨', label: 'Hạng thành viên', color: 'bg-yellow-50 text-yellow-600' },
        { icon: '📍', label: 'Sổ địa chỉ', color: 'bg-purple-50 text-purple-600' },
        { icon: '👤', label: 'Tài khoản của bạn', color: 'bg-gray-100 text-gray-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Header />
            <main className="container max-w-5xl py-8 px-4">
                {/* User Card */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden mb-8 border border-gray-100">
                    <div className="bg-[#D70018] h-32 relative">
                        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                            <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl">
                                👤
                            </div>
                            <div className="pb-2">
                                <h1 className="text-2xl font-bold text-gray-800">{user?.fullName || 'Thành viên mới'}</h1>
                                <p className="text-gray-500 font-medium">{user?.phoneNumber}</p>
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 px-8 pb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Hạng thành viên</p>
                            <p className="text-red-600 font-bold">{user?.rank || 'Smember'}</p>
                        </div>
                        <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Điểm tích lũy</p>
                            <p className="text-red-600 font-bold">{user?.points || 0}</p>
                        </div>
                        <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tổng chi tiêu</p>
                            <p className="text-red-600 font-bold">{totalSpent.toLocaleString('vi-VN')}₫</p>
                        </div>
                        <div className="text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Đơn hàng</p>
                            <p className="text-red-600 font-bold">{orders.length}</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {menuItems.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={item.action}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 hover:shadow-md hover:border-red-100 transition-all flex flex-col items-center gap-3 text-center group cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${item.color} group-hover:scale-110 transition-transform`}>
                                {item.icon}
                            </div>
                            <span className="font-bold text-sm text-gray-700">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Orders List Section */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <span>📦</span> Lịch sử đơn hàng
                        </h2>
                        {orders.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">
                                <p>Bạn chưa có đơn hàng nào.</p>
                                <Link href={ROUTES.HOME} className="text-red-600 font-bold hover:underline mt-2 inline-block">Mua sắm ngay</Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order: Order) => (
                                    <div key={order._id} className="border border-gray-100 rounded-xl overflow-hidden hover:border-red-200 transition-colors">
                                        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-100">
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase font-bold mr-2">Mã đơn: #{order._id.slice(-6)}</span>
                                                <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase ${order?.status === ORDER_STATUS.PENDING ? 'bg-yellow-100 text-yellow-700' :
                                                order?.status === ORDER_STATUS.DELIVERED ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order?.status === ORDER_STATUS.PENDING ? 'Chờ xác nhận' : order?.status}
                                            </span>
                                        </div>
                                        <div className="p-4">
                                            {order.items?.map((item, i) => (
                                                <div key={i} className="flex gap-4 mb-4 last:mb-0">
                                                    <div className="w-16 h-16 border rounded-lg p-1 flex-shrink-0">
                                                        <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                                                        <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-red-600">{(item?.price || 0).toLocaleString('vi-VN')}₫</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="bg-red-50 px-4 py-3 text-right flex justify-between items-center">
                                            <span className="text-xs text-gray-500">Thanh toán khi nhận hàng</span>
                                            <div>
                                                <span className="text-sm font-bold text-gray-700 mr-2">Tổng tiền:</span>
                                                <span className="text-lg font-bold text-red-600">{(order?.totalPrice || 0).toLocaleString('vi-VN')}₫</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-10 flex gap-4 justify-center">
                    <button
                        onClick={logout}
                        className="px-10 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                    >
                        ĐĂNG XUẤT
                    </button>
                    <Link href={ROUTES.HOME} className="px-10 py-3 bg-[#D70018] text-white rounded-xl font-bold hover:bg-red-700 transition-all">
                        VỀ TRANG CHỦ
                    </Link>
                </div>
            </main>
        </div>
    );
}
