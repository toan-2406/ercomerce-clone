import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/lib/api/order-service';
import { Order } from '@/types';

export const useUserOrders = (userId: string) => {
    return useQuery<Order[]>({
        queryKey: ['orders', 'user', userId],
        queryFn: () => orderService.getOrdersByUser(userId),
        enabled: !!userId,
    });
};

export const useAllOrders = () => {
    return useQuery<Order[]>({
        queryKey: ['orders', 'all'],
        queryFn: orderService.getAllOrders,
    });
};

export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderData: Partial<Order>) => orderService.createOrder(orderData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['orders', 'user', variables.userId] });
        },
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
            orderService.updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        }
    })
}
