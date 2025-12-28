import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: {
    template: '%s | CellphoneS Clone',
    default: 'CellphoneS - Điện thoại, laptop, tablet, phụ kiện chính hãng',
  },
  description: "Hệ thống bán lẻ điện thoại, máy tính bảng, laptop, phụ kiện chính hãng giá tốt nhất. Hỗ trợ trả góp 0%, đổi mới trong 30 ngày.",
  openGraph: {
    title: 'CellphoneS Clone',
    description: 'Mua sắm điện thoại, laptop, phụ kiện giá tốt nhất.',
    url: 'https://cellphones.com.vn',
    siteName: 'CellphoneS Clone',
    images: [
      {
        url: 'https://cellphones.com.vn/media/logo/logo-cps-full.svg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import ReactQueryProvider from "@/providers/react-query-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-[#f4f4f4] text-[#444]`}>
        <ReactQueryProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
