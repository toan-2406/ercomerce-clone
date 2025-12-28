import Link from 'next/link';
import { Product } from '@/types';
import { ROUTES } from '@/constants';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    if (!product) return null;

    return (
        <Link
            href={`${ROUTES.HOME}product/${product._id}`}
            className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:border-red-500 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden h-full"
        >
            {/* Member Tag */}
            <div className="absolute top-0 left-0 bg-yellow-400 text-red-700 text-[10px] font-bold px-2 py-1 rounded-br-lg z-10 shadow-sm">
                Smember Giảm thêm 1%
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
                    {product.price > 0 ? product.price.toLocaleString('vi-VN') + 'đ' : 'Liên hệ'}
                </div>
                {product.priceString && (
                    <div className="text-xs text-gray-400 line-through">
                        {product.priceString}
                    </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                    <div className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded border border-red-200">
                        Trả góp 0%
                    </div>
                </div>
            </div>
        </Link>
    );
}
