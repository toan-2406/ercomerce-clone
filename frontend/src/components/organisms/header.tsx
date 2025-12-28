"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { ROUTES } from '@/constants';

export default function Header() {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const { user, logout } = useAuth();
    const { totalItems } = useCart();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <header className="bg-[#D70018] text-white py-1 sticky top-0 z-50 shadow-lg">
            <div className="container flex items-center justify-between gap-3 h-16">
                {/* Logo */}
                <Link href={ROUTES.HOME} className="flex-shrink-0">
                    <img
                        src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/Web/campaign/2025/530x95_Logo_Homepage_Noel_nonBG.gif"
                        alt="CellphoneS"
                        className="h-10 w-auto hover:scale-105 transition-transform"
                    />
                </Link>

                {/* Danh muc Button */}
                <button className="hidden lg:flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg hover:bg-white/30 transition-colors text-xs font-bold whitespace-nowrap">
                    <span className="text-xl">☰</span>
                    <p className="text-left leading-none uppercase">Danh mục</p>
                </button>

                {/* Search Bar - Premium Look */}
                <form onSubmit={handleSearch} className="flex-grow max-w-2xl relative group">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Bạn cần tìm gì?"
                        className="w-full py-2.5 pl-10 pr-4 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all shadow-inner"
                    />
                    <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg hover:text-gray-600">
                        🔍
                    </button>
                </form>

                {/* Actions */}
                <nav className="hidden xl:flex items-center gap-4 text-[10px] font-bold">
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors text-white no-underline">
                        <span className="text-2xl">📞</span>
                        <div className="leading-tight">
                            <p className="font-medium">Gọi mua hàng</p>
                            <p className="text-xs">1800.2097</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
                        <span className="text-2xl">📍</span>
                        <p className="leading-tight">Cửa hàng<br />gần bạn</p>
                    </div>
                    <Link href={ROUTES.CART} className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors relative no-underline text-white">
                        <span className="text-2xl">🛒</span>
                        <p className="leading-tight">Giỏ<br />hàng</p>
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow-sm">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="relative group">
                            <button className="bg-white/20 px-3 py-2 border border-white/30 rounded-lg flex items-center gap-2 transition-all hover:bg-white/30">
                                <span className="text-xl leading-none">👤</span>
                                <div className="text-left">
                                    <p className="text-[9px] uppercase leading-none opacity-80">{user?.rank || 'Smember'}</p>
                                    <p className="text-xs font-bold leading-none mt-0.5">{user?.fullName || user?.phoneNumber || 'Smember'}</p>
                                </div>
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 hidden group-hover:block z-50 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 bg-red-50">
                                    <p className="font-bold text-sm truncate">{user?.fullName}</p>
                                    <p className="text-[10px] text-gray-500">{user?.phoneNumber}</p>
                                    <div className="mt-2 text-[10px] font-bold text-red-600 flex justify-between">
                                        <span>Điểm: {user?.points || 0}</span>
                                        <span>Hạng: {user?.rank || 'Smember'}</span>
                                    </div>
                                </div>
                                <Link href={ROUTES.ACCOUNT} className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-100 flex items-center gap-2 no-underline text-gray-800 border-b border-gray-50">
                                    👤 Xem trang cá nhân
                                </Link>
                                <button onClick={logout} className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-gray-100 flex items-center gap-2">
                                    🚪 Thoát tài khoản
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link href={ROUTES.LOGIN} className="bg-[#E45464] px-4 py-2 border border-white/30 rounded-lg flex flex-col items-center justify-center gap-0 transition-all hover:bg-[#FE6271] hover:scale-105 no-underline text-white">
                            <span className="text-xl leading-none">👤</span>
                            <span className="text-[9px] uppercase">Đăng nhập</span>
                        </Link>
                    )}
                </nav>

                {/* Mobile Toggle */}
                <button className="xl:hidden text-2xl">☰</button>
            </div>
        </header>
    );
}
