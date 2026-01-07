# CellphoneS Clone - Summary Project

## 🏗️ Kiến trúc Hệ thống (Solution Architecture)
Hệ thống được xây dựng theo mô hình Monorepo với công nghệ hiện đại:
- **Backend**: NestJS, Mongoose (MongoDB), Puppeteer (Scraper), Passport JWT.
- **Frontend**: Next.js 14 (App Router), TailwindCSS, TanStack Query, React Context.

## 🚀 Các tính năng đã hoàn thiện

### 1. 🛒 Hệ thống Giỏ hàng & Checkout (Cart & Order Management)
- **Cart Module**: Đồng bộ giỏ hàng linh hoạt giữa LocalStorage (Khách) và Database (Thành viên).
- **Order Module**: Quy trình đặt hàng (COD), quản lý trạng thái đơn hàng (Pending, Confirmed, Shipping, Delivered, Cancelled).
- **Trang Đơn hàng của tôi**: Cho phép người dùng theo dõi lịch sử mua hàng cá nhân.

### 2. 💎 Chương trình thành viên Smember (Loyalty Program)
- **Hạng thành viên**: Tự động tính toán chiết khấu dựa trên hạng (S-Member, SVIP).
- **Dynamic Pricing**: Tự động hiển thị giá Smember và nhãn ưu đãi trên toàn hệ thống.
- **UI/UX**: Tích hợp các block "Thu cũ đổi mới", "Khuyến mãi Smember" chuẩn style CellphoneS.

### 3. 📰 S-Forum (Tin tức & Tech Blog)
- **Module News**: Quản lý bài viết với nội dung phong phú và sản phẩm có liên quan.
- **SEO Optimized**: URL thân thiện (Slugs), typography cao cấp.

### 4. 🔍 Crawl dữ liệu & Tìm kiếm (Scraper & Search)
- **Scraper Service**: Tự động lấy dữ liệu Sản phẩm và Danh mục từ CellphoneS.
- **Deteil SEO**: Hỗ trợ tìm kiếm sản phẩm bằng cả ID và Slug.

## 🛠️ Trạng thái hiện tại (Current Progress)
- [x] Backend API core (Auth, Products, Categories, News, Cart, Orders).
- [x] Frontend UI/UX (Home, Detail, Category, Search, Cart, Checkout, News, My Orders).
- [x] Smember Loyalty Integration.
- [x] Fix lỗi đồng bộ giỏ hàng và định tuyến Slug.

## 📅 Kế hoạch tiếp theo
- [ ] Tích hợp thanh toán Online thực tế (Stripe/Momo).
- [ ] Xây dựng hệ thống Notification (Email/Push).
- [ ] Dashboard Admin hoàn chỉnh cho quản lý kho và báo cáo.
