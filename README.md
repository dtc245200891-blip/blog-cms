# HỆ THỐNG BLOG & QUẢN TRỊ NỘI DUNG (CMS) CHUYÊN NGHIỆP
## BÁO CÁO ĐỒ ÁN MÔN HỌC — NGÀNH CÔNG NGHỆ THÔNG TIN

---

### THÔNG TIN ĐỒ ÁN
- **Tên đề tài:** Xây dựng Hệ thống Blog / Content Management System (CMS) hoàn chỉnh, chuyên nghiệp, có thể chạy thực tế.
- **Sinh viên thực hiện:** **Vũ Trọng Nghĩa**
- **Lớp:** **CNTT K23L**
- **Trường:** **Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU)**
- **Giảng viên hướng dẫn:** **ThS. Vũ Văn Diện**
- **Ngôn ngữ giao diện:** Tiếng Việt | **Múi giờ:** Asia/Ho_Chi_Minh | **Định dạng ngày:** dd/MM/yyyy

---

## 1. GIỚI THIỆU VÀ ĐẶC ĐIỂM NỔI BẬT

Hệ thống Blog/CMS được phát triển như một nền tảng xuất bản nội dung số hoàn chỉnh theo tiêu chuẩn doanh nghiệp, bao gồm:
1. **Cơ sở dữ liệu NoSQL MongoDB thật 100%:** Quản lý và trừu tượng hóa bằng Prisma ORM (MongoDB Connector). Hệ thống hỗ trợ khởi động trực tiếp MongoDB 7.0 Replica Set cục bộ (`npm run db:mongo`) và triển khai Docker container (`blog_cms_mongodb`). Có kịch bản nạp dữ liệu mẫu (Seed script) đầy đủ người dùng, bài viết, danh mục, thẻ, bình luận và nhật ký hoạt động vào các Collections MongoDB.
2. **Phân quyền người dùng RBAC 4 cấp độ:** Kiểm soát nghiêm ngặt tại Backend:
   - **Khách (Guest):** Đọc bài viết công khai, tìm kiếm.
   - **Độc giả (Reader):** Bình luận, trả lời bình luận, lưu bài viết (Bookmark), quản lý hồ sơ cá nhân.
   - **Tác giả (Author):** Soạn thảo bài viết Rich Text (TipTap), lưu bản nháp, gửi bài để kiểm duyệt, quản lý bài viết của mình (chống IDOR).
   - **Biên tập viên (Editor):** Thẩm định và duyệt bài viết (`PENDING` $\rightarrow$ `PUBLISHED`), từ chối bài viết kèm lý do cụ thể, kiểm duyệt bình luận.
   - **Quản trị viên (Admin):** Toàn quyền quản trị hệ thống, cấp quyền vai trò RBAC, khóa/mở khóa tài khoản, tạo người dùng, đặt lại mật khẩu, xóa tài khoản, xem bảng điều khiển và nhật ký hoạt động (Audit logs).
3. **Bảo mật chuyên sâu:** Băm mật khẩu với Bcrypt 10 rounds, phiên làm việc qua Cookie HttpOnly và Token JWT, chống brute-force bằng Rate Limiter, khử mã độc XSS bằng Sanitize-HTML, bảo vệ tiêu đề với Helmet.
4. **Kiểm thử tự động:** Tích hợp bộ kiểm thử tự động với Vitest và Supertest chạy trực tiếp trên MongoDB Replica Set, đạt tỉ lệ **24/24 bài kiểm thử thành công (100%)**.

---

## 2. BỘ CÔNG NGHỆ SỬ DỤNG (TECH STACK)

- **Frontend:**
  - React 18, TypeScript, Vite
  - Tailwind CSS
  - TipTap Editor (Trình soạn thảo văn bản phong phú WYSIWYG)
  - TanStack Query v5 & Axios
  - Recharts (Biểu đồ thống kê)
  - Lucide React (Bộ icon hiện đại)
  - React Router DOM v6
- **Backend:**
  - Node.js LTS (v24 / v22 / v20), Express.js, TypeScript
  - Prisma ORM
  - Zod (Xác thực dữ liệu đầu vào)
  - Bcryptjs (Băm mật khẩu an toàn)
  - JsonWebToken & Cookie-Parser
  - Express-Rate-Limit (Chống brute-force)
  - Helmet & CORS (Bảo mật HTTP)
  - Multer (Quản lý tải tệp ảnh an toàn)
- **Cơ sở dữ liệu:**
  - **MongoDB 7.0 (NoSQL Database)**
  - Prisma ORM (MongoDB Connector với đầy đủ Collections & Quan hệ)
- **Kiểm thử, Giám sát & Triển khai:**
  - Vitest, Supertest (24/24 bài kiểm thử tự động đạt 100%)
  - **Prometheus v2.54** (Thu thập chỉ số thời gian thực từ Backend `/api/v1/metrics`)
  - **Grafana v11.2** (Trực quan hóa Dashboard hiệu năng hệ thống tại cổng `3001`)
  - Docker & Docker Compose (MongoDB 7.0 Replica Set, Backend, Frontend, Prometheus, Grafana)

---

## 3. HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY TRÊN WINDOWS

Hệ thống được cấu hình để sinh viên và giảng viên có thể khởi chạy và chấm điểm trực tiếp trên máy tính.

### Bước 1: Mở Terminal tại thư mục dự án
```powershell
cd C:\Users\vtn08\.gemini\antigravity\scratch\blog-cms
```

---

### Bước 2: Khởi động Cơ sở dữ liệu MongoDB
Bạn có thể chọn 1 trong 2 cách cực kỳ tiện lợi:
- **Cách A (Không cần Docker):** Chạy lệnh sau để khởi động MongoDB 7.0 Replica Set cục bộ:
  ```powershell
  cd backend
  npm run db:mongo
  ```
- **Cách B (Dùng Docker Desktop):**
  ```powershell
  docker-compose up -d mongodb
  ```

---

### Bước 3: Khởi tạo và chạy Backend
Mở một cửa sổ PowerShell mới:
```powershell
cd C:\Users\vtn08\.gemini\antigravity\scratch\blog-cms\backend

# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Tạo file cấu hình môi trường từ mẫu (nếu chưa có)
Copy-Item .env.example .env

# 3. Sinh mã nguồn Prisma Client cho MongoDB
npm run db:generate

# 4. Đồng bộ Collections và Indexes vào MongoDB
npm run db:push

# 5. Nạp dữ liệu mẫu hoàn chỉnh vào MongoDB
npm run db:seed
```

#### Chạy kiểm thử tự động xác minh:
```powershell
npm run test
```
*Tất cả **24/24 bài test** Unit & Integration chạy trên MongoDB Replica Set vượt qua 100%.*

#### Khởi động Backend API:
```powershell
npm run dev
```
- Máy chủ API chạy tại: **`http://localhost:5000`**
- Kiểm tra sức khỏe: **`http://localhost:5000/api/health`**
- API Metrics Prometheus: **`http://localhost:5000/api/v1/metrics`**

---

### Bước 4: Khởi động Frontend
Mở một cửa sổ PowerShell thứ hai:
```powershell
cd C:\Users\vtn08\.gemini\antigravity\scratch\blog-cms\frontend

# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy máy chủ giao diện
npm run dev
```
- Trang web người dùng truy cập tại: **`http://localhost:5173`**

---

## 4. TÀI KHOẢN TRÌNH DIỄN (DEMO ACCOUNTS)

Mật khẩu chung cho tất cả các tài khoản demo: **`Password@123`**  
*(Trên trang đăng nhập `http://localhost:5173/login`, hệ thống có sẵn các nút bấm 1-Click để tự động điền tài khoản giúp sinh viên trình diễn nhanh chóng trước Hội đồng)*:

| Vai trò | Email đăng nhập | Tên đăng nhập | Chức năng kiểm thử chính |
|---|---|---|---|
| **1. Quản trị viên (Admin)** | `admin@ictu.edu.vn` | `admin` | Quản lý người dùng, đổi role RBAC, khóa/mở khóa tài khoản, xem nhật ký Audit Logs, cài đặt hệ thống. |
| **2. Biên tập viên (Editor)** | `editor@ictu.edu.vn` | `editor` | Vào `/admin/posts` duyệt bài (`Approve`), từ chối (`Reject` có nhập lý do), kiểm duyệt bình luận. |
| **3. Tác giả (Author)** | `author1@ictu.edu.vn` | `author_nghia` | Soạn thảo bài viết mới với TipTap, lưu nháp (`Draft`), gửi duyệt (`Submit`), quản lý bài của mình. |
| **4. Tác giả 2 (Author)** | `author2@ictu.edu.vn` | `author_linh` | Bài viết nghiên cứu AI và Data. |
| **5. Độc giả 1 (Reader)** | `reader1@ictu.edu.vn` | `reader_nam` | Gửi bình luận, trả lời bình luận, lưu bài viết yêu thích (`/saved-posts`). |
| **6. Độc giả 2 (Reader)** | `reader2@ictu.edu.vn` | `reader_mai` | Độc giả mới tìm hiểu công nghệ. |

---

## 5. KỊCH BẢN TRÌNH DIỄN BẢO VỆ ĐỒ ÁN (DEMO WALKTHROUGH)

Khi báo cáo trước Giảng viên hướng dẫn và Hội đồng, sinh viên có thể thực hiện theo quy trình sau:
1. **Trang chủ (`/`):** Giới thiệu thông tin đề tài, sinh viên Vũ Trọng Nghĩa (K23L), các bài viết nổi bật được ghim, danh mục chuyên môn và thanh lọc bài viết thời gian thực.
2. **Chi tiết bài viết (`/posts/...`):** Mở một bài viết, xem định dạng nội dung TipTap, hình ảnh, thông tin tác giả, lượt xem tăng tự động, thử tính năng **Lưu bài viết (Bookmark)**.
3. **Thảo luận (`CommentSection`):** Gửi bình luận và gửi phản hồi trả lời bình luận cấp 2.
4. **Quy trình duyệt bài (Workflow):**
   - Đăng nhập tài khoản Tác giả `author1@ictu.edu.vn`.
   - Vào `/admin/posts/new`, tạo bài viết mới, tải ảnh đại diện lên, bấm **Lưu bản nháp**.
   - Bấm **Gửi duyệt** $\rightarrow$ Bài viết chuyển sang trạng thái **Chờ duyệt (`PENDING`)**.
   - Đăng xuất, đăng nhập tài khoản Biên tập viên `editor@ictu.edu.vn`.
   - Vào `/admin/posts`, kiểm tra bài viết chờ duyệt, bấm **Duyệt bài** $\rightarrow$ Bài viết lập tức chuyển sang **Đã xuất bản (`PUBLISHED`)** và hiển thị ngoài trang chủ.
5. **Kiểm duyệt bình luận:** Biên tập viên vào `/admin/comments` duyệt hoặc từ chối bình luận của độc giả.
6. **Bảng điều khiển & Bảo mật (Admin):**
   - Đăng nhập `admin@ictu.edu.vn`.
   - Xem thống kê Dashboard và biểu đồ phân bố bài viết theo danh mục (lấy từ database thật).
   - Vào `/admin/users`: Thử đổi vai trò của người dùng hoặc khóa tài khoản.
   - Vào `/admin/audit-logs`: Kiểm tra lịch sử toàn bộ thao tác vừa diễn ra trên hệ thống.
7. **Giám sát hệ thống (DevOps Monitoring):**
   - Mở Dashboard quản trị hoặc thanh menu bên trái, bấm nút **Giám sát Grafana** (hoặc truy cập `http://localhost:3001`).
   - Trình diễn cho giảng viên biểu đồ RPS, thời gian phản hồi (p95 latency), mã HTTP 2xx/4xx/5xx và tình trạng bộ nhớ RAM/CPU được thu thập từ backend `/api/v1/metrics`.

---

## 6. HƯỚNG DẪN VẬN HÀNH GIÁM SÁT GRAFANA & PROMETHEUS

Hệ thống được tích hợp sẵn toàn bộ cấu hình giám sát phục vụ môn học **Triển khai và hệ thống phần mềm**:

### 1. Khởi động cụm giám sát qua Docker Compose
```powershell
docker-compose up -d prometheus grafana
```
*(Nếu muốn chạy toàn bộ cả MySQL, Backend, Frontend, Prometheus, Grafana thì chỉ cần chạy `docker-compose up -d`)*

### 2. Truy cập dịch vụ giám sát:
- **Grafana Dashboard:** `http://localhost:3001`
  - Tài khoản mặc định: `admin` / Mật khẩu: `admin`
  - Dashboard đã được nạp sẵn tự động: **ICTU Blog/CMS - Giám sát Hệ thống (Vũ Trọng Nghĩa - K23L)**.
- **Prometheus Server:** `http://localhost:9090` (Kiểm tra targets tại `http://localhost:9090/targets`).
- **Backend Prometheus Metrics Endpoint:** `http://localhost:5000/api/v1/metrics` (hoặc `http://localhost:5000/metrics`).

---

## 7. KIỂM THỬ VÀ ĐÓNG GÓI SẢN PHẨM (BUILD)

### 1. Chạy bài kiểm thử tự động
```powershell
cd backend
npm run test
```

### 2. Biên dịch Production Backend
```powershell
cd backend
npm run build
```

### 3. Biên dịch Production Frontend
```powershell
cd frontend
npm run build
```
*Thư mục `frontend/dist` được đóng gói hoàn chỉnh, sẵn sàng triển khai trên Nginx hoặc máy chủ tĩnh.*

---

## 7. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
blog-cms/
├── backend/                  # Mã nguồn Máy chủ Backend API
│   ├── src/
│   │   ├── config/           # Cấu hình môi trường & Prisma Client
│   │   ├── middlewares/      # Xác thực, RBAC, Rate-limit, Upload, Error handler
│   │   ├── modules/          # Các phân hệ nghiệp vụ: Auth, Posts, Categories, Tags, Comments, Media, Users, Dashboard, Settings, Audit
│   │   ├── utils/            # Băm mật khẩu, JWT, Response, Slug tiếng Việt, AppError
│   │   ├── tests/            # Bộ kiểm thử Unit & Integration (Vitest & Supertest)
│   │   ├── app.ts            # Khởi tạo Express App & Routing
│   │   └── index.ts          # Điểm khởi chạy HTTP Server
│   ├── prisma/
│   │   ├── schema.prisma     # Lược đồ CSDL chính (SQLite dev)
│   │   ├── schema.mysql.prisma # Lược đồ CSDL MySQL 8 (Production)
│   │   └── seed.ts           # Kịch bản nạp dữ liệu mẫu
│   ├── package.json
│   └── tsconfig.json
├── frontend/                 # Mã nguồn Giao diện Người dùng
│   ├── src/
│   │   ├── components/       # Component dùng chung, Post card, TipTap editor, Sidebar, Header
│   │   ├── context/          # Quản lý trạng thái đăng nhập AuthContext
│   │   ├── layouts/          # PublicLayout & AdminLayout (bảo vệ quyền truy cập)
│   │   ├── pages/
│   │   │   ├── public/       # Trang chủ, Chi tiết bài, Danh mục, Thẻ, Tìm kiếm, Đăng nhập, Hồ sơ
│   │   │   └── admin/        # Dashboard, Quản lý bài, Soạn bài, Danh mục, Thẻ, Bình luận, Người dùng, Media, Cấu hình, Audit
│   │   ├── routes/           # Định tuyến ứng dụng React Router
│   │   ├── services/         # Axios API client
│   │   └── types/            # Định nghĩa kiểu dữ liệu TypeScript
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docs/                     # Tài liệu kỹ thuật phục vụ báo cáo đồ án
│   ├── SRS.md                # Đặc tả yêu cầu phần mềm
│   ├── ARCHITECTURE.md       # Thiết kế kiến trúc và các sơ đồ UML (Mermaid)
│   ├── DATABASE.md           # Thiết kế CSDL quan hệ, ERD và từ điển dữ liệu
│   ├── API.md                # Đặc tả toàn bộ RESTful API & ma trận phân quyền
│   ├── TESTING.md            # Báo cáo kết quả kiểm thử tự động
│   ├── DEPLOYMENT.md         # Hướng dẫn triển khai và vận hành hệ thống
│   └── IMPLEMENTATION_STATUS.md # Báo cáo tiến độ nghiệm thu
├── docker-compose.yml        # Cấu hình chạy MySQL 8 và các dịch vụ Docker
├── .env.example              # Mẫu biến môi trường
├── .gitignore
└── README.md                 # Tài liệu hướng dẫn sử dụng chính
```

---

## 8. DANH SÁCH TÀI LIỆU KỸ THUẬT KÈM THEO

1. **[Đặc tả yêu cầu phần mềm (SRS.md)](docs/SRS.md)**
2. **[Kiến trúc hệ thống và sơ đồ UML (ARCHITECTURE.md)](docs/ARCHITECTURE.md)**
3. **[Thiết kế Cơ sở dữ liệu và ERD (DATABASE.md)](docs/DATABASE.md)**
4. **[Đặc tả RESTful API (API.md)](docs/API.md)**
5. **[Báo cáo kiểm thử tự động (TESTING.md)](docs/TESTING.md)**
6. **[Hướng dẫn triển khai chi tiết (DEPLOYMENT.md)](docs/DEPLOYMENT.md)**
7. **[Báo cáo tiến độ và tiêu chí nghiệm thu (IMPLEMENTATION_STATUS.md)](docs/IMPLEMENTATION_STATUS.md)**

---
*Đồ án hoàn thành vào tháng 10/2026 bởi sinh viên Vũ Trọng Nghĩa (Lớp CNTT K23L — Trường Đại học Công nghệ Thông tin và Truyền thông Thái Nguyên).*
