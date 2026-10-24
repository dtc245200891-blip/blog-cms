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

function getChapter4Children() {
  const elements = [];

  // ==========================================
  // CHƯƠNG 4
  // ==========================================
  elements.push(
    h1('CHƯƠNG 4: TRIỂN KHAI VÀ XÂY DỰNG HỆ THỐNG (MÔN TRIỂN KHAI HỆ THỐNG)', { pageBreakBefore: true }),

    h2('4.1. Quy trình triển khai phần mềm chuẩn công nghiệp (Deployment Lifecycle)'),
    h3('4.1.1. Các giai đoạn triển khai hệ thống'),
    p(
      'Môn học "Triển khai và hệ thống phần mềm" đòi hỏi sinh viên phải nắm vững và thực thi trọn vẹn quy trình đưa một sản phẩm từ những dòng mã nguồn ban đầu đến một hệ thống hoàn chỉnh có thể vận hành ổn định trên môi trường sản xuất. Đề tài áp dụng quy trình triển khai phân tầng qua 3 giai đoạn tiêu chuẩn:'
    ),
    bullet('1. Môi trường phát triển cục bộ (Local Development Environment): Lập trình viên phát triển mã nguồn trên hệ điều hành Windows 10/11, sử dụng Node.js v24.19 LTS, Vite Dev Server với tính năng Hot Module Replacement (HMR) cho Frontend, và Prisma ORM kết nối tới cơ sở dữ liệu SQLite/MySQL cục bộ để thử nghiệm nhanh chóng.'),
    bullet('2. Môi trường kiểm thử tự động (Staging & Automated Testing): Trước khi hợp nhất mã nguồn, bộ kiểm thử Vitest và Supertest được kích hoạt để kiểm tra tự động 17 ca kiểm thử Unit test và Integration test; đồng thời công cụ TypeScript Compiler (tsc) kiểm tra tính đúng đắn của kiểu dữ liệu toàn bộ dự án.'),
    bullet('3. Môi trường đóng gói sản xuất (Production Deployment): Toàn bộ mã nguồn Frontend được biên dịch tối ưu hóa thành các tệp tĩnh (HTML, CSS, JS nén minified) đặt trong thư mục /dist và phục vụ bởi máy chủ web Nginx siêu nhẹ. Tầng Backend được đóng gói thành Docker Image đa tầng chạy trên nền Linux Alpine, kết nối với máy chủ CSDL MySQL 8.0 thông qua mạng nội bộ Docker Network biệt lập.'),

    h3('4.1.2. Quản lý cấu hình biến môi trường (.env, .env.example)'),
    p(
      'Tuân thủ nguyên tắc thứ 3 trong phương pháp luận phát triển ứng dụng đám mây "The Twelve-Factor App" (Config: Lưu trữ cấu hình trong biến môi trường), toàn bộ thông tin nhạy cảm của hệ thống tuyệt đối không được gán cứng (hardcode) vào mã nguồn. Tệp .env được đưa vào danh sách loại trừ .gitignore để không bao giờ bị lộ lên hệ thống quản lý phiên bản Git. Hệ thống cung cấp tệp .env.example chuẩn mực với đầy đủ danh mục tham số (Bảng 4.1):'
    ),

    p('Bảng 4.1: Danh mục các biến môi trường cấu hình hệ thống (.env)', {
      bold: true,
      size: 24,
      color: COLORS.NAVY_PRIMARY,
      before: 120,
      after: 80,
    }),
    createTable(
      ['Tên biến môi trường', 'Giá trị mẫu mặc định', 'Mô tả ý nghĩa kỹ thuật'],
      [
        ['PORT', '5000', 'Cổng mạng lắng nghe của máy chủ Express API Backend.'],
        ['NODE_ENV', 'development / production', 'Môi trường thực thi của Node.js (phát triển hoặc sản xuất).'],
        ['DATABASE_URL', 'file:./dev.db / mysql://...', 'Chuỗi kết nối cơ sở dữ liệu SQLite cục bộ hoặc MySQL 8.0.'],
        ['JWT_SECRET', 'super_secret_jwt_key_2026', 'Chuỗi khóa bí mật dùng để ký và giải mã mã hóa Token JWT.'],
        ['JWT_EXPIRES_IN', '7d', 'Thời hạn hiệu lực tối đa của mã Token JWT (7 ngày).'],
        ['CORS_ORIGIN', 'http://localhost:5173,http://localhost:3000', 'Danh sách tên miền Frontend được phép gọi API (chống tấn công CORS).'],
        ['COOKIE_SECRET', 'cookie_signing_secret_ictu_2026', 'Khóa bí mật dùng để ký và bảo vệ Cookie HttpOnly phía trình duyệt.'],
        ['MAX_UPLOAD_SIZE', '5242880', 'Dung lượng tệp tin tải lên tối đa (5MB tính bằng Bytes).'],
      ],
      { colWidths: [24, 38, 38] }
    ),

    h3('4.1.3. Quản lý phiên bản mã nguồn với Git và GitHub'),
    p(
      'Toàn bộ quá trình phát triển hệ thống được quản lý phiên bản chặt chẽ bằng hệ thống Git, áp dụng quy chuẩn đặt tên commit quốc tế Conventional Commits (feat, fix, docs, refactor, test, chore). Kho lưu trữ mã nguồn chính thức của đồ án đã được xuất bản công khai trên nền tảng GitHub tại địa chỉ:'
    ),
    bullet('Địa chỉ kho lưu trữ GitHub: https://github.com/dtc245200891-blip/blog-cms'),
    bullet('Tất cả các commit đều có mô tả rõ ràng, minh chứng cho sự lao động nghiêm túc và quá trình thực hiện bài bản của sinh viên trong suốt học kỳ.'),

    h2('4.2. Xây dựng và cài đặt Tầng Backend API'),
    h3('4.2.1. Cấu hình máy chủ Express và hệ thống Middleware bảo mật'),
    p(
      'Điểm khởi đầu của tầng Backend là tệp src/app.ts. Ứng dụng Express được thiết lập một chuỗi middleware phòng vệ đa lớp:'
    ),

    codeBox([
      '// Trích đoạn cấu hình Middleware an toàn trong src/app.ts',
      'const app = express();',
      'app.use(helmet()); // Tiêu đề bảo mật HTTP chống clickjacking',
      'app.use(cors({ origin: env.CORS_ORIGINS, credentials: true }));',
      'app.use(express.json({ limit: "10mb" })); // Chống payload quá khổ',
      'app.use(cookieParser(env.COOKIE_SECRET));',
      'app.use(rateLimiter); // Giới hạn tần suất gọi API chống DoS',
      'app.use("/uploads", express.static(path.join(__dirname, "../uploads")));',
      'app.use("/api/v1", apiRouter); // Gắn toàn bộ định tuyến API v1',
      'app.use(globalErrorHandler); // Middleware xử lý ngoại lệ tập trung',
    ]),

    h3('4.2.2. Cài đặt Prisma ORM và kỹ thuật sinh dữ liệu mẫu (Database Seeding)'),
    p(
      'Một trong những điểm nhấn kỹ thuật quan trọng của đồ án là kịch bản nạp dữ liệu mẫu tự động (src/config/seed.ts). Kịch bản này cho phép thiết lập ngay một hệ thống có đầy đủ dữ liệu hoạt động thực tế chỉ với một câu lệnh: `npm run db:seed`. Dữ liệu mẫu bao gồm:'
    ),
    bullet('6 tài khoản người dùng đại diện cho đầy đủ 4 nhóm vai trò RBAC (Admin, Editor, 2 Author, 2 Reader), tất cả đều có mật khẩu băm chuẩn Bcrypt là: Password@123.'),
    bullet('5 danh mục chuyên môn sâu (Công nghệ thông tin, Lập trình Web, Điện toán đám mây, Trí tuệ nhân tạo, An toàn thông tin).'),
    bullet('8 thẻ từ khóa công nghệ phổ biến (React, Nodejs, TypeScript, Docker, Prisma, Tailwind, Security, ICTU).'),
    bullet('10 bài viết mẫu ở các trạng thái khác nhau: 6 bài đã xuất bản (PUBLISHED), 2 bài đang chờ biên tập viên duyệt (PENDING), 1 bài nháp (DRAFT) và 1 bài bị từ chối (REJECTED) kèm lý do cụ thể.'),
    bullet('Nhiều bình luận thảo luận đa tầng và các dòng nhật ký audit log mẫu ghi nhận các thao tác đăng nhập và tạo bài viết.'),

    h3('4.2.3. Xây dựng thuật toán sinh Slug tiếng Việt tự động'),
    p(
      'Đường dẫn thân thiện (SEO Slug) là yếu tố sống còn của một hệ thống Blog tin tức. Đề tài tự phát triển hàm tiện ích slugify chuẩn xác tại src/utils/slugify.ts, xử lý triệt để toàn bộ 134 ký tự tiếng Việt có dấu, thay thế chữ đ/Đ thành d, loại bỏ ký tự đặc biệt và thay thế khoảng trắng bằng dấu gạch ngang nối tiếp:'
    ),

    codeBox([
      'export function generateSlug(title: string): string {',
      '  return title',
      '    .toLowerCase()',
      '    .normalize("NFD")',
      '    .replace(/[\\u0300-\\u036f]/g, "") // Xóa sạch dấu thanh tiếng Việt',
      '    .replace(/[đĐ]/g, "d") // Chuyển đ/Đ thành d',
      '    .replace(/[^a-z0-9\\s-]/g, "") // Xóa toàn bộ ký tự đặc biệt',
      '    .trim()',
      '    .replace(/\\s+/g, "-") // Thay khoảng trắng bằng gạch ngang',
      '    .replace(/-+/g, "-"); // Xóa gạch ngang kép liên tiếp',
      '}',
    ]),

    h2('4.3. Xây dựng và cài đặt Tầng Frontend SPA'),
    h3('4.3.1. Thiết lập dự án React 18 với Vite và Tailwind CSS'),
    p(
      'Tầng giao diện người dùng được tổ chức theo kiến trúc Component phân cấp trong thư mục frontend/src. Hệ thống sử dụng React Router v6 để cấu hình hệ thống định tuyến phân tách rõ ràng thành hai phân vùng giao diện (Layouts):'
    ),
    bullet('PublicLayout: Bao gồm Navbar điều hướng công khai, trường tìm kiếm thời gian thực, menu danh mục và Footer chân trang chứa thông tin bản quyền và liên hệ của ICTU.'),
    bullet('AdminLayout: Bao gồm thanh bên AdminSidebar hiển thị các menu quản trị theo đúng thẩm quyền vai trò của người dùng hiện tại (Tác giả chỉ thấy bài của mình; Biên tập viên thấy thêm mục duyệt bài; Quản trị viên thấy toàn bộ người dùng, cài đặt và audit log) cùng AdminHeader hiển thị thông báo và hồ sơ cá nhân.'),

    h3('4.3.2. Quản lý trạng thái xác thực người dùng toàn cục (AuthContext)'),
    p(
      'Trạng thái đăng nhập của người dùng được quản lý tập trung thông qua React Context (src/context/AuthContext.tsx). Khi người dùng đăng nhập thành công, thông tin tài khoản được lưu trữ an toàn trong Context và bộ nhớ sessionStorage; đồng thời mọi yêu cầu HTTP gửi qua Axios đều được cấu hình interceptor tự động đính kèm thông tin xác thực (withCredentials: true), giúp phiên làm việc luôn được đồng bộ tức thì trên toàn bộ giao diện.'
    ),

    h3('4.3.3. Tích hợp trình soạn thảo WYSIWYG TipTap và biểu đồ Recharts'),
    bullet('Thành phần TipTapEditor.tsx: Cung cấp thanh công cụ nổi (Toolbar) trực quan với các nút bấm định dạng văn bản (In đậm, In nghiêng, Tiêu đề H1-H3, Trích dẫn Blockquote, Danh sách chấm tròn, Khối mã nguồn Codeblock). Trình soạn thảo còn hỗ trợ nút bấm chèn URL hình ảnh trực tiếp hoặc mở thư viện Media để chọn ảnh chèn vào nội dung bài viết.'),
    bullet('Thành phần AdminDashboardPage.tsx: Sử dụng các biểu đồ BarChart và ResponsiveContainer của Recharts để thể hiện trực quan số lượng bài viết của từng chuyên mục và bảng thống kê top 5 bài viết có lượt đọc cao nhất.'),

    h2('4.4. Container hóa hệ thống với Docker & Docker Compose'),
    h3('4.4.1. Cấu hình Dockerfile Backend đa tầng (Multi-stage)'),
    p(
      'Tệp backend/Dockerfile được tối ưu hóa thành hai giai đoạn biên dịch và thực thi trên nền image siêu nhẹ node:24-alpine:'
    ),

    codeBox([
      '# Giai đoạn 1: Biên dịch mã nguồn TypeScript',
      'FROM node:24-alpine AS builder',
      'WORKDIR /app',
      'COPY package*.json ./',
      'COPY prisma ./prisma/',
      'RUN npm ci',
      'COPY . .',
      'RUN npm run db:generate && npm run build',
      '',
      '# Giai đoạn 2: Môi trường thực thi sản xuất tối giản',
      'FROM node:24-alpine AS runner',
      'WORKDIR /app',
      'ENV NODE_ENV=production',
      'COPY package*.json ./',
      'COPY prisma ./prisma/',
      'RUN npm ci --only=production && npm run db:generate',
      'COPY --from=builder /app/dist ./dist',
      'EXPOSE 5000',
      'CMD ["node", "dist/index.js"]',
    ]),

    h3('4.4.2. Cấu hình Dockerfile Frontend kết hợp Nginx Reverse Proxy'),
    p(
      'Tệp frontend/Dockerfile thực hiện build mã nguồn React bằng lệnh `npm run build` ở giai đoạn 1, sau đó sao chép toàn bộ thư mục /dist vào máy chủ web Nginx Alpine ở giai đoạn 2. Nginx được cấu hình để chuyển hướng tất cả các yêu cầu điều hướng SPA về tệp index.html và chuyển tiếp các yêu cầu /api/* sang máy chủ Backend lắng nghe tại cổng 5000.'
    ),

    h3('4.4.3. Cấu hình tệp điều phối dịch vụ docker-compose.yml'),
    p(
      'Tệp docker-compose.yml tại thư mục gốc của dự án liên kết đồng thời 3 dịch vụ: MySQL 8.0 (cổng 3306), Backend API (cổng 5000) và Nginx Frontend (cổng 3000), kết hợp với hai ổ đĩa bền vững (Named Volumes) là mysql_data để lưu trữ CSDL và uploads_data để lưu trữ hình ảnh tải lên:'
    ),

    codeBox([
      'version: "3.8"',
      'services:',
      '  mysql:',
      '    image: mysql:8.0',
      '    container_name: blog_cms_mysql',
      '    environment:',
      '      MYSQL_ROOT_PASSWORD: rootpassword',
      '      MYSQL_DATABASE: blog_cms',
      '    ports: ["3306:3306"]',
      '    volumes: [mysql_data:/var/lib/mysql]',
      '',
      '  backend:',
      '    build: ./backend',
      '    container_name: blog_cms_backend',
      '    ports: ["5000:5000"]',
      '    environment:',
      '      DATABASE_URL: "mysql://root:rootpassword@mysql:3306/blog_cms"',
      '    depends_on: [mysql]',
      '    volumes: [uploads_data:/app/uploads]',
      '',
      '  frontend:',
      '    build: ./frontend',
      '    container_name: blog_cms_frontend',
      '    ports: ["3000:80"]',
      '    depends_on: [backend]',
      '',
      '  prometheus:',
      '    image: prom/prometheus:v2.54.1',
      '    container_name: blog_cms_prometheus',
      '    ports: ["9090:9090"]',
      '    volumes: ["./monitoring/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro"]',
      '    depends_on: [backend]',
      '',
      '  grafana:',
      '    image: grafana/grafana:11.2.0',
      '    container_name: blog_cms_grafana',
      '    ports: ["3001:3000"]',
      '    volumes:',
      '      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning:ro',
      '      - ./monitoring/grafana/dashboards:/etc/grafana/provisioning/dashboards/json:ro',
      '    depends_on: [prometheus]',
      '',
      'volumes:',
      '  mysql_data:',
      '  uploads_data:',
    ]),

    h2('4.5. Thiết kế và triển khai hệ thống giám sát hiệu năng với Prometheus và Grafana (DevOps Observability)'),
    p(
      'Trong môn học "Triển khai và hệ thống phần mềm", việc giám sát (Monitoring & Observability) là một cấu phần sống còn để đảm bảo hệ thống vận hành liên tục, phát hiện sớm sự cố và đánh giá năng lực chịu tải của phần mềm. Đề tài đã thiết kế và tích hợp trọn vẹn bộ đôi công cụ giám sát chuẩn công nghiệp Prometheus và Grafana:'
    ),
    bullet('1. Thu thập chỉ số từ Backend (Application Metrics): Backend Express tích hợp thư viện chuyên dụng prom-client để tự động ghi nhận các chỉ số tài nguyên Node.js runtime (tiêu thụ CPU, bộ nhớ Heap RAM, độ trễ Event Loop) và các chỉ số HTTP request (mã phản hồi 2xx/4xx/5xx, thời gian phản hồi theo phân vị p50, p90, p95). Mọi chỉ số được công khai tại endpoint bảo mật GET /api/v1/metrics dưới định dạng chuẩn Prometheus.'),
    bullet('2. Máy chủ đo đạc Prometheus: Prometheus Server định kỳ kéo (pull scrape) dữ liệu từ Backend mỗi 5 giây, lưu trữ chuỗi thời gian (time-series database) và cung cấp ngôn ngữ truy vấn PromQL mạnh mẽ để tính toán tốc độ xử lý (RPS) và độ trễ trung bình.'),
    bullet('3. Nền tảng trực quan hóa Grafana: Grafana v11.2 được cấu hình cơ chế tự động nạp (Auto-provisioning) kết nối với Prometheus tại cổng 3001 và nạp sẵn Dashboard chuyên nghiệp "ICTU Blog/CMS - Giám sát Hệ thống (Vũ Trọng Nghĩa - K23L)". Dashboard cung cấp trực quan 8 biểu đồ thời gian thực: Tổng Requests, Tốc độ RPS, Độ trễ p95 Latency, Phân bố HTTP Status, Bộ nhớ Heap RAM, % CPU và Top Endpoints lưu lượng cao.'),
    bullet('4. Tích hợp trực tiếp vào Giao diện Quản trị CMS: Trên bảng điều khiển Admin Dashboard và thanh điều hướng Sidebar, hệ thống tích hợp sẵn thẻ trạng thái giám sát và nút truy cập trực tiếp tới Grafana để người vận hành và giảng viên có thể kiểm tra hiệu năng hệ thống ngay lập tức.'),

    h2('4.6. Thiết kế và cài đặt các giải pháp an toàn thông tin lớp sâu (Defense in Depth)'),
    p(
      'Nhằm đáp ứng các tiêu chuẩn bảo mật khắt khe của ngành công nghệ thông tin, hệ thống Blog/CMS thiết kế các lớp bảo vệ đa tầng chống lại 5 lỗ hổng nghiêm trọng nhất theo bảng xếp hạng OWASP Top 10:'
    ),
    bullet('1. Phòng chống SQL Injection: Prisma ORM sử dụng kỹ thuật Parameterized Queries cho 100% các câu lệnh tương tác CSDL. Mọi tham số đầu vào đều được truyền dưới dạng đối số phân tách thay vì nối chuỗi SQL, triệt tiêu hoàn toàn rủi ro bị kẻ tấn công tiêm mã độc SQLi.'),
    bullet('2. Phòng chống Cross-Site Scripting (XSS): Hệ thống tích hợp thư viện Sanitize-HTML để khử độc toàn bộ nội dung bài viết trước khi lưu vào CSDL và loại bỏ hoàn toàn các thẻ HTML nguy hại (<script>, <iframe>, thuộc tính onerror, onload) trong bình luận của độc giả.'),
    bullet('3. Phòng chống Insecure Direct Object Reference (IDOR): Tại tầng PostsService, trước khi thực hiện cập nhật hoặc xóa bài viết, hệ thống luôn đối chiếu: nếu vai trò người dùng không phải ADMIN và không phải EDITOR, thì bắt buộc `post.authorId === currentUserId`. Bất kỳ hành vi sửa ID bài viết của người khác trên URL đều bị từ chối với lỗi 403 Forbidden.'),
    bullet('4. Phòng chống Brute-force & DoS: Cấu hình Express-Rate-Limit giới hạn nghiêm ngặt tối đa 30 yêu cầu đăng nhập trong 15 phút từ một IP và tối đa 10 bình luận/phút. Nếu vượt quá ngưỡng, IP sẽ bị tạm khóa kèm mã lỗi HTTP 429.'),
    bullet('5. Bảo mật phiên làm việc và chống CSRF: Token xác thực được lưu trữ trong Cookie với cờ HttpOnly (ngăn chặn JavaScript đọc token) và thuộc tính SameSite=Lax (chống tấn công giả mạo yêu cầu chéo trang).'),
    bullet('6. Nhật ký kiểm toán an toàn (Audit Logging): Mọi thao tác quản trị quan trọng (Đăng nhập, Tạo bài viết, Phê duyệt bài, Từ chối bài, Đổi quyền vai trò, Xóa bài) đều được tự động ghi nhận vào bảng audit_logs kèm địa chỉ IP, User-Agent và thời gian thực hiện.'),

    h2('4.7. Danh mục các màn hình giao diện đã triển khai thực tế'),
    p(
      'Hệ thống đã xây dựng hoàn chỉnh các màn hình giao diện hiện đại, thẩm mỹ cao và tương thích 100% thiết bị di động (Bảng 4.2):'
    ),

    p('Bảng 4.2: Danh mục các trang giao diện người dùng và quản trị đã xây dựng hoàn tất', {
      bold: true,
      size: 24,
      color: COLORS.NAVY_PRIMARY,
      before: 120,
      after: 80,
    }),
    createTable(
      ['STT', 'Tên trang giao diện', 'Đường dẫn Route', 'Phân hệ', 'Chức năng vận hành chính'],
      [
        ['1', 'Trang chủ', '/', 'Công khai', 'Hiển thị bài viết nổi bật, bài mới nhất, danh mục và thẻ từ khóa.'],
        ['2', 'Danh sách bài viết', '/posts', 'Công khai', 'Xem tất cả bài viết đã xuất bản, hỗ trợ lọc, sắp xếp và phân trang.'],
        ['3', 'Chi tiết bài viết', '/posts/:slug', 'Công khai', 'Đọc nội dung bài viết TipTap, tác giả, bình luận và lưu bài viết.'],
        ['4', 'Chuyên mục bài viết', '/categories/:slug', 'Công khai', 'Hiển thị các bài viết thuộc một danh mục cụ thể.'],
        ['5', 'Thẻ từ khóa', '/tags/:slug', 'Công khai', 'Hiển thị danh sách bài viết được gắn thẻ tương ứng.'],
        ['6', 'Tìm kiếm bài viết', '/search', 'Công khai', 'Tìm kiếm bài viết theo từ khóa trong tiêu đề và nội dung.'],
        ['7', 'Trang tác giả', '/authors/:id', 'Công khai', 'Xem thông tin tiểu sử tác giả và danh sách bài viết của tác giả đó.'],
        ['8', 'Đăng nhập', '/login', 'Công khai', 'Đăng nhập tài khoản an toàn với kiểm thực Zod và mật khẩu băm Bcrypt.'],
        ['9', 'Đăng ký tài khoản', '/register', 'Công khai', 'Đăng ký tài khoản độc giả mới với kiểm thực Zod.'],
        ['10', 'Quên mật khẩu', '/forgot-password', 'Công khai', 'Nhập email để nhận token khôi phục mật khẩu.'],
        ['11', 'Đặt lại mật khẩu', '/reset-password', 'Công khai', 'Nhập token và thiết lập mật khẩu mới an toàn.'],
        ['12', 'Hồ sơ cá nhân', '/profile', 'Độc giả', 'Cập nhật họ tên, tiểu sử, ảnh đại diện và đổi mật khẩu.'],
        ['13', 'Bài viết đã lưu', '/saved-posts', 'Độc giả', 'Quản lý danh sách các bài viết yêu thích (Bookmarks) cá nhân.'],
        ['14', 'Trang báo lỗi 404', '/*', 'Công khai', 'Giao diện thông báo trang không tồn tại kèm nút quay về trang chủ.'],
        ['15', 'Bảng điều khiển số liệu', '/admin', 'Quản trị CMS', 'Dashboard thẻ thống kê số liệu và liên kết trực tiếp Grafana.'],
        ['16', 'Quản lý bài viết', '/admin/posts', 'Quản trị CMS', 'Danh sách bài viết lọc theo trạng thái (Draft, Pending, Published).'],
        ['17', 'Tạo bài viết mới', '/admin/posts/new', 'Quản trị CMS', 'Trình soạn thảo văn bản phong phú TipTap WYSIWYG hiện đại.'],
        ['18', 'Chỉnh sửa bài viết', '/admin/posts/edit/:id', 'Quản trị CMS', 'Chỉnh sửa bài viết của chính mình (chống IDOR).'],
        ['19', 'Quản lý danh mục', '/admin/categories', 'Quản trị CMS', 'Thêm, sửa, xóa danh mục chuyên môn (hỗ trợ parentId).'],
        ['20', 'Quản lý thẻ từ khóa', '/admin/tags', 'Quản trị CMS', 'Thêm, sửa, xóa các thẻ nhãn phân loại bài viết.'],
        ['21', 'Kiểm duyệt bình luận', '/admin/comments', 'Quản trị CMS', 'Duyệt hoặc đánh dấu bình luận spam từ độc giả.'],
        ['22', 'Quản lý người dùng', '/admin/users', 'Quản trị CMS', 'Xem danh sách tài khoản, thay đổi vai trò RBAC, khóa/mở tài khoản.'],
        ['23', 'Thư viện hình ảnh Media', '/admin/media', 'Quản trị CMS', 'Tải ảnh lên máy chủ, xem trước ảnh, sao chép URL ảnh.'],
        ['24', 'Nhật ký an toàn (Audit)', '/admin/audit-logs', 'Quản trị CMS', 'Xem toàn bộ lịch sử thao tác nhạy cảm, IP và trình duyệt.'],
        ['25', 'Giám sát Grafana', 'http://localhost:3001', 'Vận hành DevOps', 'Trực quan hóa chỉ số hiệu năng RPS, p95 latency, Heap RAM, CPU.'],
      ],
      { colWidths: [8, 22, 24, 18, 28] }
    )
  );

  return elements;
}

module.exports = { getChapter4Children };
