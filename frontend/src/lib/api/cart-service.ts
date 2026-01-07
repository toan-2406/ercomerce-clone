import axiosClient from './axios-client';

export const cartService = {
    getCart: () => axiosClient.get('/cart'),
    addToCart: (productId: string, quantity: number) =>
        axiosClient.post('/cart/add', { productId, quantity }),
    updateQuantity: (productId: string, quantity: number) =>
        axiosClient.put('/cart/update', { productId, quantity }),
    removeItem: (productId: string) =>
        axiosClient.delete('/cart/remove', { data: { productId } }),
    clearCart: () => axiosClient.delete('/cart/clear'),
};
