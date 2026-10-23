# BỘ GIÁO DỤC VÀ ĐÀO TẠO — ĐẠI HỌC THÁI NGUYÊN
## TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG (ICTU)
### KHOA CÔNG NGHỆ THÔNG TIN

---

<p align="center">
  <img src="ictu-logo.png" alt="Logo Trường Đại học Công nghệ Thông tin và Truyền thông" width="160" />
</p>

# BÁO CÁO ĐỒ ÁN MÔN HỌC
### MÔN HỌC: TRIỂN KHAI VÀ HỆ THỐNG PHẦN MỀM

## ĐỀ TÀI:
# XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG BLOG / CONTENT MANAGEMENT SYSTEM (CMS) CHUYÊN NGHIỆP

---

- **Giảng viên hướng dẫn:** **ThS. Vũ Văn Diện**
- **Sinh viên thực hiện:** **Vũ Trọng Nghĩa**
- **Mã số sinh viên:** **DTC245200891**
- **Lớp chuyên ngành:** **CNTT K23L (Khóa 23)**
- **Ngành đào tạo:** **Công nghệ Thông tin**
- **Thời gian thực hiện:** **Học kỳ 1 — Năm thứ 3 (Tháng 10/2026)**
- **Địa điểm:** **Thái Nguyên, Năm 2026**

---

\newpage

# LỜI CẢM ƠN

Lời đầu tiên, em xin gửi lời bày tỏ lòng biết ơn sâu sắc và chân thành nhất tới **Thầy giáo ThS. Vũ Văn Diện** — Giảng viên giảng dạy và hướng dẫn bộ môn **Triển khai và hệ thống phần mềm**, Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).

Trong suốt quá trình học tập và hoàn thiện đồ án môn học, Thầy đã luôn tận tình định hướng phương pháp tiếp cận kiến trúc phần mềm, chỉ dẫn các tiêu chuẩn triển khai thực tế của ngành công nghệ thông tin, cũng như động viên, góp ý những kinh nghiệm quý báu giúp em hoàn thiện trọn vẹn sản phẩm cả về mã nguồn, bảo mật và cơ sở dữ liệu.

Em cũng xin chân thành cảm ơn các Thầy Cô giáo trong Khoa Công nghệ Thông tin – Trường Đại học Công nghệ Thông tin và Truyền thông đã truyền thụ cho em những nền tảng kiến thức vững chắc trong suốt 3 năm học vừa qua. Những tri thức đó là hành trang vô cùng quan trọng giúp em tự tin thiết kế, lập trình và triển khai các hệ thống phần mềm đáp ứng nhu cầu thực tiễn.

Mặc dù đã rất nỗ lực nghiên cứu và hoàn thiện sản phẩm theo các tiêu chuẩn công nghiệp hiện đại, song do giới hạn về mặt thời gian và kinh nghiệm thực tế, báo cáo đồ án khó tránh khỏi những thiếu sót nhất định. Em rất mong nhận được những ý kiến đóng góp, chỉ dẫn quý báu từ Thầy và Hội đồng chấm điểm để hệ thống ngày càng hoàn thiện hơn.

*Em xin chân thành cảm ơn!*  
**Sinh viên thực hiện: Vũ Trọng Nghĩa**

---

\newpage

# MỤC LỤC TỔNG QUAN

- **LỜI CẢM ƠN**
- **LỜI MỞ ĐẦU**
  - 1. Tính cấp thiết của đề tài
  - 2. Mục tiêu nghiên cứu
  - 3. Đối tượng và phạm vi nghiên cứu
- **CHƯƠNG 1: TỔNG QUAN VỀ HỆ THỐNG VÀ CƠ SỞ CÔNG NGHỆ**
  - 1.1. Khái niệm về Blog và Content Management System (CMS)
  - 1.2. Khảo sát các giải pháp hiện nay và giải pháp của đề tài
  - 1.3. Lựa chọn công nghệ xây dựng hệ thống (React, TypeScript, Node.js, Prisma, MySQL 8, Docker)
- **CHƯƠNG 2: PHÂN TÍCH YÊU CẦU VÀ MÔ HÌNH HÓA SƠ ĐỒ USE CASE**
  - 2.1. Yêu cầu chức năng và phi chức năng
  - 2.2. Xác định các tác nhân (Actors: Guest, Reader, Author, Editor, Admin)
  - 2.3. Sơ đồ Use Case tổng quát toàn hệ thống
  - 2.4. Sơ đồ Use Case phân hệ Quản lý Bài viết & Quy trình duyệt bài
  - 2.5. Ma trận phân quyền RBAC chi tiết
  - 2.6. Đặc tả kịch bản Use Case trọng tâm
- **CHƯƠNG 3: THIẾT KẾ KIẾN TRÚC PHẦN MỀM VÀ CƠ SỞ DỮ LIỆU**
  - 3.1. Thiết kế kiến trúc 3 tầng (Three-Tier Architecture)
  - 3.2. Thiết kế Cơ sở dữ liệu quan hệ (ERD - 13 bảng chuẩn hóa)
  - 3.3. Từ điển dữ liệu chi tiết các bảng trọng tâm
  - 3.4. Sơ đồ tuần tự (Sequence Diagrams)
  - 3.5. Thiết kế RESTful API
- **CHƯƠNG 4: TRIỂN KHAI VÀ XÂY DỰNG HỆ THỐNG (MÔN TRIỂN KHAI HỆ THỐNG)**
  - 4.1. Quy trình triển khai phần mềm (Software Deployment Process)
  - 4.2. Xây dựng tầng Backend API (Express + TypeScript + Prisma)
  - 4.3. Xây dựng tầng Frontend SPA (React + Vite + Tailwind + TipTap)
  - 4.4. Đóng gói Container hóa với Docker Compose (Nginx + Node.js + MySQL 8)
  - 4.5. Triển khai các giải pháp an toàn bảo mật (Security in Depth)
  - 4.6. Hình ảnh giao diện thực tế và chức năng vận hành
- **CHƯƠNG 5: KIỂM THỬ TỰ ĐỘNG VÀ ĐÁNH GIÁ KẾT QUẢ ĐẠT ĐƯỢC**
  - 5.1. Kế hoạch và phương pháp kiểm thử (Test Plan)
  - 5.2. Kết quả kiểm thử tự động (Vitest & Supertest 17/17 Passed 100%)
  - 5.3. Bằng chứng kiểm thử an toàn bảo mật (IDOR, XSS, 401, 403)
  - 5.4. Kịch bản kiểm thử đầu-cuối (E2E Test Scenario)
- **KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN**
- **TÀI LIỆU THAM KHẢO**

---

\newpage

# LỜI MỞ ĐẦU

### 1. Tính cấp thiết của đề tài
Trong thời đại chuyển đổi số mạnh mẽ, các cổng thông tin điện tử và hệ thống xuất bản nội dung (Blog/CMS) đóng vai trò trung tâm trong việc truyền tải tri thức học thuật, tin tức giáo dục và nghiên cứu khoa học. Đối với sinh viên ngành Công nghệ Thông tin, việc làm chủ quy trình phân tích, thiết kế, triển khai và bảo mật một hệ thống phần mềm hoàn chỉnh là mục tiêu đào tạo then chốt.

Các giải pháp CMS truyền thống thường bộc lộ những hạn chế như phụ thuộc vào kiến trúc nguyên khối (Monolithic), khó bảo trì, tải chậm và dễ phát sinh lỗ hổng bảo mật. Việc tự nghiên cứu và xây dựng một hệ thống Blog/CMS phân lớp hiện đại (Decoupled Architecture) với React, Node.js, TypeScript và MySQL 8 không chỉ giải quyết triệt để các bài toán thực tiễn mà còn giúp sinh viên áp dụng toàn diện kiến thức của môn học **Triển khai và hệ thống phần mềm**.

### 2. Mục tiêu nghiên cứu
- Nắm vững quy trình thiết kế và triển khai phần mềm từ khảo sát yêu cầu đến đóng gói Docker.
- Xây dựng hệ thống phân quyền RBAC 4 cấp độ (Guest, Reader, Author, Editor, Admin) kiểm soát chặt chẽ tại Backend.
- Áp dụng các kỹ thuật bảo mật lớp sâu: Bcrypt, HttpOnly Cookies, JWT, Rate Limiting, Sanitize HTML chống XSS.
- Viết bộ kiểm thử tự động với Vitest và Supertest, đảm bảo sản phẩm đạt chất lượng cao trước khi bàn giao.

---

\newpage

# CHƯƠNG 1: TỔNG QUAN VỀ HỆ THỐNG VÀ CƠ SỞ CÔNG NGHỆ

### 1.1. Khái niệm về Blog và Content Management System (CMS)
- **Blog (Weblog):** Nền tảng chia sẻ bài viết, ý kiến chuyên môn và trao đổi học thuật theo thứ tự thời gian.
- **CMS (Hệ thống Quản trị Nội dung):** Nền tảng phần mềm cung cấp giao diện đồ họa trực quan giúp quản trị viên, biên tập viên và tác giả dễ dàng tạo, chỉnh sửa, phân loại, kiểm duyệt, xuất bản và theo dõi số liệu nội dung số mà không cần thao tác trực tiếp với cơ sở dữ liệu.

### 1.2. Bảng tổng hợp công nghệ sử dụng trong đề tài

| Thành phần hệ thống | Công nghệ / Thư viện | Phiên bản | Vai trò & Lý do lựa chọn |
|---|---|---|---|
| **Frontend Framework** | React + TypeScript | 18.3.1 | Giao diện Single Page Application (SPA), an toàn kiểu dữ liệu tĩnh. |
| **Build Tool** | Vite | 5.4.6 | Tốc độ biên dịch cực nhanh, tối ưu hóa bundle sản xuất. |
| **CSS Framework** | Tailwind CSS | 3.4.11 | Thiết kế giao diện hiện đại, responsive đa thiết bị (Mobile, Tablet, Desktop). |
| **Rich Text Editor** | TipTap Editor | 2.6.6 | Trình soạn thảo văn bản phong phú WYSIWYG, hỗ trợ định dạng, chèn ảnh, bảng và code. |
| **Biểu đồ thống kê** | Recharts | 2.12.7 | Trực quan hóa số liệu phân bố bài viết và lượt xem thời gian thực. |
| **Backend Runtime** | Node.js LTS + Express | 24.19 / 4.21 | Xây dựng RESTful API hiệu năng cao, bất đồng bộ không chặn (Non-blocking I/O). |
| **ORM & Database** | Prisma ORM & MySQL 8 | 5.19.1 | Quản lý lược đồ CSDL quan hệ chặt chẽ, sinh migration tự động, chống SQL Injection. |
| **Kiểm thử tự động** | Vitest + Supertest | 2.1.1 / 7.0 | Kiểm thử tự động Unit test và Integration test tốc độ cao. |
| **Đóng gói triển khai** | Docker Compose | 29.6.2 | Container hóa Backend, Nginx Frontend và MySQL 8 thành một thể thống nhất. |

---

\newpage

# CHƯƠNG 2: PHÂN TÍCH YÊU CẦU VÀ MÔ HÌNH HÓA SƠ ĐỒ USE CASE

### 2.1. Xác định các Tác nhân (Actors)

```mermaid
graph TD
    Guest["Khách (Guest)"]
    Reader["Độc giả (Reader)"]
    Author["Tác giả (Author)"]
    Editor["Biên tập viên (Editor)"]
    Admin["Quản trị viên (Admin)"]

    Reader -->|Kế thừa| Guest
    Author -->|Kế thừa| Reader
    Editor -->|Kế thừa| Reader
    Admin -->|Kế thừa toàn quyền| Editor
    Admin -->|Kế thừa toàn quyền| Author
```

1. **Khách (Guest):** Đọc bài viết công khai, tìm kiếm theo từ khóa, lọc theo chuyên mục, xem thông tin tác giả, đăng ký tài khoản mới.
2. **Độc giả (Reader):** Đăng nhập, đăng xuất, lưu bài viết yêu thích (Bookmark), gửi bình luận, trả lời bình luận, cập nhật hồ sơ cá nhân và đổi mật khẩu.
3. **Tác giả (Author):** Soạn thảo bài viết mới bằng TipTap, tải ảnh đại diện, lưu bản nháp (`DRAFT`), gửi bài duyệt (`PENDING`), chỉnh sửa/xóa bài viết của chính mình (chống IDOR).
4. **Biên tập viên (Editor):** Xem danh sách bài chờ duyệt, duyệt bài (`APPROVE` $\rightarrow$ `PUBLISHED`), từ chối bài kèm lý do cụ thể (`REJECT`), kiểm duyệt bình luận của độc giả, quản lý chuyên mục và thẻ bài viết.
5. **Quản trị viên (Admin):** Toàn quyền CMS, quản lý người dùng (đổi vai trò RBAC, khóa/mở tài khoản), xem thống kê Dashboard, cấu hình hệ thống và theo dõi nhật ký hoạt động (Audit logs).

---

### 2.2. Sơ đồ Use Case tổng quát hệ thống Blog/CMS

```mermaid
flowchart LR
    subgraph SystemBoundary ["HỆ THỐNG BLOG / CONTENT MANAGEMENT SYSTEM (CMS)"]
        UC1(["Xem bài viết công khai"])
        UC2(["Tìm kiếm & Lọc chuyên mục"])
        UC3(["Đăng ký / Đăng nhập"])
        UC4(["Bình luận & Lưu bài viết"])
        UC5(["Soạn thảo & Lưu bản nháp"])
        UC6(["Gửi bài viết phê duyệt"])
        UC7(["Phê duyệt bài viết (Approve)"])
        UC8(["Từ chối bài viết (Reject)"])
        UC9(["Kiểm duyệt bình luận"])
        UC10(["Quản lý Danh mục & Thẻ"])
        UC11(["Quản lý Người dùng & RBAC"])
        UC12(["Xem Dashboard & Audit Logs"])
    end

    ActorGuest((Khách))
    ActorReader((Độc giả))
    ActorAuthor((Tác giả))
    ActorEditor((Biên tập viên))
    ActorAdmin((Quản trị viên))

    ActorGuest --> UC1
    ActorGuest --> UC2
    ActorGuest --> UC3

    ActorReader --> UC1
    ActorReader --> UC2
    ActorReader --> UC4

    ActorAuthor --> UC5
    ActorAuthor --> UC6
    ActorAuthor --> UC4

    ActorEditor --> UC7
    ActorEditor --> UC8
    ActorEditor --> UC9
    ActorEditor --> UC10

    ActorAdmin --> UC7
    ActorAdmin --> UC8
    ActorAdmin --> UC10
    ActorAdmin --> UC11
    ActorAdmin --> UC12
```

---

### 2.3. Sơ đồ Use Case chi tiết: Phân hệ Quản lý Bài viết & Quy trình duyệt bài

```mermaid
flowchart TD
    subgraph PostLifecycle ["VÒNG ĐỜI VÀ QUY TRÌNH DUYỆT BÀI VIẾT (WORKFLOW)"]
        DRAFT["Bản nháp (DRAFT)"]
        PENDING["Chờ duyệt (PENDING)"]
        PUBLISHED["Đã xuất bản (PUBLISHED)"]
        REJECTED["Bị từ chối (REJECTED)"]
        ARCHIVED["Lưu trữ (ARCHIVED)"]
    end

    AuthorAction[Tác giả soạn thảo] -->|Lưu nháp| DRAFT
    DRAFT -->|Gửi phê duyệt| PENDING
    REJECTED -->|Chỉnh sửa & Gửi lại| PENDING
    PENDING -->|Biên tập viên Duyệt bài| PUBLISHED
    PENDING -->|Biên tập viên Từ chối + Lý do| REJECTED
    PUBLISHED -->|Quản trị viên Lưu trữ| ARCHIVED
```

---

\newpage

# CHƯƠNG 3: THIẾT KẾ KIẾN TRÚC PHẦN MỀM VÀ CƠ SỞ DỮ LIỆU

### 3.1. Thiết kế kiến trúc phân tầng (Three-Tier Architecture)

```mermaid
flowchart TD
    subgraph Client ["1. Presentation Layer (React SPA)"]
        Components["React Components & Pages"]
        TanStack["TanStack Query (Cache & Fetch)"]
        Router["React Router v6"]
    end

    subgraph Server ["2. Application Layer (Node.js & Express)"]
        Security["Rate Limit & Helmet & CORS"]
        AuthRBAC["JWT & RBAC Middleware"]
        Controllers["Controller Layer"]
        Services["Business Service Layer"]
    end

    subgraph DataStore ["3. Data Layer (Prisma ORM & Storage)"]
        PrismaClient["Prisma ORM Client"]
        MySQLDB[("MySQL 8.0 / SQLite DB")]
        DiskStorage[("Uploads Directory (/uploads)")]
    end

    Components --> TanStack
    TanStack --> Router
    Router -->|HTTPS / REST API| Security
    Security --> AuthRBAC
    AuthRBAC --> Controllers
    Controllers --> Services
    Services --> PrismaClient
    Services --> DiskStorage
    PrismaClient -->|SQL Connection Pool| MySQLDB
```

---

### 3.2. Sơ đồ Thực thể Quan hệ (ERD - Entity Relationship Diagram)

```mermaid
erDiagram
    users ||--o{ posts : "tác giả viết"
    users ||--o{ comments : "người dùng bình luận"
    users ||--o{ bookmarks : "độc giả lưu"
    users ||--o{ media : "tải lên tệp"
    users ||--o{ notifications : "nhận thông báo"
    users ||--o{ audit_logs : "kích hoạt hành động"

    categories ||--o{ categories : "danh mục cha - con"
    categories ||--o{ posts : "thuộc danh mục"

    posts ||--o{ post_tags : "gắn thẻ"
    tags ||--o{ post_tags : "liên kết bài viết"

    posts ||--o{ comments : "chứa bình luận"
    comments ||--o{ comments : "trả lời bình luận (replies)"
    posts ||--o{ bookmarks : "được lưu bởi"
    posts ||--o{ post_views : "lịch sử lượt xem"
```

---

### 3.3. Sơ đồ tuần tự: Phê duyệt bài viết (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor Editor as Biên tập viên (Editor)
    participant FE as React Frontend (/admin/posts)
    participant API as Express API Server
    participant Auth as RBAC Middleware
    participant Service as PostsService
    participant DB as MySQL Database

    Editor->>FE: Bấm nút "Phê duyệt" bài viết
    FE->>API: POST /api/v1/posts/:id/approve (Kèm Bearer Token)
    API->>Auth: Xác thực Token & Kiểm tra vai trò EDITOR/ADMIN
    Auth-->>API: Hợp lệ
    API->>Service: PostsService.approvePost(user, postId)
    Service->>DB: UPDATE posts SET status = 'PUBLISHED', publishedAt = NOW() WHERE id = postId
    Service->>DB: INSERT INTO notifications (userId, title, message)
    Service->>DB: INSERT INTO audit_logs (userId, action='APPROVE_POST')
    DB-->>Service: Cập nhật thành công
    Service-->>API: Đối tượng bài viết đã xuất bản
    API-->>FE: HTTP 200 OK
    FE-->>Editor: Cập nhật giao diện bài viết sang "Đã xuất bản"
```

---

\newpage

# CHƯƠNG 4: TRIỂN KHAI VÀ XÂY DỰNG HỆ THỐNG

### 4.1. Cấu hình Docker Compose và Triển khai đa dịch vụ
Hệ thống cung cấp tệp `docker-compose.yml` chuẩn hóa, tự động liên kết 3 container dịch vụ:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: blog_cms_mysql
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: blog_cms
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build: ./backend
    container_name: blog_cms_backend
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: "mysql://root:rootpassword@mysql:3306/blog_cms"
    depends_on:
      - mysql

  frontend:
    build: ./frontend
    container_name: blog_cms_frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

---

### 4.2. Giải pháp An toàn Bảo mật lớp sâu (Defense in Depth)

1. **Bảo vệ mật khẩu người dùng:** Sử dụng thuật toán băm Bcrypt với 10 vòng lặp muối (Salt rounds).
2. **Chống tấn công XSS:** Khử mã độc bằng `sanitize-html` trên cả bài viết và bình luận.
3. **Chống tấn công CSRF & Đánh cắp phiên:** Lưu trữ Token trong Cookie với cờ `HttpOnly`, `SameSite=Lax`.
4. **Chống Brute-force:** Áp dụng `express-rate-limit` giới hạn 30 lần thử đăng nhập trong 15 phút.
5. **Chống lỗ hổng IDOR:** Tầng Service kiểm tra nghiêm ngặt `post.authorId === currentUserId` trước khi thực thi sửa/xóa.

---

\newpage

# CHƯƠNG 5: KIỂM THỬ TỰ ĐỘNG VÀ ĐÁNH GIÁ KẾT QUẢ

### 5.1. Báo cáo kết quả kiểm thử Vitest (17/17 Passed 100%)

Toàn bộ các bài kiểm thử tự động được thực thi trên môi trường máy tính Windows và cho kết quả như sau:

| STT | Tên bài kiểm thử (Test Case) | Loại kiểm thử | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|:---:|---|:---:|---|---|:---:|
| 1 | Sinh Slug chuẩn SEO tiếng Việt có dấu | Unit Test | Loại bỏ dấu, nối gạch ngang | Chính xác | 🟢 PASS |
| 2 | Loại bỏ ký tự đặc biệt và xử lý chữ đ/Đ | Unit Test | Thay thế đ thành d, xóa ký tự lạ | Chính xác | 🟢 PASS |
| 3 | Ký và giải mã Token JWT | Unit Test | Payload nguyên vẹn, role đúng | Chính xác | 🟢 PASS |
| 4 | Băm và so khớp mật khẩu Bcrypt | Unit Test | So khớp đúng và chặn mật khẩu sai | Chính xác | 🟢 PASS |
| 5 | Zod Schema kiểm tra hợp lệ đăng ký | Unit Test | Chấp thuận dữ liệu chuẩn | Chính xác | 🟢 PASS |
| 6 | Zod Schema từ chối email sai định dạng | Unit Test | Báo lỗi 422 Unprocessable | Chính xác | 🟢 PASS |
| 7 | GET /api/health trả về Status UP | Integration | HTTP 200 { status: 'UP' } | HTTP 200 | 🟢 PASS |
| 8 | POST /auth/login đăng nhập Admin | Integration | HTTP 200, cấp Token JWT | HTTP 200 | 🟢 PASS |
| 9 | POST /auth/login đăng nhập Reader | Integration | HTTP 200, cấp Token JWT | HTTP 200 | 🟢 PASS |
| 10 | POST /auth/login sai mật khẩu | Integration | HTTP 400 Bad Request | HTTP 400 | 🟢 PASS |
| 11 | GET /posts lấy bài đã xuất bản | Integration | 100% bài có status = PUBLISHED | Chính xác | 🟢 PASS |
| 12 | GET /categories lấy danh mục có bài | Integration | Danh sách danh mục kèm count | Chính xác | 🟢 PASS |
| 13 | GET /tags lấy danh sách thẻ | Integration | Danh sách thẻ bài viết | Chính xác | 🟢 PASS |
| 14 | Chặn khách gọi API Admin (401) | Security Test | HTTP 401 Unauthorized | HTTP 401 | 🟢 PASS |
| 15 | Chặn Reader gọi API Admin (403) | Security Test | HTTP 403 Forbidden | HTTP 403 | 🟢 PASS |
| 16 | Cho phép Admin gọi API Admin (200) | Security Test | HTTP 200 OK | HTTP 200 | 🟢 PASS |
| 17 | GET /dashboard/stats lấy số liệu thật | Integration | Số liệu cards lấy từ database thật | Chính xác | 🟢 PASS |

---

\newpage

# KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

### 1. Kết luận
Đề tài **"Xây dựng và triển khai Hệ thống Blog / Content Management System (CMS) chuyên nghiệp"** đã hoàn thành xuất sắc các mục tiêu nghiên cứu và yêu cầu thực tiễn của môn học:
- Xây dựng thành công hệ thống phần mềm hoàn chỉnh, giao diện hiện đại, cơ sở dữ liệu quan hệ chặt chẽ.
- Hoàn thiện trọn vẹn quy trình phê duyệt bài viết đa tầng và phân quyền RBAC 4 cấp độ.
- Hệ thống đạt 100% các tiêu chí kiểm thử tự động, biên dịch sạch sẽ và có thể vận hành ổn định trên Windows lẫn Docker.
- Toàn bộ mã nguồn và tài liệu đã được công khai trên GitHub: **`https://github.com/dtc245200891-blip/blog-cms`**.

### 2. Hướng phát triển
- Tích hợp dịch vụ gửi thư điện tử thông báo tự động (AWS SES / Google SMTP).
- Phát triển thêm ứng dụng di động đa nền tảng (React Native) kết nối chung với hệ thống RESTful API hiện có.

---

\newpage

# TÀI LIỆU THAM KHẢO

1. **ThS. Vũ Văn Diện (2026)**, *Giáo trình và bài giảng môn Triển khai và hệ thống phần mềm*, Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).
2. **React Documentation (2024)**, *React 18 Architecture and Hooks Guide*, https://react.dev/
3. **Prisma ORM Documentation (2024)**, *Prisma Client, Schema and Migration Management*, https://www.prisma.io/docs
4. **Express.js Documentation (2024)**, *RESTful API Routing, Middleware, and Security Best Practices*, https://expressjs.com/
5. **OWASP Foundation (2023)**, *OWASP Top 10 Security Vulnerabilities & Remediation*, https://owasp.org/
6. **Docker Documentation (2024)**, *Docker Compose Specification and Containerization*, https://docs.docker.com/
