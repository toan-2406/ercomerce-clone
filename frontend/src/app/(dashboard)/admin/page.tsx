"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/organisms/header';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { ROUTES, ORDER_STATUS } from '@/constants';
import { Order } from '@/types';
import { useAllOrders, useUpdateOrderStatus } from '@/hooks/use-orders';

export default function AdminPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { data: orders = [] } = useAllOrders();
    const updateStatus = useUpdateOrderStatus();
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push(ROUTES.LOGIN);
            }
        }
    }, [user, loading, router]);


    const handleStatusChange = (orderId: string, newStatus: string) => {
        updateStatus.mutate({ orderId, status: newStatus });
    };

    const filteredOrders = orders.filter((order: Order) =>
        order._id.toLowerCase().includes(search.toLowerCase()) ||
        order.shippingAddress.phoneNumber.includes(search)
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case ORDER_STATUS.PENDING: return 'bg-yellow-100 text-yellow-800';
            case ORDER_STATUS.CONFIRMED: return 'bg-blue-100 text-blue-800';
            case ORDER_STATUS.SHIPPING: return 'bg-purple-100 text-purple-800';
            case ORDER_STATUS.DELIVERED: return 'bg-green-100 text-green-800';
            case ORDER_STATUS.CANCELLED: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="container max-w-7xl py-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Quản trị đơn hàng</h1>
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-200">
                        <input
                            type="text"
                            placeholder="Tìm theo mã đơn hoặc SĐT..."
                            className="outline-none text-sm px-2 w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
                            <tr>
                                <th className="p-4 border-b">Mã đơn</th>
                                <th className="p-4 border-b">Khách hàng</th>
                                <th className="p-4 border-b">Sản phẩm</th>
                                <th className="p-4 border-b">Tổng tiền</th>
                                <th className="p-4 border-b">Trạng thái</th>
                                <th className="p-4 border-b">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredOrders.map((order: Order) => (
                                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono font-medium text-gray-500">#{order._id.slice(-6)}</td>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-800">{order.shippingAddress.fullName}</p>
                                        <p className="text-xs text-gray-500">{order.shippingAddress.phoneNumber}</p>
                                        <p className="text-xs text-gray-400 truncate w-40" title={order.shippingAddress.address}>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                    </td>
                                    <td className="p-4">
                                        <div className="space-y-1">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <span className="text-gray-400 text-xs">{item.quantity}x</span>
                                                    <span className="truncate w-40" title={item.name}>{item.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-red-600">{order.totalPrice.toLocaleString('vi-VN')}₫</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-red-500 cursor-pointer"
                                        >
                                            <option value={ORDER_STATUS.PENDING}>Chờ xác nhận</option>
                                            <option value={ORDER_STATUS.CONFIRMED}>Đã xác nhận</option>
                                            <option value={ORDER_STATUS.SHIPPING}>Đang giao</option>
                                            <option value={ORDER_STATUS.DELIVERED}>Đã giao</option>
                                            <option value={ORDER_STATUS.CANCELLED}>Đã hủy</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredOrders.length === 0 && (
                        <div className="p-10 text-center text-gray-500">Không tìm thấy đơn hàng nào.</div>
                    )}
                </div>
            </main>
        </div>
    );
}
