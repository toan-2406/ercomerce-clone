"use client";

import Header from "@/components/organisms/header";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/api/axios-client";
import Link from "next/link";

interface NewsPost {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    thumbnail: string;
    author: string;
    createdAt: string;
}

export default function NewsPage() {
    const { data: news = [], isLoading } = useQuery<NewsPost[]>({
        queryKey: ['news'],
        queryFn: () => axiosClient.get('/news'),
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container py-8 max-w-6xl">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                    <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">S-Forum Tin Công Nghệ</h1>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl p-4 shadow-sm animate-pulse h-[400px]"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item) => (
                            <Link
                                key={item._id}
                                href={`/news/${item.slug}`}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group border border-gray-100"
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Tin tức</span>
                                        <span className="text-[10px] text-gray-400 font-medium">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-800 line-clamp-2 mb-3 group-hover:text-red-600 transition-colors">
                                        {item.title}
                                    </h2>
                                    <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed">
                                        {item.summary}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                        <span className="text-xs font-bold text-gray-700">✍️ {item.author}</span>
                                        <span className="text-red-600 text-xs font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Xem chi tiết <span>→</span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
