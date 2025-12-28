import { Order } from '@/types';
import axiosClient from './axios-client';

export const orderService = {
    createOrder: async (orderData: Partial<Order>): Promise<Order> => {
        return axiosClient.post('/orders', orderData);
    },

    getOrdersByUser: async (userId: string): Promise<Order[]> => {
        return axiosClient.get(`/orders/user/${userId}`);
    },

    getAllOrders: async (): Promise<Order[]> => {
        return axiosClient.get('/orders');
    },

    updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
        return axiosClient.patch(`/orders/${orderId}/status`, { status });
    }
};
