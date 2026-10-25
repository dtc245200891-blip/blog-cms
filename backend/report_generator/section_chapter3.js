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

function getChapter3Children() {
  const elements = [];

  // ==========================================
  // CHƯƠNG 3
  // ==========================================
  elements.push(
    h1('CHƯƠNG 3: THIẾT KẾ KIẾN TRÚC PHẦN MỀM VÀ CƠ SỞ DỮ LIỆU NOSQL MONGODB', { pageBreakBefore: true }),

    h2('3.1. Thiết kế kiến trúc tổng thể phần mềm (Three-Tier Architecture)'),
    h3('3.1.1. Mô hình kiến trúc phân tầng 3 lớp (Three-Tier Architecture)'),
    p(
      'Hệ thống Blog/CMS được thiết kế tuân thủ nghiêm ngặt nguyên lý Phân tách mối quan tâm (Separation of Concerns - SoC) theo mô hình kiến trúc phân tầng ba lớp chuẩn mực:'
    ),
    bullet('1. Tầng Trình diễn (Presentation Layer - Frontend): Xây dựng trên nền tảng React 18 SPA. Chịu trách nhiệm tương tác đồ họa với người dùng, kết xuất dữ liệu HTML/CSS, quản lý trạng thái điều hướng bằng React Router v6, quản lý bộ nhớ đệm truy vấn qua TanStack Query v5, và kích hoạt các yêu cầu HTTP bất đồng bộ thông qua thư viện Axios tới máy chủ API.'),
    bullet('2. Tầng Ứng dụng & Dịch vụ (Application / Service Layer - Backend): Máy chủ Express.js viết bằng TypeScript. Đóng vai trò là cổng API Gateway tiếp nhận các yêu cầu HTTP từ máy khách, xử lý các tác vụ an ninh thông qua chuỗi Middleware (Helmet, CORS, Rate Limit, Auth, RBAC), chuyển tiếp dữ liệu vào tầng Điều khiển (Controllers) và Tầng Dịch vụ (Services) để thực thi trọn vẹn logic nghiệp vụ.'),
    bullet('3. Tầng Lưu trữ & Truy cập Dữ liệu (Persistence Layer - Database): Sử dụng hệ quản trị CSDL NoSQL MongoDB 7.0 (kết hợp Prisma ORM MongoDB Connector). Đảm bảo lưu trữ dữ liệu dạng JSON/BSON Document linh hoạt, tối ưu hóa tốc độ truy xuất, hỗ trợ cơ chế Replica Set phân tán và đảm bảo an toàn giao dịch đa tài liệu (Multi-Document ACID Transactions).'),

    h3('3.1.2. Thiết kế tổ chức module mã nguồn Backend (Controller-Service-Repository)'),
    p(
      'Nhằm đảm bảo tính mở rộng cao và dễ bảo trì, mã nguồn Backend được cấu trúc theo mô hình module hóa tính năng (Feature-based Modular Architecture). Mỗi thực thể chức năng (auth, posts, categories, comments, media, dashboard, users, audit, settings) đều tạo thành một module độc lập chứa 3 tệp tin chuyên biệt: Routes (*.routes.ts) khai báo các điểm cuối URL; Controllers (*.controller.ts) tiếp nhận và kiểm thực yêu cầu HTTP; và Services (*.service.ts) thực thi logic nghiệp vụ và tương tác với CSDL qua Prisma.'
    ),

    h2('3.2. Thiết kế Cơ sở dữ liệu NoSQL MongoDB và lược đồ Collections'),
    h3('3.2.1. Phân tích thực thể và mô hình hóa dữ liệu Document MongoDB'),
    p(
      'Cơ sở dữ liệu của hệ thống được tổ chức thành 13 Collections linh hoạt trong MongoDB. Mọi Document đều được ánh xạ trường khóa chính _id dưới dạng chuỗi UUID duy nhất, thiết lập các chỉ mục (Indexes) tốc độ cao và ràng buộc tính toàn vẹn thông qua Prisma Schema:'
    ),

    // Bảng 3.1: posts
    p('Bảng 3.1: Từ điển dữ liệu bảng `posts` (Bài viết - Thực thể trung tâm)', { bold: true, size: 23, color: COLORS.NAVY_PRIMARY, before: 60, after: 40 }),
    createTable(
      ['Trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính định danh UUID v4 duy nhất.'],
        ['title', 'VARCHAR(255)', 'NOT NULL', 'Tiêu đề bài viết.'],
        ['slug', 'VARCHAR(255)', 'UNIQUE, NOT NULL', 'Đường dẫn URL SEO bài viết.'],
        ['excerpt', 'TEXT', 'NULL', 'Đoạn trích tóm tắt mở đầu bài viết.'],
        ['content', 'LONGTEXT', 'NOT NULL', 'Nội dung định dạng HTML đã được khử độc XSS.'],
        ['featuredImage', 'VARCHAR(500)', 'NULL', 'Đường dẫn ảnh đại diện tiêu đề bài viết.'],
        ['status', 'VARCHAR(50)', 'DEFAULT "DRAFT"', 'Trạng thái: DRAFT, PENDING, PUBLISHED, REJECTED, ARCHIVED.'],
        ['rejectionReason', 'TEXT', 'NULL', 'Lý do từ chối bài viết từ Biên tập viên.'],
        ['isPinned', 'BOOLEAN', 'DEFAULT FALSE', 'Cờ ghim bài viết lên vị trí nổi bật trang chủ.'],
        ['allowComments', 'BOOLEAN', 'DEFAULT TRUE', 'Cờ bật hoặc tắt tính năng bình luận độc giả.'],
        ['viewsCount', 'INT', 'DEFAULT 0', 'Bộ đếm tổng số lượt xem bài viết (tăng nguyên tử).'],
        ['publishedAt', 'DATETIME', 'NULL', 'Thời điểm xuất bản bài viết chính thức.'],
        ['authorId', 'VARCHAR(36)', 'FK users(id)', 'Khóa ngoại liên kết tới người viết (Cascade).'],
        ['categoryId', 'VARCHAR(36)', 'FK categories(id)', 'Khóa ngoại liên kết tới chuyên mục (SetNull).'],
        ['createdAt / updatedAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm tạo và cập nhật gần nhất.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.2: users
    p('Bảng 3.2: Từ điển dữ liệu bảng `users` (Quản lý tài khoản và phân quyền)', { bold: true, size: 23, color: COLORS.NAVY_PRIMARY, before: 80, after: 40 }),
    createTable(
      ['Trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính định danh UUID ngẫu nhiên v4.'],
        ['email', 'VARCHAR(191)', 'UNIQUE, NOT NULL', 'Địa chỉ thư điện tử duy nhất của người dùng.'],
        ['username', 'VARCHAR(191)', 'UNIQUE, NOT NULL', 'Tên đăng nhập duy nhất không trùng lặp.'],
        ['passwordHash', 'VARCHAR(255)', 'NOT NULL', 'Mật khẩu đã được băm an toàn bằng thuật toán Bcrypt.'],
        ['fullName', 'VARCHAR(191)', 'NOT NULL', 'Họ và tên hiển thị công khai của người dùng.'],
        ['bio / avatarUrl', 'TEXT / VARCHAR(500)', 'NULL', 'Tiểu sử tác giả và đường dẫn ảnh đại diện.'],
        ['role', 'VARCHAR(50)', 'DEFAULT "READER"', 'Vai trò RBAC: ADMIN, EDITOR, AUTHOR, READER.'],
        ['isActive', 'BOOLEAN', 'DEFAULT TRUE', 'Cờ trạng thái: TRUE (hoạt động), FALSE (bị khóa).'],
        ['createdAt / updatedAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm đăng ký và cập nhật tài khoản.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.3: categories, tags, post_tags
    p('Bảng 3.3: Từ điển dữ liệu nhóm phân loại (`categories`, `tags`, `post_tags`)', { bold: true, size: 23, color: COLORS.NAVY_PRIMARY, before: 80, after: 40 }),
    createTable(
      ['Bảng / Trường', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['categories.id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính UUID v4 danh mục.'],
        ['categories.name / slug', 'VARCHAR(191)', 'UNIQUE(slug)', 'Tên danh mục và đường dẫn SEO không dấu.'],
        ['categories.parentId', 'VARCHAR(36)', 'FK categories(id)', 'Khóa ngoại đệ quy danh mục cha - con.'],
        ['tags.id / name / slug', 'VARCHAR(36)/VARCHAR', 'UNIQUE(slug)', 'Định danh thẻ, tên thẻ và đường dẫn SEO.'],
        ['post_tags.postId', 'VARCHAR(36)', 'PK, FK posts(id)', 'Khóa ngoại liên kết tới bài viết.'],
        ['post_tags.tagId', 'VARCHAR(36)', 'PK, FK tags(id)', 'Khóa ngoại liên kết tới thẻ từ khóa.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.4: comments & bookmarks
    p('Bảng 3.4: Từ điển dữ liệu nhóm tương tác độc giả (`comments`, `bookmarks`)', { bold: true, size: 23, color: COLORS.NAVY_PRIMARY, before: 80, after: 40 }),
    createTable(
      ['Bảng / Trường', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['comments.id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính UUID v4 bình luận.'],
        ['comments.content', 'TEXT', 'NOT NULL', 'Nội dung bình luận đã khử độc XSS.'],
        ['comments.status', 'VARCHAR(50)', 'DEFAULT "APPROVED"', 'Trạng thái: PENDING, APPROVED, REJECTED, SPAM.'],
        ['comments.postId', 'VARCHAR(36)', 'FK posts(id)', 'Khóa ngoại liên kết bài viết được bình luận.'],
        ['comments.authorId', 'VARCHAR(36)', 'FK users(id)', 'Khóa ngoại liên kết người gửi bình luận.'],
        ['comments.parentId', 'VARCHAR(36)', 'FK comments(id)', 'Khóa ngoại đệ quy cho trả lời bình luận (Reply).'],
        ['bookmarks.id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính UUID v4 bài viết đã lưu.'],
        ['bookmarks.(userId, postId)', 'VARCHAR(36)', 'UNIQUE, FK', 'Cặp khóa ngoại liên kết người dùng và bài viết đã lưu.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.5: media, notifications, settings, audit_logs, tokens, views
    p('Bảng 3.5: Từ điển dữ liệu nhóm mở rộng (`media`, `notifications`, `audit_logs`, `settings`, `tokens`, `views`)', { bold: true, size: 23, color: COLORS.NAVY_PRIMARY, before: 80, after: 40 }),
    createTable(
      ['Bảng / Trường', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['media (id, filename, url)', 'VARCHAR(36)/VARCHAR', 'NOT NULL, FK user', 'Lưu trữ thông tin tệp hình ảnh tải lên máy chủ.'],
        ['notifications (title, message)', 'VARCHAR/TEXT', 'NOT NULL, FK user', 'Thông báo thời gian thực gửi tới người dùng.'],
        ['audit_logs (action, entity, ip)', 'VARCHAR(100)/VARCHAR', 'NOT NULL, FK user', 'Nhật ký an toàn thông tin (ai làm gì, thời gian, IP).'],
        ['settings (key, value)', 'VARCHAR(191)/TEXT', 'UNIQUE(key)', 'Cấu hình tham số động website theo cặp key-value.'],
        ['password_reset_tokens (token)', 'VARCHAR(255)', 'UNIQUE, expiresAt', 'Mã token khôi phục mật khẩu dùng 1 lần (1 giờ).'],
        ['post_views (postId, ipHash)', 'VARCHAR(36)/VARCHAR', 'FK posts(id)', 'Ghi nhận lịch sử các lượt đọc bài viết nguyên tử.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    h3('3.2.2. Chiến lược đánh chỉ mục (Indexing Strategy) và ràng buộc toàn vẹn'),
    p(
      'Để đảm bảo tốc độ phản hồi API dưới 100ms ngay cả khi dữ liệu tăng trưởng lên hàng chục ngàn bài viết, hệ thống áp dụng chiến lược đánh chỉ mục B-Tree tại các vị trí trọng yếu: Unique Index trên users(email, username), categories(slug), tags(slug), posts(slug), settings(key); Composite Index trên post_tags(postId, tagId) và bookmarks(userId, postId); Chỉ mục tìm kiếm & phân trang trên posts(status, publishedAt) và posts(authorId).'
    ),

    h2('3.3. Thiết kế Biểu đồ tuần tự (Sequence Diagrams)'),
    h3('3.3.1. Sơ đồ tuần tự: Phê duyệt bài viết xuất bản (Approve Post Sequence)'),
    p(
      'Quy trình tương tác giữa các thành phần khi Biên tập viên phê duyệt bài viết được đặc tả qua các bước tuần tự chặt chẽ:'
    ),
    bullet('Bước 1: Biên tập viên bấm nút "Phê duyệt" bài viết trên màn hình quản trị /admin/posts.'),
    bullet('Bước 2: Giao diện React gửi yêu cầu HTTP POST /api/v1/posts/:id/approve đính kèm JWT Token trong Cookie/Header.'),
    bullet('Bước 3: Lớp Auth Middleware tiếp nhận, giải mã Token JWT, kiểm tra người dùng có vai trò là EDITOR hoặc ADMIN.'),
    bullet('Bước 4: Middleware chuyển tiếp yêu cầu tới PostsController.approvePost().'),
    bullet('Bước 5: Controller gọi hàm PostsService.approvePost(postId, currentUserId).'),
    bullet('Bước 6: Tầng Service thực hiện câu lệnh CSDL cập nhật bảng posts: status = "PUBLISHED", publishedAt = NOW().'),
    bullet('Bước 7: Tầng Service tạo một bản ghi trong bảng notifications gửi tới tác giả bài viết thông báo bài đã được xuất bản.'),
    bullet('Bước 8: Tầng Service ghi một bản ghi vào bảng audit_logs ghi nhận hành động APPROVE_POST.'),
    bullet('Bước 9: Tầng Service trả về đối tượng bài viết đã xuất bản cho Controller.'),
    bullet('Bước 10: Controller trả về mã HTTP 200 OK kèm JSON; giao diện React cập nhật trạng thái bài viết và đưa bài ra Cổng thông tin công khai.'),

    h2('3.4. Thiết kế Giao diện lập trình ứng dụng RESTful API'),
    h3('3.4.1. Chuẩn hóa cấu trúc URL, HTTP Verbs và JSON Response Envelope'),
    p(
      'Toàn bộ các điểm cuối API của hệ thống tuân thủ nghiêm ngặt nguyên lý thiết kế REST (Base URL: http://localhost:5000/api/v1/*; Phương thức GET, POST, PATCH, DELETE; Mã HTTP chuẩn 200, 201, 400, 401, 403, 404, 500) kèm Envelope phản hồi JSON đồng nhất:'
    ),

    codeBox([
      '{',
      '  "success": true,',
      '  "message": "Thông điệp phản hồi từ máy chủ",',
      '  "data": { ... },',
      '  "meta": { "page": 1, "limit": 10, "total": 45, "totalPages": 5 }',
      '}',
    ]),

    h3('3.4.2. Bảng đặc tả chi tiết 25 Endpoint API Backend'),
    p(
      'Bảng 3.6 dưới đây đặc tả đầy đủ 25 Endpoint RESTful API của hệ thống Blog/CMS phục vụ toàn bộ hoạt động của hai phân hệ công khai và quản trị:'
    ),

    p('Bảng 3.6: Danh mục 25 Endpoint RESTful API Backend của hệ thống', {
      bold: true,
      size: 23,
      color: COLORS.NAVY_PRIMARY,
      before: 80,
      after: 40,
    }),
    createTable(
      ['STT', 'Phương thức', 'Đường dẫn Endpoint', 'Quyền hạn (Auth/RBAC)', 'Mô tả chức năng'],
      [
        ['1', 'POST', '/api/v1/auth/register', 'Công khai (Guest)', 'Đăng ký tài khoản độc giả mới.'],
        ['2', 'POST', '/api/v1/auth/login', 'Công khai (Guest)', 'Đăng nhập hệ thống, cấp Cookie và JWT.'],
        ['3', 'POST', '/api/v1/auth/logout', 'Đã đăng nhập', 'Đăng xuất, xóa Cookie phiên làm việc.'],
        ['4', 'GET', '/api/v1/auth/me', 'Đã đăng nhập', 'Lấy thông tin tài khoản hiện tại.'],
        ['5', 'PATCH', '/api/v1/auth/profile', 'Đã đăng nhập', 'Cập nhật họ tên, ảnh đại diện, tiểu sử.'],
        ['6', 'PATCH', '/api/v1/auth/change-password', 'Đã đăng nhập', 'Đổi mật khẩu tài khoản người dùng.'],
        ['7', 'POST', '/api/v1/auth/forgot-password', 'Công khai', 'Gửi yêu cầu cấp token khôi phục mật khẩu.'],
        ['8', 'POST', '/api/v1/auth/reset-password', 'Công khai', 'Đặt lại mật khẩu mới thông qua Token.'],
        ['9', 'GET', '/api/v1/posts', 'Công khai', 'Lấy danh sách bài viết PUBLISHED (lọc, tìm kiếm, phân trang).'],
        ['10', 'GET', '/api/v1/posts/detail/:slug', 'Công khai', 'Xem chi tiết bài viết, tăng viewsCount nguyên tử.'],
        ['11', 'GET', '/api/v1/posts/manage', 'AUTHOR, EDITOR, ADMIN', 'Lấy danh sách bài viết quản trị (Author xem bài mình).'],
        ['12', 'POST', '/api/v1/posts', 'AUTHOR, EDITOR, ADMIN', 'Tạo bài viết mới (bản nháp hoặc xuất bản).'],
        ['13', 'PATCH', '/api/v1/posts/:id', 'AUTHOR, EDITOR, ADMIN', 'Chỉnh sửa bài viết (chống IDOR).'],
        ['14', 'DELETE', '/api/v1/posts/:id', 'AUTHOR, EDITOR, ADMIN', 'Xóa bài viết (chống IDOR).'],
        ['15', 'POST', '/api/v1/posts/:id/submit', 'AUTHOR', 'Tác giả gửi bài viết chờ duyệt (DRAFT -> PENDING).'],
        ['16', 'POST', '/api/v1/posts/:id/approve', 'EDITOR, ADMIN', 'Biên tập viên duyệt xuất bản (PENDING -> PUBLISHED).'],
        ['17', 'POST', '/api/v1/posts/:id/reject', 'EDITOR, ADMIN', 'Từ chối bài viết kèm lý do cụ thể (REJECTED).'],
        ['18', 'GET', '/api/v1/categories', 'Công khai', 'Lấy danh sách danh mục kèm số lượng bài viết.'],
        ['19', 'POST', '/api/v1/categories', 'EDITOR, ADMIN', 'Tạo danh mục mới (hỗ trợ parentId).'],
        ['20', 'GET', '/api/v1/tags', 'Công khai', 'Lấy danh sách thẻ từ khóa.'],
        ['21', 'POST', '/api/v1/comments', 'READER trở lên', 'Gửi bình luận vào bài viết (khử độc XSS).'],
        ['22', 'PATCH', '/api/v1/comments/:id/moderate', 'EDITOR, ADMIN', 'Kiểm duyệt bình luận (APPROVED, SPAM, REJECT).'],
        ['23', 'POST', '/api/v1/media/upload', 'AUTHOR, EDITOR, ADMIN', 'Tải tệp ảnh lên thư viện Media máy chủ.'],
        ['24', 'GET', '/api/v1/dashboard/stats', 'AUTHOR, EDITOR, ADMIN', 'Lấy số liệu thống kê Dashboard và biểu đồ.'],
        ['25', 'GET', '/api/v1/audit-logs', 'ADMIN', 'Xem danh sách nhật ký an toàn hệ thống (Audit Logs).'],
      ],
      { colWidths: [8, 14, 28, 22, 28] }
    )
  );

  return elements;
}

module.exports = { getChapter3Children };
