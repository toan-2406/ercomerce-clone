"use client";

import Header from "@/components/organisms/header";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/lib/api/order-service";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/price";

export default function MyOrdersPage() {
    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['my-orders'],
        queryFn: () => orderService.getMyOrders(),
    });

    return (
        <div className="min-h-screen bg-[#f4f4f4]">
            <Header />
            <main className="container py-10 max-w-4xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-1.5 h-8 bg-[#D70018] rounded-full"></div>
                    <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight uppercase">Đơn hàng của tôi</h1>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse h-40"></div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
                        <div className="text-6xl mb-6">📦</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Bạn chưa có đơn hàng nào</h2>
                        <p className="text-gray-500 mb-8">Hãy khám phá các sản phẩm công nghệ tuyệt vời tại CellphoneS</p>
                        <Link
                            href="/"
                            className="bg-[#D70018] text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-100"
                        >
                            MUA SẮM NGAY
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <div key={order._id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 group hover:shadow-xl transition-all duration-300">
                                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100 uppercase tracking-tighter">
                                    <div className="flex gap-4 text-xs font-bold text-gray-500">
                                        <span>Mã Đơn: <span className="text-gray-900">#{order._id.slice(-8).toUpperCase()}</span></span>
                                        <span>Ngày đặt: <span className="text-gray-900">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span></span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {order.status === 'pending' ? 'Đang chờ' :
                                            order.status === 'confirmed' ? 'Đã xác nhận' :
                                                order.status === 'shipping' ? 'Đang giao' :
                                                    order.status === 'delivered' ? 'Đã giao' : 'Đã hủy'}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex gap-4 items-center">
                                                <div className="w-16 h-16 bg-white border border-gray-100 rounded-xl p-2 flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex-grow">
                                                    <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                                    <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                                                </div>
                                                <div className="text-sm font-bold text-red-600">
                                                    {formatPrice(item.price)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                                        <div className="text-xs text-gray-500">
                                            Hình thức: <span className="font-bold text-gray-700 uppercase">{order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản'}</span>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 mb-1">Tổng tiền thanh toán</p>
                                            <p className="text-xl font-extrabold text-red-600 leading-none">{formatPrice(order.totalPrice)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
