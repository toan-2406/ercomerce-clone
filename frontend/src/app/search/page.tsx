"use client";

import Header from "@/components/organisms/header";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axiosClient from "@/lib/api/axios-client";
import ProductCard from "@/components/molecules/product-card";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';

    const { data: products = [], isLoading: loading } = useQuery<Product[]>({
        queryKey: ['products', 'search', query],
        queryFn: () => axiosClient.get(`/products/search?q=${query}`),
        enabled: !!query
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container py-8">
                <h1 className="text-xl font-bold mb-6">
                    Kết quả tìm kiếm cho: <span className="text-red-600">&quot;{query}&quot;</span>
                    {loading ? '' : ` (${products?.length || 0} sản phẩm)`}
                </h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-red-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {products?.length > 0 ? products.map(product => (
                            <ProductCard key={product?._id} product={product} />
                        )) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-400 italic">Không tìm thấy sản phẩm nào khớp với từ khóa của bạn.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Đang tải trang tìm kiếm...</div>}>
            <SearchContent />
        </Suspense>
    );
}
