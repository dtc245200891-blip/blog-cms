# BÁO CÁO TIẾN ĐỘ VÀ TRẠNG THÁI TRIỂN KHAI (IMPLEMENTATION STATUS)
## HỆ THỐNG BLOG / CONTENT MANAGEMENT SYSTEM (CMS)

- **Đồ án:** Hệ thống Blog/CMS hoàn chỉnh, chuyên nghiệp, chạy thực tế.
- **Sinh viên:** Vũ Trọng Nghĩa — Lớp: CNTT K23L.
- **Trường:** Đại học Công nghệ Thông tin và Truyền thông – ĐH Thái Nguyên (ICTU).
- **Giảng viên hướng dẫn:** ThS. Vũ Văn Diện.
- **Cập nhật thời gian:** 23/10/2026.

---

## 1. BẢNG TIẾN ĐỘ 8 GIAI ĐOẠN

| Giai đoạn | Nhiệm vụ chính | Trạng thái | Minh chứng |
|---|---|:---:|---|
| **Giai đoạn 1** | Phân tích yêu cầu chức năng, phi chức năng, ma trận RBAC | ✅ HOÀN THÀNH | Đã tạo [SRS.md](file:///C:/Users/vtn08/.gemini/antigravity/scratch/blog-cms/docs/SRS.md) |
| **Giai đoạn 2** | Thiết kế kiến trúc 3 tầng, CSDL ERD, UML Diagrams | ✅ HOÀN THÀNH | Đã tạo [ARCHITECTURE.md](file:///C:/Users/vtn08/.gemini/antigravity/scratch/blog-cms/docs/ARCHITECTURE.md) & [DATABASE.md](file:///C:/Users/vtn08/.gemini/antigravity/scratch/blog-cms/docs/DATABASE.md) |
| **Giai đoạn 3** | Khởi tạo cấu trúc dự án, TypeScript, Prisma, Tailwind, Vite | ✅ HOÀN THÀNH | Cấu trúc phân lớp chuẩn `backend/` và `frontend/` |
| **Giai đoạn 4** | Xây dựng toàn bộ Backend API (Auth, Posts, Categories, Tags, Comments, Media, Users, Dashboard, Audit Logs, Settings) | ✅ HOÀN THÀNH | Đầy đủ Controllers, Services, Middlewares, Routes, Validators |
| **Giai đoạn 5** | Xây dựng Frontend UI (Trang chủ, Chi tiết bài viết, Soạn thảo TipTap, Quản trị CMS, Responsive) | ✅ HOÀN THÀNH | 14 trang công khai + 10 trang quản trị CMS |
| **Giai đoạn 6** | Tích hợp hệ thống, kiểm soát IDOR, Cookie HttpOnly, Tải ảnh | ✅ HOÀN THÀNH | Đã cấu hình Axios Interceptors, Error Handling, Toasts |
| **Giai đoạn 7** | Kiểm thử tự động (Unit test, Integration test Supertest, Build) | ✅ HOÀN THÀNH | **17/17 bài kiểm thử Vitest PASSED 100%**; Build frontend & backend thành công |
| **Giai đoạn 8** | Hoàn thiện tài liệu, hướng dẫn vận hành, kịch bản bảo vệ đồ án | ✅ HOÀN THÀNH | [README.md](file:///C:/Users/vtn08/.gemini/antigravity/scratch/blog-cms/README.md), [API.md](file:///C:/Users/vtn08/.gemini/antigravity/scratch/blog-cms/docs/API.md), [TESTING.md](file:///C:/Users/vtn08/.gemini/antigravity/scratch/blog-cms/docs/TESTING.md), [DEPLOYMENT.md](file:///C:/Users/vtn08/.gemini/antigravity/scratch/blog-cms/docs/DEPLOYMENT.md) |

---

## 2. ĐỐI CHIẾU BẢNG TIÊU CHÍ NGHIỆM THU (ACCEPTANCE CRITERIA)

- [x] **Ứng dụng cài đặt được theo README:** Hướng dẫn chi tiết từng bước cho Windows.
- [x] **Database tạo và migration thành công:** Prisma schema đã đồng bộ (`dev.db` và `schema.mysql.prisma`).
- [x] **Seed dữ liệu chạy được:** `npm run db:seed` tạo thành công 6 tài khoản mẫu, 5 danh mục, 7 thẻ, 10+ bài viết, bình luận, bookmark, audit logs.
- [x] **Đăng ký và đăng nhập hoạt động:** Hỗ trợ mật khẩu Bcrypt, Cookie HttpOnly, JWT Bearer.
- [x] **Đăng xuất hoạt động:** Xóa cookie phiên làm việc và dọn dẹp localStorage.
- [x] **Phân quyền đúng trên backend:** Middleware `authorizeRoles` chặn triệt để Reader truy cập admin (403), chặn Guest (401).
- [x] **CRUD bài viết hoạt động với database thật:** Hỗ trợ tạo, sửa, xóa, lọc, phân trang.
- [x] **Quy trình duyệt bài hoạt động:** Tác giả gửi duyệt (`PENDING`), Biên tập viên / Quản trị viên duyệt (`PUBLISHED`) hoặc từ chối kèm lý do (`REJECTED`).
- [x] **Tìm kiếm và phân trang hoạt động:** Tìm kiếm tiêu đề/nội dung không phân biệt chữ hoa/thường, hỗ trợ tiếng Việt.
- [x] **Danh mục và thẻ hoạt động:** Phân cấp danh mục cha - con, chống vòng lặp, đếm bài viết.
- [x] **Bình luận và kiểm duyệt hoạt động:** Độc giả gửi bình luận, trả lời bình luận, làm sạch XSS, biên tập viên kiểm duyệt (`APPROVED`, `PENDING`, `REJECTED`, `SPAM`).
- [x] **Upload ảnh an toàn:** Kiểm tra MIME type, giới hạn 5MB, đổi tên file ngẫu nhiên chống path traversal.
- [x] **Dashboard dùng dữ liệu thực:** Toàn bộ số liệu cards, biểu đồ BarChart danh mục, top bài viết lấy trực tiếp từ database queries.
- [x] **Giao diện responsive:** Tương thích di động (375px), tablet (768px), desktop (1440px).
- [x] **Không có nút chính bị vô hiệu hoặc chỉ mang tính trang trí:** Tất cả nút bấm đều liên kết API hoặc trigger modal xử lý thật.
- [x] **Không để lộ bản nháp cho khách:** API `/posts` chỉ trả về bài có trạng thái `PUBLISHED`.
- [x] **Không cho phép tự nâng quyền:** Backend kiểm tra nghiêm ngặt vai trò người dùng, không thể gửi payload nâng role.
- [x] **Các bài kiểm thử quan trọng chạy thành công:** Vitest chạy 17 bài test (6 unit test + 11 integration test Supertest) đạt $100\%$.
- [x] **Frontend build thành công:** `npm run build` với Vite biên dịch 2,612 modules thành công không lỗi.
- [x] **Backend typecheck và build thành công:** `tsc --noEmit` và `tsc` biên dịch mã JavaScript thành công không lỗi.
- [x] **Tài liệu hướng dẫn đầy đủ:** SRS, Architecture, Database, API, Testing, Deployment, README.
