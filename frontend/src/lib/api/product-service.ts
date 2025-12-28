import { Product } from '@/types';
import axiosClient from './axios-client';

export const productService = {
    getAllProducts: async (): Promise<Product[]> => {
        return axiosClient.get('/products');
    },

    getProductById: async (id: string): Promise<Product> => {
        return axiosClient.get(`/products/${id}`);
    },

    searchProducts: async (query: string): Promise<Product[]> => {
        return axiosClient.get('/products/search', {
            params: { q: query }
        });
    }
};
