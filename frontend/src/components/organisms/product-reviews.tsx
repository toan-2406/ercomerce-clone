"use client";
import { useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useProductReviews, useReviewStats, useCreateReview } from '@/hooks/use-reviews';
import { ROUTES } from '@/constants';
import { Review } from '@/types';
import Link from 'next/link';
export default function ProductReviews({ productId }: { productId: string }) {
    const { user } = useAuth();
    const { data: reviews = [] } = useProductReviews(productId);
    const { data: stats = { average: 0, count: 0 } } = useReviewStats(productId);
    const createReview = useCreateReview();

    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        createReview.mutate({
            userId: user.id || user._id,
            userFullName: user.fullName || user.phoneNumber,
            productId,
            rating: newReview.rating,
            comment: newReview.comment
        }, {
            onSuccess: () => {
                setNewReview({ rating: 5, comment: '' });
                setShowForm(false);
            }
        });
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-6">
                <div>
                    <h2 className="text-xl font-bold mb-2">Đánh giá & Nhận xét {stats.count > 0 ? `(${stats.count})` : ''}</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-gray-800">{(stats?.average || 0).toFixed(1)}/5</div>
                        <div className="flex text-yellow-500 text-xl">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span key={star}>{star <= Math.round(stats?.average || 0) ? '★' : '☆'}</span>
                            ))}
                        </div>
                        <div className="text-sm text-gray-500">{stats?.count || 0} đánh giá</div>
                    </div>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="mt-4 md:mt-0 bg-[#D70018] text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition-all flex items-center gap-2"
                >
                    <span className="text-xl">✎</span> VIẾT ĐÁNH GIÁ
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-xl mb-8 animate-fade-in">
                    {!user ? (
                        <div className="text-center text-gray-500">
                            <p>Vui lòng <Link href={ROUTES.LOGIN} className="text-red-600 font-bold hover:underline">đăng nhập</Link> để viết đánh giá.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="font-bold mb-4">Gửi đánh giá của bạn</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Bạn cảm thấy thế nào về sản phẩm? (Chọn sao)</label>
                                <div className="flex gap-2 text-2xl text-gray-300 cursor-pointer">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span
                                            key={star}
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className={`transition-colors ${star <= newReview.rating ? 'text-yellow-400' : 'hover:text-yellow-200'}`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Nội dung đánh giá</label>
                                <textarea
                                    className="w-full border rounded-lg p-3 min-h-[100px] outline-none focus:ring-1 focus:ring-red-500"
                                    placeholder="Mời bạn chia sẻ cảm nhận về sản phẩm..."
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="bg-[#D70018] text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700">
                                GỬI ĐÁNH GIÁ
                            </button>
                        </>
                    )}
                </form>
            )}

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-center py-10">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                ) : (
                    reviews.map((review: Review) => (
                        <div key={review._id} className="border-b last:border-0 pb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 text-xs">
                                    {review?.userFullName?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <span className="font-bold text-gray-800">{review?.userFullName}</span>
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 font-bold">✓ Đã mua hàng</span>
                            </div>
                            <div className="flex text-yellow-400 text-sm mb-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star}>{star <= (review?.rating || 0) ? '★' : '☆'}</span>
                                ))}
                            </div>
                            <p className="text-gray-700 mb-2">{review?.comment}</p>
                            <p className="text-xs text-gray-400">{review?.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''} - {review?.createdAt ? new Date(review.createdAt).toLocaleTimeString('vi-VN') : ''}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
