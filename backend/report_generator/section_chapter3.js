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
    h1('CHƯƠNG 3: THIẾT KẾ KIẾN TRÚC PHẦN MỀM VÀ CƠ SỞ DỮ LIỆU QUAN HỆ', { pageBreakBefore: true }),

    h2('3.1. Thiết kế kiến trúc tổng thể phần mềm (System Architecture)'),
    h3('3.1.1. Mô hình kiến trúc phân tầng 3 lớp (Three-Tier Architecture)'),
    p(
      'Hệ thống Blog/CMS được thiết kế tuân thủ nghiêm ngặt nguyên lý Phân tách mối quan tâm (Separation of Concerns - SoC) theo mô hình kiến trúc phân tầng ba lớp chuẩn mực:'
    ),
    bullet('1. Tầng Trình diễn (Presentation Layer - Frontend): Xây dựng trên nền tảng React 18 SPA. Chịu trách nhiệm tương tác đồ họa với người dùng, kết xuất dữ liệu HTML/CSS, quản lý trạng thái điều hướng bằng React Router v6, quản lý bộ nhớ đệm truy vấn qua TanStack Query v5, và kích hoạt các yêu cầu HTTP bất đồng bộ thông qua thư viện Axios tới máy chủ API.'),
    bullet('2. Tầng Ứng dụng & Dịch vụ (Application / Service Layer - Backend): Máy chủ Express.js viết bằng TypeScript. Đóng vai trò là cổng API Gateway tiếp nhận các yêu cầu HTTP từ máy khách, xử lý các tác vụ an ninh thông qua chuỗi Middleware (Helmet, CORS, Rate Limit, Auth, RBAC), chuyển tiếp dữ liệu vào tầng Điều khiển (Controllers) và Tầng Dịch vụ (Services) để thực thi trọn vẹn logic nghiệp vụ.'),
    bullet('3. Tầng Lưu trữ & Truy cập Dữ liệu (Persistence Layer - Database): Sử dụng hệ quản trị CSDL quan hệ MySQL 8.0 (kết hợp Prisma ORM Client). Đảm bảo lưu trữ dữ liệu an toàn, thực thi các truy vấn quan hệ phức tạp, quản lý giao dịch nguyên tử (ACID Transactions) và ánh xạ đối tượng quan hệ an toàn kiểu tĩnh tuyệt đối.'),

    h3('3.1.2. Thiết kế tổ chức module mã nguồn Backend (Controller-Service-Repository)'),
    p(
      'Nhằm đảm bảo tính mở rộng cao và dễ bảo trì, mã nguồn Backend được cấu trúc theo mô hình module hóa tính năng (Feature-based Modular Architecture). Mỗi thực thể chức năng (auth, posts, categories, comments, media, dashboard, users, audit, settings) đều tạo thành một module độc lập chứa 3 tệp tin chuyên biệt:'
    ),
    bullet('Routes (*.routes.ts): Định nghĩa các điểm cuối URL (Endpoints), phương thức HTTP (GET, POST, PATCH, DELETE) và gắn các middleware xác thực, phân quyền tương ứng.'),
    bullet('Controllers (*.controller.ts): Tiếp nhận HTTP Request từ máy khách, trích xuất dữ liệu từ body/params/query, gọi bộ kiểm thực Zod để xác minh dữ liệu, gọi tầng Service và đóng gói HTTP Response gửi về cho trình duyệt.'),
    bullet('Services (*.service.ts): Trái tim của hệ thống chứa toàn bộ quy tắc nghiệp vụ (Business Rules). Trực tiếp tương tác với Prisma ORM Client để đọc/ghi cơ sở dữ liệu, kiểm tra quyền tác giả (chống IDOR), xử lý dữ liệu (băm mật khẩu, sinh slug, khử độc XSS) và ghi nhận nhật ký audit log.'),

    h2('3.2. Thiết kế Cơ sở dữ liệu quan hệ (Relational Database Design)'),
    h3('3.2.1. Phân tích thực thể và chuẩn hóa CSDL mức 3NF'),
    p(
      'Cơ sở dữ liệu của hệ thống được chuẩn hóa triệt để đạt mức Dạng chuẩn 3 (3rd Normal Form - 3NF): mọi thuộc tính không khóa đều phụ thuộc hoàn toàn vào khóa chính, không tồn tại phụ thuộc bắc cầu, loại bỏ hoàn toàn hiện tượng dư thừa dữ liệu (Data Redundancy) và dị thường trong các thao tác thêm, sửa, xóa.'
    ),
    p(
      'Hệ thống bao gồm 13 bảng dữ liệu quan hệ được liên kết chặt chẽ thông qua các khóa ngoại (Foreign Keys) có ràng buộc toàn vẹn tham chiếu:'
    ),
    bullet('1. users: Bảng quản lý toàn bộ tài khoản người dùng, vai trò RBAC và trạng thái kích hoạt.'),
    bullet('2. categories: Bảng quản lý các chuyên mục bài viết, hỗ trợ cấu trúc phân cấp cây đệ quy.'),
    bullet('3. tags: Bảng quản lý các thẻ từ khóa phân loại bài viết.'),
    bullet('4. posts: Bảng trung tâm lưu trữ thông tin bài viết, nội dung HTML, lượt xem và trạng thái vòng đời.'),
    bullet('5. post_tags: Bảng trung gian giải quyết mối quan hệ Nhiều - Nhiều (N-N) giữa bài viết và thẻ.'),
    bullet('6. comments: Bảng lưu trữ bình luận của độc giả, hỗ trợ quan hệ đệ quy trả lời bình luận.'),
    bullet('7. bookmarks: Bảng lưu trữ danh sách bài viết yêu thích của từng người dùng (quan hệ N-N).'),
    bullet('8. media: Bảng lưu trữ siêu dữ liệu các tệp hình ảnh được tải lên máy chủ.'),
    bullet('9. notifications: Bảng lưu trữ các thông báo gửi tới người dùng trong hệ thống.'),
    bullet('10. settings: Bảng lưu trữ cấu hình tham số động của website dưới dạng cặp Key-Value.'),
    bullet('11. audit_logs: Bảng lưu vết nhật ký an toàn thông tin phục vụ công tác thanh tra, kiểm toán.'),
    bullet('12. password_reset_tokens: Bảng quản lý mã token khôi phục mật khẩu dùng một lần.'),
    bullet('13. post_views: Bảng ghi nhận lịch sử các lượt đọc bài viết theo thời gian thực.'),

    h3('3.2.2. Bảng từ điển dữ liệu chi tiết cho toàn bộ 13 bảng CSDL'),
    p(
      'Dưới đây là từ điển dữ liệu kỹ thuật chi tiết của 13 bảng CSDL, mô tả chính xác tên trường, kiểu dữ liệu, các ràng buộc toàn vẹn và ý nghĩa nghiệp vụ:'
    ),

    // Bảng 3.1: users
    p('Bảng 3.1: Từ điển dữ liệu bảng `users` (Quản lý người dùng)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 100, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính định danh UUID ngẫu nhiên v4.'],
        ['email', 'VARCHAR(191)', 'UNIQUE, NOT NULL', 'Địa chỉ thư điện tử duy nhất của người dùng.'],
        ['username', 'VARCHAR(191)', 'UNIQUE, NOT NULL', 'Tên đăng nhập duy nhất không trùng lặp.'],
        ['passwordHash', 'VARCHAR(255)', 'NOT NULL', 'Mật khẩu đã được băm an toàn bằng thuật toán Bcrypt.'],
        ['fullName', 'VARCHAR(191)', 'NOT NULL', 'Họ và tên hiển thị công khai của người dùng.'],
        ['bio', 'TEXT', 'NULL', 'Tiểu sử ngắn giới thiệu bản thân tác giả/người dùng.'],
        ['avatarUrl', 'VARCHAR(500)', 'NULL', 'Đường dẫn ảnh đại diện của người dùng.'],
        ['role', 'VARCHAR(50)', 'DEFAULT "READER"', 'Vai trò RBAC: ADMIN, EDITOR, AUTHOR, READER.'],
        ['isActive', 'BOOLEAN', 'DEFAULT TRUE', 'Cờ trạng thái: TRUE (đang hoạt động), FALSE (bị khóa).'],
        ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm đăng ký tài khoản.'],
        ['updatedAt', 'DATETIME', 'ON UPDATE NOW()', 'Thời điểm cập nhật thông tin tài khoản gần nhất.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.2: categories
    p('Bảng 3.2: Từ điển dữ liệu bảng `categories` (Danh mục chuyên môn)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính định danh UUID v4.'],
        ['name', 'VARCHAR(191)', 'NOT NULL', 'Tên danh mục (ví dụ: Công nghệ thông tin, Trí tuệ nhân tạo).'],
        ['slug', 'VARCHAR(191)', 'UNIQUE, NOT NULL', 'Đường dẫn SEO duy nhất không dấu.'],
        ['description', 'TEXT', 'NULL', 'Mô tả tóm tắt nội dung của danh mục chuyên môn.'],
        ['parentId', 'VARCHAR(36)', 'FOREIGN KEY, NULL', 'Khóa ngoại đệ quy trỏ tới categories(id), ON DELETE SET NULL.'],
        ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm tạo danh mục.'],
        ['updatedAt', 'DATETIME', 'ON UPDATE NOW()', 'Thời điểm sửa đổi danh mục.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.3: tags
    p('Bảng 3.3: Từ điển dữ liệu bảng `tags` (Thẻ từ khóa)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính định danh UUID v4.'],
        ['name', 'VARCHAR(191)', 'NOT NULL', 'Tên thẻ từ khóa (ví dụ: React, TypeScript, Docker).'],
        ['slug', 'VARCHAR(191)', 'UNIQUE, NOT NULL', 'Đường dẫn URL SEO của thẻ.'],
        ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm tạo thẻ từ khóa.'],
        ['updatedAt', 'DATETIME', 'ON UPDATE NOW()', 'Thời điểm cập nhật thẻ gần nhất.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.4: posts
    p('Bảng 3.4: Từ điển dữ liệu bảng `posts` (Bài viết - Thực thể cốt lõi)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
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
        ['scheduledAt', 'DATETIME', 'NULL', 'Thời điểm lên lịch xuất bản tự động (tùy chọn).'],
        ['authorId', 'VARCHAR(36)', 'FOREIGN KEY, NOT NULL', 'Khóa ngoại liên kết tới users(id), ON DELETE CASCADE.'],
        ['categoryId', 'VARCHAR(36)', 'FOREIGN KEY, NULL', 'Khóa ngoại liên kết tới categories(id), ON DELETE SET NULL.'],
        ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm tạo bài viết.'],
        ['updatedAt', 'DATETIME', 'ON UPDATE NOW()', 'Thời điểm chỉnh sửa bài viết gần nhất.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.5: post_tags
    p('Bảng 3.5: Từ điển dữ liệu bảng `post_tags` (Bảng trung gian Bài viết - Thẻ)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['postId', 'VARCHAR(36)', 'PK, FK, NOT NULL', 'Khóa ngoại liên kết tới posts(id), ON DELETE CASCADE.'],
        ['tagId', 'VARCHAR(36)', 'PK, FK, NOT NULL', 'Khóa ngoại liên kết tới tags(id), ON DELETE CASCADE.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.6: comments
    p('Bảng 3.6: Từ điển dữ liệu bảng `comments` (Bình luận độc giả)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính UUID v4.'],
        ['content', 'TEXT', 'NOT NULL', 'Nội dung bình luận đã được làm sạch khử XSS.'],
        ['status', 'VARCHAR(50)', 'DEFAULT "APPROVED"', 'Trạng thái kiểm duyệt: PENDING, APPROVED, REJECTED, SPAM.'],
        ['postId', 'VARCHAR(36)', 'FOREIGN KEY, NOT NULL', 'Khóa ngoại liên kết posts(id), ON DELETE CASCADE.'],
        ['authorId', 'VARCHAR(36)', 'FOREIGN KEY, NOT NULL', 'Khóa ngoại liên kết users(id), ON DELETE CASCADE.'],
        ['parentId', 'VARCHAR(36)', 'FOREIGN KEY, NULL', 'Khóa ngoại đệ quy comments(id) cho cấu trúc trả lời đa tầng.'],
        ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm gửi bình luận.'],
        ['updatedAt', 'DATETIME', 'ON UPDATE NOW()', 'Thời điểm cập nhật bình luận gần nhất.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.7: bookmarks
    p('Bảng 3.7: Từ điển dữ liệu bảng `bookmarks` (Bài viết đã lưu)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính UUID v4.'],
        ['userId', 'VARCHAR(36)', 'FOREIGN KEY, NOT NULL', 'Khóa ngoại liên kết users(id), ON DELETE CASCADE.'],
        ['postId', 'VARCHAR(36)', 'FOREIGN KEY, NOT NULL', 'Khóa ngoại liên kết posts(id), ON DELETE CASCADE.'],
        ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm người dùng bấm lưu bài viết.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.8: media
    p('Bảng 3.8: Từ điển dữ liệu bảng `media` (Thư viện tệp hình ảnh)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính UUID v4.'],
        ['filename', 'VARCHAR(255)', 'NOT NULL', 'Tên tệp đã được chuẩn hóa duy nhất trên ổ đĩa máy chủ.'],
        ['originalName', 'VARCHAR(255)', 'NOT NULL', 'Tên tệp tin gốc của người dùng khi tải lên.'],
        ['mimeType', 'VARCHAR(100)', 'NOT NULL', 'Kiểu nội dung MIME (ví dụ: image/jpeg, image/png, image/webp).'],
        ['size', 'INT', 'NOT NULL', 'Dung lượng tệp tin tính bằng đơn vị Bytes.'],
        ['url', 'VARCHAR(500)', 'NOT NULL', 'Đường dẫn truy cập công khai của ảnh (/uploads/filename).'],
        ['uploaderId', 'VARCHAR(36)', 'FOREIGN KEY, NOT NULL', 'Khóa ngoại liên kết users(id), ON DELETE CASCADE.'],
        ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm tải tệp lên.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.9: notifications
    p('Bảng 3.9: Từ điển dữ liệu bảng `notifications` (Thông báo người dùng)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính UUID v4.'],
        ['title', 'VARCHAR(255)', 'NOT NULL', 'Tiêu đề thông báo ngắn gọn.'],
        ['message', 'TEXT', 'NOT NULL', 'Nội dung chi tiết thông báo (lý do duyệt, từ chối hoặc bình luận mới).'],
        ['type', 'VARCHAR(50)', 'DEFAULT "INFO"', 'Loại thông báo: INFO, SUCCESS, WARNING, DANGER.'],
        ['isRead', 'BOOLEAN', 'DEFAULT FALSE', 'Trạng thái đã đọc (TRUE) hoặc chưa đọc (FALSE).'],
        ['link', 'VARCHAR(500)', 'NULL', 'Đường dẫn chuyển hướng khi bấm vào thông báo.'],
        ['userId', 'VARCHAR(36)', 'FOREIGN KEY, NOT NULL', 'Khóa ngoại trỏ tới users(id) người nhận thông báo.'],
        ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm tạo thông báo.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.10: settings
    p('Bảng 3.10: Từ điển dữ liệu bảng `settings` (Cấu hình hệ thống)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính UUID v4.'],
        ['key', 'VARCHAR(191)', 'UNIQUE, NOT NULL', 'Mã khóa định danh tham số (ví dụ: site_title, posts_per_page).'],
        ['value', 'TEXT', 'NOT NULL', 'Giá trị chuỗi của tham số cấu hình.'],
        ['description', 'VARCHAR(255)', 'NULL', 'Mô tả giải thích ý nghĩa tham số.'],
        ['updatedAt', 'DATETIME', 'ON UPDATE NOW()', 'Thời điểm cập nhật tham số gần nhất.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.11: audit_logs
    p('Bảng 3.11: Từ điển dữ liệu bảng `audit_logs` (Nhật ký kiểm toán an toàn)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính UUID v4.'],
        ['action', 'VARCHAR(100)', 'NOT NULL', 'Hành động thực hiện (LOGIN, CREATE_POST, APPROVE_POST, REJECT_POST, UPDATE_ROLE, DELETE_POST).'],
        ['entity', 'VARCHAR(100)', 'NOT NULL', 'Thực thể bị tác động (User, Post, Comment, Category).'],
        ['entityId', 'VARCHAR(36)', 'NULL', 'Mã ID của bản ghi bị tác động.'],
        ['details', 'TEXT', 'NULL', 'Chi tiết mô tả bổ sung cho hành động.'],
        ['ipAddress', 'VARCHAR(100)', 'NULL', 'Địa chỉ IP của máy khách gửi yêu cầu.'],
        ['userAgent', 'VARCHAR(255)', 'NULL', 'Chuỗi nhận dạng trình duyệt máy khách.'],
        ['userId', 'VARCHAR(36)', 'FOREIGN KEY, NULL', 'Khóa ngoại trỏ tới users(id) thực hiện, ON DELETE SET NULL.'],
        ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm ghi nhận hành động.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.12: password_reset_tokens
    p('Bảng 3.12: Từ điển dữ liệu bảng `password_reset_tokens` (Mã khôi phục mật khẩu)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính UUID v4.'],
        ['email', 'VARCHAR(191)', 'NOT NULL', 'Địa chỉ email yêu cầu đặt lại mật khẩu.'],
        ['token', 'VARCHAR(255)', 'UNIQUE, NOT NULL', 'Chuỗi token ngẫu nhiên mã hóa an toàn dùng một lần.'],
        ['expiresAt', 'DATETIME', 'NOT NULL', 'Thời điểm hết hạn hiệu lực của token (sau 1 giờ).'],
        ['usedAt', 'DATETIME', 'NULL', 'Thời điểm token đã được sử dụng thành công.'],
        ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm tạo mã token.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    // Bảng 3.13: post_views
    p('Bảng 3.13: Từ điển dữ liệu bảng `post_views` (Lịch sử lượt xem bài viết)', { bold: true, size: 24, color: COLORS.NAVY_PRIMARY, before: 140, after: 60 }),
    createTable(
      ['Tên trường (Field)', 'Kiểu dữ liệu', 'Ràng buộc', 'Ý nghĩa nghiệp vụ'],
      [
        ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính UUID v4.'],
        ['ipHash', 'VARCHAR(100)', 'NULL', 'Mã băm địa chỉ IP của người đọc để phân tích lượt xem duy nhất.'],
        ['postId', 'VARCHAR(36)', 'FOREIGN KEY, NOT NULL', 'Khóa ngoại liên kết posts(id), ON DELETE CASCADE.'],
        ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm đọc bài viết.'],
      ],
      { colWidths: [22, 22, 24, 32] }
    ),

    h3('3.2.3. Chiến lược đánh chỉ mục (Indexing Strategy) và ràng buộc toàn vẹn'),
    p(
      'Để đảm bảo tốc độ phản hồi API dưới 100ms ngay cả khi dữ liệu tăng trưởng lên hàng chục ngàn bài viết, hệ thống áp dụng chiến lược đánh chỉ mục B-Tree tại các vị trí trọng yếu:'
    ),
    bullet('Chỉ mục duy nhất (Unique Index): users(email), users(username), categories(slug), tags(slug), posts(slug), settings(key).'),
    bullet('Chỉ mục phức hợp (Composite Index): post_tags(postId, tagId) và bookmarks(userId, postId) giúp việc truy vấn kiểm tra bài viết đã lưu chỉ mất thời gian O(log N).'),
    bullet('Chỉ mục tìm kiếm & phân trang: posts(status, publishedAt) và posts(authorId) tối ưu hóa tối đa các câu lệnh lọc danh sách bài viết theo chuyên mục và tác giả.'),

    h2('3.3. Thiết kế Biểu đồ tuần tự (Sequence Diagrams)'),
    h3('3.3.1. Sơ đồ tuần tự: Phê duyệt bài viết xuất bản (Approve Post Sequence)'),
    p(
      'Quy trình tương tác giữa các thành phần khi Biên tập viên phê duyệt bài viết được đặc tả qua 10 bước tuần tự chặt chẽ:'
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
      'Toàn bộ các điểm cuối API của hệ thống tuân thủ nghiêm ngặt nguyên lý thiết kế REST (Representational State Transfer):'
    ),
    bullet('Quy chuẩn Base URL: http://localhost:5000/api/v1/*'),
    bullet('Phương thức HTTP: GET (đọc dữ liệu), POST (tạo mới tài nguyên), PATCH (cập nhật một phần dữ liệu), DELETE (xóa tài nguyên).'),
    bullet('Mã trạng thái HTTP Status Codes: 200 OK (thành công), 201 Created (tạo mới thành công), 400 Bad Request (lỗi dữ liệu đầu vào), 401 Unauthorized (chưa đăng nhập), 403 Forbidden (không đủ quyền RBAC), 404 Not Found (không tìm thấy tài nguyên), 500 Internal Server Error (lỗi máy chủ).'),
    bullet('Cấu trúc Envelope chuẩn của toàn bộ phản hồi JSON (Response Envelope):'),

    codeBox([
      '{',
      '  "success": true,',
      '  "message": "Thông điệp phản hồi từ máy chủ",',
      '  "data": { ... },',
      '  "meta": {',
      '    "page": 1,',
      '    "limit": 10,',
      '    "total": 45,',
      '    "totalPages": 5',
      '  }',
      '}',
    ]),

    h3('3.4.2. Bảng đặc tả chi tiết 25 Endpoint API Backend'),
    p(
      'Bảng 3.14 dưới đây đặc tả đầy đủ 25 Endpoint RESTful API của hệ thống Blog/CMS phục vụ toàn bộ hoạt động của hai phân hệ công khai và quản trị:'
    ),

    p('Bảng 3.14: Danh mục 25 Endpoint RESTful API Backend của hệ thống', {
      bold: true,
      size: 24,
      color: COLORS.NAVY_PRIMARY,
      before: 120,
      after: 80,
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
