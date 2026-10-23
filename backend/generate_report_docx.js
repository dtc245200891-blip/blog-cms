const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  ImageRun,
  AlignmentType,
  HeadingLevel,
  WidthType,
  BorderStyle,
  Header,
  Footer,
  PageNumber,
  ShadingType,
} = require('docx');

async function generateReport() {
  console.log('🚀 Bắt đầu tạo tệp Word báo cáo đồ án ICTU...');

  // Đọc file logo ICTU
  const logoPath = path.join(__dirname, 'ictu-logo.png');
  let logoData = null;
  if (fs.existsSync(logoPath)) {
    logoData = fs.readFileSync(logoPath);
  }

  // Cấu hình border ô bảng
  const cellBorders = {
    top: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
    left: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
    right: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
  };

  const headerBorders = {
    top: { style: BorderStyle.SINGLE, size: 6, color: '03589F' },
    bottom: { style: BorderStyle.SINGLE, size: 6, color: '03589F' },
    left: { style: BorderStyle.SINGLE, size: 6, color: '03589F' },
    right: { style: BorderStyle.SINGLE, size: 6, color: '03589F' },
  };

  // Helper hàm tạo đoạn văn bản thông thường
  function p(text, options = {}) {
    return new Paragraph({
      alignment: options.align || AlignmentType.LEFT,
      spacing: { after: options.after !== undefined ? options.after : 120, line: 276 }, // 1.15 line spacing
      children: [
        new TextRun({
          text: text,
          font: 'Times New Roman',
          size: options.size || 26, // 13pt
          bold: options.bold || false,
          italics: options.italics || false,
          color: options.color || '111827',
        }),
      ],
    });
  }

  // Helper hàm tạo tiêu đề Chương
  function h1(title) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.LEFT,
      spacing: { before: 280, after: 160 },
      children: [
        new TextRun({
          text: title,
          font: 'Times New Roman',
          size: 32, // 16pt
          bold: true,
          color: '03589F', // Brand Navy
        }),
      ],
    });
  }

  // Helper hàm tạo tiêu đề mục 1.1, 1.2
  function h2(title) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      alignment: AlignmentType.LEFT,
      spacing: { before: 200, after: 120 },
      children: [
        new TextRun({
          text: title,
          font: 'Times New Roman',
          size: 28, // 14pt
          bold: true,
          color: '074A83',
        }),
      ],
    });
  }

  // Helper hàm tạo tiêu đề mục con 1.1.1
  function h3(title) {
    return new Paragraph({
      heading: HeadingLevel.HEADING_3,
      alignment: AlignmentType.LEFT,
      spacing: { before: 160, after: 80 },
      children: [
        new TextRun({
          text: title,
          font: 'Times New Roman',
          size: 26, // 13pt
          bold: true,
          color: '1E293B',
        }),
      ],
    });
  }

  // Helper hàm tạo bảng thông số
  function createTable(headers, rows) {
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          tableHeader: true,
          children: headers.map(
            (h) =>
              new TableCell({
                borders: headerBorders,
                shading: { type: ShadingType.CLEAR, fill: 'E0EFFE' }, // Brand blue light
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                      new TextRun({
                        text: h,
                        font: 'Times New Roman',
                        size: 24, // 12pt
                        bold: true,
                        color: '03589F',
                      }),
                    ],
                  }),
                ],
              })
          ),
        }),
        ...rows.map(
          (row) =>
            new TableRow({
              children: row.map(
                (cellText, colIndex) =>
                  new TableCell({
                    borders: cellBorders,
                    children: [
                      new Paragraph({
                        alignment: colIndex === 0 || colIndex === 1 ? AlignmentType.LEFT : AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: cellText,
                            font: 'Times New Roman',
                            size: 22, // 11pt
                            color: '334155',
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            })
        ),
      ],
    });
  }

  // Tạo tài liệu docx
  const doc = new Document({
    sections: [
      // ==========================================
      // SECTION 1: TRANG BÌA (COVER PAGE)
      // ==========================================
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1700, right: 1440 }, // A4 margins (Left 3cm, others 2.5cm)
          },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: 'BỘ GIÁO DỤC VÀ ĐÀO TẠO — ĐẠI HỌC THÁI NGUYÊN',
                font: 'Times New Roman',
                size: 26,
                bold: true,
                color: '1E293B',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 180 },
            children: [
              new TextRun({
                text: 'TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG (ICTU)',
                font: 'Times New Roman',
                size: 26,
                bold: true,
                color: '03589F',
              }),
            ],
          }),

          // Logo ICTU
          ...(logoData
            ? [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 120, after: 200 },
                  children: [
                    new ImageRun({
                      data: logoData,
                      transformation: { width: 140, height: 140 },
                    }),
                  ],
                }),
              ]
            : []),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 180, after: 120 },
            children: [
              new TextRun({
                text: 'BÁO CÁO ĐỒ ÁN MÔN HỌC',
                font: 'Times New Roman',
                size: 36, // 18pt
                bold: true,
                color: '0F172A',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'MÔN HỌC: TRIỂN KHAI VÀ HỆ THỐNG PHẦN MỀM',
                font: 'Times New Roman',
                size: 28, // 14pt
                bold: true,
                color: '0284C7',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 120, after: 60 },
            children: [
              new TextRun({
                text: 'ĐỀ TÀI:',
                font: 'Times New Roman',
                size: 28,
                bold: true,
                color: '475569',
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 360 },
            children: [
              new TextRun({
                text: 'XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG BLOG / CONTENT MANAGEMENT SYSTEM (CMS) CHUYÊN NGHIỆP',
                font: 'Times New Roman',
                size: 32, // 16pt
                bold: true,
                color: '03589F',
              }),
            ],
          }),

          // Thông tin sinh viên và giảng viên
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 300, after: 80 },
            indent: { left: 1440 },
            children: [
              new TextRun({
                text: 'Giảng viên hướng dẫn:',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
              new TextRun({
                text: '   ThS. Vũ Văn Diện',
                font: 'Times New Roman',
                size: 26,
                bold: true,
                color: '03589F',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            indent: { left: 1440 },
            children: [
              new TextRun({
                text: 'Sinh viên thực hiện:',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
              new TextRun({
                text: '       Vũ Trọng Nghĩa',
                font: 'Times New Roman',
                size: 26,
                bold: true,
                color: '03589F',
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            indent: { left: 1440 },
            children: [
              new TextRun({
                text: 'Mã số sinh viên:',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
              new TextRun({
                text: '           DTC245200891',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            indent: { left: 1440 },
            children: [
              new TextRun({
                text: 'Lớp chuyên ngành:',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
              new TextRun({
                text: '         CNTT K23L (Khóa 23)',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { after: 80 },
            indent: { left: 1440 },
            children: [
              new TextRun({
                text: 'Ngành đào tạo:',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
              new TextRun({
                text: '             Công nghệ Thông tin',
                font: 'Times New Roman',
                size: 26,
                bold: true,
              }),
            ],
          }),

          // Footer trang bìa
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 500 },
            children: [
              new TextRun({
                text: 'THÁI NGUYÊN, THÁNG 10 NĂM 2026',
                font: 'Times New Roman',
                size: 26,
                bold: true,
                color: '475569',
              }),
            ],
          }),
        ],
      },

      // ==========================================
      // SECTION 2: TOÀN BỘ NỘI DUNG CHÍNH BÁO CÁO
      // ==========================================
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1700, right: 1440 },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Báo cáo Đồ án: Hệ thống Blog/CMS — Vũ Trọng Nghĩa (DTC245200891 - CNTT K23L)',
                    font: 'Times New Roman',
                    size: 18,
                    italics: true,
                    color: '64748B',
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Times New Roman',
                    size: 22,
                    bold: true,
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // LỜI CẢM ƠN
          h1('LỜI CẢM ƠN'),
          p(
            'Lời đầu tiên, em xin gửi lời bày tỏ lòng biết ơn sâu sắc và chân thành nhất tới Thầy giáo ThS. Vũ Văn Diện — Giảng viên giảng dạy và hướng dẫn bộ môn Triển khai và hệ thống phần mềm, Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).'
          ),
          p(
            'Trong suốt quá trình học tập và hoàn thiện đồ án môn học, Thầy đã luôn tận tình định hướng phương pháp tiếp cận kiến trúc phần mềm, chỉ dẫn các tiêu chuẩn triển khai thực tế của ngành công nghệ thông tin, cũng như động viên, góp ý những kinh nghiệm quý báu giúp em hoàn thiện trọn vẹn sản phẩm cả về mã nguồn, bảo mật và cơ sở dữ liệu.'
          ),
          p(
            'Em cũng xin chân thành cảm ơn các Thầy Cô giáo trong Khoa Công nghệ Thông tin – Trường Đại học Công nghệ Thông tin và Truyền thông đã truyền thụ cho em những nền tảng kiến thức vững chắc trong suốt 3 năm học vừa qua. Những tri thức đó là hành trang vô cùng quan trọng giúp em tự tin thiết kế, lập trình và triển khai các hệ thống phần mềm đáp ứng nhu cầu thực tiễn.'
          ),
          p(
            'Mặc dù đã rất nỗ lực nghiên cứu và hoàn thiện sản phẩm theo các tiêu chuẩn công nghiệp hiện đại, song do giới hạn về mặt thời gian và kinh nghiệm thực tế, báo cáo đồ án khó tránh khỏi những thiếu sót nhất định. Em rất mong nhận được những ý kiến đóng góp, chỉ dẫn quý báu từ Thầy và Hội đồng chấm điểm để hệ thống ngày càng hoàn thiện hơn.'
          ),
          p('Em xin chân thành cảm ơn!', { italics: true, align: AlignmentType.RIGHT }),

          // MỤC LỤC TỔNG QUAN
          h1('MỤC LỤC VÀ BỐ CỤC ĐỒ ÁN'),
          p('• LỜI MỞ ĐẦU: Lý do chọn đề tài, mục tiêu và phương pháp nghiên cứu.'),
          p('• CHƯƠNG 1: TỔNG QUAN VỀ HỆ THỐNG BLOG/CMS VÀ CƠ SỞ CÔNG NGHỆ.'),
          p('• CHƯƠNG 2: PHÂN TÍCH YÊU CẦU VÀ MÔ HÌNH HÓA SƠ ĐỒ USE CASE.'),
          p('• CHƯƠNG 3: THIẾT KẾ KIẾN TRÚC PHẦN MỀM VÀ CƠ SỞ DỮ LIỆU QUAN HỆ.'),
          p('• CHƯƠNG 4: TRIỂN KHAI VÀ XÂY DỰNG HỆ THỐNG (MÔN TRIỂN KHAI HỆ THỐNG).'),
          p('• CHƯƠNG 5: KIỂM THỬ TỰ ĐỘNG VÀ ĐÁNH GIÁ KẾT QUẢ ĐẠT ĐƯỢC.'),
          p('• KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN TIẾP THEO.'),
          p('• TÀI LIỆU THAM KHẢO.'),

          // LỜI MỞ ĐẦU
          h1('LỜI MỞ ĐẦU'),
          h2('1. Tính cấp thiết của đề tài'),
          p(
            'Trong kỷ nguyên số và cách mạng công nghiệp 4.0, thông tin và tri thức đóng vai trò huyết mạch đối với mọi tổ chức, đặc biệt là trong môi trường giáo dục đại học và các doanh nghiệp công nghệ. Việc xuất bản, lưu trữ, kiểm duyệt và phân phối nội dung số đòi hỏi phải có một hệ thống quản trị nội dung (Content Management System - CMS) chuyên nghiệp, an toàn và dễ vận hành.'
          ),
          p(
            'Mặc dù hiện nay có nhiều giải pháp mã nguồn mở có sẵn như WordPress, Drupal hay Joomla, tuy nhiên các nền tảng này thường cồng kềnh, tiêu tốn nhiều tài nguyên, tiềm ẩn nhiều lỗ hổng bảo mật từ các plugin bên thứ ba, và rất khó tùy biến sâu quy trình nghiệp vụ kiểm duyệt đa cấp độ (từ Tác giả, Biên tập viên đến Quản trị viên).'
          ),
          p(
            'Xuất phát từ yêu cầu thực tiễn của môn học "Triển khai và hệ thống phần mềm" dành cho sinh viên năm 3 ngành Công nghệ Thông tin, đề tài "Xây dựng và triển khai Hệ thống Blog / Content Management System (CMS)" được thực hiện nhằm áp dụng toàn diện các công nghệ hiện đại (React, TypeScript, Node.js, Express, Prisma ORM, MySQL 8, Docker) để tạo ra một sản phẩm thực tế, có khả năng mở rộng cao, giao diện hiện đại và hoạt động ổn định.'
          ),

          h2('2. Mục tiêu nghiên cứu'),
          p('1. Nắm vững quy trình phân tích, thiết kế, triển khai và kiểm thử phần mềm hoàn chỉnh theo mô hình ba tầng (Three-Tier Architecture).'),
          p('2. Thiết kế và cài đặt cơ sở dữ liệu quan hệ chặt chẽ với khóa chính, khóa ngoại, ràng buộc toàn vẹn, chỉ mục tối ưu hóa và quản lý phiên bản qua Prisma Migration.'),
          p('3. Triển khai phân quyền người dùng RBAC 4 cấp độ (Guest, Reader, Author, Editor, Admin) được kiểm tra nghiêm ngặt tại Backend API.'),
          p('4. Xây dựng giao diện công khai và bảng điều khiển quản trị hiện đại, hỗ trợ soạn thảo nội dung phong phú (WYSIWYG TipTap), biểu đồ số liệu thời gian thực và tương thích mọi kích thước màn hình (Responsive Design).'),
          p('5. Thực hiện kiểm thử tự động (Unit Test, Integration Test với Supertest/Vitest) đạt tỉ lệ thành công 100% trước khi triển khai sản xuất.'),

          // CHƯƠNG 1
          h1('CHƯƠNG 1: TỔNG QUAN VỀ HỆ THỐNG VÀ CƠ SỞ CÔNG NGHỆ'),
          h2('1.1. Khái niệm về Blog và Content Management System (CMS)'),
          p(
            'Blog (viết tắt của Weblog) là một dạng nhật ký trực tuyến hoặc ấn phẩm tin tức số, nơi các tác giả chia sẻ kiến thức, bài viết chuyên môn hoặc thông báo. Trong khi đó, Content Management System (CMS) là hệ thống phần mềm cung cấp các công cụ đồ họa giúp quản lý toàn diện vòng đời nội dung số từ khâu khởi tạo, biên tập, phê duyệt, lên lịch, xuất bản đến lưu trữ hoặc gỡ bỏ mà không đòi hỏi người dùng phải can thiệp trực tiếp vào mã nguồn CSDL.'
          ),

          h2('1.2. Khảo sát các nền tảng hiện nay và giải pháp của đề tài'),
          p(
            'Qua khảo sát các hệ thống phổ biến (WordPress, Ghost, Medium), đề tài lựa chọn tự phát triển hệ thống trên nền tảng Single Page Application (SPA) kết hợp RESTful API decoupled. Mô hình này giúp tách biệt hoàn toàn giao diện Frontend và logic Backend, tăng cường hiệu năng, dễ dàng bảo trì và sẵn sàng mở rộng sang ứng dụng di động trong tương lai.'
          ),

          h2('1.3. Tổng quan công nghệ sử dụng trong đề tài'),
          createTable(
            ['Thành phần', 'Công nghệ lựa chọn', 'Phiên bản', 'Vai trò & Ưu điểm'],
            [
              ['Frontend Framework', 'React & TypeScript', '18.3.1', 'Xây dựng giao diện SPA mượt mà, kiểm soát kiểu dữ liệu tĩnh nghiêm ngặt.'],
              ['Công cụ đóng gói', 'Vite', '5.4.6', 'Tốc độ biên dịch cực nhanh, hỗ trợ Hot Module Replacement (HMR).'],
              ['CSS Framework', 'Tailwind CSS', '3.4.11', 'Thiết kế giao diện hiện đại, chuẩn Responsive cho mobile, tablet và desktop.'],
              ['Soạn thảo Rich Text', 'TipTap Editor', '2.6.6', 'Trình soạn thảo WYSIWYG chuẩn headless, chống XSS, hỗ trợ chèn ảnh, bảng, code.'],
              ['Biểu đồ thống kê', 'Recharts', '2.12.7', 'Hiển thị trực quan dữ liệu phân bố bài viết và lượt xem thời gian thực.'],
              ['Backend Runtime', 'Node.js LTS & Express', '24.19.0 / 4.21', 'Xây dựng RESTful API tốc độ cao, xử lý bất đồng bộ mạnh mẽ.'],
              ['ORM & CSDL', 'Prisma ORM & MySQL 8', '5.19.1', 'Truy vấn quan hệ an toàn, chống SQL Injection, quản lý migration SQL chuẩn xác.'],
              ['Kiểm thử tự động', 'Vitest & Supertest', '2.1.1 / 7.0', 'Kiểm thử đơn vị và tích hợp API tự động với tốc độ thực thi cao.'],
              ['Đóng gói triển khai', 'Docker & Compose', '29.6.2', 'Đóng gói container hóa môi trường chạy Backend, Nginx và MySQL 8 đồng nhất.']
            ]
          ),

          // CHƯƠNG 2
          h1('CHƯƠNG 2: PHÂN TÍCH YÊU CẦU VÀ MÔ HÌNH HÓA USE CASE'),
          h2('2.1. Xác định các Tác nhân (Actors) trong hệ thống'),
          p('Hệ thống thiết lập 4 nhóm tác nhân với thẩm quyền phân cấp chặt chẽ:'),
          p('1. Khách vãng lai (Guest): Người dùng chưa đăng nhập, chỉ có quyền đọc bài viết công khai, tìm kiếm và xem danh mục.'),
          p('2. Độc giả (Reader): Người dùng đã đăng ký tài khoản, có quyền bình luận, trả lời bình luận, lưu bài viết (Bookmark), cập nhật thông tin cá nhân và đổi mật khẩu.'),
          p('3. Tác giả (Author): Sinh viên/giảng viên được cấp quyền viết bài, soạn thảo bằng TipTap, lưu bản nháp, gửi bài chờ ban biên tập phê duyệt, quản lý bài viết của mình.'),
          p('4. Biên tập viên (Editor): Phê duyệt bài viết chờ duyệt (Approve -> Published), từ chối bài viết kèm lý do cụ thể (Reject), kiểm duyệt bình luận của độc giả, quản lý danh mục và thẻ.'),
          p('5. Quản trị viên (Admin): Toàn quyền quản trị hệ thống, quản lý tài khoản người dùng, đổi vai trò RBAC, khóa/mở tài khoản, xem thống kê dashboard, cấu hình hệ thống và theo dõi nhật ký hoạt động (Audit logs).'),

          h2('2.2. Ma trận phân quyền chức năng (Use Case Matrix)'),
          createTable(
            ['Nhóm chức năng (Use Case)', 'Khách', 'Độc giả', 'Tác giả', 'Biên tập viên', 'Quản trị viên'],
            [
              ['Xem bài viết công khai', 'Có', 'Có', 'Có', 'Có', 'Có'],
              ['Tìm kiếm bài viết / lọc chuyên mục', 'Có', 'Có', 'Có', 'Có', 'Có'],
              ['Đăng ký tài khoản độc giả', 'Có', 'Không', 'Không', 'Không', 'Không'],
              ['Đăng nhập / Đăng xuất', 'Có', 'Có', 'Có', 'Có', 'Có'],
              ['Quên mật khẩu / Đặt lại mật khẩu', 'Có', 'Có', 'Có', 'Có', 'Có'],
              ['Lưu bài viết yêu thích (Bookmark)', 'Không', 'Có', 'Có', 'Có', 'Có'],
              ['Gửi bình luận & Trả lời bình luận', 'Không', 'Có', 'Có', 'Có', 'Có'],
              ['Cập nhật hồ sơ & Đổi mật khẩu', 'Không', 'Có', 'Có', 'Có', 'Có'],
              ['Soạn thảo bài viết mới (TipTap)', 'Không', 'Không', 'Có', 'Có', 'Có'],
              ['Lưu bản nháp bài viết (DRAFT)', 'Không', 'Không', 'Có', 'Có', 'Có'],
              ['Gửi bài viết phê duyệt (PENDING)', 'Không', 'Không', 'Có', 'Có', 'Có'],
              ['Sửa bài viết của chính mình (chống IDOR)', 'Không', 'Không', 'Có', 'Có', 'Có'],
              ['Phê duyệt bài viết (APPROVE -> PUBLISHED)', 'Không', 'Không', 'Không', 'Có', 'Có'],
              ['Từ chối bài viết kèm lý do (REJECT)', 'Không', 'Không', 'Không', 'Có', 'Có'],
              ['Kiểm duyệt bình luận (APPROVED/SPAM)', 'Không', 'Không', 'Không', 'Có', 'Có'],
              ['Quản lý danh mục & Thẻ bài viết', 'Không', 'Không', 'Không', 'Có', 'Có'],
              ['Tải ảnh lên thư viện Media', 'Không', 'Không', 'Có', 'Có', 'Có'],
              ['Xem Bảng điều khiển thống kê (Dashboard)', 'Không', 'Không', 'Thống kê cá nhân', 'Có', 'Có'],
              ['Quản lý tài khoản & Phân quyền người dùng', 'Không', 'Không', 'Không', 'Không', 'Có'],
              ['Xem Nhật ký hoạt động hệ thống (Audit Logs)', 'Không', 'Không', 'Không', 'Không', 'Có'],
              ['Cấu hình thông số website (Settings)', 'Không', 'Không', 'Không', 'Không', 'Có']
            ]
          ),

          h2('2.3. Sơ đồ Use Case phân hệ Quản lý Bài viết'),
          p(
            'Dưới đây là mô tả đặc tả cấu trúc Use Case cho quy trình nghiệp vụ bài viết cốt lõi của CMS:'
          ),
          p('• Actor Tác giả (Author): Thực hiện các Use Case "Tạo bài viết", "Soạn nội dung phong phú", "Tải ảnh đại diện", "Lưu bản nháp", "Gửi bài phê duyệt", "Xem danh sách bài viết của mình".'),
          p('• Actor Biên tập viên (Editor): Kế thừa quyền xem bài viết và thực hiện các Use Case "Xem bài chờ duyệt", "Thẩm định nội dung", "Phê duyệt bài viết (Approve)", "Từ chối bài viết (Reject kèm lý do)".'),
          p('• Actor Quản trị viên (Admin): Kế thừa quyền Editor và bổ sung Use Case "Ghim bài viết nổi bật", "Lưu trữ bài viết", "Xóa bài viết vi phạm".'),

          h2('2.4. Đặc tả kịch bản Use Case trọng tâm: Phê duyệt bài viết (Approve Post)'),
          p('1. Tên Use Case: Phê duyệt bài viết chờ duyệt.'),
          p('2. Tác nhân chính: Biên tập viên (Editor), Quản trị viên (Admin).'),
          p('3. Điều kiện tiên quyết: Biên tập viên đã đăng nhập thành công vào hệ thống, bài viết đang ở trạng thái PENDING.'),
          p('4. Luồng sự kiện chính (Main Flow):'),
          p('   - Bước 1: Biên tập viên truy cập trang Quản lý bài viết (/admin/posts).'),
          p('   - Bước 2: Hệ thống lọc và hiển thị danh sách bài viết có trạng thái "Chờ duyệt (PENDING)".'),
          p('   - Bước 3: Biên tập viên bấm vào bài viết để đọc nội dung thẩm định.'),
          p('   - Bước 4: Biên tập viên bấm nút "Phê duyệt" (Approve).'),
          p('   - Bước 5: Backend kiểm tra quyền Editor, cập nhật status = PUBLISHED, gán thời gian publishedAt = NOW().'),
          p('   - Bước 6: Hệ thống tự động tạo bản ghi Thông báo gửi đến Tác giả bài viết.'),
          p('   - Bước 7: Ghi nhận hành động vào Nhật ký hoạt động (Audit Logs).'),
          p('   - Bước 8: Giao diện hiển thị bài viết ra ngoài Cổng thông tin công khai.'),

          // CHƯƠNG 3
          h1('CHƯƠNG 3: THIẾT KẾ KIẾN TRÚC PHẦN MỀM VÀ CƠ SỞ DỮ LIỆU'),
          h2('3.1. Thiết kế kiến trúc phân tầng (Three-Tier Architecture)'),
          p(
            'Hệ thống áp dụng kiến trúc phân tầng chuyên nghiệp, đảm bảo nguyên tắc Separation of Concerns (SoC):'
          ),
          p('• Tầng Presentation (Frontend): Xây dựng bằng React 18 SPA, quản lý trạng thái API bằng TanStack Query, routing bởi React Router v6, styling bởi Tailwind CSS.'),
          p('• Tầng Application / Service (Backend): Máy chủ Express.js sử dụng TypeScript, tổ chức mã nguồn theo mô hình module hóa (Modules): Routes khai báo endpoint, Controllers tiếp nhận HTTP Request, Services xử lý logic nghiệp vụ, Middlewares đảm nhiệm xác thực JWT và kiểm tra quyền RBAC.'),
          p('• Tầng Data Persistence (Database): Prisma ORM tương tác với CSDL MySQL 8.0, thực hiện ánh xạ đối tượng quan hệ, kiểm soát ràng buộc toàn vẹn và thực thi các giao dịch an toàn (Transactions).'),

          h2('3.2. Thiết kế Cơ sở dữ liệu quan hệ (ERD - 13 bảng)'),
          p(
            'Cơ sở dữ liệu của hệ thống được thiết kế chuẩn hóa mức 3NF, bao gồm 13 bảng dữ liệu liên kết quan hệ chặt chẽ:'
          ),
          p('1. users: Quản lý thông tin tài khoản, mật khẩu Bcrypt, phân quyền role và trạng thái active.'),
          p('2. categories: Quản lý danh mục chuyên môn, hỗ trợ quan hệ đệ quy cha - con (parentId).'),
          p('3. tags: Quản lý từ khóa / nhãn phân loại bài viết.'),
          p('4. posts: Bảng trung tâm lưu trữ bài viết, slug duy nhất, tóm tắt, nội dung HTML làm sạch, trạng thái vòng đời, lượt xem.'),
          p('5. post_tags: Bảng trung gian giải quyết quan hệ Nhiều - Nhiều giữa posts và tags.'),
          p('6. comments: Lưu trữ bình luận của độc giả, hỗ trợ quan hệ đệ quy (parentId) cho cấu trúc trả lời đa tầng.'),
          p('7. bookmarks: Quản lý danh sách bài viết yêu thích của độc giả (quan hệ N-N giữa users và posts).'),
          p('8. media: Lưu trữ thông tin tệp hình ảnh tải lên (filename, mimetype, size, url, uploaderId).'),
          p('9. notifications: Quản lý thông báo người dùng theo thời gian thực (duyệt bài, từ chối, bình luận).'),
          p('10. settings: Lưu trữ cấu hình tham số động của hệ thống dưới dạng key-value.'),
          p('11. audit_logs: Ghi nhận nhật ký an toàn thông tin (ai làm gì, thời gian nào, địa chỉ IP, tác động lên bản ghi nào).'),
          p('12. password_reset_tokens: Quản lý mã token khôi phục mật khẩu dùng một lần.'),
          p('13. post_views: Ghi nhận lượt xem bài viết phục vụ phân tích số liệu thống kê.'),

          h2('3.3. Từ điển dữ liệu bảng trung tâm `posts`'),
          createTable(
            ['Tên trường (Field)', 'Kiểu dữ liệu (MySQL)', 'Ràng buộc', 'Mô tả ý nghĩa nghiệp vụ'],
            [
              ['id', 'VARCHAR(36)', 'PRIMARY KEY', 'Khóa chính định danh UUID v4 ngẫu nhiên an toàn.'],
              ['title', 'VARCHAR(255)', 'NOT NULL', 'Tiêu đề bài viết.'],
              ['slug', 'VARCHAR(255)', 'UNIQUE, NOT NULL', 'Đường dẫn SEO thân thiện, loại bỏ dấu tiếng Việt tự động.'],
              ['excerpt', 'TEXT', 'NULL', 'Đoạn tóm tắt mở đầu bài viết.'],
              ['content', 'LONGTEXT', 'NOT NULL', 'Nội dung định dạng HTML đã được khử độc XSS.'],
              ['featuredImage', 'VARCHAR(500)', 'NULL', 'URL đường dẫn ảnh đại diện bài viết.'],
              ['status', 'VARCHAR(50)', 'DEFAULT "DRAFT"', 'Trạng thái: DRAFT, PENDING, PUBLISHED, REJECTED, SCHEDULED, ARCHIVED.'],
              ['rejectionReason', 'TEXT', 'NULL', 'Lý do từ chối bài viết từ Biên tập viên để tác giả sửa.'],
              ['isPinned', 'BOOLEAN', 'DEFAULT FALSE', 'Cờ ghim bài viết lên đầu trang chủ.'],
              ['allowComments', 'BOOLEAN', 'DEFAULT TRUE', 'Cờ bật/tắt quyền bình luận của độc giả.'],
              ['viewsCount', 'INT', 'DEFAULT 0', 'Tổng số lượt đọc bài viết (tăng nguyên tử).'],
              ['publishedAt', 'DATETIME', 'NULL', 'Thời điểm xuất bản bài viết chính thức.'],
              ['authorId', 'VARCHAR(36)', 'FOREIGN KEY', 'Khóa ngoại liên kết tới bảng users(id), ON DELETE CASCADE.'],
              ['categoryId', 'VARCHAR(36)', 'FOREIGN KEY', 'Khóa ngoại liên kết tới bảng categories(id), ON DELETE SET NULL.'],
              ['createdAt', 'DATETIME', 'DEFAULT NOW()', 'Thời điểm tạo bài viết.'],
              ['updatedAt', 'DATETIME', 'ON UPDATE NOW()', 'Thời điểm chỉnh sửa bài viết gần nhất.']
            ]
          ),

          // CHƯƠNG 4
          h1('CHƯƠNG 4: TRIỂN KHAI VÀ XÂY DỰNG HỆ THỐNG'),
          h2('4.1. Quy trình triển khai phần mềm (Môn Triển khai hệ thống)'),
          p(
            'Quy trình triển khai phần mềm được thực hiện qua các giai đoạn tiêu chuẩn theo mô hình Continuous Delivery:'
          ),
          p('1. Môi trường phát triển cục bộ (Local Development): Sử dụng Node.js v24, TypeScript Compiler, Prisma SQLite/MySQL engine, Vite Dev Server với Hot Module Replacement.'),
          p('2. Quản lý phiên bản mã nguồn (VCS): Sử dụng Git và GitHub (Kho lưu trữ chính thức: https://github.com/dtc245200891-blip/blog-cms). Áp dụng quy chuẩn Conventional Commits.'),
          p('3. Container hóa ứng dụng (Dockerization): Đóng gói Backend API với Multi-stage Dockerfile (Node Alpine), đóng gói Frontend với Nginx Alpine Reverse Proxy, và dịch vụ CSDL MySQL 8.0 qua Docker Compose.'),
          p('4. Quản lý cấu hình môi trường (.env): Tách biệt hoàn toàn mã nguồn và thông tin cấu hình nhạy cảm. Không commit .env lên Git, cung cấp tệp .env.example chuẩn mẫu.'),

          h2('4.2. Xây dựng các cơ chế bảo mật chuyên sâu'),
          p(
            'Hệ thống triển khai các lớp bảo vệ đa tầng (Defense in Depth) nhằm đáp ứng tiêu chuẩn an toàn thông tin:'
          ),
          p('• Chống SQL Injection: Sử dụng Prisma ORM với cơ chế Parameterized Queries, loại bỏ 100% rủi ro tiêm mã độc vào câu lệnh SQL.'),
          p('• Chống Cross-Site Scripting (XSS): Sử dụng thư viện Sanitize-HTML làm sạch toàn bộ nội dung HTML bài viết và triệt tiêu toàn bộ thẻ độc hại trong bình luận.'),
          p('• Chống Brute-force & DoS: Cấu hình Express-Rate-Limit giới hạn tối đa 30 lần thử đăng nhập trong 15 phút và 10 bình luận/phút.'),
          p('• Bảo mật phiên làm việc: Lưu trữ access_token trong Cookie HttpOnly với thuộc tính SameSite=Lax, ngăn chặn JavaScript độc hại truy cập token.'),
          p('• Chống lỗi IDOR (Insecure Direct Object Reference): Backend luôn xác thực authorId của bài viết khớp với userId trong token trước khi cho phép sửa/xóa.'),

          h2('4.3. Các trang giao diện chính đã xây dựng'),
          p('• Cổng thông tin công khai (14 trang): Trang chủ (/), Danh sách bài viết (/posts), Chi tiết bài viết (/posts/:slug), Danh mục chuyên môn (/categories/:slug), Thẻ từ khóa (/tags/:slug), Tìm kiếm (/search), Trang tác giả (/authors/:id), Đăng nhập (/login), Đăng ký (/register), Quên mật khẩu (/forgot-password), Đặt lại mật khẩu (/reset-password), Hồ sơ cá nhân (/profile), Bài viết đã lưu (/saved-posts), Trang lỗi 404.'),
          p('• Phân hệ Quản trị CMS (10 trang): Bảng điều khiển thống kê (/admin), Quản lý bài viết (/admin/posts), Tạo bài viết mới (/admin/posts/new), Chỉnh sửa bài viết (/admin/posts/edit/:id), Quản lý danh mục (/admin/categories), Quản lý thẻ (/admin/tags), Kiểm duyệt bình luận (/admin/comments), Quản lý người dùng (/admin/users), Thư viện Media (/admin/media), Nhật ký hoạt động (/admin/audit-logs), Cài đặt hệ thống (/admin/settings).'),

          // CHƯƠNG 5
          h1('CHƯƠNG 5: KIỂM THỬ TỰ ĐỘNG VÀ ĐÁNH GIÁ KẾT QUẢ'),
          h2('5.1. Phương pháp và công cụ kiểm thử'),
          p(
            'Hệ thống áp dụng công cụ Vitest kết hợp thư viện Supertest để tự động hóa toàn bộ quá trình kiểm thử mà không cần thao tác thủ công.'
          ),

          h2('5.2. Kết quả kiểm thử tự động thực tế (Vitest Report)'),
          createTable(
            ['Nhóm bài test', 'Số lượng test', 'Trạng thái', 'Nội dung kiểm thử trọng tâm'],
            [
              ['Unit Tests (Tiện ích & Xác thực)', '6 ca kiểm thử', '100% ĐẠT', 'Xử lý chuỗi slug tiếng Việt, băm Bcrypt, ký/giải mã JWT, Zod validation schema.'],
              ['Integration Tests (API & CSDL)', '11 ca kiểm thử', '100% ĐẠT', 'Healthcheck 200, Đăng nhập đúng/sai, Lọc bài viết công khai, Phân quyền RBAC 401/403, Dashboard stats.'],
              ['TỔNG CỘNG', '17 ca kiểm thử', '17/17 PASSED (100%)', 'Thời gian thực thi toàn bộ: 4.06 giây, không có cảnh báo lỗi.']
            ]
          ),

          h2('5.3. Bằng chứng kiểm thử bảo mật phân quyền RBAC'),
          p('• Test Case SEC-01 (401 Unauthorized): Gọi API quản trị người dùng GET /api/v1/users khi chưa đăng nhập -> Kết quả trả về mã HTTP 401 và thông báo "Yêu cầu đăng nhập để truy cập tài nguyên này".'),
          p('• Test Case SEC-02 (403 Forbidden): Sử dụng token của tài khoản Độc giả (READER) gọi API GET /api/v1/users -> Kết quả trả về mã HTTP 403 và thông báo "Bạn không có quyền thực hiện hành động này. Yêu cầu vai trò: [ADMIN]".'),
          p('• Test Case SEC-03 (Admin Access): Sử dụng token của tài khoản Quản trị viên (ADMIN) gọi API GET /api/v1/users -> Kết quả trả về mã HTTP 200 và danh sách đầy đủ người dùng trong CSDL.'),

          // KẾT LUẬN
          h1('KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN'),
          h2('1. Các kết quả đạt được'),
          p(
            'Sau quá trình nghiêm túc nghiên cứu và lập trình, đề tài "Xây dựng và triển khai Hệ thống Blog / Content Management System (CMS)" đã hoàn thành 100% các mục tiêu đề ra:'
          ),
          p('1. Xây dựng hoàn chỉnh một ứng dụng web Full-stack chuyên nghiệp, có thể cài đặt, chạy thật và bảo vệ trước Hội đồng chấm thi.'),
          p('2. Cơ sở dữ liệu quan hệ chuẩn mực, có seed script dữ liệu mẫu hoàn chỉnh 6 tài khoản, nhiều bài viết ở các trạng thái khác nhau, bình luận và nhật ký hoạt động.'),
          p('3. Triển khai phân quyền RBAC 4 cấp độ và bảo mật đa tầng, chống các lỗ hổng phổ biến (SQL Injection, XSS, IDOR, Brute-force).'),
          p('4. Bộ kiểm thử tự động 17/17 test cases thành công và biên dịch production build thành công cả Frontend và Backend.'),
          p('5. Đã đưa mã nguồn lên GitHub công khai phục vụ việc kiểm tra và đánh giá: https://github.com/dtc245200891-blip/blog-cms.'),

          h2('2. Hạn chế và hướng phát triển tiếp theo'),
          p('• Hạn chế: Tính năng gửi email xác thực tài khoản và khôi phục mật khẩu hiện tại mới dừng ở mức giả lập Token trên môi trường phát triển (cần tích hợp dịch vụ SMTP của Google hoặc Amazon SES khi lên production thực tế).'),
          p('• Hướng phát triển: Bổ sung tính năng thông báo thời gian thực qua WebSocket (Socket.io); Tích hợp mạng phân phối nội dung (CDN) như Cloudinary hoặc AWS S3 để lưu trữ media; Bổ sung chế độ Dark Mode chuyển đổi giao diện sáng/tối.'),

          // TÀI LIỆU THAM KHẢO
          h1('TÀI LIỆU THAM KHẢO'),
          p('1. ThS. Vũ Văn Diện (2026), Bài giảng môn Triển khai và hệ thống phần mềm, Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).'),
          p('2. React Documentation (2024), React 18 & Single Page Application Architecture, https://react.dev/'),
          p('3. Prisma ORM Documentation (2024), Database Modeling, Migrations, and Relations, https://www.prisma.io/docs'),
          p('4. Express.js Guide (2024), Routing, Middleware, and Security Best Practices, https://expressjs.com/'),
          p('5. OWASP Foundation (2023), OWASP Top 10 Web Application Security Risks, https://owasp.org/www-project-top-ten/'),
          p('6. Docker Documentation (2024), Multi-stage Builds and Docker Compose v3, https://docs.docker.com/'),
          p('7. TipTap Rich Text Editor (2024), Headless Editor Framework for Modern Web Apps, https://tiptap.dev/'),
        ],
      },
    ],
  });

  // Xuất file docx
  const outputPath = path.resolve(__dirname, '..', 'BAO_CAO_DO_AN_ICTU_VU_TRONG_NGHIA.docx');
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ ĐÃ TẠO THÀNH CÔNG TỆP WORD BÁO CÁO TẠI: ${outputPath}`);
}

generateReport().catch((err) => {
  console.error('❌ Lỗi khi tạo tệp docx:', err);
  process.exit(1);
});
