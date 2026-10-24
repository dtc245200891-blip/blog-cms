const {
  Paragraph,
  TextRun,
  AlignmentType,
  p,
  h1,
  h2,
  h3,
  h4,
  bullet,
  callout,
  codeBox,
  createTable,
  COLORS,
} = require('./helpers');

function getChapter5Children() {
  const elements = [];

  // ==========================================
  // CHƯƠNG 5
  // ==========================================
  elements.push(
    h1('CHƯƠNG 5: KIỂM THỬ TỰ ĐỘNG VÀ ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG', { pageBreakBefore: true }),

    h2('5.1. Chiến lược và kế hoạch kiểm thử tự động (Test Strategy)'),
    h3('5.1.1. Mô hình Kim tự tháp kiểm thử phần mềm (Test Pyramid)'),
    p(
      'Kiểm thử tự động là một trong những tiêu chí đánh giá trọng tâm của môn học "Triển khai và hệ thống phần mềm". Việc phụ thuộc vào kiểm thử thủ công (Manual Testing) bằng tay không chỉ tiêu tốn nhiều thời gian, dễ bỏ sót lỗi hồi quy (Regression Bugs) mà còn không đáp ứng được yêu cầu của các đường ống CI/CD hiện đại. Đề tài áp dụng mô hình Kim tự tháp kiểm thử (Test Pyramid) được chuẩn hóa theo 3 tầng:'
    ),
    bullet('Tầng đáy - Kiểm thử đơn vị (Unit Tests): Tập trung kiểm thử các hàm thuật toán độc lập, các hàm tiện ích xử lý chuỗi (slug), hàm mã hóa mật khẩu, hàm ký/giải mã JWT và các bộ quy tắc kiểm thực dữ liệu Zod Schema mà không cần khởi động toàn bộ máy chủ.'),
    bullet('Tầng giữa - Kiểm thử tích hợp API (Integration Tests): Kiểm thử sự phối hợp hoàn chỉnh giữa các lớp trong hệ thống từ HTTP Request, Router, Middleware, Controller, Service cho tới cơ sở dữ liệu thật thông qua thư viện Supertest.'),
    bullet('Tầng đỉnh - Kiểm thử an toàn bảo mật (Security Tests) & Kiểm thử đầu-cuối (E2E): Kiểm thử các tình huống tấn công vượt quyền (Privilege Escalation), chặn rò rỉ dữ liệu chưa xuất bản, kiểm thử tính toàn vẹn phiên làm việc và kịch bản hành vi người dùng xuyên suốt toàn bộ hệ thống.'),

    h3('5.1.2. Môi trường và công cụ kiểm thử tự động'),
    bullet('Vitest 2.1: Bộ công cụ kiểm thử thế hệ mới tốc độ cực cao, tương thích hoàn toàn với hệ sinh thái Vite và TypeScript.'),
    bullet('Supertest 7.0: Thư viện giả lập các yêu cầu HTTP máy khách (GET, POST, PATCH, DELETE) gửi tới đối tượng Express App mà không cần mở cổng mạng thật, giúp các bài kiểm thử tích hợp thực thi trong vài phần trăm giây.'),

    h2('5.2. Danh mục và kết quả các ca kiểm thử đơn vị (Unit Tests)'),
    p(
      'Tệp backend/src/tests/unit.test.ts thiết lập 6 ca kiểm thử đơn vị bao phủ toàn bộ các hàm cốt lõi (Bảng 5.1):'
    ),

    p('Bảng 5.1: Danh mục 6 ca kiểm thử đơn vị (Unit Tests)', {
      bold: true,
      size: 24,
      color: COLORS.NAVY_PRIMARY,
      before: 120,
      after: 80,
    }),
    createTable(
      ['Mã Test', 'Module kiểm thử', 'Đầu vào thử nghiệm', 'Kết quả mong đợi', 'Kết quả thực tế', 'Đánh giá'],
      [
        [
          'UT-01',
          'generateSlug (Xử lý tiếng Việt)',
          '"Đại học Công nghệ Thông tin & Truyền thông"',
          'dai-hoc-cong-nghe-thong-tin-and-truyen-thong',
          'Chuỗi không dấu chuẩn SEO',
          '🟢 PASS',
        ],
        [
          'UT-02',
          'generateSlug (Xử lý chữ đ/Đ và ký tự lạ)',
          '"Điểm Đến Số 1 Đồ Án @2026!!!"',
          'diem-den-so-1-do-an-2026',
          'Chuyển đ thành d, loại bỏ ký tự lạ',
          '🟢 PASS',
        ],
        [
          'UT-03',
          'JWT Token Service',
          'Ký token với payload { userId: "123", role: "ADMIN" }',
          'Giải mã ra đúng payload nguyên vẹn, role=ADMIN',
          'Xác thực và giải mã chính xác 100%',
          '🟢 PASS',
        ],
        [
          'UT-04',
          'Bcrypt Password Hash',
          'Mật khẩu gốc "Password@123"',
          'Băm ra chuỗi 60 ký tự, so sánh bcrypt.compare trả về true',
          'So khớp đúng và chặn mật khẩu sai',
          '🟢 PASS',
        ],
        [
          'UT-05',
          'Zod Register Schema (Hợp lệ)',
          'Dữ liệu đăng ký đầy đủ email, username, password mạnh',
          'Zod parse thành công không ném ngoại lệ',
          'Chấp thuận dữ liệu chuẩn',
          '🟢 PASS',
        ],
        [
          'UT-06',
          'Zod Register Schema (Không hợp lệ)',
          'Email sai định dạng "abc", password quá ngắn (<6 ký tự)',
          'Zod từ chối và trả về lỗi ZodError chi tiết',
          'Phát hiện chính xác lỗi định dạng',
          '🟢 PASS',
        ],
      ],
      { colWidths: [12, 24, 26, 22, 16] }
    ),

    h2('5.3. Danh mục và kết quả các ca kiểm thử tích hợp (Integration Tests)'),
    p(
      'Tệp backend/src/tests/integration.test.ts thiết lập 8 ca kiểm thử tích hợp luồng nghiệp vụ API tương tác trực tiếp với cơ sở dữ liệu thật (Bảng 5.2):'
    ),

    p('Bảng 5.2: Danh mục 8 ca kiểm thử tích hợp API (Integration Tests)', {
      bold: true,
      size: 24,
      color: COLORS.NAVY_PRIMARY,
      before: 120,
      after: 80,
    }),
    createTable(
      ['Mã Test', 'Endpoint API', 'Phương thức & Dữ liệu', 'Kết quả mong đợi', 'Kết quả thực tế', 'Đánh giá'],
      [
        [
          'IT-01',
          '/api/health',
          'GET không cần token',
          'HTTP 200 { status: "UP", timestamp: ... }',
          'HTTP 200, phản hồi trạng thái hoạt động tốt',
          '🟢 PASS',
        ],
        [
          'IT-02',
          '/api/v1/auth/login',
          'POST tài khoản Admin demo (admin@ictu.edu.vn)',
          'HTTP 200, trả về User Admin và Token JWT hợp lệ',
          'HTTP 200, cấp token và Cookie thành công',
          '🟢 PASS',
        ],
        [
          'IT-03',
          '/api/v1/auth/login',
          'POST tài khoản Reader demo (reader1@ictu.edu.vn)',
          'HTTP 200, trả về User Reader và Token JWT hợp lệ',
          'HTTP 200, cấp token vai trò READER',
          '🟢 PASS',
        ],
        [
          'IT-04',
          '/api/v1/auth/login',
          'POST tài khoản đúng nhưng mật khẩu sai',
          'HTTP 400 Bad Request, báo thông tin không chính xác',
          'HTTP 400, chặn đăng nhập thành công',
          '🟢 PASS',
        ],
        [
          'IT-05',
          '/api/v1/posts',
          'GET danh sách bài viết công khai',
          'HTTP 200, 100% bài viết trả về có status = PUBLISHED',
          'HTTP 200, không bị lộ bài nháp hay chờ duyệt',
          '🟢 PASS',
        ],
        [
          'IT-06',
          '/api/v1/categories',
          'GET danh sách chuyên mục',
          'HTTP 200, danh sách chuyên mục kèm số bài viết',
          'HTTP 200, kèm trường _count.posts chuẩn xác',
          '🟢 PASS',
        ],
        [
          'IT-07',
          '/api/v1/tags',
          'GET danh sách thẻ từ khóa',
          'HTTP 200, danh sách thẻ kèm số bài viết',
          'HTTP 200, trả về đúng danh sách thẻ mẫu',
          '🟢 PASS',
        ],
        [
          'IT-08',
          '/api/v1/dashboard/stats',
          'GET số liệu Dashboard với Token Admin',
          'HTTP 200, trả về tổng số bài viết, users, comments thật',
          'HTTP 200, số liệu đếm trực tiếp từ CSDL thật',
          '🟢 PASS',
        ],
        [
          'IT-09',
          '/metrics & /api/v1/metrics',
          'GET Prometheus Metrics cho Grafana',
          'HTTP 200, xuất dữ liệu định dạng Prometheus',
          'HTTP 200 text/plain, chứa đầy đủ metric hệ thống',
          '🟢 PASS',
        ],
        [
          'IT-10',
          '/api/v1/users/stats',
          'GET phân bổ thống kê người dùng theo vai trò',
          'HTTP 200, số lượng tài khoản theo Admin, Editor, Author, Reader',
          'HTTP 200, đếm phân nhóm tài khoản chính xác',
          '🟢 PASS',
        ],
        [
          'IT-11',
          'POST /api/v1/users',
          'Admin tạo mới tài khoản người dùng',
          'HTTP 201 Created, tạo tài khoản và ghi nhận Audit Log',
          'HTTP 201, băm mật khẩu Bcrypt và lưu DB thành công',
          '🟢 PASS',
        ],
        [
          'IT-12',
          'PATCH /api/v1/users/:id/admin',
          'Admin thay đổi vai trò RBAC và khóa / mở khóa tài khoản',
          'HTTP 200, cập nhật trạng thái và vô hiệu phiên đăng nhập',
          'HTTP 200, cập nhật tức thì vào CSDL',
          '🟢 PASS',
        ],
        [
          'IT-13',
          'PATCH /api/v1/users/:id/reset-password',
          'Admin đặt lại mật khẩu mới cho người dùng',
          'HTTP 200, băm mật khẩu mới và ghi nhận Audit Log',
          'HTTP 200, đặt lại mật khẩu an toàn',
          '🟢 PASS',
        ],
        [
          'IT-14',
          'DELETE /api/v1/users/:id',
          'Admin xóa tài khoản người dùng',
          'HTTP 200, xóa các bảng liên kết an toàn theo Transaction',
          'HTTP 200, xử lý an toàn dữ liệu bài viết và xóa tài khoản',
          '🟢 PASS',
        ],
      ],
      { colWidths: [12, 22, 26, 22, 18] }
    ),

    h2('5.4. Danh mục và kết quả các ca kiểm thử an toàn phân quyền bảo mật (Security Tests)'),
    p(
      'Nhằm xác minh mức độ an toàn của hệ thống phân quyền RBAC và khả năng chống leo thang đặc quyền, 3 ca kiểm thử bảo mật chuyên sâu đã được thực thi (Bảng 5.3):'
    ),

    p('Bảng 5.3: Bằng chứng kiểm thử bảo mật phân quyền RBAC', {
      bold: true,
      size: 24,
      color: COLORS.NAVY_PRIMARY,
      before: 120,
      after: 80,
    }),
    createTable(
      ['Mã Test', 'Mục tiêu kiểm thử', 'Kịch bản thực nghiệm', 'Kết quả mong đợi', 'Kết quả thực tế', 'Đánh giá'],
      [
        [
          'SEC-01',
          'Chặn người dùng chưa đăng nhập gọi API Quản trị',
          'Gửi request GET /api/v1/users mà không có Cookie hay Authorization Header',
          'Trả về HTTP 401 Unauthorized kèm thông báo yêu cầu đăng nhập',
          'HTTP 401 { success: false, message: "Yêu cầu đăng nhập..." }',
          '🟢 PASS',
        ],
        [
          'SEC-02',
          'Chặn tài khoản Độc giả (READER) truy cập API Quản trị',
          'Sử dụng Token JWT của tài khoản Reader để gọi GET /api/v1/users',
          'Trả về HTTP 403 Forbidden kèm thông báo không đủ thẩm quyền',
          'HTTP 403 { success: false, message: "Yêu cầu vai trò: [ADMIN]" }',
          '🟢 PASS',
        ],
        [
          'SEC-03',
          'Cấp quyền truy cập cho Quản trị viên (ADMIN)',
          'Sử dụng Token JWT của tài khoản Admin để gọi GET /api/v1/users',
          'Trả về HTTP 200 OK kèm danh sách đầy đủ người dùng trong CSDL',
          'HTTP 200 OK, trả về danh sách 6 tài khoản mẫu',
          '🟢 PASS',
        ],
      ],
      { colWidths: [12, 22, 26, 22, 18] }
    ),

    h2('5.5. Tổng hợp báo cáo kết quả kiểm thử thực tế từ Vitest (24/24 Passed - 100%)'),
    p(
      'Toàn bộ quá trình kiểm thử tự động được thực thi trên môi trường máy tính của sinh viên bằng lệnh `npm run test` và ghi nhận kết quả thực tế xuất sắc:'
    ),

    codeBox([
      ' RUN  v2.1.9 C:/Users/vtn08/.gemini/antigravity/scratch/blog-cms/backend',
      '',
      ' ✓ src/tests/unit.test.ts (6 tests) 653ms',
      '   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > generateSlug > chuyển đổi tiếng Việt có dấu thành slug chuẩn',
      '   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > generateSlug > loại bỏ ký tự đặc biệt và xử lý chữ đ/Đ',
      '   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > JWT Token & Bcrypt > ký và giải mã token JWT chính xác',
      '   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > JWT Token & Bcrypt > băm mật khẩu và so khớp hash thành công',
      '   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > Zod Validation Schemas > chấp nhận dữ liệu đăng ký hợp lệ',
      '   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > Zod Validation Schemas > từ chối đăng ký khi email/mật khẩu sai',
      '',
      ' ✓ src/tests/integration.test.ts (18 tests) 4191ms',
      '   ✓ GET /api/health - trả về mã 200 và trạng thái UP',
      '   ✓ GET /metrics - trả về dữ liệu giám sát Prometheus cho Grafana',
      '   ✓ GET /api/v1/metrics - trả về dữ liệu định dạng Prometheus v1',
      '   ✓ POST /api/v1/auth/login - Đăng nhập tài khoản Admin demo thành công',
      '   ✓ POST /api/v1/auth/login - Đăng nhập tài khoản Reader demo thành công',
      '   ✓ POST /api/v1/auth/login - Thất bại khi mật khẩu sai (trả về 400 Bad Request)',
      '   ✓ GET /api/v1/posts - Lấy danh sách bài viết đã xuất bản công khai (chỉ trả về bài PUBLISHED)',
      '   ✓ GET /api/v1/categories - Lấy danh sách danh mục có số lượng bài viết',
      '   ✓ GET /api/v1/tags - Lấy danh sách thẻ',
      '   ✓ Chặn truy cập người dùng chưa đăng nhập khi gọi API quản trị (401 Unauthorized)',
      '   ✓ Chặn người dùng READER truy cập danh sách người dùng quản trị (403 Forbidden)',
      '   ✓ Cho phép ADMIN truy cập danh sách người dùng quản trị (200 OK)',
      '   ✓ GET /api/v1/dashboard/stats - Admin lấy số liệu thống kê thực tế từ database',
      '   ✓ GET /api/v1/users/stats - Admin lấy thống kê phân bổ người dùng theo vai trò',
      '   ✓ POST /api/v1/users - Admin tạo người dùng mới thành công',
      '   ✓ PATCH /api/v1/users/:id/admin - Admin đổi vai trò và khóa tài khoản',
      '   ✓ PATCH /api/v1/users/:id/reset-password - Admin đặt lại mật khẩu cho người dùng',
      '   ✓ DELETE /api/v1/users/:id - Admin xóa người dùng thành công',
      '',
      ' Test Files  2 passed (2)',
      '      Tests  24 passed (24)',
      '   Start at  21:37:35',
      '   Duration  12.39s (transform 2.40s, setup 0ms, collect 8.00s, tests 4.84s, environment 1ms, prepare 1.89s)',
    ]),

    p('Bảng 5.4: Bảng tổng kết kết quả kiểm thử tự động của đồ án', {
      bold: true,
      size: 24,
      color: COLORS.NAVY_PRIMARY,
      before: 120,
      after: 80,
    }),
    createTable(
      ['Nhóm kiểm thử', 'Số lượng ca kiểm thử', 'Số ca thành công (Passed)', 'Số ca thất bại (Failed)', 'Tỉ lệ đạt'],
      [
        ['Unit Tests (Tiện ích, Slug, Zod, JWT, Bcrypt)', '6 ca', '6 ca', '0 ca', '100%'],
        ['Integration & Monitoring Tests (API, DB, Metrics)', '11 ca', '11 ca', '0 ca', '100%'],
        ['Security & Admin RBAC Tests (Cấp quyền, Khóa, Mật khẩu)', '7 ca', '7 ca', '0 ca', '100%'],
        ['TỔNG CỘNG TOÀN BỘ HỆ THỐNG', '24 ca kiểm thử', '24 ca PASSED', '0 ca FAILED', '24/24 (100%)'],
      ],
      { colWidths: [38, 18, 18, 16, 10] }
    ),

    h2('5.6. Kịch bản kiểm thử đầu-cuối (E2E Test Scenario 12 bước) phục vụ bảo vệ đồ án'),
    p(
      'Hệ thống được thiết kế với kịch bản trình diễn và kiểm thử đầu-cuối (End-to-End) khép kín gồm 12 bước mạch lạc, phục vụ việc bảo vệ trực tiếp trước Hội đồng chấm thi của Trường Đại học Công nghệ Thông tin và Truyền thông:'
    ),
    bullet('Bước 1: Khách vãng lai truy cập Trang chủ (/), lướt xem các bài viết nổi bật, các danh mục và thẻ từ khóa thịnh hành.'),
    bullet('Bước 2: Khách nhập từ khóa tìm kiếm "React" trên thanh điều hướng, xem kết quả tìm kiếm được phân trang mượt mà.'),
    bullet('Bước 3: Khách bấm vào một bài viết bất kỳ (/posts/:slug) để đọc nội dung; hệ thống tự động tăng viewsCount nguyên tử thêm 1 đơn vị.'),
    bullet('Bước 4: Khách chuyển tới trang /login, sử dụng nút 1-click để tự động điền tài khoản Độc giả (reader1@ictu.edu.vn / Password@123) và đăng nhập.'),
    bullet('Bước 5: Độc giả bấm nút lưu bài viết (Bookmark), sau đó truy cập trang /saved-posts kiểm tra bài viết vừa lưu xuất hiện ngay lập tức.'),
    bullet('Bước 6: Độc giả kéo xuống chân bài viết, gửi một bình luận thảo luận; bình luận hiển thị tức thì sau khi được làm sạch khử XSS.'),
    bullet('Bước 7: Độc giả đăng xuất, đăng nhập vào tài khoản Tác giả (author1@ictu.edu.vn / Password@123).'),
    bullet('Bước 8: Tác giả mở trang /admin/posts/new, soạn thảo bài viết mới bằng TipTap WYSIWYG, định dạng tiêu đề, chèn ảnh và bấm "Lưu bản nháp".'),
    bullet('Bước 9: Tác giả bấm "Gửi phê duyệt" để chuyển trạng thái bài viết từ DRAFT sang PENDING.'),
    bullet('Bước 10: Tác giả đăng xuất, đăng nhập vào tài khoản Biên tập viên (editor@ictu.edu.vn / Password@123).'),
    bullet('Bước 11: Biên tập viên mở danh sách bài chờ duyệt (/admin/posts), thẩm định bài viết vừa gửi và bấm "Phê duyệt" (chuyển sang PUBLISHED). Bài viết lập tức xuất hiện ngoài trang chủ và tác giả nhận được thông báo chúc mừng.'),
    bullet('Bước 12: Đăng nhập tài khoản Quản trị viên (admin@ictu.edu.vn), xem Bảng điều khiển /admin để theo dõi biểu đồ số liệu Recharts và mở /admin/audit-logs để chứng kiến toàn bộ lịch sử 11 bước trước đó đã được hệ thống ghi nhận vết kiểm toán an toàn tuyệt đối.')
  );

  return elements;
}

module.exports = { getChapter5Children };
