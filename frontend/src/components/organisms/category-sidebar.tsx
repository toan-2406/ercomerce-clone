import Link from 'next/link';

const categories = [
    { name: 'Điện thoại', icon: '📱', slug: 'mobile' },
    { name: 'Laptop', icon: '💻', slug: 'laptop' },
    { name: 'Máy tính bảng', icon: '🍎', slug: 'tablet' },
    { name: 'Apple', icon: '🍏', slug: 'apple' },
    { name: 'Âm thanh', icon: '🎧', slug: 'audio' },
    { name: 'Đồng hồ', icon: '⌚', slug: 'watch' },
    { name: 'Nhà thông minh', icon: '🏠', slug: 'smart-home' },
    { name: 'Phụ kiện', icon: '🔌', slug: 'accessories' },
    { name: 'PC - Màn hình', icon: '🖥️', slug: 'pc-monitor' },
    { name: 'Tivi', icon: '📺', slug: 'tv' },
    { name: 'Thu cũ đổi mới', icon: '🔄', slug: 'trade-in' },
    { name: 'Hàng cũ', icon: '🏷️', slug: 'used' },
    { name: 'Khuyến mãi', icon: '🔥', slug: 'promotions' },
    { name: 'Tin công nghệ', icon: '📰', slug: 'news' },
];

export default function CategorySidebar() {
    return (
        <aside className="bg-white rounded-xl shadow-md overflow-hidden hidden md:block w-full">
            <ul className="py-2">
                {categories.map((cat) => (
                    <li key={cat.slug} className="group">
                        <Link
                            href={`/category/${cat.slug}`}
                            className="flex items-center justify-between px-4 py-1.5 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-lg">{cat.icon}</span>
                                <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                            </div>
                            <span className="text-gray-400 text-xs hidden group-hover:block">▶</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
