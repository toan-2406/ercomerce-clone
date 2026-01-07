# Tài liệu Kiến trúc Frontend (Frontend Architecture Documentation)

> **Dự án**: CellphoneS Clone  
> **Phiên bản**: 2.0  
> **Cập nhật lần cuối**: 29/12/2025

---

## 📑 Mục lục (Table of Contents)

1. [Giới thiệu chung](#1-giới-thiệu-chung)
2. [Cấu trúc Thư mục](#2-cấu-trúc-thư-mục-project-structure)
3. [Mẫu Thiết kế & Kỹ thuật Chủ đạo](#3-mẫu-thiết-kế--kỹ-thuật-chủ-đạo-core-patterns)
4. [Quy chuẩn Đặt tên](#4-quy-chuẩn-đặt-tên-naming-conventions)
5. [Lộ trình Mở rộng (Scaling Roadmap)](#5-lộ-trình-mở-rộng-team-scaling)
6. [Hệ thống Đảm bảo Chất lượng (Quality Assurance)](#6-hệ-thống-đảm-bảo-chất-lượng-qa-checks)

---

## 1. Giới thiệu chung

Tài liệu này quy định các chuẩn mực về kiến trúc, tổ chức mã nguồn và quy trình phát triển cho hệ thống Frontend. Mục tiêu nhằm đảm bảo tính nhất quán, khả năng bảo trì và khả năng mở rộng khi quy mô team phát triển lên tới 5+ thành viên.

## 2. Cấu trúc Thư mục (Project Structure)

Dự án sử dụng Next.js App Router với kiến trúc **Feature-based** kết hợp **Atomic Design**.

```text
src/
├── app/                  # App Router: Xử lý Routing, Layout, cấu hình page
│   ├── (auth)/           # Route Group: Authentication (Login, Register)
│   ├── (dashboard)/      # Route Group: Dashboard (Admin, Account)
│   └── ...
├── components/           # UI Library: Tuân thủ Atomic Design
│   ├── atoms/            # Tầng 1: Button, Input, Icon, Banner
│   ├── molecules/        # Tầng 2: ProductCard, SearchBar, FormField
│   ├── organisms/        # Tầng 3: Header, Footer, HeroSlider, ProductList
│   └── templates/        # Tầng 4: Page Layouts
├── config/               # Configuration: Environment vars (API_URL, Timeout)
├── constants/            # Constants: Routes, Regex, Order Status
├── context/              # Global State: AuthContext, CartContext
├── hooks/                # Logic Reuse: Custom Hooks (useOrders, useAuth)
├── lib/                  # Core Libraries: Axios Client, Utils
│   └── api/              # API Services layer
├── providers/            # Providers: React Query Provider, Theme Provider
└── types/                # TypeScript Definitions: Interfaces, Enums
```

## 3. Mẫu Thiết kế & Kỹ thuật Chủ đạo (Core Patterns)

### 3.1. Atomic Design System
Phân chia UI thành các tầng kế thừa để tối đa hóa tái sử dụng:
*   **Nguyên tắc**: `Atom` (nhỏ nhất, không logic) -> `Molecule` (kết hợp Atom, logic UI) -> `Organism` (khối chức năng hoàn chỉnh, logic nghiệp vụ).

### 3.2. Centralized API Client (Axios)
Sử dụng Singleton Design Pattern cho HTTP Client (`src/lib/api/axios-client.ts`):
*   **Interceptor Request**: Tự động inject `Bearer Token` từ Storage vào Header.
*   **Interceptor Response**:
    *   Trích xuất data (`response.data`) giúp service layer gọn gàng.
    *   Tự động logout khi gặp lỗi `401 Unauthorized`.
    *   Xử lý lỗi mạng/server tập trung.

### 3.3. State Management Strategy
*   **Server State**: Sử dụng **TanStack Query (React Query)** để caching, polling, và synchronization dữ liệu backend.
*   **Client State**: Sử dụng **React Context** cho các state toàn cục nhẹ (Auth, Cart UI).
*   **Local State**: `useState`, `useReducer` cho logic tại component cục bộ.

### 3.4. Defensive Programming
*   **Strict Null Checks**: Luôn kiểm tra sự tồn tại của dữ liệu (vd: `user?.id`) thay vì truy cập trực tiếp.
*   **Fallback UI**: Luôn có trạng thái `Loading` và `Error` cho mọi tác vụ async.
*   **Type Safety**: Không sử dụng `any`, định nghĩa Type/Interface rõ ràng cho mọi API Response và Props.

## 4. Quy chuẩn Đặt tên (Naming Conventions)

| Đối tượng | Quy tắc | Ví dụ |
| :--- | :--- | :--- |
| **File / Folder** | `kebab-case` | `user-profile.tsx`, `auth-provider.ts` |
| **Component** | `PascalCase` | `ProductCard`, `MainHeader` |
| **Function / Variable** | `camelCase` | `handleLogin`, `isFetching` |
| **Constant / Enum** | `UPPER_SNAKE_CASE` | `API_TIMEOUT`, `ORDER_STATUS` |
| **Interface / Type** | `PascalCase` | `User`, `ProductResponse` |

## 5. Lộ trình Mở rộng (Team Scaling)

Chiến lược phát triển dành cho team 5+ Devs, tập trung vào tính kỷ luật và bảo mật.

### ✅ Giai đoạn 1: Chuẩn hóa Code (Đã hoàn thành)
Thiết lập hàng rào kỹ thuật để ngăn chặn "bad code" lọt vào repo.

*   **TypeScript Strict Mode**: Kích hoạt `strict: true` cùng hàng loạt rules kiểm tra nghiêm ngặt trong `tsconfig.json`.
*   **Husky & Lint-staged**:
    *   `pre-commit`: Chạy ESLint + Prettier chỉ trên các file thay đổi (staged).
    *   `commit-msg`: Validate message theo chuẩn **Conventional Commits**.
*   **Conventional Commits**:
    *   `feat`: Tính năng mới
    *   `fix`: Sửa lỗi
    *   `refactor`: Tái cấu trúc (không đổi logic)
    *   `style`: Format, CSS
    *   `docs`: Tài liệu

### 🚀 Giai đoạn 2: Security & Performance (Q1/2026)
*   **Authentication**: Chuyển từ `localStorage` sang **HttpOnly Cookies** để bảo mật (chống XSS) và hỗ trợ SSR.
*   **Middleware**: Implement Next.js Middleware để filter request độc hại và phân quyền Role-based mạnh mẽ hơn.

### 🛡️ Giai đoạn 3: Quality Assurance (Q2/2026)
*   **Unit Test**: Viết test với Jest/Vitest cho các hàm logic nghiệp vụ quan trọng (tính giá, utils).
*   **E2E Test**: Sử dụng Playwright để test tự động các luồng người dùng chính (Checkout, Payment).
*   **Monitoring**: Tích hợp Sentry để bắt lỗi realtime trên Production.

## 6. Hệ thống Đảm bảo Chất lượng (QA Checks)

Mọi Pull Request (PR) cần phải vượt qua các checklist sau trước khi Merge:

1.  **Lint Check**: `npm run lint` (Không còn warning/error).
2.  **Type Check**: `npm run type-check` (Không lỗi TypeScript).
3.  **Format**: `npm run format` (Code style tươm tất).
4.  **Conventional Commits**: Message đúng chuẩn `feat:`, `fix:`, ...

---

> **Lưu ý cho Dev mới**:
> *   Chạy `npm install` ngay khi pull code về để cài đặt Husky hooks.
> *   Đọc kỹ file `package.json` để biết các script có sẵn.
