"use client";
import { useState, useEffect } from 'react';

const banners = [
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/iphone-16-pro-max-km-moi-banner-home.jpg",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/samsung-s24-ultra-banner-moi-home.png",
    "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/banner-thu-cu-doi-moi-home.png"
];

export default function MainSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden group shadow-md bg-white">
            {banners.map((img, idx) => (
                <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-500 ${idx === current ? 'opacity-100' : 'opacity-0'}`}
                >
                    <img src={img} alt={`Banner ${idx}`} className="w-full h-full object-cover" />
                </div>
            ))}

            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {banners.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === current ? 'bg-[#D70018] w-6' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
}
