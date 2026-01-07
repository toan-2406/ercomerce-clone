"use client";
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import axiosClient from '@/lib/api/axios-client';
import { ROUTES } from '@/constants';
import { User } from '@/types';

export default function RegisterPage() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setLoading(true);

        try {
            const user = await axiosClient.post<User>('/auth/register', { phoneNumber, password, fullName }) as unknown as User;
            login(user);
            router.push(ROUTES.HOME);
        } catch (err: unknown) {
            const errorObj = err as { message?: string };
            setError(errorObj.message || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden">
                <div className="bg-[#D70018] p-8 text-center text-white">
                    <Link href={ROUTES.HOME}>
                        <img
                            src="https://cdn2.cellphones.com.vn/x/media/wysiwyg/Web/campaign/2025/530x95_Logo_Homepage_Noel_nonBG.gif"
                            className="h-10 mx-auto mb-4"
                            alt="Logo"
                        />
                    </Link>
                    <h1 className="text-xl font-bold">Tham gia Smember ngay</h1>
                    <p className="text-xs opacity-80 mt-1">Nhiều ưu đãi đặc quyền đang chờ bạn</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Họ và tên</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                            placeholder="Nhập họ và tên"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Số điện thoại</label>
                        <input
                            type="text"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                            placeholder="Nhập số điện thoại"
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
                            placeholder="Tối thiểu 6 ký tự"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nhập lại mật khẩu</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 transition-all outline-none"
                            placeholder="Xác nhận mật khẩu"
                        />
                    </div>

                    <div className="text-[10px] text-gray-500 leading-tight">
                        Bằng cách đăng ký, bạn đồng ý với <Link href="#" className="text-blue-500 underline">Điều khoản & Chính sách</Link> của Smember.
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#D70018] text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-400 mt-4"
                    >
                        {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ NGAY'}
                    </button>

                    <p className="text-center text-sm text-gray-600 pt-2">
                        Đã có tài khoản? {' '}
                        <Link href={ROUTES.LOGIN} className="text-red-600 font-bold hover:underline">Đăng nhập</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
