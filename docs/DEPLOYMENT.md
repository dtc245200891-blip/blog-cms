# HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH TRIỂN KHAI (DEPLOYMENT GUIDE)
## HỆ THỐNG BLOG / CONTENT MANAGEMENT SYSTEM (CMS)

- **Dự án:** Hệ thống Blog / Content Management System (CMS) chuyên nghiệp.
- **Sinh viên thực hiện:** Vũ Trọng Nghĩa — Lớp: CNTT K23L.
- **Đơn vị:** Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).
- **Giảng viên hướng dẫn:** ThS. Vũ Văn Diện.
- **Hệ điều hành mục tiêu:** Windows 10/11 (kèm Docker Compose).

---

## 1. YÊU CẦU MÔI TRƯỜNG TIÊN QUYẾT (PREREQUISITES)

1. **Node.js:** Phiên bản LTS khuyến nghị từ `v20.x` hoặc `v22.x` / `v24.x` (Đã xác minh hoạt động tốt trên Node `v24.19.0`).
2. **Trình quản lý gói:** `npm` phiên bản 10 trở lên.
3. **Cơ sở dữ liệu:**
   - **Tùy chọn A (Nhanh nhất, chạy ngay không cần cài đặt CSDL rời):** Sử dụng SQLite tích hợp sẵn trong Prisma (`DATABASE_URL="file:./dev.db"`). Khởi động ngay tức thì, đầy đủ toàn vẹn dữ liệu quan hệ và phục vụ bảo vệ đồ án trực tiếp trước Hội đồng chấm điểm.
   - **Tùy chọn B (Sản xuất / Docker):** Cài đặt MySQL 8.0 hoặc Docker Desktop.

---

## 2. HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY TỪ ĐẦU TRÊN WINDOWS (STEP-BY-STEP)

### Bước 1: Mở thư mục dự án trên PowerShell hoặc Terminal
```powershell
cd C:\Users\vtn08\.gemini\antigravity\scratch\blog-cms
```

### Bước 2: Cài đặt và cấu hình Máy chủ Backend
```powershell
# Di chuyển vào thư mục backend
cd backend

# Cài đặt toàn bộ thư viện cần thiết
npm install

# Tạo tệp biến môi trường từ mẫu
Copy-Item .env.example .env

# Sinh mã Prisma Client
npm run db:generate

# Đồng bộ lược đồ cơ sở dữ liệu (tự động tạo bảng)
npm run db:push

# Nạp dữ liệu mẫu hoàn chỉnh (Users, Posts, Categories, Tags, Comments, Logs)
npm run db:seed
```

### Bước 3: Chạy bài kiểm thử tự động Backend
```powershell
# Chạy 17 bài kiểm thử Unit & Integration với Vitest
npm run test
```
*Kết quả mong đợi:* $17/17$ bài test ĐẠT (Passed).

### Bước 4: Khởi động máy chủ Backend
```powershell
npm run dev
```
*Máy chủ Backend sẽ lắng nghe tại cổng:* `http://localhost:5000`  
- API v1: `http://localhost:5000/api/v1`
- Kiểm tra sức khỏe hệ thống: `http://localhost:5000/api/health`

---

### Bước 5: Cài đặt và khởi chạy Giao diện Frontend
Mở một cửa sổ PowerShell mới:
```powershell
cd C:\Users\vtn08\.gemini\antigravity\scratch\blog-cms\frontend

# Cài đặt thư viện frontend
npm install

# Khởi chạy máy chủ phát triển Vite
npm run dev
```
*Trang web sẽ hiển thị tại:* `http://localhost:5173`

---

## 3. DANH SÁCH TÀI KHOẢN ĐĂNG NHẬP TRÌNH DIỄN (DEMO ACCOUNTS)

Mật khẩu chung cho tất cả tài khoản là: `Password@123`  
*(Trên trang đăng nhập `/login`, có sẵn các nút bấm 1-Click tự động điền tài khoản để trình diễn bảo vệ đồ án)*:

| Vai trò (Role) | Email đăng nhập | Tên đăng nhập | Mục đích trình diễn |
|---|---|---|---|
| **1. Quản trị viên (Admin)** | `admin@ictu.edu.vn` | `admin` | Toàn quyền CMS, quản lý người dùng, phân quyền RBAC, xem nhật ký hoạt động |
| **2. Biên tập viên (Editor)** | `editor@ictu.edu.vn` | `editor` | Phê duyệt bài viết chờ duyệt (`PENDING`), từ chối bài viết, kiểm duyệt bình luận |
| **3. Tác giả 1 (Author)** | `author1@ictu.edu.vn` | `author_nghia` | Sinh viên Vũ Trọng Nghĩa: Soạn bài viết mới, gửi duyệt, quản lý bài viết cá nhân |
| **4. Tác giả 2 (Author)** | `author2@ictu.edu.vn` | `author_linh` | Tác giả Trần Thùy Linh: Bản nháp và nghiên cứu dữ liệu |
| **5. Độc giả 1 (Reader)** | `reader1@ictu.edu.vn` | `reader_nam` | Bình luận, trả lời bình luận, lưu bài viết (Bookmark) |
| **6. Độc giả 2 (Reader)** | `reader2@ictu.edu.vn` | `reader_mai` | Độc giả mới khám phá bài viết |

---

## 4. TRIỂN KHAI VỚI DOCKER COMPOSE VÀ MYSQL 8 (NẾU SỬ DỤNG DOCKER)

Khi triển khai trên máy chủ thật hoặc môi trường có Docker Desktop:
```powershell
# Tại thư mục gốc blog-cms/
docker-compose up -d --build
```

Dịch vụ sẽ tự động kích hoạt 3 container:
1. `blog_cms_mysql` (MySQL 8.0 lắng nghe cổng 3306)
2. `blog_cms_backend` (Node.js API lắng nghe cổng 5000)
3. `blog_cms_frontend` (Nginx lắng nghe cổng 3000)

---

## 5. XỬ LÝ SỰ CỐ PHỔ BIẾN (TROUBLESHOOTING)

1. **Lỗi cổng 5000 hoặc 5173 bị xung đột (Port in use):**
   - Đổi `PORT=5001` trong `backend/.env` và cập nhật cấu hình proxy trong `frontend/vite.config.ts`.
2. **Lỗi quyền thực thi PowerShell Execution Policy:**
   - Mở PowerShell với quyền Administrator và chạy: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`.
3. **Lỗi tệp ảnh tải lên không hiển thị:**
   - Kiểm tra thư mục `backend/uploads` đã được tạo và có quyền ghi.
