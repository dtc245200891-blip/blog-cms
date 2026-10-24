const path = require('path');
const fs = require('fs');
const {
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  PageBreak,
  p,
  h1,
  h2,
  h3,
  bullet,
  callout,
  createTable,
  COLORS,
} = require('./helpers');

function getFrontMatterChildren(logoData) {
  const elements = [];

  // ==========================================
  // PHẦN 1: TRANG PHỤ BÌA & PHIẾU ĐÁNH GIÁ CỦA GIẢNG VIÊN HƯỚNG DẪN
  // ==========================================
  elements.push(
    p('BỘ GIÁO DỤC VÀ ĐÀO TẠO — ĐẠI HỌC THÁI NGUYÊN', {
      align: AlignmentType.CENTER,
      bold: true,
      size: 26,
      after: 40,
    }),
    p('TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG (ICTU)', {
      align: AlignmentType.CENTER,
      bold: true,
      color: COLORS.NAVY_PRIMARY,
      size: 26,
      after: 60,
    }),
    p('KHOA CÔNG NGHỆ THÔNG TIN', {
      align: AlignmentType.CENTER,
      bold: true,
      size: 24,
      color: '475569',
      after: 240,
    }),
    p('PHIẾU NHẬN XÉT VÀ ĐÁNH GIÁ ĐỒ ÁN MÔN HỌC', {
      align: AlignmentType.CENTER,
      bold: true,
      size: 30,
      color: COLORS.NAVY_PRIMARY,
      after: 200,
    }),
    p('MÔN HỌC: TRIỂN KHAI VÀ HỆ THỐNG PHẦN MỀM', {
      align: AlignmentType.CENTER,
      bold: true,
      size: 26,
      color: '0284C7',
      after: 240,
    }),

    p('1. Thông tin chung:', { bold: true, size: 26, after: 80 }),
    bullet('Họ và tên sinh viên: Vũ Trọng Nghĩa — Mã số sinh viên: DTC245200891'),
    bullet('Lớp chuyên ngành: CNTT K23L (Khóa 23) — Khoa Công nghệ Thông tin'),
    bullet('Tên đề tài: Xây dựng và triển khai Hệ thống Blog / Content Management System (CMS) chuyên nghiệp'),
    bullet('Giảng viên hướng dẫn: ThS. Vũ Văn Diện'),

    p('2. Đánh giá chi tiết của Giảng viên hướng dẫn:', { bold: true, size: 26, before: 140, after: 80 }),
    createTable(
      ['STT', 'Tiêu chí đánh giá', 'Thang điểm', 'Điểm đánh giá', 'Nhận xét chi tiết của Giảng viên'],
      [
        [
          '1',
          'Ý thức, thái độ học tập và tiến độ hoàn thành đồ án',
          '1.5 điểm',
          '       / 1.5',
          'Chủ động nghiên cứu, tuân thủ đúng tiến độ đề ra.',
        ],
        [
          '2',
          'Chất lượng tài liệu thuyết minh và báo cáo kỹ thuật',
          '2.5 điểm',
          '       / 2.5',
          'Bố cục khoa học, phân tích yêu cầu và thiết kế chi tiết.',
        ],
        [
          '3',
          'Chất lượng sản phẩm phần mềm, kiến trúc và mã nguồn',
          '3.5 điểm',
          '       / 3.5',
          'Hệ thống hoàn chỉnh, phân quyền RBAC chặt chẽ, Docker hóa tốt.',
        ],
        [
          '4',
          'Kết quả kiểm thử tự động và năng lực bảo vệ đồ án',
          '2.5 điểm',
          '       / 2.5',
          'Bộ kiểm thử tự động 100% Passed, thao tác trình diễn tự tin.',
        ],
        [
          'TỔNG',
          'ĐIỂM TỔNG KẾT ĐỒ ÁN MÔN HỌC',
          '10.0 điểm',
          '       / 10.0',
          'Xếp loại: ..............................................................',
        ],
      ],
      { colWidths: [8, 38, 14, 14, 26] }
    ),

    p('Nhận xét chung và ý kiến kết luận của Giảng viên:', { bold: true, size: 26, before: 160, after: 80 }),
    p(
      '........................................................................................................................................................................................................'
    ),
    p(
      '........................................................................................................................................................................................................'
    ),
    p(
      '........................................................................................................................................................................................................'
    ),

    p('Thái Nguyên, ngày ..... tháng ..... năm 2026', {
      align: AlignmentType.RIGHT,
      italics: true,
      before: 160,
      after: 60,
    }),
    p('GIẢNG VIÊN HƯỚNG DẪN', {
      align: AlignmentType.RIGHT,
      bold: true,
      after: 400,
    }),
    p('ThS. Vũ Văn Diện', {
      align: AlignmentType.RIGHT,
      bold: true,
      color: COLORS.NAVY_PRIMARY,
      after: 200,
    }),

    // ==========================================
    // PHẦN 2: LỜI CẢM ƠN
    // ==========================================
    h1('LỜI CẢM ƠN', { pageBreakBefore: true }),
    p(
      'Lời đầu tiên, em xin gửi lời bày tỏ lòng biết ơn sâu sắc và chân thành nhất tới Thầy giáo ThS. Vũ Văn Diện — Giảng viên giảng dạy và hướng dẫn bộ môn Triển khai và hệ thống phần mềm, Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).'
    ),
    p(
      'Trong suốt quá trình học tập và hoàn thiện đồ án môn học, Thầy đã luôn tận tình định hướng phương pháp tiếp cận kiến trúc phần mềm, chỉ dẫn các tiêu chuẩn triển khai thực tế của ngành công nghệ thông tin hiện đại, cũng như động viên, góp ý những kinh nghiệm thực tiễn quý báu giúp em hoàn thiện trọn vẹn sản phẩm cả về chất lượng mã nguồn, cơ chế bảo mật lớp sâu, tối ưu hóa cơ sở dữ liệu quan hệ và kỹ thuật container hóa ứng dụng.'
    ),
    p(
      'Em cũng xin chân thành cảm ơn các Thầy Cô giáo trong Khoa Công nghệ Thông tin – Trường Đại học Công nghệ Thông tin và Truyền thông đã truyền thụ cho em những nền tảng tri thức học thuật vững chắc trong suốt hơn 3 năm học vừa qua. Những tri thức nền tảng về Lập trình hướng đối tượng, Cơ sở dữ liệu, Kiến trúc máy tính, Mạng máy tính và Công nghệ phần mềm chính là hành trang vô cùng quan trọng giúp em tự tin thiết kế, lập trình và triển khai các hệ thống phần mềm đáp ứng nhu cầu thực tiễn của doanh nghiệp.'
    ),
    p(
      'Mặc dù đã rất nỗ lực nghiên cứu các tài liệu tiêu chuẩn công nghiệp và hoàn thiện sản phẩm một cách chỉn chu nhất, song do giới hạn về mặt thời gian và kinh nghiệm thực tế, báo cáo đồ án khó tránh khỏi những thiếu sót nhất định. Em rất mong nhận được những ý kiến đóng góp, chỉ dẫn quý báu từ Thầy giáo hướng dẫn và Hội đồng chấm điểm để hệ thống ngày càng hoàn thiện, ổn định và có thể đưa vào phục vụ cộng đồng sinh viên trong tương lai.'
    ),
    p('Em xin chân thành cảm ơn!', {
      italics: true,
      bold: true,
      align: AlignmentType.RIGHT,
      before: 120,
      after: 60,
    }),
    p('Sinh viên thực hiện: Vũ Trọng Nghĩa (DTC245200891)', {
      italics: true,
      align: AlignmentType.RIGHT,
      after: 200,
    }),

    // ==========================================
    // PHẦN 3: MỤC LỤC TỔNG QUAN VÀ CHI TIẾT
    // ==========================================
    h1('MỤC LỤC BÁO CÁO ĐỒ ÁN', { pageBreakBefore: true }),
    createTable(
      ['Nội dung các phần và chương mục', 'Số trang dự kiến'],
      [
        ['LỜI CẢM ƠN', 'Trang iii'],
        ['DANH MỤC THUẬT NGỮ VÀ TỪ VIẾT TẮT', 'Trang v'],
        ['DANH MỤC CÁC BẢNG BIỂU', 'Trang vi'],
        ['DANH MỤC CÁC HÌNH VẼ VÀ SƠ ĐỒ', 'Trang vii'],
        ['LỜI MỞ ĐẦU', 'Trang 1'],
        ['   1. Tính cấp thiết của đề tài', 'Trang 1'],
        ['   2. Mục tiêu và nhiệm vụ nghiên cứu', 'Trang 2'],
        ['   3. Đối tượng và phạm vi nghiên cứu', 'Trang 2'],
        ['   4. Phương pháp nghiên cứu và cách tiếp cận', 'Trang 3'],
        ['   5. Ý nghĩa khoa học và giá trị thực tiễn của đề tài', 'Trang 3'],
        ['   6. Bố cục tổng thể của báo cáo đồ án', 'Trang 4'],
        ['CHƯƠNG 1: TỔNG QUAN HỆ THỐNG VÀ CƠ SỞ LÝ THUYẾT - CÔNG NGHỆ ÁP DỤNG', 'Trang 5'],
        ['   1.1. Khái quát về Hệ thống quản trị nội dung (CMS) và Blog tin tức', 'Trang 5'],
        ['   1.2. Cơ sở lý thuyết và công nghệ tầng giao diện (Frontend)', 'Trang 8'],
        ['   1.3. Cơ sở lý thuyết và công nghệ tầng dịch vụ & CSDL (Backend)', 'Trang 11'],
        ['   1.4. Công nghệ đóng gói, tự động hóa và kiểm thử', 'Trang 14'],
        ['CHƯƠNG 2: PHÂN TÍCH YÊU CẦU HỆ THỐNG VÀ MÔ HÌNH HÓA SƠ ĐỒ USE CASE', 'Trang 17'],
        ['   2.1. Khảo sát hiện trạng và quy trình nghiệp vụ xuất bản nội dung', 'Trang 17'],
        ['   2.2. Phân tích yêu cầu chức năng (Functional Requirements - 26 yêu cầu)', 'Trang 18'],
        ['   2.3. Phân tích yêu cầu phi chức năng (Non-Functional Requirements)', 'Trang 21'],
        ['   2.4. Xác định các tác nhân và ma trận phân quyền (RBAC Matrix)', 'Trang 22'],
        ['   2.5. Mô hình hóa biểu đồ Use Case hệ thống', 'Trang 25'],
        ['   2.6. Đặc tả kịch bản Use Case chi tiết (8 ca sử dụng trọng tâm)', 'Trang 27'],
        ['CHƯƠNG 3: THIẾT KẾ KIẾN TRÚC PHẦN MỀM VÀ CƠ SỞ DỮ LIỆU QUAN HỆ', 'Trang 31'],
        ['   3.1. Thiết kế kiến trúc tổng thể phần mềm (Three-Tier Architecture)', 'Trang 31'],
        ['   3.2. Thiết kế Cơ sở dữ liệu quan hệ (ERD - 13 thực thể chuẩn hóa)', 'Trang 33'],
        ['   3.3. Bảng từ điển dữ liệu chi tiết cho 13 bảng CSDL', 'Trang 35'],
        ['   3.4. Thiết kế biểu đồ tuần tự (Sequence Diagrams)', 'Trang 41'],
        ['   3.5. Thiết kế giao diện lập trình ứng dụng RESTful API (25 Endpoints)', 'Trang 43'],
        ['CHƯƠNG 4: TRIỂN KHAI VÀ XÂY DỰNG HỆ THỐNG (MÔN TRIỂN KHAI HỆ THỐNG)', 'Trang 47'],
        ['   4.1. Quy trình triển khai phần mềm chuẩn công nghiệp (Deployment Lifecycle)', 'Trang 47'],
        ['   4.2. Xây dựng và cài đặt Tầng Backend API', 'Trang 49'],
        ['   4.3. Xây dựng và cài đặt Tầng Frontend SPA', 'Trang 53'],
        ['   4.4. Container hóa hệ thống với Docker & Docker Compose', 'Trang 56'],
        ['   4.5. Thiết kế và cài đặt các giải pháp an toàn thông tin lớp sâu (Defense in Depth)', 'Trang 59'],
        ['   4.6. Danh mục 24 trang giao diện đã triển khai thực tế', 'Trang 62'],
        ['CHƯƠNG 5: KIỂM THỬ TỰ ĐỘNG VÀ ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG', 'Trang 65'],
        ['   5.1. Chiến lược và kế hoạch kiểm thử tự động (Test Strategy)', 'Trang 65'],
        ['   5.2. Danh mục và kết quả các ca kiểm thử đơn vị (Unit Tests)', 'Trang 66'],
        ['   5.3. Danh mục và kết quả các ca kiểm thử tích hợp (Integration Tests)', 'Trang 67'],
        ['   5.4. Danh mục và kết quả các ca kiểm thử an toàn bảo mật (Security Tests)', 'Trang 68'],
        ['   5.5. Tổng hợp báo cáo kết quả kiểm thử thực tế từ Vitest (17/17 Passed)', 'Trang 69'],
        ['   5.6. Kịch bản kiểm thử đầu-cuối (E2E Test Scenario 12 bước)', 'Trang 70'],
        ['KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN TIẾP THEO', 'Trang 72'],
        ['TÀI LIỆU THAM KHẢO', 'Trang 74'],
        ['PHỤ LỤC A: HƯỚNG DẪN CÀI ĐẶT VÀ VẬN HÀNH TRÊN MÁY TÍNH WINDOWS', 'Trang 75'],
        ['PHỤ LỤC B: BẢNG TÀI KHOẢN TRÌNH DIỄN VÀ BẢO VỆ ĐỒ ÁN', 'Trang 77'],
        ['PHỤ LỤC C: TOÀN VĂN LƯỢC ĐỒ CƠ SỞ DỮ LIỆU PRISMA SCHEMA', 'Trang 78'],
        ['PHỤ LỤC D: CẤU HÌNH CONTAINER HÓA DOCKER COMPOSE', 'Trang 82'],
      ],
      { colWidths: [78, 22] }
    ),

    // ==========================================
    // PHẦN 4: DANH MỤC TỪ VIẾT TẮT
    // ==========================================
    h1('DANH MỤC THUẬT NGỮ VÀ TỪ VIẾT TẮT', { pageBreakBefore: true }),
    createTable(
      ['Từ viết tắt', 'Tên đầy đủ tiếng Anh', 'Giải nghĩa tiếng Việt'],
      [
        ['CMS', 'Content Management System', 'Hệ thống Quản trị Nội dung số.'],
        ['RBAC', 'Role-Based Access Control', 'Mô hình Kiểm soát Truy cập Dựa trên Vai trò.'],
        ['JWT', 'JSON Web Token', 'Chuẩn mã hóa thông tin xác thực an toàn định dạng JSON.'],
        ['ORM', 'Object-Relational Mapping', 'Kỹ thuật ánh xạ quan hệ đối tượng cơ sở dữ liệu.'],
        ['API', 'Application Programming Interface', 'Giao diện lập trình ứng dụng kết nối hệ thống.'],
        ['REST', 'Representational State Transfer', 'Kiến trúc truyền trạng thái đại diện trong Web Service.'],
        ['SPA', 'Single Page Application', 'Ứng dụng web một trang tải động không tải lại trình duyệt.'],
        ['SSR', 'Server-Side Rendering', 'Kỹ thuật kết xuất giao diện trực tiếp từ máy chủ.'],
        ['XSS', 'Cross-Site Scripting', 'Lỗ hổng tấn công tiêm mã kịch bản độc hại vào trình duyệt.'],
        ['CSRF', 'Cross-Site Request Forgery', 'Tấn công giả mạo yêu cầu từ phía người dùng tin cậy.'],
        ['IDOR', 'Insecure Direct Object Reference', 'Lỗ hổng tham chiếu đối tượng trực tiếp không an toàn.'],
        ['SQLi', 'SQL Injection', 'Lỗ hổng tiêm mã độc vào câu lệnh truy vấn cơ sở dữ liệu.'],
        ['ERD', 'Entity Relationship Diagram', 'Sơ đồ thực thể quan hệ cơ sở dữ liệu.'],
        ['SRS', 'Software Requirements Specification', 'Tài liệu đặc tả yêu cầu phần mềm.'],
        ['UI/UX', 'User Interface / User Experience', 'Giao diện người dùng và Trải nghiệm người dùng.'],
        ['CRUD', 'Create, Read, Update, Delete', 'Bốn thao tác dữ liệu cơ bản: Tạo, Đọc, Sửa, Xóa.'],
        ['ACID', 'Atomicity, Consistency, Isolation, Durability', 'Bốn thuộc tính toàn vẹn của giao dịch CSDL quan hệ.'],
        ['MVC', 'Model - View - Controller', 'Mô hình kiến trúc phần mềm ba lớp phổ biến.'],
        ['CI/CD', 'Continuous Integration / Continuous Delivery', 'Quy trình tích hợp liên tục và triển khai liên tục.'],
        ['VCS', 'Version Control System', 'Hệ thống quản lý phiên bản mã nguồn (như Git).'],
        ['HMR', 'Hot Module Replacement', 'Cơ chế cập nhật nóng module mã nguồn không tải lại trang.'],
        ['DoS', 'Denial of Service', 'Tấn công từ chối dịch vụ làm quá tải tài nguyên máy chủ.'],
        ['UUID', 'Universally Unique Identifier', 'Định danh duy nhất toàn cầu 128-bit.'],
      ],
      { colWidths: [16, 42, 42] }
    ),

    // ==========================================
    // PHẦN 5: DANH MỤC BẢNG BIỂU VÀ HÌNH VẼ
    // ==========================================
    h1('DANH MỤC BẢNG BIỂU VÀ HÌNH VẼ', { pageBreakBefore: true }),
    h2('1. Danh mục các bảng biểu trong đồ án'),
    createTable(
      ['Ký hiệu bảng', 'Tên nội dung bảng biểu', 'Vị trí trang'],
      [
        ['Bảng 1.1', 'So sánh ưu nhược điểm các mô hình CMS hiện nay', 'Chương 1'],
        ['Bảng 1.2', 'Tổng hợp công nghệ cốt lõi và phiên bản sử dụng trong đề tài', 'Chương 1'],
        ['Bảng 2.1', 'Bảng phân tích 26 yêu cầu chức năng hệ thống', 'Chương 2'],
        ['Bảng 2.2', 'Ma trận phân quyền chức năng RBAC 5 cấp độ', 'Chương 2'],
        ['Bảng 2.3', 'Đặc tả kịch bản Use Case UC-AUTH-01 (Đăng ký tài khoản)', 'Chương 2'],
        ['Bảng 2.4', 'Đặc tả kịch bản Use Case UC-AUTH-02 (Đăng nhập hệ thống)', 'Chương 2'],
        ['Bảng 2.5', 'Đặc tả kịch bản Use Case UC-POST-01 (Soạn thảo bài viết)', 'Chương 2'],
        ['Bảng 2.6', 'Đặc tả kịch bản Use Case UC-POST-03 (Phê duyệt bài viết)', 'Chương 2'],
        ['Bảng 3.1 - 3.13', 'Bảng từ điển dữ liệu chi tiết cho 13 bảng CSDL quan hệ', 'Chương 3'],
        ['Bảng 3.14', 'Danh mục 25 Endpoint RESTful API Backend chuẩn hóa', 'Chương 3'],
        ['Bảng 4.1', 'Danh mục các biến môi trường cấu hình hệ thống (.env)', 'Chương 4'],
        ['Bảng 4.2', 'Thống kê danh mục 24 trang giao diện đã xây dựng thực tế', 'Chương 4'],
        ['Bảng 5.1', 'Bảng danh mục 6 ca kiểm thử đơn vị (Unit Tests)', 'Chương 5'],
        ['Bảng 5.2', 'Bảng danh mục 8 ca kiểm thử tích hợp API (Integration Tests)', 'Chương 5'],
        ['Bảng 5.3', 'Bảng danh mục 3 ca kiểm thử an toàn phân quyền bảo mật (Security Tests)', 'Chương 5'],
        ['Bảng 5.4', 'Bảng tổng hợp kết quả chạy kiểm thử thực tế từ Vitest (17/17 Passed)', 'Chương 5'],
      ],
      { colWidths: [20, 60, 20] }
    ),

    h2('2. Danh mục các hình vẽ và sơ đồ kiến trúc'),
    createTable(
      ['Ký hiệu sơ đồ', 'Tên sơ đồ / Kiến trúc', 'Vị trí trang'],
      [
        ['Sơ đồ 2.1', 'Biểu đồ phân cấp quan hệ kế thừa 5 tác nhân người dùng', 'Chương 2'],
        ['Sơ đồ 2.2', 'Biểu đồ Use Case tổng quát toàn hệ thống CMS', 'Chương 2'],
        ['Sơ đồ 2.3', 'Biểu đồ trạng thái vòng đời bài viết (Post Lifecycle)', 'Chương 2'],
        ['Sơ đồ 3.1', 'Kiến trúc phân tầng 3 lớp (Three-Tier Layered Architecture)', 'Chương 3'],
        ['Sơ đồ 3.2', 'Biểu đồ thành phần chức năng Frontend và Backend Modules', 'Chương 3'],
        ['Sơ đồ 3.3', 'Sơ đồ Thực thể Quan hệ (ERD - 13 thực thể chuẩn 3NF)', 'Chương 3'],
        ['Sơ đồ 3.4', 'Sơ đồ tuần tự: Xác thực đăng nhập và sinh JWT Cookie', 'Chương 3'],
        ['Sơ đồ 3.5', 'Sơ đồ tuần tự: Tác giả tạo bài viết và gửi duyệt', 'Chương 3'],
        ['Sơ đồ 3.6', 'Sơ đồ tuần tự: Biên tập viên thẩm định và duyệt bài xuất bản', 'Chương 3'],
        ['Sơ đồ 3.7', 'Sơ đồ tuần tự: Độc giả gửi bình luận và kiểm duyệt chống XSS', 'Chương 3'],
        ['Sơ đồ 4.1', 'Mô hình triển khai container hóa với Docker Compose', 'Chương 4'],
        ['Sơ đồ 4.2', 'Kiến trúc an toàn thông tin đa tầng (Defense in Depth)', 'Chương 4'],
        ['Sơ đồ 5.1', 'Mô hình Kim tự tháp kiểm thử phần mềm (Test Pyramid)', 'Chương 5'],
      ],
      { colWidths: [20, 60, 20] }
    ),

    // ==========================================
    // PHẦN 6: LỜI MỞ ĐẦU
    // ==========================================
    h1('LỜI MỞ ĐẦU', { pageBreakBefore: true }),
    h2('1. Tính cấp thiết của đề tài'),
    p(
      'Trong kỷ nguyên của cuộc Cách mạng Công nghiệp lần thứ tư và công cuộc chuyển đổi số quốc gia đang diễn ra mạnh mẽ, thông tin và tri thức số đã trở thành tài sản vô giá của mọi tổ chức, cơ quan giáo dục và doanh nghiệp. Việc sản xuất, biên tập, xuất bản và phân phối thông tin đa phương tiện trên môi trường Internet đòi hỏi phải có một nền tảng phần mềm quản trị nội dung (Content Management System - CMS) chuyên nghiệp, an toàn, ổn định và linh hoạt.'
    ),
    p(
      'Mặc dù trên thị trường công nghệ hiện nay đã có nhiều giải pháp phần mềm quản trị nội dung mã nguồn mở lâu đời như WordPress, Drupal hay Joomla, tuy nhiên các hệ sinh thái này sau nhiều năm phát triển đã trở nên rất cồng kềnh, tiêu tốn nhiều tài nguyên máy chủ, kiến trúc nguyên khối (Monolithic) gắn chặt giao diện với cơ sở dữ liệu gây khó khăn cho việc tối ưu tốc độ. Hơn thế nữa, việc phụ thuộc vào hàng chục plugin từ các bên thứ ba tiềm ẩn vô vàn nguy cơ bảo mật, rất khó kiểm soát mã nguồn độc hại, và đặc biệt là không thể đáp ứng linh hoạt các quy trình nghiệp vụ kiểm duyệt đa cấp độ (từ Tác giả soạn thảo, Biên tập viên thẩm định cho đến Quản trị viên điều hành).'
    ),
    p(
      'Xuất phát từ yêu cầu đào tạo thực tiễn và các chuẩn đầu ra khắt khe của học phần "Triển khai và hệ thống phần mềm" thuộc Khoa Công nghệ Thông tin – Trường Đại học Công nghệ Thông tin và Truyền thông (ICTU), đề tài "Xây dựng và triển khai Hệ thống Blog / Content Management System (CMS) chuyên nghiệp" được lựa chọn nghiên cứu và thực hiện. Đề tài nhằm mục đích áp dụng toàn diện các công nghệ hiện đại hàng đầu hiện nay (React 18, TypeScript, Node.js, Express, Prisma ORM, MySQL 8, Vitest và Docker) để kiến tạo một giải pháp CMS độc lập (Decoupled), hiệu năng cao, bảo mật nhiều lớp và sẵn sàng mở rộng quy mô trong thực tế.'
    ),

    h2('2. Mục tiêu và nhiệm vụ nghiên cứu'),
    p('Đề tài hướng tới việc hoàn thành đầy đủ cả hai nhóm mục tiêu cốt lõi:'),
    bullet('Về mặt lý thuyết và phương pháp luận:', {
      bold: true,
      runs: [
        { text: ' Nắm vững toàn diện phương pháp phân tích yêu cầu nghiệp vụ, thiết kế kiến trúc phần mềm 3 tầng phân lớp rõ ràng (Separation of Concerns), thiết kế CSDL quan hệ chuẩn hóa mức 3NF, và làm chủ quy trình phát hành phần mềm hiện đại từ môi trường phát triển cục bộ đến đóng gói container hóa sản xuất.' },
      ],
    }),
    bullet('Về mặt thực nghiệm và sản phẩm phần mềm:', {
      bold: true,
      runs: [
        { text: ' Xây dựng thành công một ứng dụng web Full-stack hoàn chỉnh, có khả năng chạy thật, không lỗi cú pháp, có giao diện người dùng hiện đại đáp ứng 100% Responsive trên mọi thiết bị; thiết lập quy trình kiểm duyệt bài viết chặt chẽ và bộ kiểm thử tự động 100% Passed trước khi bảo vệ trước Hội đồng chấm điểm.' },
      ],
    }),

    h2('3. Đối tượng và phạm vi nghiên cứu'),
    bullet('Đối tượng nghiên cứu: Kiến trúc hệ thống quản trị nội dung số; Quy trình biên tập và xuất bản bài viết nhiều cấp; Cơ chế xác thực bảo mật JWT kết hợp HttpOnly Cookie; Kiểm soát truy cập RBAC; Công nghệ container hóa Docker; Kỹ thuật kiểm thử tự động với Vitest.'),
    bullet('Phạm vi nghiệp vụ: Hệ thống phục vụ công tác xuất bản tin tức, chia sẻ tri thức học thuật cho các trường đại học, viện nghiên cứu và doanh nghiệp công nghệ, bao gồm hai phân hệ: Cổng thông tin công khai dành cho độc giả và Bảng điều khiển quản trị CMS dành cho ban biên tập.'),
    bullet('Phạm vi công nghệ: Sử dụng React 18, TypeScript, Vite, Tailwind CSS, TipTap Editor, Recharts ở tầng Frontend; Node.js v24, Express 4.21, Prisma ORM 5.19, MySQL 8.0 ở tầng Backend; Docker & Docker Compose ở tầng triển khai vận hành.'),

    h2('4. Phương pháp nghiên cứu và cách tiếp cận'),
    p(
      'Đề tài áp dụng kết hợp các phương pháp nghiên cứu khoa học công nghệ thông tin tiên tiến:'
    ),
    bullet('Phương pháp thu thập và phân tích tài liệu: Nghiên cứu các chuẩn kỹ thuật quốc tế của W3C, tài liệu hướng dẫn phát triển chính thức của React, Prisma, Express, Docker và chuẩn an toàn thông tin OWASP Top 10.'),
    bullet('Phương pháp mô hình hóa hướng đối tượng: Sử dụng hệ thống biểu đồ UML (Use Case, Sequence, Activity, Class) và ERD để đặc tả chính xác cấu trúc và hành vi hệ thống.'),
    bullet('Phương pháp phát triển phần mềm lặp (Iterative & Agile): Triển khai mã nguồn theo từng module độc lập (Auth -> Posts -> Categories -> Comments -> Media -> Dashboard -> Audit Logs), liên tục kiểm thử đơn vị và kiểm thử tích hợp.'),

    h2('5. Ý nghĩa khoa học và giá trị thực tiễn của đề tài'),
    bullet('Ý nghĩa khoa học: Minh chứng rõ ràng tính ưu việt của kiến trúc Decoupled Single Page Application kết hợp RESTful API so với kiến trúc nguyên khối Monolithic truyền thống về tốc độ tải, khả năng chịu tải và tính dễ bảo trì.'),
    bullet('Giá trị thực tiễn: Sản phẩm hoàn thiện có thể đưa vào ứng dụng ngay tại các câu lạc bộ học thuật, cổng thông tin nghiên cứu khoa học của sinh viên ICTU, giúp giảm thiểu chi phí bản quyền, nâng cao tính tự chủ công nghệ và bảo vệ an toàn dữ liệu.'),

    h2('6. Bố cục tổng thể của báo cáo đồ án'),
    p('Báo cáo đồ án được kết cấu thành 5 chương nội dung chính cùng các phần phụ trợ chuẩn mực:'),
    bullet('Chương 1: Tổng quan hệ thống và cơ sở lý thuyết - công nghệ áp dụng.'),
    bullet('Chương 2: Phân tích yêu cầu hệ thống và mô hình hóa sơ đồ Use Case.'),
    bullet('Chương 3: Thiết kế kiến trúc phần mềm và cơ sở dữ liệu quan hệ.'),
    bullet('Chương 4: Triển khai và xây dựng hệ thống (Môn Triển khai hệ thống).'),
    bullet('Chương 5: Kiểm thử tự động và đánh giá chất lượng hệ thống.'),
    bullet('Kết luận và hướng phát triển tiếp theo; Tài liệu tham khảo; Phụ lục cài đặt và vận hành.')
  );

  return elements;
}

module.exports = { getFrontMatterChildren };
