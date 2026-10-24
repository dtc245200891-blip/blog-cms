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

function getChapter1Children() {
  const elements = [];

  // ==========================================
  // CHƯƠNG 1
  // ==========================================
  elements.push(
    h1('CHƯƠNG 1: TỔNG QUAN HỆ THỐNG VÀ CƠ SỞ LÝ THUYẾT - CÔNG NGHỆ ÁP DỤNG', { pageBreakBefore: true }),

    h2('1.1. Khái quát về Hệ thống quản trị nội dung (CMS) và Blog tin tức'),
    h3('1.1.1. Lịch sử phát triển và vai trò của CMS trong chuyển đổi số'),
    p(
      'Hệ thống quản trị nội dung (Content Management System - CMS) là một giải pháp phần mềm toàn diện cho phép người sử dụng khởi tạo, biên tập, quản lý, xuất bản và lưu trữ nội dung số trên môi trường mạng máy tính mà không nhất thiết phải có kiến thức chuyên sâu về ngôn ngữ đánh dấu siêu văn bản (HTML), định kiểu (CSS) hay các câu lệnh truy vấn cơ sở dữ liệu (SQL). Trong quá trình phát triển của World Wide Web từ thời kỳ Web 1.0 (các trang web tĩnh) sang Web 2.0 (web tương tác động) và hiện nay là Web 3.0, CMS đã khẳng định vai trò là xương sống của truyền thông số và thương mại điện tử.'
    ),
    p(
      'Trong môi trường giáo dục đại học, CMS đóng vai trò là kênh xuất bản tin tức học thuật, thông báo đào tạo, giới thiệu các công trình nghiên cứu khoa học và kết nối giữa sinh viên, giảng viên với cộng đồng. Một hệ thống CMS hiện đại không đơn thuần là nơi đăng bài viết mà còn phải tích hợp các quy trình nghiệp vụ phức tạp: phân quyền biên tập nhiều tầng, kiểm duyệt bài viết trước khi xuất bản, phòng chống bình luận rác (spam), trực quan hóa số liệu truy cập và đảm bảo an toàn thông tin tuyệt đối trước các cuộc tấn công mạng.'
    ),

    h3('1.1.2. Phân loại các kiến trúc CMS phổ biến trên thế giới'),
    p(
      'Dựa trên sự liên kết giữa tầng giao diện hiển thị (Frontend) và tầng quản trị lưu trữ dữ liệu (Backend), các hệ thống CMS hiện đại được chia thành 3 mô hình kiến trúc cơ bản:'
    ),
    bullet('Kiến trúc nguyên khối (Coupled / Monolithic CMS): Tầng hiển thị giao diện và tầng quản lý dữ liệu được đóng gói chặt chẽ trong cùng một khối mã nguồn (điển hình như WordPress, Drupal, Joomla bằng PHP). Ưu điểm là dễ cài đặt ban đầu, nhiều giao diện mẫu có sẵn; nhưng nhược điểm rất lớn là hiệu năng kém khi lưu lượng truy cập cao, giao diện gắn chặt với mã nguồn Backend và rất khó mở rộng sang các nền tảng khác như Mobile App hay IoT.'),
    bullet('Kiến trúc không đầu (Headless CMS): Hệ thống loại bỏ hoàn toàn tầng hiển thị giao diện, chỉ cung cấp Backend quản lý dữ liệu và xuất dữ liệu thông qua RESTful API hoặc GraphQL (như Strapi, Contentful, Sanity). Mô hình này rất linh hoạt nhưng đòi hỏi đội ngũ phát triển phải tự xây dựng toàn bộ giao diện phía máy khách.'),
    bullet('Kiến trúc tách rời (Decoupled CMS): Là mô hình tối ưu được đề tài lựa chọn. Tầng giao diện người dùng được xây dựng hoàn toàn độc lập dưới dạng Single Page Application (SPA) sử dụng React, trong khi tầng xử lý nghiệp vụ Backend được viết bằng Express.js/Node.js cung cấp RESTful API. Hai thành phần này giao tiếp thuần túy qua giao thức HTTP/JSON, đem lại hiệu năng vượt trội, khả năng phản hồi tức thì và sự tách biệt rõ ràng về trách nhiệm (Separation of Concerns).'),

    h3('1.1.3. Khảo sát các nền tảng CMS phổ biến và hạn chế thực tế'),
    p(
      'Nhằm làm rõ tính cần thiết của việc tự phát triển hệ thống Blog/CMS trong đề tài, việc khảo sát và so sánh các giải pháp hiện nay được thực hiện chi tiết trong Bảng 1.1 dưới đây:'
    ),

    p('Bảng 1.1: So sánh ưu nhược điểm của các giải pháp CMS hiện có so với giải pháp đề tài', {
      bold: true,
      size: 24,
      color: COLORS.NAVY_PRIMARY,
      before: 120,
      after: 80,
    }),
    createTable(
      ['Tiêu chí so sánh', 'WordPress', 'Ghost', 'Strapi Headless', 'Hệ thống đề tài (Blog/CMS)'],
      [
        [
          'Kiến trúc hệ thống',
          'Nguyên khối (PHP Monolith)',
          'Node.js + Handlebars',
          'Node.js Headless API',
          'Decoupled: React 18 SPA + Express TS API',
        ],
        [
          'Tốc độ và Hiệu năng',
          'Chậm, tiêu tốn CPU/RAM',
          'Khá nhanh',
          'Nhanh (chỉ cung cấp API)',
          'Cực nhanh (SPA Client routing + Vite + Node LTS)',
        ],
        [
          'Kiểm soát mã nguồn',
          'Phụ thuộc nhiều Plugin',
          'Hạn chế tùy biến',
          'Tự do tùy biến Backend',
          '100% tự chủ mã nguồn, không phụ thuộc plugin rác',
        ],
        [
          'Phân quyền RBAC',
          'Cơ bản, khó tùy biến sâu',
          'Ít vai trò nghiệp vụ',
          'Tùy biến qua Admin Panel',
          'RBAC 5 cấp chuẩn hóa: Guest, Reader, Author, Editor, Admin',
        ],
        [
          'Quy trình duyệt bài',
          'Cần cài thêm plugin trả phí',
          'Chỉ có Draft / Publish',
          'Tự cấu hình workflow',
          'Tích hợp sẵn: Draft -> Pending -> Approved/Rejected -> Publish',
        ],
        [
          'Bảo mật thông tin',
          'Dễ bị lộ lọt do lỗi plugin',
          'Khá tốt',
          'Tùy thuộc cấu hình',
          'Bảo vệ đa tầng: HttpOnly Cookie, Bcrypt, XSS Sanitizer, Rate Limit',
        ],
        [
          'Triển khai vận hành',
          'Cài đặt LAMP / WAMP',
          'Docker / Ghost CLI',
          'Node.js / Docker',
          'Docker Compose 3 Container: Nginx, Node.js API, MySQL 8',
        ],
      ],
      { colWidths: [20, 26, 26, 28] }
    ),

    h3('1.1.4. Đề xuất giải pháp kiến trúc hệ thống Blog/CMS của đề tài'),
    p(
      'Từ kết quả khảo sát trên, đề tài đề xuất thiết kế và phát triển hệ thống Blog/CMS chuyên nghiệp với các định hướng kiến trúc đột phá:'
    ),
    bullet('Áp dụng kiến trúc Decoupled Single Page Application (SPA): Giao diện người dùng được tải một lần duy nhất về trình duyệt máy khách, mọi thao tác điều hướng chuyển trang, tìm kiếm và gửi dữ liệu đều diễn ra mượt mà không tải lại toàn trang (No Page Reload).'),
    bullet('Chuẩn hóa RESTful API độc lập: Backend đóng vai trò là một API Gateway thuần túy, bảo vệ dữ liệu bằng xác thực kép JWT và Cookie HttpOnly, sẵn sàng phục vụ song song cho cả Website lẫn ứng dụng di động tương lai.'),
    bullet('Quy trình thẩm định nội dung khép kín: Tác giả (Author) viết bài bằng trình soạn thảo trực quan TipTap, gửi đề nghị phê duyệt; Biên tập viên (Editor) đọc thẩm định, chấp thuận xuất bản hoặc từ chối kèm lý do chi tiết để tác giả chỉnh sửa lại.'),

    h2('1.2. Cơ sở lý thuyết và công nghệ tầng giao diện (Frontend)'),
    h3('1.2.1. Ngôn ngữ TypeScript và lợi ích kiểm soát kiểu tĩnh (Static Typing)'),
    p(
      'TypeScript là một ngôn ngữ lập trình mã nguồn mở được phát triển bởi Microsoft, đóng vai trò là một siêu tập hợp có kiểu tĩnh (Typed Superset) của JavaScript. Trong dự án Blog/CMS, toàn bộ mã nguồn Frontend và Backend đều được viết bằng TypeScript (phiên bản v5.x), đem lại các ưu thế vượt trội:'
    ),
    bullet('Phát hiện lỗi ngay trong giai đoạn biên dịch (Compile-time Error Checking): Ngăn ngừa triệt để các lỗi phổ biến trong JavaScript thuần như TypeError, undefined property access, hoặc truyền sai kiểu tham số hàm.'),
    bullet('Tự động hoàn thành mã nguồn (IntelliSense Auto-completion): Giúp lập trình viên dễ dàng định hình cấu trúc dữ liệu của các thực thể bài viết (Post), người dùng (User), danh mục (Category) với độ chính xác 100%.'),
    bullet('Tự sinh tài liệu mã nguồn (Self-documenting Code): Các tệp định nghĩa giao diện (Interfaces) và kiểu dữ liệu (Types) giúp việc bảo trì, mở rộng và bàn giao dự án trở nên rõ ràng, minh bạch.'),

    h3('1.2.2. Thư viện React 18, kiến trúc Single Page Application và React Hooks'),
    p(
      'React là thư viện JavaScript hàng đầu thế giới do tập đoàn Meta (Facebook) phát triển, chuyên dùng để xây dựng giao diện người dùng dựa trên các thành phần (Component-Based Architecture). Phiên bản React 18.3.1 được tích hợp trong đồ án với các công nghệ lõi:'
    ),
    bullet('Virtual DOM (Cơ chế DOM ảo): Thay vì cập nhật trực tiếp cây DOM thực của trình duyệt (vốn là một thao tác tiêu tốn nhiều tài nguyên xử lý), React sử dụng thuật toán so lệch (Reconciliation / Diffing Algorithm) để chỉ render lại những phần tử thực sự có sự thay đổi dữ liệu, tối ưu hóa tốc độ khung hình và trải nghiệm tương tác.'),
    bullet('Hệ thống React Hooks hiện đại: Đề tài sử dụng 100% Functional Components kết hợp các Hooks tiêu chuẩn: useState (quản lý trạng thái cục bộ), useEffect (xử lý tác vụ phụ gọi API, đăng ký sự kiện), useContext (chia sẻ trạng thái đăng nhập người dùng toàn cục trong AuthContext), useCallback và useMemo (tối ưu hóa hiệu năng tính toán tránh re-render không cần thiết).'),
    bullet('Quản lý trạng thái và bộ nhớ đệm với TanStack Query v5: Quản lý vòng đời dữ liệu từ máy chủ (Server State Management), tự động lưu bộ nhớ đệm (Caching), tái tìm nạp dữ liệu khi người dùng chuyển tab (Refetch on Window Focus) và xử lý phân trang thông minh.'),

    h3('1.2.3. Công cụ đóng gói Vite và tối ưu hóa Hot Module Replacement (HMR)'),
    p(
      'Thay vì sử dụng Webpack truyền thống vốn có tốc độ khởi động và biên dịch chậm chạp, đề tài lựa chọn Vite 5.4 làm công cụ phát triển và đóng gói. Vite tận dụng trực tiếp tính năng Native ES Modules trên trình duyệt kết hợp với bộ biên dịch Esbuild viết bằng ngôn ngữ Go. Nhờ đó, thời gian khởi động máy chủ phát triển chỉ mất chưa đầy 300 mili-giây, và tính năng Hot Module Replacement (HMR) cho phép cập nhật giao diện ngay tức thì khi lập trình viên chỉnh sửa mã nguồn mà không làm mất trạng thái ứng dụng.'
    ),

    h3('1.2.4. Khung giao diện Tailwind CSS và nguyên lý thiết kế thích ứng (Responsive Design)'),
    p(
      'Tailwind CSS 3.4 là một khung tiện ích CSS (Utility-First CSS Framework) mạnh mẽ, cung cấp hàng ngàn lớp tiện ích được tối ưu sẵn. Thay vì viết các tệp CSS riêng lẻ cồng kềnh, lập trình viên phối hợp trực tiếp các class trong mã nguồn JSX. Dự án được thiết kế tuân thủ nghiêm ngặt nguyên lý Mobile-First Responsive:'
    ),
    bullet('Màn hình điện thoại thông minh (Mobile Screens: width < 768px): Thanh điều hướng chuyển sang dạng ngăn kéo (Drawer/Menu Hamburger), bảng biểu hiển thị dạng thẻ cuộn dọc, font chữ co giãn linh hoạt.'),
    bullet('Màn hình máy tính bảng (Tablet Screens: 768px <= width < 1024px): Bố cục chuyển sang dạng lưới 2 cột, tối ưu hóa không gian đọc bài viết.'),
    bullet('Màn hình máy tính xách tay và để bàn (Desktop: width >= 1024px): Bố cục 3 cột hoàn chỉnh, thanh điều hướng ngang sang trọng, hiển thị song song danh mục, bài viết nổi bật và các thẻ từ khóa thịnh hành.'),

    h3('1.2.5. Trình soạn thảo văn bản phong phú TipTap (WYSIWYG Editor)'),
    p(
      'Soạn thảo nội dung là trái tim của mọi hệ thống Blog/CMS. Đề tài tích hợp TipTap Editor 2.6 — một thư viện soạn thảo văn bản phong phú dạng Headless xây dựng trên nền tảng ProseMirror. TipTap mang lại các ưu thế vượt bậc:'
    ),
    bullet('Đầy đủ tính năng định dạng chuyên nghiệp: Tiêu đề các cấp (H1, H2, H3), in đậm, in nghiêng, gạch chân, danh sách thứ tự/không thứ tự, trích dẫn (Blockquote), chèn liên kết hyperlink và chèn khối mã nguồn (Code block).'),
    bullet('Chèn ảnh thông minh: Cho phép tác giả chèn trực tiếp URL hình ảnh hoặc tải ảnh lên thư viện Media của hệ thống rồi nhúng vào bài viết.'),
    bullet('Đầu ra HTML chuẩn mực: Dữ liệu được tuần tự hóa sang định dạng HTML sạch, dễ dàng xử lý khử độc chống mã độc XSS ở phía máy chủ trước khi lưu trữ vào CSDL.'),

    h3('1.2.6. Thư viện trực quan hóa dữ liệu Recharts'),
    p(
      'Để cung cấp cho ban quản trị cái nhìn trực quan về số liệu vận hành, đề tài tích hợp thư viện Recharts 2.12. Recharts xây dựng các biểu đồ dưới dạng các phần tử đồ họa vector có thể co giãn (SVG), tự động thích ứng với kích thước màn hình và hỗ trợ hiệu ứng động mượt mà khi hover chuột xem chi tiết số liệu phân bố bài viết theo danh mục và tổng lượt đọc.'
    ),

    h2('1.3. Cơ sở lý thuyết và công nghệ tầng dịch vụ & CSDL (Backend)'),
    h3('1.3.1. Nền tảng Node.js LTS và cơ chế Non-blocking Event Loop'),
    p(
      'Node.js là một môi trường thực thi JavaScript đa nền tảng, mã nguồn mở, hoạt động bên ngoài trình duyệt dựa trên bộ máy V8 JavaScript Engine của Google Chrome. Đề tài vận hành trên phiên bản Node.js v24.x LTS với kiến trúc I/O hướng sự kiện không chặn (Event-driven, Non-blocking I/O Model). Nhờ một luồng đơn (Single Thread) kết hợp với cơ chế Vòng lặp sự kiện (Event Loop) và thư viện libuv, Node.js có thể xử lý đồng thời hàng chục ngàn kết nối mạng với mức tiêu hao bộ nhớ RAM cực kỳ thấp, đặc biệt phù hợp với các ứng dụng có cường độ đọc/ghi dữ liệu lớn như hệ thống CMS.'
    ),

    h3('1.3.2. Web Framework Express.js 4.21 và kiến trúc Middleware Pipeline'),
    p(
      'Express.js là khung ứng dụng web tối giản (Minimalist Web Framework) phổ biến nhất trong hệ sinh thái Node.js. Express cung cấp hệ thống định tuyến (Routing) mạnh mẽ và cơ chế chuỗi xử lý trung gian (Middleware Pipeline). Trong kiến trúc của đề tài, mỗi HTTP Request khi đi vào máy chủ đều phải tuần tự đi qua các lớp Middleware an toàn:'
    ),
    bullet('Helmet Middleware: Tự động gắn các tiêu đề bảo mật HTTP (Content-Security-Policy, X-Frame-Options, X-XSS-Protection) để che giấu thông tin máy chủ và phòng chống tấn công Clickjacking.'),
    bullet('CORS Middleware: Cấu hình chính sách chia sẻ tài nguyên giữa các nguồn gốc khác nhau, chỉ cho phép tên miền Frontend hợp lệ được phép gọi API.'),
    bullet('Rate Limiter Middleware: Giới hạn tần suất gọi API từ một địa chỉ IP để phòng chống tấn công từ chối dịch vụ (DoS) và dò quét mật khẩu.'),
    bullet('Authentication & RBAC Middleware: Giải mã JWT token, kiểm tra trạng thái hoạt động của tài khoản trong CSDL và đối chiếu quyền hạn truy cập theo ma trận vai trò.'),

    h3('1.3.3. Hệ quản trị CSDL quan hệ MySQL 8.0 và nguyên tắc ACID'),
    p(
      'Hệ thống quản trị nội dung đòi hỏi tính toàn vẹn dữ liệu cực kỳ khắt khe giữa các bài viết, tác giả, danh mục, bình luận và nhật ký an toàn. Do đó, hệ quản trị cơ sở dữ liệu quan hệ MySQL 8.0 (sử dụng Storage Engine InnoDB) được lựa chọn. MySQL đảm bảo tuyệt đối 4 đặc tính ACID trong mọi giao dịch phần mềm:'
    ),
    bullet('Tính nguyên tử (Atomicity): Đảm bảo một chuỗi thao tác CSDL (ví dụ: duyệt bài viết kèm việc tạo thông báo và ghi nhật ký audit log) hoặc được thực hiện trọn vẹn 100%, hoặc hoàn tác hoàn toàn nếu xảy ra sự cố (Rollback).'),
    bullet('Tính nhất quán (Consistency): Dữ liệu trước và sau giao dịch luôn thỏa mãn các ràng buộc toàn vẹn, khóa ngoại (Foreign Keys) và chỉ mục duy nhất (Unique Constraints).'),
    bullet('Tính cô lập (Isolation): Các giao dịch đồng thời được thực thi độc lập, không gây ra hiện tượng đọc dữ liệu bẩn (Dirty Read) hay đọc không lặp lại (Non-repeatable Read).'),
    bullet('Tính bền vững (Durability): Khi giao dịch đã được xác nhận (Commit), dữ liệu sẽ được lưu trữ an toàn vĩnh viễn trên ổ cứng máy chủ ngay cả khi xảy ra sự cố mất điện đột ngột.'),

    h3('1.3.4. Công nghệ Prisma ORM: Schema, Prisma Client và Migration Engine'),
    p(
      'Thay vì phải viết các câu lệnh SQL thô (Raw SQL) dễ mắc lỗi cú pháp và đối mặt với rủi ro SQL Injection, đề tài ứng dụng Prisma ORM 5.19 — một thư viện ánh xạ quan hệ đối tượng thế hệ mới dành cho Node.js và TypeScript. Prisma bao gồm 3 trụ cột kỹ thuật:'
    ),
    bullet('Prisma Schema (schema.prisma): Tệp khai báo mô hình dữ liệu tập trung, mô tả rõ nét các thực thể, kiểu dữ liệu, quan hệ 1-N, N-N, các giá trị mặc định và ánh xạ bảng.'),
    bullet('Prisma Client: Thư viện truy vấn CSDL an toàn kiểu (Type-safe Database Client) được tự động sinh mã từ lược đồ Schema. Mỗi lệnh truy vấn (findUnique, findMany, create, update, delete) đều được kiểm tra kiểu tĩnh tuyệt đối.'),
    bullet('Prisma Migrate: Công cụ quản lý các phiên bản thay đổi cấu trúc CSDL theo thời gian, giúp việc nâng cấp lược đồ giữa các môi trường (Dev, Test, Production) diễn ra tự động và đồng nhất.'),

    h3('1.3.5. Kiểm thực và validate dữ liệu với thư viện Zod'),
    p(
      'Zod là thư viện khai báo lược đồ và xác thực dữ liệu đầu vào (Schema Declaration and Validation) số một cho TypeScript. Trước khi dữ liệu từ máy khách được chuyển vào tầng xử lý nghiệp vụ, các bộ kiểm thực Zod (như RegisterSchema, LoginSchema, CreatePostSchema) sẽ kiểm tra nghiêm ngặt độ dài chuỗi, định dạng email, quy tắc độ phức tạp mật khẩu và các trường bắt buộc, giúp triệt tiêu rủi ro tiêm dữ liệu bẩn vào hệ thống.'
    ),

    h2('1.4. Công nghệ đóng gói, tự động hóa và kiểm thử'),
    h3('1.4.1. Công nghệ ảo hóa Container Docker và Docker Compose đa dịch vụ'),
    p(
      'Một trong những yêu cầu cốt lõi của môn học "Triển khai và hệ thống phần mềm" là khả năng đóng gói ứng dụng để có thể vận hành đồng nhất trên mọi máy tính mà không gặp phải vấn đề "chạy được trên máy tôi nhưng lỗi trên máy khác". Đề tài ứng dụng công nghệ container hóa Docker và công cụ điều phối Docker Compose v3:'
    ),
    bullet('Docker Images đa tầng (Multi-stage Builds): Tách biệt môi trường biên dịch mã nguồn (Build Stage) và môi trường thực thi tối giản (Production Stage), giúp giảm kích thước Image từ hàng gigabyte xuống chỉ còn vài chục megabyte trên nền Linux Alpine siêu nhẹ.'),
    bullet('Docker Compose: Định nghĩa và khởi chạy đồng bộ toàn bộ hệ thống gồm 3 container độc lập (Nginx Frontend, Node.js Backend API và MySQL 8.0 Database) chỉ bằng một câu lệnh duy nhất: `docker-compose up -d --build`.'),

    h3('1.4.2. Khung kiểm thử tự động Vitest và Supertest cho REST API'),
    p(
      'Để đảm bảo chất lượng phần mềm đạt chuẩn công nghiệp, hệ thống tích hợp khung kiểm thử tự động Vitest 2.1 kết hợp với thư viện Supertest 7.0. Vitest cung cấp tốc độ thực thi kiểm thử nhanh hơn từ 5 đến 10 lần so với Jest nhờ tận dụng chung cấu hình và luồng biên dịch của Vite, hỗ trợ đầy đủ các hàm khẳng định (expect, describe, it, beforeAll) và báo cáo trực quan tỉ lệ thành công.'
    ),

    h2('1.5. Bảng tổng hợp công nghệ sử dụng trong đề tài'),
    p(
      'Bảng 1.2 dưới đây tổng kết toàn bộ các công nghệ, thư viện thành phần và vai trò cụ thể được ứng dụng trong quá trình phát triển hệ thống Blog/CMS:'
    ),

    p('Bảng 1.2: Bảng tổng hợp công nghệ sử dụng trong đồ án', {
      bold: true,
      size: 24,
      color: COLORS.NAVY_PRIMARY,
      before: 120,
      after: 80,
    }),
    createTable(
      ['Thành phần kiến trúc', 'Công nghệ lựa chọn', 'Phiên bản', 'Vai trò & Ưu điểm vượt trội'],
      [
        [
          'Frontend Library',
          'React',
          '18.3.1',
          'Xây dựng giao diện Single Page Application, Virtual DOM tối ưu.',
        ],
        [
          'Ngôn ngữ phát triển',
          'TypeScript',
          '5.5.3',
          'Kiểm soát kiểu dữ liệu tĩnh nghiêm ngặt ở cả Frontend và Backend.',
        ],
        [
          'Công cụ đóng gói FE',
          'Vite',
          '5.4.6',
          'Tốc độ khởi động siêu tốc, hỗ trợ Hot Module Replacement tức thì.',
        ],
        [
          'Định kiểu giao diện',
          'Tailwind CSS',
          '3.4.11',
          'Thiết kế giao diện hiện đại, responsive đa kích thước màn hình.',
        ],
        [
          'Soạn thảo văn bản',
          'TipTap Editor',
          '2.6.6',
          'Soạn thảo WYSIWYG trên nền ProseMirror, xuất HTML sạch, chống XSS.',
        ],
        [
          'Đồ thị thống kê',
          'Recharts',
          '2.12.7',
          'Trực quan hóa số liệu phân bố bài viết và lượt xem thời gian thực.',
        ],
        [
          'Bộ nhớ đệm API',
          'TanStack Query',
          '5.56.2',
          'Quản lý trạng thái bất đồng bộ, tự động caching và tái tìm nạp.',
        ],
        [
          'Backend Runtime',
          'Node.js LTS',
          '24.19.0',
          'Môi trường chạy JavaScript phía máy chủ, xử lý I/O không chặn.',
        ],
        [
          'Web Framework',
          'Express.js',
          '4.21.0',
          'Khung xây dựng RESTful API linh hoạt với chuỗi middleware bảo mật.',
        ],
        [
          'Cơ sở dữ liệu',
          'MySQL / SQLite',
          '8.0 / 3.x',
          'Lưu trữ dữ liệu quan hệ, đảm bảo tính toàn vẹn và giao dịch ACID.',
        ],
        [
          'Object-Relational Mapping',
          'Prisma ORM',
          '5.19.1',
          'Quản lý lược đồ CSDL, sinh migration tự động, chống SQL Injection.',
        ],
        [
          'Xác thực người dùng',
          'JWT + Bcrypt',
          '9.0 / 5.1',
          'Mã hóa băm mật khẩu 10 salt rounds, ký token xác thực phiên làm việc.',
        ],
        [
          'Xác thực dữ liệu',
          'Zod',
          '3.23.8',
          'Kiểm thực dữ liệu đầu vào nghiêm ngặt trước khi ghi vào CSDL.',
        ],
        [
          'Khử độc mã nguồn',
          'Sanitize-HTML',
          '2.13.0',
          'Loại bỏ triệt để các thẻ HTML và kịch bản JavaScript độc hại chống XSS.',
        ],
        [
          'Kiểm thử tự động',
          'Vitest + Supertest',
          '2.1.1 / 7.0',
          'Tự động hóa kiểm thử đơn vị và kiểm thử tích hợp API với độ chính xác cao.',
        ],
        [
          'Đóng gói triển khai',
          'Docker & Compose',
          '29.6.2',
          'Container hóa dịch vụ Nginx, Node.js Backend và MySQL 8 đồng nhất.',
        ],
      ],
      { colWidths: [22, 22, 14, 42] }
    )
  );

  return elements;
}

module.exports = { getChapter1Children };
