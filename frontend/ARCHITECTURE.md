# Tài liệu Kiến trúc Frontend - CellphoneS Clone

Tài liệu này giải thích các cấu trúc, mẫu thiết kế (patterns) và kỹ thuật được sử dụng trong việc tái cấu trúc hệ thống Frontend của dự án.

---

## 1. Cấu trúc Thư mục (Project Structure)

Dự án tuân thủ cấu trúc thư mục hiện đại của Next.js kết hợp với các nguyên tắc quản lý mã nguồn sạch.

```text
src/
├── app/             # Next.js App Router (Pages, Layouts, Route Groups)
├── components/      # UI Components (Atomic Design)
│   ├── atoms/       # Các thành phần nhỏ nhất (Button, Input, Icon)
│   ├── molecules/   # Kết hợp từ các atoms (ProductCard, SearchBar)
│   ├── organisms/   # Các khối chức năng phức tạp (Header, Footer, Sidebar)
│   └── templates/   # Layout cục bộ cho các trang
├── config/          # Cấu hình hệ thống (Environment variables)
├── constants/       # Hằng số hệ thống (Routes, Storage Keys, Order Status)
├── context/         # React Context (Auth, Cart)
├── hooks/           # Custom React Hooks (TanStack Query hooks)
├── lib/             # Thư viện dùng chung (API Axios client)
│   └── api/         # Các service gọi API
├── providers/       # Các Provider bọc ngoài ứng dụng (React Query, Auth)
└── types/           # Định nghĩa TypeScript (Interfaces, Types)
```

---

## 2. Các Mẫu Thiết kế & Kỹ thuật Chủ đạo

### 2.1. Atomic Design
Chúng ta chia nhỏ UI thành các cấp độ để tăng khả năng tái sử dụng và bảo trì:
- **Atoms**: Đảm bảo tính nhất quán của thiết kế từ những phần nhỏ nhất.
- **Molecules/Organisms**: Giúp xây dựng giao diện phức tạp từ các module đã có.

### 2.2. API Layer với Axios Interceptors
Thay vì dùng `fetch` rời rạc, chúng ta sử dụng một `axios-client` tập trung:
- **Request Interceptor**: Tự động đính kèm JWT Token từ `localStorage` vào mọi yêu cầu.
- **Response Interceptor**: 
    - Xử lý lỗi tập trung (401, 403, 500).
    - **Auto-logout**: Tự động đăng xuất và xóa dữ liệu khi token hết hạn (lỗi 401).
    - Trích xuất dữ liệu (`response.data`) giúp code ở tầng service gọn hơn.

### 2.3. Quản lý Trạng thái (State Management)
- **TanStack Query (React Query)**: Dùng để quản lý "Server State" (dữ liệu từ API). Hỗ trợ caching, loading state, và tự động fetch lại dữ liệu.
- **React Context**: Dùng cho "Global UI State" đơn giản như thông tin đăng nhập (`AuthContext`) và giỏ hàng (`CartContext`).
- **Zustand (Tùy chọn)**: Có thể dùng cho các logic phức tạp hơn nếu cần.

### 2.4. Route Groups (Next.js)
Sử dụng các thư mục trong ngoặc đơn như `(auth)` và `(dashboard)`:
- Giúp tổ chức file sạch sẽ mà không ảnh hưởng đến URL.
- Cho phép áp dụng các `layout.tsx` khác nhau cho từng nhóm trang (VD: trang Admin có sidebar khác trang Login).

### 2.5. Centralized Constants & Configuration
- Mọi đường dẫn (URL) đều khai báo trong `ROUTES`.
- Mọi key lưu trữ đều nằm trong `STORAGE_KEYS`.
=> Giúp việc thay đổi dễ dàng, tránh lỗi "Magic String" (viết sai tên chuỗi gây lỗi logic).

### 2.6. Defensive Coding & Type Safety
- **Strict Typing**: Mọi dữ liệu đều được định nghĩa interface trong `src/types`.
- **Optional Chaining (`?.`)**: Luôn sử dụng khi truy cập thuộc tính của object từ API để tránh lỗi "Cannot read property of undefined".
- **Nullish Coalescing (`??`)**: Cung cấp giá trị mặc định khi dữ liệu bị trống.

### 2.7. Middleware
Thiết lập file `middleware.ts` để:
- Kiểm soát truy cập ở mức server.
- Bảo vệ các đường dẫn nhạy cảm như `/admin`, `/account`.
- Hiện tại đang ở bước chuẩn bị (sẵn sàng chuyển sang dùng Cookie thay cho LocalStorage để tăng tính bảo mật).

---

## 3. Quy tắc đặt tên (Naming Convention)
- **Files/Folders**: Luôn sử dụng `kebab-case` (ví dụ: `product-card.tsx`, `auth-context.tsx`).
- **Components**: Sử dụng `PascalCase` (ví dụ: `Header`, `ProductDetail`).
- **Constants**: Sử dụng `UPPER_SNAKE_CASE` (ví dụ: `API_URL`, `AUTH_TOKEN`).

---

## 4. Lộ trình mở rộng & Ưu tiên cho Team (Scaling)

Để dự án có thể vận hành tốt khi quy mô nhân sự lên tới 5 người, chúng ta đặt ra các ưu tiên sau:

### 4.1. Ưu tiên 1: Chuẩn hóa chất lượng Code (Code Quality) ✅ ĐÃ CẤU HÌNH

#### 4.1.1. TypeScript Strict Mode
File `tsconfig.json` đã được nâng cấp lên chế độ nghiêm ngặt nhất:

| Tùy chọn | Mô tả |
|----------|-------|
| `strict: true` | Bật tất cả các chế độ strict |
| `noImplicitAny` | Không cho phép biến có kiểu `any` ngầm định |
| `strictNullChecks` | Kiểm tra `null`/`undefined` nghiêm ngặt |
| `noUnusedLocals` | Báo lỗi nếu có biến cục bộ không sử dụng |
| `noUnusedParameters` | Báo lỗi nếu có tham số hàm không sử dụng |
| `noImplicitReturns` | Hàm phải có `return` rõ ràng ở mọi nhánh |
| `noUncheckedIndexedAccess` | Truy cập mảng/object phải check `undefined` |

#### 4.1.2. Husky & Lint-staged
Đã cấu hình Git Hooks để tự động kiểm tra code trước khi commit:

```text
.husky/
├── pre-commit      # Chạy lint-staged (ESLint + Prettier)
└── commit-msg      # Kiểm tra format commit message
```

**Cách hoạt động:**
1. Developer chạy `git commit -m "feat: add cart"`
2. **pre-commit hook** tự động chạy:
   - ESLint kiểm tra lỗi syntax/logic
   - Prettier tự động format code
3. **commit-msg hook** kiểm tra message:
   - Phải theo chuẩn: `type: subject`
   - Ví dụ hợp lệ: `feat: add cart logic`, `fix: header UI bug`

#### 4.1.3. Conventional Commits
Quy tắc đặt tên commit để dễ dàng theo dõi lịch sử thay đổi:

| Loại | Mô tả | Ví dụ |
|------|-------|-------|
| `feat` | Tính năng mới | `feat: add product review` |
| `fix` | Sửa lỗi | `fix: cart total calculation` |
| `docs` | Cập nhật tài liệu | `docs: update README` |
| `style` | Format code (không đổi logic) | `style: fix indentation` |
| `refactor` | Tái cấu trúc code | `refactor: extract utils` |
| `perf` | Cải thiện hiệu năng | `perf: optimize image loading` |
| `test` | Thêm/sửa test | `test: add unit test for cart` |
| `chore` | Công việc vặt | `chore: update dependencies` |

#### 4.1.4. Cách cài đặt (Dành cho Developer mới)
```bash
# 1. Cài đặt dependencies
npm install

# 2. Husky sẽ tự động được cài đặt qua script "prepare"
# Nếu chưa, chạy thủ công:
npx husky install

# 3. Kiểm tra lint
npm run lint

# 4. Format code
npm run format
```

---

### 4.2. Ưu tiên 2: Cải thiện Bảo mật & SSR (Auth & SEO)
- **Cookie-based Auth (HttpOnly)**: Chuyển đổi từ `localStorage` sang lưu Token ở Cookie. 
    - **Lý do**: Tăng tính bảo mật (hạn chế tấn công XSS) và cho phép Next.js Middleware kiểm tra quyền truy cập ngay ở tầng server (SSR), giúp tối ưu SEO và trải nghiệm người dùng (tránh tình trạng "jump" giao diện).
- **Next-Auth optimization**: Chuẩn hóa luồng Login/Register để hỗ trợ các tính năng nâng cao như Social Login trong tương lai.

### 4.3. Ưu tiên 3: Kiểm thử & Giám sát (Testing & Monitoring)
- **Unit Testing**: Viết test cho các nghiệp vụ lõi (vd: logic tính giá, thuế, phí vận chuyển) để đảm bảo không bị lỗi khi refactor code.
- **E2E Testing (Playwright)**: Test tự động các luồng quan trọng nhất (Mua hàng -> Thanh toán) để đảm bảo doanh thu không bị ảnh hưởng bởi bug UI.
- **Error Tracking (Sentry)**: Tự động ghi lại lỗi từ phía người dùng để team có thể fix bug trước khi khách hàng phàn nàn.

---

## 5. Các file cấu hình quan trọng

| File | Mục đích |
|------|----------|
| `tsconfig.json` | Cấu hình TypeScript strict mode |
| `.prettierrc` | Quy tắc format code (dấu chấm phẩy, ngoặc kép, độ rộng dòng) |
| `commitlint.config.js` | Quy tắc đặt tên commit message |
| `.husky/pre-commit` | Hook chạy lint trước khi commit |
| `.husky/commit-msg` | Hook kiểm tra commit message |
| `package.json > lint-staged` | Cấu hình lint cho các file staged |

---

*Tài liệu này giúp các thành viên mới nắm bắt nhanh kiến trúc và duy trì tính nhất quán của mã nguồn.*

*Cập nhật lần cuối: 29/12/2024*
