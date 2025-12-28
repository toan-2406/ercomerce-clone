"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import axiosClient from '@/lib/api/axios-client';
import { ROUTES } from '@/constants';

export default function LoginPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data: any = await axiosClient.post('/auth/login', { phoneNumber, password });
            login(data.access_token, data.user);
            router.push(ROUTES.HOME);
        } catch (err: any) {
            setError(err.message || 'Đăng nhập thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-[#D70018] p-8 text-center">
                    <Link href={ROUTES.HOME}>
                        <img
                            src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/Web/campaign/2025/530x95_Logo_Homepage_Noel_nonBG.gif"
                            className="h-10 mx-auto mb-4"
                            alt="Logo"
                        />
                    </Link>
                    <h1 className="text-white text-xl font-bold">Đăng nhập với Smember</h1>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại</label>
                        <input
                            type="text"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                            placeholder="Nhập số điện thoại của bạn"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link href="#" className="text-xs text-red-600 font-bold hover:underline">Quên mật khẩu?</Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D70018] text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-400"
                    >
                        {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                        <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng</span></div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="h-5" />
                            <span className="text-xs font-bold">Google</span>
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition-all">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Zalo_logo.svg/2048px-Zalo_logo.svg.png" className="h-5" />
                            <span className="text-xs font-bold">Zalo</span>
                        </button>
                    </div>

                    <p className="text-center text-sm text-gray-600">
                        Chưa có tài khoản? {' '}
                        <Link href={ROUTES.REGISTER} className="text-red-600 font-bold hover:underline">Đăng ký ngay</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
