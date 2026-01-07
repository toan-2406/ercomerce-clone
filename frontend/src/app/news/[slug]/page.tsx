"use client";

import Header from "@/components/organisms/header";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/api/axios-client";
import { useParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/molecules/product-card";

interface NewsPost {
    _id: string;
    title: string;
    content: string;
    thumbnail: string;
    author: string;
    createdAt: string;
    relatedProducts: any[];
}

export default function NewsDetailPage() {
    const { slug } = useParams();

    const { data: post, isLoading } = useQuery<NewsPost>({
        queryKey: ['news', slug],
        queryFn: () => axiosClient.get(`/news/${slug}`),
        enabled: !!slug,
    });

    if (isLoading) return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="container py-20 text-center animate-pulse text-red-600 font-bold text-xl px-4">
                Đang tải bài viết...
            </div>
        </div>
    );

    if (!post) return (
        <div className="min-h-screen bg-white">
            <Header />
            <div className="container py-20 text-center px-4">
                <h1 className="text-2xl font-bold mb-4">Không tìm thấy bài viết!</h1>
                <Link href="/news" className="text-red-600 font-bold underline">Quay lại danh sách tin tức</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Post Header */}
            <div className="bg-gray-50 py-12 mb-10">
                <div className="container max-w-4xl px-4">
                    <div className="flex gap-2 mb-4 text-xs font-bold text-red-600 uppercase tracking-widest">
                        <Link href="/news">S-Forum</Link>
                        <span>/</span>
                        <span>Tin công nghệ</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                        <span className="flex items-center gap-1.5"><span className="text-lg">👤</span> {post.author}</span>
                        <span className="flex items-center gap-1.5"><span className="text-lg">📅</span> {new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>
            </div>

            <main className="container max-w-4xl px-4 pb-20">
                <article className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-20 article-content">
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </article>

                {/* Related Products */}
                {post.relatedProducts?.length > 0 && (
                    <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-inner">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="bg-red-600 w-2 h-6 rounded-full"></span>
                            <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight">Sản phẩm liên quan</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {post.relatedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <style jsx global>{`
                .article-content p { margin-bottom: 1.5rem; }
                .article-content img { border-radius: 1.5rem; margin: 2rem 0; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                .article-content h2 { font-weight: 800; color: #111; margin-top: 3rem; margin-bottom: 1rem; }
            `}</style>
        </div>
    );
}
