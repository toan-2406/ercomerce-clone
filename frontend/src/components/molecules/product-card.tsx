"use client";
import Link from 'next/link';
import { Product } from '@/types';
import { ROUTES } from '@/constants';
import { formatPrice, calculateMemberPrice, getMemberDiscountText } from '@/lib/utils/price';
import { useAuth } from '@/context/auth-context';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { user } = useAuth();
    if (!product) return null;

    const rank = user?.rank || 'S-Member';
    const memberPrice = calculateMemberPrice(product.price, rank);
    const discountText = getMemberDiscountText(rank);

    return (
        <Link
            href={`/product/${product.slug || product._id}`}
            className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:border-red-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden h-full"
        >
            {/* Member Tag */}
            <div className="absolute top-0 left-0 bg-yellow-400 text-red-700 text-[10px] font-bold px-2 py-1 rounded-br-lg z-10 shadow-sm">
                Smember Giảm thêm {discountText}
            </div>

            <div>
                <div className="bg-white aspect-square rounded-lg mb-2 flex items-center justify-center overflow-hidden pt-4">
                    <img
                        src={product.images?.[0] || 'https://via.placeholder.com/200'}
                        alt={product.name || 'Product'}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                    />
                </div>
                <h3 className="text-sm font-semibold line-clamp-2 min-h-[40px] text-gray-800 group-hover:text-red-600">
                    {product.name}
                </h3>
            </div>

            <div className="mt-4">
                <div className="text-red-600 font-extrabold text-lg">
                    {product.price > 0 ? formatPrice(product.price) : 'Liên hệ'}
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-500">Giá Smember:</span>
                    <span className="text-xs font-bold text-gray-800">{formatPrice(memberPrice)}</span>
                </div>

                {product.priceString && (
                    <div className="text-xs text-gray-400 line-through mt-1">
                        {product.priceString}
                    </div>
                )}

                <div className="mt-3 flex items-center justify-between">
                    <div className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-200">
                        Trả góp 0%
                    </div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                        4.5 ⭐
                    </div>
                </div>
            </div>
        </Link>
    );
}
