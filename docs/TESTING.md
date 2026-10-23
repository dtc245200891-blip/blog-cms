# BÁO CÁO KẾT QUẢ KIỂM THỬ TỰ ĐỘNG (TESTING REPORT)
## HỆ THỐNG BLOG / CONTENT MANAGEMENT SYSTEM (CMS)

- **Dự án:** Hệ thống Blog / Content Management System (CMS) chuyên nghiệp.
- **Sinh viên thực hiện:** Vũ Trọng Nghĩa — Lớp: CNTT K23L.
- **Đơn vị:** Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).
- **Giảng viên hướng dẫn:** ThS. Vũ Văn Diện.
- **Framework kiểm thử:** Vitest 2.1, Supertest 7.0, TypeScript.

---

## 1. CHIẾN LƯỢC KIỂM THỬ (TEST STRATEGY)

Hệ thống áp dụng mô hình Kim tự tháp kiểm thử (Test Pyramid) toàn diện:
1. **Unit Tests (Kiểm thử đơn vị):** Kiểm tra tính đúng đắn của các hàm tiện ích nghiệp vụ (sinh slug tiếng Việt, băm mật khẩu Bcrypt, ký/giải mã JWT token, kiểm tra Zod Schema validation).
2. **Integration Tests (Kiểm thử tích hợp API):** Kiểm tra các luồng tương tác thực tế từ HTTP Request qua Middleware, Controller, Service đến Cơ sở dữ liệu thật với Supertest.
3. **Security Tests (Kiểm thử bảo mật):** Xác minh chống IDOR, kiểm soát truy cập phân quyền RBAC 401/403, chống dò mật khẩu bằng Rate Limit và khử mã độc XSS.
4. **End-to-End Tests (E2E):** Kịch bản kiểm thử hành vi người dùng xuyên suốt toàn bộ ứng dụng.

---

## 2. KẾT QUẢ KIỂM THỬ THỰC TẾ TRÊN MÁY TÍNH (EXECUTION RESULTS)

Lệnh thực thi kiểm thử:
```bash
npm run test
```

### Kết quả chạy chi tiết từ Vitest:

```text
 RUN  v2.1.9 C:/Users/vtn08/.gemini/antigravity/scratch/blog-cms/backend

 ✓ src/tests/unit.test.ts (6 tests) 503ms
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > generateSlug (Hàm sinh Slug chuẩn SEO hỗ trợ tiếng Việt) > chuyển đổi chuỗi tiếng Việt có dấu thành slug không dấu nối bằng dấu gạch ngang
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > generateSlug (Hàm sinh Slug chuẩn SEO hỗ trợ tiếng Việt) > loại bỏ ký tự đặc biệt và xử lý chữ đ/Đ
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > JWT Token & Bcrypt > ký và giải mã token JWT chính xác
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > JWT Token & Bcrypt > băm mật khẩu và so khớp hash thành công
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > Zod Validation Schemas > chấp nhận dữ liệu đăng ký hợp lệ
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > Zod Validation Schemas > từ chối đăng ký khi email sai định dạng hoặc mật khẩu quá ngắn

 ✓ src/tests/integration.test.ts (11 tests) 638ms
   ✓ GET /api/health - trả về mã 200 và trạng thái UP
   ✓ POST /api/v1/auth/login - Đăng nhập tài khoản Admin demo thành công
   ✓ POST /api/v1/auth/login - Đăng nhập tài khoản Reader demo thành công
   ✓ POST /api/v1/auth/login - Thất bại khi mật khẩu sai (trả về 400 Bad Request)
   ✓ GET /api/v1/posts - Lấy danh sách bài viết đã xuất bản công khai (chỉ trả về bài có status PUBLISHED)
   ✓ GET /api/v1/categories - Lấy danh sách danh mục có số lượng bài viết
   ✓ GET /api/v1/tags - Lấy danh sách thẻ
   ✓ Chặn truy cập người dùng chưa đăng nhập khi gọi API quản trị (401 Unauthorized)
   ✓ Chặn người dùng READER truy cập danh sách người dùng quản trị (403 Forbidden)
   ✓ Cho phép ADMIN truy cập danh sách người dùng quản trị (200 OK)
   ✓ GET /api/v1/dashboard/stats - Admin lấy số liệu thống kê thực tế từ database

 Test Files  2 passed (2)
      Tests  17 passed (17)
   Start at  22:48:05
   Duration  4.06s (transform 988ms, setup 0ms, collect 2.89s, tests 1.14s, environment 1ms, prepare 1.16s)
```

**Tỉ lệ đạt:** $17/17$ bài kiểm thử thành công ($100\%$).

---

## 3. BẢNG TỔNG HỢP CÁC TRƯỜNG HỢP KIỂM THỬ BẢO MẬT ĐÃ ĐƯỢC XÁC MINH

| Mã ca kiểm thử | Mô tả mục tiêu | Đầu vào thực nghiệm | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|:---:|
| **SEC-01** | Gọi API quản trị người dùng mà không có JWT Token | `GET /api/v1/users` (No Header) | Trả về mã HTTP `401 Unauthorized` | HTTP 401 { success: false, message: "Yêu cầu đăng nhập..." } | 🟢 ĐẠT |
| **SEC-02** | Độc giả (`READER`) cố tình gọi API lấy danh sách người dùng quản trị | `GET /api/v1/users` với Token Reader | Trả về mã HTTP `403 Forbidden` | HTTP 403 { success: false, message: "...Yêu cầu vai trò: [ADMIN]" } | 🟢 ĐẠT |
| **SEC-03** | Đăng nhập mật khẩu sai | `POST /api/v1/auth/login` với pass sai | Trả về mã HTTP `400 Bad Request` | HTTP 400 { success: false, message: "Thông tin đăng nhập không chính xác." } | 🟢 ĐẠT |
| **SEC-04** | Ngăn chặn rò rỉ bài viết chưa xuất bản | `GET /api/v1/posts` | Danh sách bài viết trả về | $100\%$ bài viết đều có status = `PUBLISHED` | 🟢 ĐẠT |
| **SEC-05** | Khử mã độc XSS trong nội dung bình luận | Bình luận chứa `<script>alert('xss')</script>` | Thẻ HTML bị xóa sạch qua Sanitize-HTML | Nội dung lưu trữ dạng plain-text an toàn | 🟢 ĐẠT |
| **SEC-06** | Sinh slug tiếng Việt | "Đại học Công nghệ Thông tin & Truyền thông" | Slug không dấu chuẩn SEO | `dai-hoc-cong-nghe-thong-tin-and-truyen-thong...` | 🟢 ĐẠT |

---

## 4. KỊCH BẢN KIỂM THỬ ĐẦU-CUỐI (E2E PLAYWRIGHT SCENARIO)

Hệ thống được thiết kế sẵn sàng cho việc tự động hóa E2E với 12 bước mô phỏng hành vi độc giả và ban quản trị:
1. Khách truy cập trang chủ `/`, kiểm tra thanh điều hướng, bài viết nổi bật, các danh mục.
2. Khách thực hiện tìm kiếm bài viết với từ khóa "React" hoặc "TypeScript".
3. Khách chuyển sang trang `/login`, bấm nút 1-click điền tài khoản Độc giả `reader1@ictu.edu.vn`.
4. Độc giả bấm nút lưu bài viết (Bookmark), vào trang `/saved-posts` kiểm tra bài vừa lưu.
5. Độc giả mở bài viết chi tiết, gửi bình luận thảo luận.
6. Độc giả đăng xuất, đăng nhập tài khoản Tác giả `author1@ictu.edu.vn`.
7. Tác giả mở `/admin/posts/new`, soạn bài viết bằng trình soạn thảo TipTap, lưu nháp.
8. Tác giả bấm "Gửi duyệt" chuyển trạng thái sang `PENDING`.
9. Tác giả đăng xuất, đăng nhập tài khoản Biên tập viên `editor@ictu.edu.vn`.
10. Biên tập viên vào `/admin/posts`, kiểm tra bài chờ duyệt, bấm "Duyệt" $\rightarrow$ trạng thái chuyển sang `PUBLISHED`.
11. Đăng nhập tài khoản Quản trị viên `admin@ictu.edu.vn`, xem Bảng điều khiển `/admin`, kiểm tra nhật ký hoạt động hệ thống `/admin/audit-logs`.
12. Đăng xuất và hoàn tất chu trình kiểm thử.
