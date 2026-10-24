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

function getBackMatterChildren() {
  const elements = [];

  // ==========================================
  // KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
  // ==========================================
  elements.push(
    h1('KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN TIẾP THEO', { pageBreakBefore: true }),

    h2('1. Các kết quả nghiên cứu và thực nghiệm đạt được'),
    p(
      'Sau một quá trình nghiêm túc nghiên cứu lý thuyết, khảo sát thực tế và nỗ lực lập trình triển khai thực nghiệm, đề tài "Xây dựng và triển khai Hệ thống Blog / Content Management System (CMS) chuyên nghiệp" thuộc học phần Triển khai và hệ thống phần mềm đã hoàn thành xuất sắc 100% các mục tiêu và nhiệm vụ đề ra:'
    ),
    bullet('Về mặt lý thuyết & kiến trúc phần mềm: Làm chủ trọn vẹn mô hình kiến trúc phân tầng ba lớp (Three-Tier Architecture) phân tách triệt để giữa React SPA và Express RESTful API; thiết kế cơ sở dữ liệu quan hệ chuẩn hóa 3NF gồm 13 bảng với khóa chính UUID, khóa ngoại toàn vẹn và chỉ mục tối ưu hóa truy vấn; áp dụng quy trình kiểm soát phiên làm việc bảo mật với HttpOnly Cookie và JSON Web Token.'),
    bullet('Về mặt sản phẩm phần mềm thực tế: Xây dựng thành công một ứng dụng web Full-stack hoàn chỉnh, có khả năng cài đặt và chạy thật 100%, không phát sinh lỗi cú pháp hay cảnh báo; giao diện hiện đại với 24 màn hình được thiết kế chuẩn Responsive tương thích trên mọi kích thước thiết bị; tích hợp trình soạn thảo văn bản phong phú TipTap WYSIWYG và bảng điều khiển số liệu thống kê thời gian thực với Recharts.'),
    bullet('Về quy trình nghiệp vụ xuất bản: Thiết lập quy trình phê duyệt bài viết đa tầng khép kín (DRAFT -> PENDING -> PUBLISHED / REJECTED -> ARCHIVED), tích hợp cơ chế phản hồi lý do từ chối bài viết minh bạch và hệ thống thông báo tức thì cho tác giả.'),
    bullet('Về an toàn thông tin: Triển khai thành công các lớp bảo vệ đa tầng (Defense in Depth) chống lại các lỗ hổng bảo mật phổ biến nhất của OWASP Top 10: chống SQL Injection bằng Parameterized Queries trong Prisma ORM, chống Cross-Site Scripting (XSS) bằng Sanitize-HTML, chống leo thang đặc quyền IDOR, chống brute-force bằng Rate Limiting và ghi nhận toàn diện nhật ký kiểm toán an toàn (Audit Logging).'),
    bullet('Về kiểm thử tự động và đóng gói: Xây dựng bộ kiểm thử tự động gồm 17 ca kiểm thử Unit test và Integration test với tỉ lệ thành công tuyệt đối 100% (17/17 Passed) trong thời gian 4.06 giây; đóng gói container hóa đồng bộ với Docker Compose (Nginx, Node.js Alpine, MySQL 8.0); và xuất bản toàn bộ mã nguồn công khai lên GitHub tại địa chỉ: https://github.com/dtc245200891-blip/blog-cms.'),

    h2('2. Những hạn chế còn tồn tại của hệ thống'),
    p(
      'Bên cạnh những kết quả đạt được, do giới hạn về mặt thời gian và kinh phí thực hiện đồ án, hệ thống vẫn còn một số điểm có thể tiếp tục hoàn thiện:'
    ),
    bullet('Tính năng gửi thư điện tử xác thực tài khoản và khôi phục mật khẩu hiện tại mới dừng ở mức sinh mã Token ngẫu nhiên và mô phỏng trên môi trường máy chủ cục bộ (cần tích hợp dịch vụ SMTP của Google Workspace hoặc Amazon SES khi triển khai kinh doanh thực tế).'),
    bullet('Tính năng thông báo cho người dùng hiện tại đang được truy vấn theo cơ chế kéo dữ liệu (Polling / REST fetch); chưa sử dụng công nghệ truyền thông hai chiều WebSocket.'),
    bullet('Tệp tin hình ảnh Media hiện đang được lưu trữ trực tiếp trên ổ cứng máy chủ (Local Storage); chưa tích hợp mạng phân phối nội dung (CDN) hoặc dịch vụ lưu trữ đám mây đối tượng như Amazon S3 hay Cloudinary.'),

    h2('3. Đề xuất các hướng nâng cấp và phát triển tiếp theo'),
    p(
      'Trong thời gian tới, sinh viên dự kiến sẽ tiếp tục phát triển và nâng cấp hệ thống theo các định hướng chiến lược:'
    ),
    bullet('Tích hợp giao thức truyền thông hai chiều thời gian thực (Socket.io / WebSocket): Cho phép thông báo duyệt bài, từ chối bài viết và bình luận mới xuất hiện ngay lập tức trên màn hình của tác giả mà không cần tải lại trang.'),
    bullet('Tích hợp dịch vụ lưu trữ đám mây AWS S3 / Cloudinary: Tự động nén ảnh, chuyển đổi định dạng ảnh sang chuẩn WebP thế hệ mới và phân phối qua mạng CDN để tăng tốc độ tải trang cho độc giả toàn cầu.'),
    bullet('Bổ sung chế độ giao diện tối (Dark Mode): Nâng cao trải nghiệm thị giác cho độc giả đọc tin tức vào ban đêm và tiết kiệm năng lượng pin trên các màn hình OLED.'),
    bullet('Phát triển ứng dụng di động đa nền tảng (React Native Mobile App): Tận dụng trực tiếp 25 Endpoint RESTful API đã được xây dựng sẵn để phát hành ứng dụng Blog/CMS trên hai hệ điều hành Android và iOS.'),

    // ==========================================
    // TÀI LIỆU THAM KHẢO
    // ==========================================
    h1('TÀI LIỆU THAM KHẢO', { pageBreakBefore: true }),
    p(
      '1. ThS. Vũ Văn Diện (2026), Bài giảng môn Triển khai và hệ thống phần mềm, Khoa Công nghệ Thông tin – Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).'
    ),
    p(
      '2. React Core Team (2024), React 18 Documentation: Single Page Application Architecture, State Management and Virtual DOM, https://react.dev/'
    ),
    p(
      '3. Prisma Data, Inc. (2024), Prisma ORM Documentation: Database Modeling, Relations, Transactions and Migrations Management, https://www.prisma.io/docs'
    ),
    p(
      '4. Express.js Working Group (2024), Express 4.x Guide: Routing, Middleware Pipeline and Error Handling Best Practices, https://expressjs.com/'
    ),
    p(
      '5. Open Web Application Security Project (OWASP Foundation, 2023), OWASP Top 10 Web Application Security Risks and Defense in Depth, https://owasp.org/www-project-top-ten/'
    ),
    p(
      '6. Docker, Inc. (2024), Docker Documentation: Multi-stage Dockerfile Builds and Docker Compose v3 Specification, https://docs.docker.com/'
    ),
    p(
      '7. TipTap Headless Editor (2024), TipTap Documentation: ProseMirror-based Rich Text Framework for Modern Web Applications, https://tiptap.dev/'
    ),
    p(
      '8. Tailwind Labs (2024), Tailwind CSS v3 Documentation: Utility-First CSS Framework and Responsive Design Principles, https://tailwindcss.com/'
    ),
    p(
      '9. Vitest Team (2024), Vitest: Next Generation Testing Framework Powered by Vite, https://vitest.dev/'
    ),
    p(
      '10. World Wide Web Consortium (W3C, 2023), Hypertext Transfer Protocol (HTTP/1.1) and JSON Data Interchange Syntax (RFC 8259), https://www.w3.org/'
    ),

    // ==========================================
    // PHỤ LỤC A: HƯỚNG DẪN CÀI ĐẶT
    // ==========================================
    h1('PHỤ LỤC A: HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH TRÊN MÁY TÍNH WINDOWS', { pageBreakBefore: true }),
    p(
      'Tài liệu hướng dẫn dưới đây cung cấp từng bước chi tiết giúp Giảng viên hướng dẫn và Hội đồng chấm điểm có thể dễ dàng khởi chạy hệ thống ngay trên máy tính cá nhân để kiểm tra và đánh giá:'
    ),

    h2('Bước 1: Mở thư mục mã nguồn dự án trên cửa sổ PowerShell'),
    codeBox([
      'cd C:\\Users\\vtn08\\.gemini\\antigravity\\scratch\\blog-cms',
    ]),

    h2('Bước 2: Cài đặt và khởi chạy Máy chủ Backend API'),
    codeBox([
      'cd backend',
      'npm install                         # Cài đặt toàn bộ thư viện phụ thuộc',
      'Copy-Item .env.example .env         # Tạo tệp biến môi trường từ mẫu',
      'npm run db:generate                # Sinh mã Prisma Client',
      'npm run db:push                    # Tự động tạo bảng trong CSDL SQLite/MySQL',
      'npm run db:seed                    # Nạp dữ liệu mẫu hoàn chỉnh (Users, Posts, Categories)',
      'npm run test                       # Chạy 17 ca kiểm thử tự động với Vitest',
      'npm run dev                        # Khởi động Backend lắng nghe tại cổng http://localhost:5000',
    ]),

    h2('Bước 3: Cài đặt và khởi chạy Giao diện Frontend React'),
    p('Mở một cửa sổ PowerShell thứ hai và thực thi các lệnh:'),
    codeBox([
      'cd C:\\Users\\vtn08\\.gemini\\antigravity\\scratch\\blog-cms\\frontend',
      'npm install                         # Cài đặt thư viện giao diện frontend',
      'npm run dev                        # Khởi chạy Vite Dev Server tại http://localhost:5173',
    ]),
    p(
      'Sau khi chạy lệnh trên, mở trình duyệt Chrome hoặc Edge truy cập vào địa chỉ: http://localhost:5173 để trải nghiệm toàn bộ hệ thống.'
    ),

    // ==========================================
    // PHỤ LỤC B: TÀI KHOẢN TRÌNH DIỄN
    // ==========================================
    h1('PHỤ LỤC B: BẢNG TÀI KHOẢN TRÌNH DIỄN VÀ BẢO VỆ ĐỒ ÁN', { pageBreakBefore: true }),
    p(
      'Hệ thống đã nạp sẵn 6 tài khoản mẫu tương ứng với 4 nhóm vai trò RBAC. Mật khẩu dùng chung cho tất cả các tài khoản là: Password@123 (Trang đăng nhập /login có sẵn các nút bấm 1-Click tự động điền tài khoản để thuận tiện trình diễn bảo vệ trước Hội đồng chấm điểm):'
    ),

    createTable(
      ['STT', 'Vai trò (Role)', 'Email đăng nhập', 'Tên đăng nhập (Username)', 'Mục đích trình diễn bảo vệ'],
      [
        [
          '1',
          'Quản trị viên (ADMIN)',
          'admin@ictu.edu.vn',
          'admin',
          'Toàn quyền CMS: đổi quyền vai trò RBAC, khóa tài khoản, xem biểu đồ số liệu Dashboard và xem nhật ký audit log.',
        ],
        [
          '2',
          'Biên tập viên (EDITOR)',
          'editor@ictu.edu.vn',
          'editor',
          'Phê duyệt bài viết chờ duyệt (Approve), từ chối bài viết (Reject kèm lý do phản hồi), kiểm duyệt bình luận độc giả.',
        ],
        [
          '3',
          'Tác giả 1 (AUTHOR)',
          'author1@ictu.edu.vn',
          'author_nghia',
          'Sinh viên Vũ Trọng Nghĩa: Soạn bài viết bằng TipTap WYSIWYG, lưu bản nháp, gửi bài chờ duyệt, quản lý bài viết cá nhân.',
        ],
        [
          '4',
          'Tác giả 2 (AUTHOR)',
          'author2@ictu.edu.vn',
          'author_linh',
          'Tác giả Trần Thùy Linh: Bản nháp và nghiên cứu dữ liệu.',
        ],
        [
          '5',
          'Độc giả 1 (READER)',
          'reader1@ictu.edu.vn',
          'reader_nam',
          'Gửi bình luận, trả lời bình luận, lưu bài viết yêu thích (Bookmark) vào trang /saved-posts.',
        ],
        [
          '6',
          'Độc giả 2 (READER)',
          'reader2@ictu.edu.vn',
          'reader_mai',
          'Tài khoản độc giả mới khám phá hệ thống.',
        ],
      ],
      { colWidths: [8, 20, 24, 20, 28] }
    ),

    // ==========================================
    // PHỤ LỤC C: PRISMA SCHEMA
    // ==========================================
    h1('PHỤ LỤC C: TOÀN VĂN LƯỢC ĐỒ CƠ SỞ DỮ LIỆU PRISMA SCHEMA', { pageBreakBefore: true }),
    p(
      'Dưới đây là toàn văn tệp định nghĩa cấu trúc cơ sở dữ liệu quan hệ của hệ thống (backend/prisma/schema.prisma) thể hiện 13 bảng thực thể và các mối quan hệ quan hệ chặt chẽ:'
    ),

    codeBox([
      'generator client {',
      '  provider = "prisma-client-js"',
      '}',
      '',
      'datasource db {',
      '  provider = "sqlite" // Hỗ trợ chuyển đổi sang "mysql" khi chạy Docker',
      '  url      = env("DATABASE_URL")',
      '}',
      '',
      'model User {',
      '  id            String    @id @default(uuid())',
      '  email         String    @unique',
      '  username      String    @unique',
      '  passwordHash  String',
      '  fullName      String',
      '  bio           String?',
      '  avatarUrl     String?',
      '  role          String    @default("READER") // ADMIN, EDITOR, AUTHOR, READER',
      '  isActive      Boolean   @default(true)',
      '  createdAt     DateTime  @default(now())',
      '  updatedAt     DateTime  @updatedAt',
      '  posts         Post[]',
      '  comments      Comment[]',
      '  bookmarks     Bookmark[]',
      '  uploadedMedia Media[]',
      '  notifications Notification[]',
      '  auditLogs     AuditLog[]',
      '  @@map("users")',
      '}',
      '',
      'model Category {',
      '  id          String     @id @default(uuid())',
      '  name        String',
      '  slug        String     @unique',
      '  description String?',
      '  parentId    String?',
      '  createdAt   DateTime   @default(now())',
      '  updatedAt   DateTime   @updatedAt',
      '  parent      Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: SetNull)',
      '  children    Category[] @relation("CategoryHierarchy")',
      '  posts       Post[]',
      '  @@map("categories")',
      '}',
      '',
      'model Tag {',
      '  id        String    @id @default(uuid())',
      '  name      String',
      '  slug      String    @unique',
      '  createdAt DateTime  @default(now())',
      '  updatedAt DateTime  @updatedAt',
      '  postTags  PostTag[]',
      '  @@map("tags")',
      '}',
      '',
      'model Post {',
      '  id              String      @id @default(uuid())',
      '  title           String',
      '  slug            String      @unique',
      '  excerpt         String?',
      '  content         String',
      '  featuredImage   String?',
      '  status          String      @default("DRAFT") // DRAFT, PENDING, PUBLISHED, REJECTED, ARCHIVED',
      '  rejectionReason String?',
      '  isPinned        Boolean     @default(false)',
      '  allowComments   Boolean     @default(true)',
      '  viewsCount      Int         @default(0)',
      '  publishedAt     DateTime?',
      '  scheduledAt     DateTime?',
      '  seoTitle        String?',
      '  seoDescription  String?',
      '  createdAt       DateTime    @default(now())',
      '  updatedAt       DateTime    @updatedAt',
      '  authorId        String',
      '  author          User        @relation(fields: [authorId], references: [id], onDelete: Cascade)',
      '  categoryId      String?',
      '  category        Category?   @relation(fields: [categoryId], references: [id], onDelete: SetNull)',
      '  postTags        PostTag[]',
      '  comments        Comment[]',
      '  bookmarks       Bookmark[]',
      '  postViews       PostView[]',
      '  @@map("posts")',
      '}',
      '',
      'model PostTag {',
      '  postId    String',
      '  tagId     String',
      '  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)',
      '  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)',
      '  @@id([postId, tagId])',
      '  @@map("post_tags")',
      '}',
      '',
      'model Comment {',
      '  id          String    @id @default(uuid())',
      '  content     String',
      '  status      String    @default("APPROVED") // PENDING, APPROVED, REJECTED, SPAM',
      '  createdAt   DateTime  @default(now())',
      '  updatedAt   DateTime  @updatedAt',
      '  postId      String',
      '  post        Post      @relation(fields: [postId], references: [id], onDelete: Cascade)',
      '  authorId    String',
      '  author      User      @relation(fields: [authorId], references: [id], onDelete: Cascade)',
      '  parentId    String?',
      '  parent      Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)',
      '  replies     Comment[] @relation("CommentReplies")',
      '  @@map("comments")',
      '}',
      '',
      'model Bookmark {',
      '  id        String   @id @default(uuid())',
      '  createdAt DateTime @default(now())',
      '  userId    String',
      '  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)',
      '  postId    String',
      '  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)',
      '  @@unique([userId, postId])',
      '  @@map("bookmarks")',
      '}',
      '',
      'model Media {',
      '  id           String   @id @default(uuid())',
      '  filename     String',
      '  originalName String',
      '  mimeType     String',
      '  size         Int',
      '  url          String',
      '  createdAt    DateTime @default(now())',
      '  uploaderId   String',
      '  uploader     User     @relation(fields: [uploaderId], references: [id], onDelete: Cascade)',
      '  @@map("media")',
      '}',
      '',
      'model Notification {',
      '  id        String   @id @default(uuid())',
      '  title     String',
      '  message   String',
      '  type      String   @default("INFO") // INFO, SUCCESS, WARNING, DANGER',
      '  isRead    Boolean  @default(false)',
      '  link      String?',
      '  createdAt DateTime @default(now())',
      '  userId    String',
      '  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)',
      '  @@map("notifications")',
      '}',
      '',
      'model Setting {',
      '  id          String   @id @default(uuid())',
      '  key         String   @unique',
      '  value       String',
      '  description String?',
      '  updatedAt   DateTime @updatedAt',
      '  @@map("settings")',
      '}',
      '',
      'model AuditLog {',
      '  id        String   @id @default(uuid())',
      '  action    String',
      '  entity    String',
      '  entityId  String?',
      '  details   String?',
      '  ipAddress String?',
      '  userAgent String?',
      '  createdAt DateTime @default(now())',
      '  userId    String?',
      '  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)',
      '  @@map("audit_logs")',
      '}',
      '',
      'model PasswordResetToken {',
      '  id        String   @id @default(uuid())',
      '  email     String',
      '  token     String   @unique',
      '  expiresAt DateTime',
      '  usedAt    DateTime?',
      '  createdAt DateTime @default(now())',
      '  @@map("password_reset_tokens")',
      '}',
      '',
      'model PostView {',
      '  id        String   @id @default(uuid())',
      '  ipHash    String?',
      '  createdAt DateTime @default(now())',
      '  postId    String',
      '  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)',
      '  @@map("post_views")',
      '}',
    ]),

    // ==========================================
    // PHỤ LỤC D: DOCKER COMPOSE
    // ==========================================
    h1('PHỤ LỤC D: CẤU HÌNH CONTAINER HÓA DOCKER COMPOSE', { pageBreakBefore: true }),
    p(
      'Toàn văn tệp cấu hình triển khai hệ thống đa container (docker-compose.yml) tại thư mục gốc của dự án:'
    ),

    codeBox([
      'version: "3.8"',
      'services:',
      '  mysql:',
      '    image: mysql:8.0',
      '    container_name: blog_cms_mysql',
      '    restart: always',
      '    environment:',
      '      MYSQL_ROOT_PASSWORD: rootpassword',
      '      MYSQL_DATABASE: blog_cms',
      '    ports:',
      '      - "3306:3306"',
      '    volumes:',
      '      - mysql_data:/var/lib/mysql',
      '    networks:',
      '      - blog_cms_net',
      '',
      '  backend:',
      '    build: ./backend',
      '    container_name: blog_cms_backend',
      '    restart: always',
      '    ports:',
      '      - "5000:5000"',
      '    environment:',
      '      NODE_ENV: production',
      '      PORT: 5000',
      '      DATABASE_URL: "mysql://root:rootpassword@mysql:3306/blog_cms"',
      '      JWT_SECRET: "prod_super_secret_jwt_key_ictu_2026"',
      '      CORS_ORIGIN: "http://localhost:3000,http://localhost:5173"',
      '    depends_on:',
      '      - mysql',
      '    volumes:',
      '      - uploads_data:/app/uploads',
      '    networks:',
      '      - blog_cms_net',
      '',
      '  frontend:',
      '    build: ./frontend',
      '    container_name: blog_cms_frontend',
      '    restart: always',
      '    ports:',
      '      - "3000:80"',
      '    depends_on:',
      '      - backend',
      '    networks:',
      '      - blog_cms_net',
      '',
      'volumes:',
      '  mysql_data:',
      '  uploads_data:',
      '',
      'networks:',
      '  blog_cms_net:',
      '    driver: bridge',
    ])
  );

  return elements;
}

module.exports = { getBackMatterChildren };
