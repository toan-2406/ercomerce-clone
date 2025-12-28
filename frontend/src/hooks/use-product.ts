import { useQuery } from '@tanstack/react-query';
import { productService } from '@/lib/api/product-service';
import { Product } from '@/types';

export const useProduct = (id: string) => {
    return useQuery<Product>({
        queryKey: ['product', id],
        queryFn: () => productService.getProductById(id),
        enabled: !!id,
    });
};
