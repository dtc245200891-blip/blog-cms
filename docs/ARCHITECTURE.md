# KIẾN TRÚC HỆ THỐNG VÀ THIẾT KẾ KỸ THUẬT (ARCHITECTURE)
## HỆ THỐNG BLOG / CONTENT MANAGEMENT SYSTEM (CMS)

- **Dự án:** Hệ thống Blog / Content Management System (CMS) chuyên nghiệp.
- **Sinh viên thực hiện:** Vũ Trọng Nghĩa — Lớp: CNTT K23L.
- **Đơn vị:** Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).
- **Giảng viên hướng dẫn:** ThS. Vũ Văn Diện.

---

## 1. MÔ HÌNH KIẾN TRÚC PHÂN TẦNG (LAYERED ARCHITECTURE)

Hệ thống được thiết kế theo kiến trúc 3 tầng chuẩn mực (Three-Tier Architecture), phân tách triệt để giữa Giao diện người dùng (Frontend), Tầng xử lý nghiệp vụ & API (Backend), và Tầng lưu trữ dữ liệu (Database Layer).

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (Trình duyệt)"]
        Browser["React 18 + Vite SPA"]
        TanStackQuery["TanStack Query (Data Fetching & Cache)"]
        ReactRouter["React Router 6 (SPA Routing)"]
    end

    subgraph APILayer ["Backend API Gateway (Express 4.21 + TS)"]
        RateLimit["Rate Limiter & Helmet Middleware"]
        AuthMiddleware["Auth & RBAC Middleware"]
        RouterLayer["Express Routes /api/v1/*"]
        ControllerLayer["Controller Layer (Req/Res Handling)"]
        ServiceLayer["Service Layer (Business Logic)"]
    end

    subgraph DataLayer ["Data Access & Storage Layer"]
        PrismaORM["Prisma ORM Client"]
        MySQL["MySQL 8 / SQLite Relational Database"]
        FileSystem["Local Storage /uploads (Media Files)"]
    end

    Browser --> TanStackQuery
    TanStackQuery --> ReactRouter
    ReactRouter -->|HTTP / JSON Requests| RateLimit
    RateLimit --> AuthMiddleware
    AuthMiddleware --> RouterLayer
    RouterLayer --> ControllerLayer
    ControllerLayer --> ServiceLayer
    ServiceLayer --> PrismaORM
    ServiceLayer --> FileSystem
    PrismaORM -->|SQL Queries & Transactions| MySQL
```

---

## 2. BIỂU ĐỒ THÀNH PHẦN (COMPONENT DIAGRAM)

```mermaid
flowchart LR
    subgraph FrontendComponents ["Frontend Components"]
        UI_Public["Public Pages (Home, Detail, Search)"]
        UI_Admin["Admin Pages (Dashboard, Posts, Users)"]
        UI_Editor["TipTap Rich Text Editor"]
        AuthCtx["AuthContext & Axios Instance"]
    end

    subgraph BackendModules ["Backend Modules"]
        Mod_Auth["Auth Module (JWT & Cookie)"]
        Mod_Posts["Posts Module (Workflow & Slug)"]
        Mod_Comments["Comments Module (Moderation)"]
        Mod_Users["Users Module (RBAC Management)"]
        Mod_Media["Media Module (Multer Upload)"]
        Mod_Dash["Dashboard Module (Analytics)"]
    end

    subgraph Storage ["Storage"]
        DB[(Relational DB)]
        MediaDir[uploads/]
    end

    UI_Public --> AuthCtx
    UI_Admin --> AuthCtx
    UI_Editor --> AuthCtx
    AuthCtx -->|REST API Calls| Mod_Auth
    AuthCtx -->|REST API Calls| Mod_Posts
    AuthCtx -->|REST API Calls| Mod_Comments
    AuthCtx -->|REST API Calls| Mod_Users
    AuthCtx -->|REST API Calls| Mod_Media
    AuthCtx -->|REST API Calls| Mod_Dash

    Mod_Auth --> DB
    Mod_Posts --> DB
    Mod_Comments --> DB
    Mod_Users --> DB
    Mod_Media --> DB
    Mod_Media --> MediaDir
    Mod_Dash --> DB
```

---

## 3. BIỂU ĐỒ TRIỂN KHAI (DEPLOYMENT DIAGRAM)

```mermaid
flowchart TD
    UserClient["Người dùng (Web Browser / Mobile)"]

    subgraph DockerHost ["Docker Compose Host / Windows Environment"]
        subgraph WebContainer ["Web Container: blog_cms_frontend"]
            Nginx["Nginx Reverse Proxy :80"]
            StaticFiles["React Production Build (/dist)"]
        end

        subgraph AppContainer ["App Container: blog_cms_backend"]
            NodeJS["Node.js LTS Runtime :5000"]
            ExpressApp["Express Application"]
        end

        subgraph DBContainer ["Database Container: blog_cms_mysql"]
            MySQLServer["MySQL 8.0 Engine :3306"]
            VolumeData[("Volume: mysql_data")]
        end

        VolumeUploads[("Volume: uploads_data")]
    end

    UserClient -->|Port 3000 / 80| Nginx
    Nginx --> StaticFiles
    Nginx -->|Proxy /api/| NodeJS
    NodeJS --> ExpressApp
    ExpressApp -->|TCP 3306 / Connection Pool| MySQLServer
    MySQLServer --> VolumeData
    ExpressApp --> VolumeUploads
```

---

## 4. QUY TRÌNH NGHIỆP VỤ & SƠ ĐỒ HOẠT ĐỘNG (ACTIVITY DIAGRAMS)

### 4.1. Sơ đồ hoạt động: Đăng nhập hệ thống (Login Activity Diagram)

```mermaid
flowchart TD
    Start([Bắt đầu]) --> Input[Nhập Email/Username và Mật khẩu]
    Input --> ValidateZod{Kiểm tra định dạng Zod}
    ValidateZod -- Không hợp lệ --> ErrFormat[Báo lỗi dữ liệu không hợp lệ] --> Input
    ValidateZod -- Hợp lệ --> QueryUser[Truy vấn tài khoản trong CSDL]
    QueryUser --> CheckExist{Tài khoản tồn tại & Đang hoạt động?}
    CheckExist -- Không --> ErrAuth[Báo lỗi: Thông tin đăng nhập sai hoặc bị khóa] --> End([Kết thúc])
    CheckExist -- Có --> CompareHash{So sánh mật khẩu với Bcrypt Hash}
    CompareHash -- Sai --> ErrAuth
    CompareHash -- Đúng --> GenJWT[Tạo mã JWT Token]
    GenJWT --> WriteAudit[Ghi nhận Audit Log đăng nhập]
    WriteAudit --> SetCookie[Đặt Cookie HttpOnly access_token & Trả về User Data]
    SetCookie --> RoleCheck{Kiểm tra vai trò người dùng}
    RoleCheck -- Admin / Editor / Author --> RedirectAdmin[Chuyển hướng về Trang Quản Trị /admin]
    RoleCheck -- Reader --> RedirectHome[Chuyển hướng về Trang Chủ /]
    RedirectAdmin --> End
    RedirectHome --> End
```

### 4.2. Sơ đồ hoạt động: Vòng đời Tạo, Duyệt và Xuất bản bài viết

```mermaid
flowchart TD
    Start([Tác giả bắt đầu]) --> FormPost[Soạn thảo Tiêu đề, Tóm tắt, Nội dung TipTap]
    FormPost --> ChoiceAction{Hành động}
    ChoiceAction -- Lưu nháp --> SaveDraft[Trạng thái DRAFT]
    ChoiceAction -- Gửi duyệt --> SubmitPending[Trạng thái PENDING]

    SaveDraft --> StoredDB[(Lưu vào CSDL)]
    SubmitPending --> StoredDB
    StoredDB --> NotifEditor[Biên tập viên nhận thông báo có bài chờ duyệt]
    NotifEditor --> ReviewPost[Biên tập viên thẩm định nội dung]
    ReviewPost --> Decision{Quyết định duyệt?}
    
    Decision -- Phê duyệt (Approve) --> SetPublished[Trạng thái PUBLISHED & Gán publishedAt]
    SetPublished --> NotifAuthorSuccess[Gửi thông báo thành công cho tác giả]
    NotifAuthorSuccess --> PublicFeed[Hiển thị công khai trên Trang chủ Blog]

    Decision -- Từ chối (Reject) --> InputReason[Nhập lý do từ chối bài viết]
    InputReason --> SetRejected[Trạng thái REJECTED & Lưu lý do]
    SetRejected --> NotifAuthorFix[Gửi thông báo kèm lý do yêu cầu tác giả sửa]
    NotifAuthorFix --> AuthorFix[Tác giả chỉnh sửa lại bài viết]
    AuthorFix --> SubmitPending
```

---

## 5. SƠ ĐỒ TUẦN TỰ (SEQUENCE DIAGRAMS)

### 5.1. Sequence Diagram: Phê duyệt bài viết (Approve Post)

```mermaid
sequenceDiagram
    autonumber
    actor Editor as Biên tập viên (Editor)
    participant FE as React Frontend
    participant API as Express API (/api/v1/posts/:id/approve)
    participant Auth as Auth & RBAC Middleware
    participant Service as PostsService
    participant DB as MySQL Database

    Editor->>FE: Bấm nút "Phê duyệt" bài viết
    FE->>API: POST /api/v1/posts/:id/approve (Kèm Bearer Token)
    API->>Auth: Kiểm tra tính hợp lệ của Token & Quyền EDITOR/ADMIN
    Auth-->>API: Hợp lệ (req.user = Editor)
    API->>Service: PostsService.approvePost(user, postId)
    Service->>DB: SELECT * FROM posts WHERE id = postId
    DB-->>Service: Thông tin bài viết (status = PENDING)
    Service->>DB: UPDATE posts SET status = 'PUBLISHED', publishedAt = NOW() WHERE id = postId
    Service->>DB: INSERT INTO notifications (userId, title, message, type)
    Service->>DB: INSERT INTO audit_logs (userId, action, entity, entityId)
    DB-->>Service: Kết quả cập nhật thành công
    Service-->>API: Đối tượng Post đã xuất bản
    API-->>FE: HTTP 200 OK (Thành công)
    FE-->>Editor: Cập nhật giao diện: Huy hiệu "Đã xuất bản"
```

### 5.2. Sequence Diagram: Độc giả gửi bình luận (Post Comment)

```mermaid
sequenceDiagram
    autonumber
    actor Reader as Độc giả (Reader)
    participant FE as React Frontend
    participant API as Express API (/api/v1/comments)
    participant Limiter as Rate Limiter (Comment)
    participant Service as CommentsService
    participant DB as MySQL Database

    Reader->>FE: Nhập nội dung bình luận & Bấm "Gửi bình luận"
    FE->>API: POST /api/v1/comments { postId, content }
    API->>Limiter: Kiểm tra tần suất gửi (< 10 comments / phút)
    Limiter-->>API: Chấp thuận
    API->>Service: CommentsService.createComment(user, data)
    Service->>Service: Sanitize HTML (Loại bỏ triệt để thẻ độc hại XSS)
    Service->>DB: SELECT allowComments FROM posts WHERE id = postId
    DB-->>Service: allowComments = true
    Service->>DB: SELECT value FROM settings WHERE key = 'comments_require_approval'
    DB-->>Service: value = 'true'
    Service->>DB: INSERT INTO comments (content, status='APPROVED', postId, authorId)
    Service->>DB: INSERT INTO notifications (userId = post.authorId, message)
    DB-->>Service: Bản ghi bình luận mới tạo
    Service-->>API: Comment object
    API-->>FE: HTTP 201 Created { success: true, data: comment }
    FE-->>Reader: Hiển thị bình luận mới trong danh sách thảo luận
```

---

## 6. KIẾN TRÚC GIÁM SÁT HỆ THỐNG & DEVOPS (OBSERVABILITY & MONITORING)

Nhằm đáp ứng yêu cầu môn học **Triển khai và hệ thống phần mềm**, hệ thống được tích hợp bộ công cụ giám sát hiệu năng hoàn chỉnh bao gồm **Prometheus** và **Grafana**:

```mermaid
flowchart LR
    subgraph AppServer ["Máy chủ Ứng dụng Backend (Node.js)"]
        ExpressApp["Express.js App (:5000)"]
        PromClient["prom-client Collector"]
        MetricsEndpoint["/api/v1/metrics (:5000)"]
        ExpressApp -->|HTTP Events & Latency| PromClient
        PromClient -->|Export Metrics| MetricsEndpoint
    end

    subgraph MonitorServer ["Hệ thống Giám sát & Đo đạc"]
        Prometheus["Prometheus Server (:9090)<br/>Scrape Interval: 5s"]
        Grafana["Grafana Visualization (:3001)<br/>Dashboard Auto-Provisioned"]
        MetricsEndpoint -->|Scrape (Pull)| Prometheus
        Prometheus -->|PromQL Queries| Grafana
    end

    subgraph ClientOps ["Người vận hành / Quản trị viên"]
        AdminUser["Quản trị viên / Giảng viên"]
        Grafana -->|Trực quan hóa đồ thị thời gian thực| AdminUser
    end
```

### Các chỉ số được thu thập và giám sát:
1. **Chỉ số lưu lượng (Traffic Metrics):**
   - `blog_cms_http_requests_total`: Đếm tổng số lượt request phân nhóm theo HTTP method, route và status code (2xx, 4xx, 5xx).
   - Tốc độ xử lý yêu cầu tức thời (Requests Per Second - RPS).
2. **Chỉ số độ trễ (Latency Metrics):**
   - `blog_cms_http_request_duration_seconds`: Histogram đo đạc thời gian đáp ứng API, phân tích theo phân vị p50, p90, p95 và p99.
3. **Chỉ số tài nguyên máy chủ (System Runtime Metrics):**
   - Bộ nhớ RAM tiêu thụ của Node.js: `blog_cms_nodejs_heap_size_used_bytes` và `blog_cms_nodejs_heap_size_total_bytes`.
   - Mức chiếm dụng CPU: `blog_cms_process_cpu_user_seconds_total`.
   - Thời gian hoạt động liên tục (Uptime): `blog_cms_process_uptime_seconds`.
