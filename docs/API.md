# TÀI LIỆU ĐẶC TẢ RESTFUL API (API SPECIFICATION)
## HỆ THỐNG BLOG / CONTENT MANAGEMENT SYSTEM (CMS)

- **Dự án:** Hệ thống Blog / Content Management System (CMS) chuyên nghiệp.
- **Sinh viên thực hiện:** Vũ Trọng Nghĩa — Lớp: CNTT K23L.
- **Đơn vị:** Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).
- **Giảng viên hướng dẫn:** ThS. Vũ Văn Diện.
- **Base URL:** `http://localhost:5000/api/v1`
- **Quy ước định dạng phản hồi chuẩn:**
  ```json
  {
    "success": true,
    "message": "Thông điệp phản hồi",
    "data": {},
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
  ```

---

## 1. MA TRẬN PHÂN QUYỀN API (RBAC PERMISSIONS MATRIX)

| Nhóm API Endpoint | Khách (Guest) | Độc giả (Reader) | Tác giả (Author) | Biên tập viên (Editor) | Quản trị viên (Admin) |
|---|:---:|:---:|:---:|:---:|:---:|
| `POST /auth/register` | ✅ | ❌ | ❌ | ❌ | ❌ |
| `POST /auth/login` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `GET /auth/me` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `GET /posts` (Công khai) | ✅ | ✅ | ✅ | ✅ | ✅ |
| `GET /posts/manage` | ❌ | ❌ | ✅ (Bài của mình) | ✅ (Tất cả) | ✅ (Tất cả) |
| `POST /posts` | ❌ | ❌ | ✅ (Gửi duyệt) | ✅ (Xuất bản) | ✅ (Xuất bản) |
| `POST /posts/:id/submit` | ❌ | ❌ | ✅ (Bài của mình) | ✅ | ✅ |
| `POST /posts/:id/approve` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `POST /posts/:id/reject` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `POST /comments` | ❌ | ✅ | ✅ | ✅ | ✅ |
| `PATCH /comments/:id/moderate` | ❌ | ❌ | ❌ | ✅ | ✅ |
| `POST /media/upload` | ❌ | ❌ | ✅ | ✅ | ✅ |
| `GET /dashboard/stats` | ❌ | ❌ | ✅ (Thống kê cá nhân) | ✅ | ✅ |
| `GET /users` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `PATCH /users/:id/admin` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `PATCH /settings` | ❌ | ❌ | ❌ | ❌ | ✅ |
| `GET /audit-logs` | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 2. CHI TIẾT CÁC ENDPOINT

### 2.1. Phân hệ Xác thực (Authentication)

#### `POST /auth/register`
- **Mô tả:** Đăng ký tài khoản độc giả mới.
- **Quyền hạn:** Công khai (Guest). Áp dụng Rate Limiting.
- **Request Body:**
  ```json
  {
    "email": "sinhvien@ictu.edu.vn",
    "username": "sinhvien_ictu",
    "password": "Password@123",
    "fullName": "Nguyễn Văn A"
  }
  ```
- **Response 201 Created:** Trả về thông tin User đã tạo và mã Token JWT, tự động thiết lập Cookie `access_token` HttpOnly.

#### `POST /auth/login`
- **Mô tả:** Đăng nhập hệ thống bằng email hoặc username.
- **Quyền hạn:** Công khai.
- **Request Body:**
  ```json
  {
    "identifier": "admin@ictu.edu.vn",
    "password": "Password@123"
  }
  ```
- **Response 200 OK:**
  ```json
  {
    "success": true,
    "message": "Đăng nhập thành công!",
    "data": {
      "user": {
        "id": "uuid-v4",
        "email": "admin@ictu.edu.vn",
        "username": "admin",
        "fullName": "Quản Trị Viên Hệ Thống",
        "role": "ADMIN"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### `GET /auth/me`
- **Mô tả:** Lấy thông tin tài khoản của phiên đăng nhập hiện tại.
- **Quyền hạn:** Đã đăng nhập (`Authorization: Bearer <token>` hoặc Cookie).

#### `POST /auth/logout`
- **Mô tả:** Đăng xuất, xóa Cookie `access_token`.

---

### 2.2. Phân hệ Bài viết (Posts)

#### `GET /posts`
- **Mô tả:** Lấy danh sách bài viết đã xuất bản (`PUBLISHED`) phục vụ trang chủ và tìm kiếm.
- **Tham số Query:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `categorySlug` (string)
  - `tagSlug` (string)
  - `authorId` (string)
  - `search` (string)
  - `sort` (`latest` | `views`)
- **Response 200 OK:** Danh sách bài viết kèm thông tin tác giả, chuyên mục, thẻ tags và siêu dữ liệu phân trang.

#### `GET /posts/detail/:slug`
- **Mô tả:** Xem chi tiết bài viết, tự động tăng bộ đếm lượt xem nguyên tử (`viewsCount + 1`), trả về bài viết liên quan và trạng thái đã lưu bài (isBookmarked).

#### `GET /posts/manage`
- **Mô tả:** Lấy danh sách bài viết quản trị (Author chỉ thấy bài của mình; Editor/Admin thấy toàn bộ).
- **Quyền hạn:** `AUTHOR`, `EDITOR`, `ADMIN`.

#### `POST /posts`
- **Mô tả:** Tạo bài viết mới.
- **Quyền hạn:** `AUTHOR`, `EDITOR`, `ADMIN`.
- **Request Body:**
  ```json
  {
    "title": "Hướng dẫn bảo mật ứng dụng Express",
    "excerpt": "Tổng hợp kỹ thuật phòng thủ XSS và CSRF",
    "content": "<h2>1. Cấu hình Helmet</h2><p>Nội dung chi tiết...</p>",
    "featuredImage": "https://images.unsplash.com/...",
    "categoryId": "cat-uuid",
    "tagIds": ["tag-1", "tag-2"],
    "status": "DRAFT",
    "allowComments": true
  }
  ```

#### `POST /posts/:id/submit`
- **Mô tả:** Tác giả gửi bài viết để Biên tập viên kiểm duyệt (`DRAFT` $\rightarrow$ `PENDING`).

#### `POST /posts/:id/approve`
- **Mô tả:** Biên tập viên / Admin phê duyệt và xuất bản bài viết (`PENDING` $\rightarrow$ `PUBLISHED`). Tự động gửi thông báo tới tác giả.

#### `POST /posts/:id/reject`
- **Mô tả:** Từ chối bài viết kèm lý do cụ thể (`PENDING` $\rightarrow$ `REJECTED`).

#### `POST /posts/:id/bookmark`
- **Mô tả:** Bật/tắt lưu bài viết yêu thích (Toggle Bookmark).
- **Quyền hạn:** Độc giả đã đăng nhập.

---

### 2.3. Phân hệ Bình luận (Comments)

#### `GET /comments/post/:postId`
- **Mô tả:** Lấy danh sách bình luận đã duyệt của bài viết (cấu trúc phân cấp replies).
- **Quyền hạn:** Công khai.

#### `POST /comments`
- **Mô tả:** Gửi bình luận mới vào bài viết (Rate Limiting: tối đa 10 bình luận/phút).
- **Quyền hạn:** Đã đăng nhập.

#### `PATCH /comments/:id/moderate`
- **Mô tả:** Phê duyệt, từ chối hoặc đánh dấu spam bình luận (`status`: `APPROVED`, `REJECTED`, `SPAM`).
- **Quyền hạn:** `EDITOR`, `ADMIN`.

---

### 2.4. Phân hệ Thống kê Dashboard

#### `GET /dashboard/stats`
- **Mô tả:** Truy vấn toàn bộ chỉ số cards, biểu đồ phân bố danh mục và hoạt động gần nhất từ CSDL thực.
- **Quyền hạn:** `AUTHOR`, `EDITOR`, `ADMIN`.
