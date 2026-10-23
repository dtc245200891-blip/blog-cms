# TÀI LIỆU ĐẶC TẢ YÊU CẦU PHẦN MỀM (SRS)
## HỆ THỐNG BLOG / CONTENT MANAGEMENT SYSTEM (CMS)

- **Dự án:** Hệ thống Blog / Content Management System (CMS) chuyên nghiệp.
- **Sinh viên thực hiện:** Vũ Trọng Nghĩa.
- **Lớp:** CNTT K23L.
- **Đơn vị:** Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).
- **Giảng viên hướng dẫn:** ThS. Vũ Văn Diện.
- **Múi giờ:** Asia/Ho_Chi_Minh | **Định dạng ngày:** dd/MM/yyyy.

---

## 1. GIỚI THIỆU TỔNG QUAN

### 1.1. Mục tiêu
Xây dựng một hệ thống xuất bản và quản trị nội dung (Blog/CMS) hoàn chỉnh, hoạt động thực tế, đáp ứng các tiêu chuẩn công nghiệp về kiến trúc phần mềm, bảo mật, phân quyền RBAC đa cấp độ, trải nghiệm người dùng hiện đại và khả năng kiểm thử tự động.

### 1.2. Phạm vi dự án
Hệ thống bao gồm hai phân hệ chính:
1. **Phân hệ Cổng thông tin công khai (Public Portal):** Độc giả có thể đọc bài viết, tìm kiếm, lọc theo chuyên mục và thẻ, gửi bình luận thảo luận, lưu bài viết yêu thích, chia sẻ bài viết và quản lý hồ sơ cá nhân.
2. **Phân hệ Quản trị nội dung (Admin CMS):** Dành cho Quản trị viên (Admin), Biên tập viên (Editor) và Tác giả (Author) để theo dõi dashboard thống kê, quản lý vòng đời bài viết, phê duyệt/từ chối bài viết, kiểm duyệt bình luận, quản lý media, quản lý người dùng và xem nhật ký hoạt động (audit logs).

---

## 2. CÁC TÁC NHÂN VÀ PHÂN QUYỀN (ACTORS & RBAC)

Hệ thống thiết lập 4 vai trò người dùng được kiểm tra nghiêm ngặt tại tầng Backend:

| Vai trò (Role) | Mô tả & Thẩm quyền chính |
|---|---|
| **Khách (Guest)** | Xem bài viết đã xuất bản (`PUBLISHED`), tìm kiếm, xem danh mục, tác giả, đăng ký tài khoản, đăng nhập. Không có quyền truy cập trang quản trị. |
| **Độc giả (Reader)** | Kế thừa toàn bộ quyền của Khách; Cập nhật hồ sơ, đổi mật khẩu; Bình luận vào bài viết; Trả lời bình luận; Lưu/bỏ lưu bài viết (Bookmark); Xem thông báo cá nhân. |
| **Tác giả (Author)** | Kế thừa quyền của Độc giả; Tạo bài viết mới; Soạn thảo với TipTap Rich Text; Lưu bản nháp (`DRAFT`); Gửi bài viết để ban biên tập phê duyệt (`PENDING`); Tải ảnh lên thư viện Media; Xem thống kê các bài viết do mình viết; Chỉnh sửa/xóa bài viết của chính mình (chống IDOR). |
| **Biên tập viên (Editor)** | Xem toàn bộ bài viết chờ duyệt (`PENDING`); Duyệt bài (`APPROVE` -> `PUBLISHED`); Từ chối bài viết kèm lý do cụ thể (`REJECT` -> gửi thông báo cho tác giả); Quản lý danh mục và thẻ bài viết; Kiểm duyệt bình luận (`PENDING`, `APPROVED`, `REJECTED`, `SPAM`). |
| **Quản trị viên (Admin)** | Quyền hạn tối cao; Quản lý người dùng (thay đổi vai trò RBAC, khóa/mở khóa tài khoản); Quản trị toàn bộ bài viết, chuyên mục, thẻ, bình luận, tệp media; Cấu hình hệ thống; Xem bảng điều khiển và nhật ký hoạt động hệ thống. |

---

## 3. YÊU CẦU CHỨC NĂNG (FUNCTIONAL REQUIREMENTS)

### 3.1. Phân hệ Xác thực và Tài khoản (Authentication & Account)
- **FR-AUTH-01:** Đăng ký tài khoản mới với email duy nhất, tên đăng nhập duy nhất, họ tên và mật khẩu mã hóa (mặc định vai trò `READER`).
- **FR-AUTH-02:** Đăng nhập bằng Email hoặc Tên đăng nhập kết hợp mật khẩu. Cung cấp cơ chế Cookie bảo mật HttpOnly và JWT Bearer.
- **FR-AUTH-03:** Đăng xuất an toàn, xóa cookie phiên đăng nhập.
- **FR-AUTH-04:** Khôi phục mật khẩu qua quy trình tạo token dùng một lần có hạn ngạch thời gian (1 giờ).
- **FR-AUTH-05:** Cập nhật thông tin hồ sơ (họ tên, ảnh đại diện, tiểu sử) và đổi mật khẩu.
- **FR-AUTH-06:** Giới hạn tốc độ gửi yêu cầu (Rate Limiting) để chống brute-force mật khẩu.

### 3.2. Phân hệ Quản lý Bài viết (Posts Management)
- **FR-POST-01:** Tạo bài viết mới với Tiêu đề, Tóm tắt ngắn, Nội dung Rich Text (TipTap), Ảnh đại diện, Chuyên mục, Thẻ tags.
- **FR-POST-02:** Tự động sinh Slug duy nhất chuẩn SEO, xử lý loại bỏ dấu tiếng Việt an toàn.
- **FR-POST-03:** Vòng đời trạng thái bài viết:
  - `DRAFT` (Bản nháp) $\rightarrow$ `PENDING` (Chờ duyệt) $\rightarrow$ `PUBLISHED` (Đã xuất bản)
  - `PENDING` $\rightarrow$ `REJECTED` (Bị từ chối kèm lý do) $\rightarrow$ Tác giả sửa lại $\rightarrow$ `PENDING`
  - `PUBLISHED` $\rightarrow$ `ARCHIVED` (Lưu trữ).
- **FR-POST-04:** Chống IDOR: Tác giả chỉ được chỉnh sửa hoặc xóa bài viết do chính mình tạo ra.
- **FR-POST-05:** Phê duyệt bài viết: Biên tập viên và Quản trị viên duyệt bài, tự động ghi nhận thời gian xuất bản và gửi thông báo cho tác giả.
- **FR-POST-06:** Lọc bài viết theo trạng thái, chuyên mục, thẻ, tác giả, tìm kiếm từ khóa và phân trang.
- **FR-POST-07:** Đếm lượt xem bài viết nguyên tử (Atomic View Increment) và lưu trữ bản ghi `post_views`.

### 3.3. Phân hệ Danh mục và Thẻ (Categories & Tags)
- **FR-CAT-01:** Quản lý danh mục bài viết (Thêm, Sửa, Xóa). Hỗ trợ danh mục cha - con.
- **FR-CAT-02:** Không cho phép xóa danh mục khi đang có bài viết hoặc danh mục con để bảo vệ toàn vẹn dữ liệu.
- **FR-TAG-01:** Quản lý thẻ từ khóa, tự động sinh slug, gắn nhiều thẻ vào một bài viết (quan hệ Nhiều - Nhiều).

### 3.4. Phân hệ Bình luận (Comments)
- **FR-COM-01:** Độc giả đã đăng nhập có thể gửi bình luận vào bài viết cho phép bình luận.
- **FR-COM-02:** Hỗ trợ cấu trúc bình luận phân cấp (trả lời bình luận gốc).
- **FR-COM-03:** Làm sạch nội dung bình luận (Sanitize) loại bỏ mã HTML độc hại chống XSS.
- **FR-COM-04:** Kiểm duyệt bình luận theo chính sách hệ thống (`PENDING`, `APPROVED`, `REJECTED`, `SPAM`).

### 3.5. Phân hệ Media
- **FR-MED-01:** Tải ảnh lên máy chủ (Multer), kiểm tra MIME type (`image/jpeg`, `image/png`, `image/webp`, `image/gif`), giới hạn dung lượng 5MB.
- **FR-MED-02:** Đổi tên file duy nhất theo timestamp và chuỗi ngẫu nhiên, ngăn chặn path traversal.

### 3.6. Phân hệ Thống kê Dashboard
- **FR-DASH-01:** Thống kê tổng số bài viết, bài đã xuất bản, bản nháp, bài chờ duyệt, tổng người dùng, tổng bình luận, tổng lượt xem.
- **FR-DASH-02:** Biểu đồ phân bố bài viết theo danh mục (Recharts).
- **FR-DASH-03:** Bảng xếp hạng 5 bài viết có lượt xem cao nhất.
- **FR-DASH-04:** Danh sách nhật ký hoạt động gần nhất.

---

## 4. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)

- **NFR-SEC (Bảo mật):** Mật khẩu băm bằng thuật toán Bcrypt 10 rounds; Bảo vệ CSRF và XSS; Helmet cấu hình tiêu đề HTTP; Rate limiting; Xác thực kép qua HttpOnly Cookie và Authorization Bearer Header.
- **NFR-PERF (Hiệu năng):** Thời gian phản hồi API trung bình dưới 100ms; Đánh chỉ mục (Index) trên các cột tìm kiếm và lọc (`slug`, `status`, `publishedAt`, `authorId`, `categoryId`).
- **NFR-RESP (Giao diện):** Tương thích 100% với màn hình di động (375px), máy tính bảng (768px), laptop (1024px) và máy tính để bàn (1440px+).
- **NFR-MAINT (Bảo trì):** Mã nguồn viết bằng TypeScript strictly typed cho cả Frontend và Backend; Tách lớp rõ ràng (Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Prisma ORM).
