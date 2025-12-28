import { Review } from '@/types';
import axiosClient from './axios-client';

export const reviewService = {
    getReviewsByProduct: async (productId: string): Promise<Review[]> => {
        return axiosClient.get(`/reviews/product/${productId}`);
    },

    getReviewStats: async (productId: string): Promise<{ average: number, count: number }> => {
        return axiosClient.get(`/reviews/product/${productId}/stats`);
    },

    createReview: async (reviewData: Partial<Review>): Promise<Review> => {
        return axiosClient.post('/reviews', reviewData);
    }
};
