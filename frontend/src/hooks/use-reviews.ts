import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/lib/api/review-service';
import { Review } from '@/types';

export const useProductReviews = (productId: string) => {
    return useQuery<Review[]>({
        queryKey: ['reviews', 'product', productId],
        queryFn: () => reviewService.getReviewsByProduct(productId),
        enabled: !!productId,
    });
};

export const useReviewStats = (productId: string) => {
    return useQuery<{ average: number, count: number }>({
        queryKey: ['reviews', 'stats', productId],
        queryFn: () => reviewService.getReviewStats(productId),
        enabled: !!productId,
    });
};

export const useCreateReview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (reviewData: Partial<Review>) => reviewService.createReview(reviewData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['reviews', 'product', variables.productId] });
            queryClient.invalidateQueries({ queryKey: ['reviews', 'stats', variables.productId] });
        }
    });
};
