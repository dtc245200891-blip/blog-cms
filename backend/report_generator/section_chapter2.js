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

function getChapter2Children() {
  const elements = [];

  // ==========================================
  // CHƯƠNG 2
  // ==========================================
  elements.push(
    h1('CHƯƠNG 2: PHÂN TÍCH YÊU CẦU HỆ THỐNG VÀ MÔ HÌNH HÓA SƠ ĐỒ USE CASE', { pageBreakBefore: true }),

    h2('2.1. Khảo sát hiện trạng và quy trình nghiệp vụ xuất bản nội dung'),
    h3('2.1.1. Phân tích quy trình xuất bản tin bài truyền thống và các điểm nghẽn'),
    p(
      'Tại nhiều tổ chức, trường học và doanh nghiệp chưa áp dụng hệ thống CMS chuyên biệt, quy trình sản xuất và xuất bản nội dung tin tức thường diễn ra thủ công qua nhiều khâu trung gian phân tán (soạn thảo bằng văn bản Word, gửi email đính kèm cho ban biên tập, duyệt bài qua tin nhắn, rồi chuyển cho nhân viên kỹ thuật web trực tiếp copy-paste mã nguồn HTML vào cơ sở dữ liệu). Quy trình này bộc lộ những điểm nghẽn nghiêm trọng:'
    ),
    bullet('Thời gian xử lý kéo dài và dễ thất lạc thông tin: Việc trao đổi qua email dẫn tới tình trạng nhầm lẫn các phiên bản sửa đổi (Version conflicts), thiếu biên bản kiểm tra nội dung chính xác.'),
    bullet('Không có quy trình phê duyệt bài viết đa tầng: Thiếu cơ chế phản hồi lý do từ chối bài viết một cách minh bạch; tác giả không biết bài viết của mình đang ở giai đoạn nào (chờ duyệt, bị từ chối do lỗi gì hay đã được phê duyệt).'),
    bullet('Nguy cơ mất an toàn thông tin và ô nhiễm dữ liệu: Người phụ trách kỹ thuật web không thể kiểm duyệt hết các thẻ HTML hoặc link độc hại được chèn trong văn bản gửi đến, dẫn tới nguy cơ bị chèn mã độc Cross-Site Scripting (XSS).'),

    h3('2.1.2. Đề xuất quy trình xuất bản nội dung số hóa mới'),
    p(
      'Hệ thống Blog/CMS của đề tài thiết lập một quy trình số hóa khép kín và tự động hóa theo vòng đời trạng thái bài viết chuẩn quốc tế (Post Lifecycle Workflow):'
    ),
    bullet('Khởi tạo và Soạn thảo (DRAFT): Tác giả (Author) đăng nhập vào hệ thống, sử dụng trình soạn thảo TipTap WYSIWYG trực quan, chèn ảnh đại diện, gắn thẻ từ khóa, chọn danh mục và có thể lưu bài viết dưới dạng bản nháp bất cứ lúc nào.'),
    bullet('Gửi thẩm định (PENDING): Khi hoàn thiện, tác giả bấm nút "Gửi phê duyệt". Bài viết chuyển trạng thái sang PENDING và xuất hiện ngay trên Bảng điều khiển kiểm duyệt của Ban biên tập.'),
    bullet('Thẩm định và Phê duyệt (APPROVE -> PUBLISHED): Biên tập viên (Editor) hoặc Quản trị viên (Admin) đọc thẩm định bài viết. Nếu nội dung đạt yêu cầu, bấm nút "Phê duyệt"; hệ thống tự động gán trạng thái PUBLISHED, ghi nhận thời gian xuất bản chính xác, xuất bản bài viết ra Cổng thông tin công khai và gửi thông báo chúc mừng tới Tác giả.'),
    bullet('Từ chối bài viết (REJECT): Nếu bài viết chưa đạt tiêu chuẩn, Biên tập viên bấm "Từ chối" và bắt buộc phải nhập lý do từ chối chi tiết (ví dụ: thiếu trích dẫn nguồn, hình ảnh mờ, vi phạm quy chế); hệ thống chuyển trạng thái bài viết về REJECTED và gửi thông báo kèm lý do cho tác giả để tiến hành sửa đổi.'),
    bullet('Lưu trữ (ARCHIVED): Các bài viết cũ hoặc bài viết cần tạm ẩn có thể được chuyển sang trạng thái lưu trữ mà không bị xóa vĩnh viễn khỏi CSDL.'),

    callout(
      'QUY TẮC NGHIỆP VỤ CỐT LÕI VỀ VÒNG ĐỜI BÀI VIẾT',
      [
        '• Chỉ những bài viết có trạng thái PUBLISHED mới được phép hiển thị ra ngoài Cổng thông tin công khai cho Khách và Độc giả xem.',
        '• Tác giả (Author) chỉ có quyền chỉnh sửa bài viết của mình khi ở trạng thái DRAFT hoặc REJECTED. Khi bài đang ở trạng thái PENDING (chờ duyệt), bài viết sẽ bị khóa chỉnh sửa để phục vụ thẩm định.',
        '• Mọi hành vi duyệt hoặc từ chối bài viết đều được tự động ghi nhận vào bảng Nhật ký kiểm toán an toàn (audit_logs).',
      ],
      'blue'
    ),

    h2('2.2. Phân tích yêu cầu chức năng (Functional Requirements)'),
    p(
      'Dựa trên quá trình khảo sát nghiệp vụ và đặc tả ca sử dụng, hệ thống Blog/CMS được phân rã thành 7 phân hệ chức năng với 26 yêu cầu cụ thể (Bảng 2.1):'
    ),

    p('Bảng 2.1: Danh mục 26 yêu cầu chức năng của hệ thống Blog/CMS', {
      bold: true,
      size: 24,
      color: COLORS.NAVY_PRIMARY,
      before: 120,
      after: 80,
    }),
    createTable(
      ['Mã yêu cầu', 'Tên chức năng nghiệp vụ', 'Mô tả chi tiết yêu cầu phần mềm'],
      [
        [
          'FR-AUTH-01',
          'Đăng ký tài khoản độc giả',
          'Người dùng đăng ký với email duy nhất, tên đăng nhập duy nhất, họ tên và mật khẩu hợp lệ; mặc định vai trò là READER.',
        ],
        [
          'FR-AUTH-02',
          'Đăng nhập hệ thống',
          'Đăng nhập bằng Email hoặc Username kèm mật khẩu. Hệ thống cấp phát Cookie HttpOnly và Token JWT phiên làm việc.',
        ],
        [
          'FR-AUTH-03',
          'Đăng xuất an toàn',
          'Hủy bỏ phiên làm việc, xóa Cookie access_token phía trình duyệt.',
        ],
        [
          'FR-AUTH-04',
          'Khôi phục mật khẩu quên',
          'Tạo token đặt lại mật khẩu dùng một lần, có thời hạn hiệu lực 1 giờ.',
        ],
        [
          'FR-AUTH-05',
          'Cập nhật hồ sơ cá nhân',
          'Người dùng cập nhật họ tên, tiểu sử (bio), ảnh đại diện (avatar) và thực hiện đổi mật khẩu tài khoản.',
        ],
        [
          'FR-AUTH-06',
          'Giới hạn tần suất đăng nhập',
          'Áp dụng Rate Limiting chặn brute-force: tối đa 30 lần thử đăng nhập sai trong vòng 15 phút từ một IP.',
        ],
        [
          'FR-POST-01',
          'Soạn thảo bài viết mới',
          'Tác giả nhập tiêu đề, tóm tắt, soạn thảo HTML bằng TipTap WYSIWYG, chèn ảnh đại diện, chọn chuyên mục và gắn thẻ.',
        ],
        [
          'FR-POST-02',
          'Tự động sinh Slug chuẩn SEO',
          'Hệ thống tự động chuyển đổi tiêu đề tiếng Việt có dấu thành chuỗi URL không dấu, nối bằng gạch ngang, đảm bảo tính duy nhất.',
        ],
        [
          'FR-POST-03',
          'Lưu bản nháp bài viết',
          'Cho phép tác giả lưu trữ bài viết ở trạng thái DRAFT để tiếp tục biên soạn khi cần.',
        ],
        [
          'FR-POST-04',
          'Gửi bài viết đề nghị duyệt',
          'Chuyển trạng thái bài viết từ DRAFT hoặc REJECTED sang PENDING để gửi tới ban biên tập.',
        ],
        [
          'FR-POST-05',
          'Phê duyệt bài viết (Approve)',
          'Biên tập viên/Admin duyệt bài: đổi status = PUBLISHED, gán publishedAt = NOW(), gửi thông báo cho tác giả.',
        ],
        [
          'FR-POST-06',
          'Từ chối bài viết (Reject)',
          'Biên tập viên/Admin từ chối bài: bắt buộc nhập rejectionReason, đổi status = REJECTED, gửi thông báo kèm lý do cho tác giả.',
        ],
        [
          'FR-POST-07',
          'Đếm lượt xem bài viết nguyên tử',
          'Mỗi lượt đọc bài viết chi tiết tự động tăng viewsCount thêm 1 đơn vị một cách nguyên tử (Atomic View Increment) và ghi nhận vào post_views.',
        ],
        [
          'FR-CAT-01',
          'Quản lý danh mục chuyên môn',
          'Thêm, sửa, xóa danh mục bài viết. Hỗ trợ cấu trúc phân cấp danh mục cha - con (Recursive Category Hierarchy).',
        ],
        [
          'FR-CAT-02',
          'Bảo vệ toàn vẹn danh mục',
          'Chặn xóa danh mục khi đang có bài viết hoặc đang chứa các danh mục con trực thuộc.',
        ],
        [
          'FR-TAG-01',
          'Quản lý thẻ từ khóa (Tags)',
          'Thêm, sửa, xóa thẻ từ khóa. Cho phép gắn nhiều thẻ vào một bài viết (quan hệ Nhiều - Nhiều).',
        ],
        [
          'FR-COM-01',
          'Gửi bình luận bài viết',
          'Độc giả đã đăng nhập gửi bình luận vào bài viết cho phép bình luận. Hỗ trợ trả lời bình luận (Reply đa cấp).',
        ],
        [
          'FR-COM-02',
          'Khử độc nội dung bình luận',
          'Tự động làm sạch toàn bộ nội dung bình luận qua Sanitize-HTML, triệt tiêu mọi thẻ script/iframe/onload chống XSS.',
        ],
        [
          'FR-COM-03',
          'Kiểm duyệt bình luận',
          'Biên tập viên/Admin kiểm duyệt và gắn trạng thái bình luận: PENDING, APPROVED, REJECTED, SPAM.',
        ],
        [
          'FR-BOOK-01',
          'Lưu bài viết yêu thích (Bookmark)',
          'Độc giả lưu hoặc hủy lưu bài viết vào danh sách bài đã lưu cá nhân (/saved-posts).',
        ],
        [
          'FR-MED-01',
          'Tải tệp tin Media lên hệ thống',
          'Tải ảnh đại diện/ảnh minh họa lên máy chủ (Multer), kiểm tra MIME type ảnh hợp lệ, giới hạn dung lượng <= 5MB.',
        ],
        [
          'FR-MED-02',
          'Quản lý thư viện hình ảnh',
          'Xem danh sách ảnh đã tải lên, sao chép URL ảnh để chèn vào bài viết, xóa ảnh khi không sử dụng.',
        ],
        [
          'FR-DASH-01',
          'Thống kê số liệu Dashboard',
          'Thống kê tổng số bài viết, bài đã xuất bản, bài chờ duyệt, tổng người dùng, tổng bình luận và tổng lượt đọc toàn trang.',
        ],
        [
          'FR-DASH-02',
          'Biểu đồ phân tích thời gian thực',
          'Biểu đồ hình cột/hình tròn Recharts phân tích số lượng bài viết theo từng chuyên mục và bảng top 5 bài xem nhiều nhất.',
        ],
        [
          'FR-AUDIT-01',
          'Ghi nhận nhật ký an toàn (Audit Log)',
          'Tự động ghi lại mọi hành động nhạy cảm: Ai thực hiện (userId), hành động gì (action), thực thể nào (entity), địa chỉ IP, User-Agent và thời gian.',
        ],
        [
          'FR-SET-01',
          'Cấu hình tham số hệ thống',
          'Admin cập nhật thông tin tên trang web, mô tả SEO, chính sách phê duyệt bình luận và chế độ bảo trì.',
        ],
      ],
      { colWidths: [18, 30, 52] }
    ),

    h2('2.3. Phân tích yêu cầu phi chức năng (Non-Functional Requirements)'),
    p(
      'Yêu cầu phi chức năng đóng vai trò quyết định đến chất lượng vận hành, độ an toàn và sự ổn định của hệ thống:'
    ),
    bullet('An toàn và Bảo mật (NFR-SEC): Mật khẩu phải được băm một chiều bằng thuật toán Bcrypt với hệ số muối (salt rounds) tối thiểu là 10. Mã Token JWT phải được ký bằng khóa bí mật (Secret Key) độ dài tối thiểu 256-bit. Triệt tiêu 100% nguy cơ SQL Injection bằng việc sử dụng cơ chế Parameterized Queries trong Prisma ORM. Khử toàn bộ mã độc kịch bản HTML (XSS) trước khi lưu trữ hoặc hiển thị. Cấu hình cờ SameSite=Lax và HttpOnly trên Cookie để chống tấn công CSRF và trộm cắp phiên.'),
    bullet('Hiệu năng và Thời gian đáp ứng (NFR-PERF): Thời gian phản hồi của các API đọc bài viết công khai phải đạt mức trung bình dưới 100ms. Cơ sở dữ liệu phải được đánh chỉ mục B-Tree tại các cột thường xuyên tìm kiếm và lọc dữ liệu (slug, status, authorId, categoryId, publishedAt). Giao diện Frontend sử dụng bộ nhớ đệm TanStack Query để tránh gọi lại API khi dữ liệu chưa có sự thay đổi.'),
    bullet('Tính sẵn sàng và Độ tin cậy (NFR-REL): Hệ thống vận hành liên tục 24/7. Tầng CSDL hỗ trợ sao lưu dữ liệu tự động định kỳ. Tầng ứng dụng Express được bọc bởi Middleware bắt lỗi tập trung (Global Error Handler), ngăn chặn máy chủ bị sập khi xảy ra lỗi ngoại lệ bất ngờ.'),
    bullet('Tính khả dụng và Trải nghiệm người dùng (NFR-USAB): Giao diện thân thiện, hiện đại, thời gian tải trang ban đầu (First Contentful Paint - FCP) dưới 1.5 giây. Thiết kế hoàn toàn tương thích trên mọi kích thước màn hình từ điện thoại di động (375px) đến màn hình máy tính 4K.'),
    bullet('Khả năng bảo trì và Mở rộng (NFR-MAINT): 100% mã nguồn được định kiểu tĩnh bằng TypeScript strictly typed, tuân thủ nguyên tắc Clean Code và kiến trúc phân lớp hướng module hóa, giúp việc bổ sung tính năng mới diễn ra thuận lợi mà không ảnh hưởng tới các module hiện hữu.'),

    h2('2.4. Xác định các tác nhân và ma trận phân quyền (RBAC Matrix)'),
    h3('2.4.1. Định nghĩa 5 nhóm tác nhân trong hệ thống'),
    p(
      'Hệ thống thiết lập mô hình kiểm soát truy cập dựa trên vai trò (Role-Based Access Control - RBAC) với 5 nhóm tác nhân có quan hệ phân cấp chặt chẽ:'
    ),
    bullet('1. Khách vãng lai (Guest): Người dùng chưa đăng nhập, chỉ có thẩm quyền đọc bài viết đã xuất bản (PUBLISHED), tìm kiếm bài viết, xem danh mục, xem trang tác giả và đăng ký tài khoản mới.'),
    bullet('2. Độc giả (Reader): Người dùng đã đăng ký và đăng nhập tài khoản. Kế thừa toàn bộ quyền của Khách, bổ sung quyền gửi bình luận, trả lời bình luận, lưu bài viết yêu thích (Bookmark), quản lý trang bài đã lưu, cập nhật hồ sơ cá nhân và đổi mật khẩu.'),
    bullet('3. Tác giả (Author): Giảng viên hoặc sinh viên được phân quyền viết bài. Kế thừa quyền của Độc giả, bổ sung quyền soạn thảo bài viết mới bằng TipTap WYSIWYG, tải ảnh lên thư viện Media cá nhân, lưu bản nháp (DRAFT), gửi bài viết đề nghị duyệt (PENDING), xem danh sách bài viết do mình viết, chỉnh sửa bài viết của chính mình (chống lỗi IDOR).'),
    bullet('4. Biên tập viên (Editor): Thành viên ban biên tập thẩm định nội dung. Kế thừa quyền của Độc giả, có thẩm quyền xem toàn bộ bài viết chờ duyệt trên toàn hệ thống, thẩm định nội dung, thực hiện phê duyệt (Approve) hoặc từ chối bài viết (Reject kèm lý do phản hồi), kiểm duyệt bình luận của độc giả, quản lý danh mục và thẻ từ khóa.'),
    bullet('5. Quản trị viên (Admin): Người quản trị tối cao của hệ thống. Kế thừa toàn bộ quyền hạn của Biên tập viên và Tác giả; bổ sung thẩm quyền quản lý tài khoản người dùng (đổi vai trò RBAC giữa các tài khoản, khóa hoặc mở khóa tài khoản), ghim bài viết nổi bật, xem toàn bộ bảng điều khiển thống kê nâng cao, theo dõi nhật ký an toàn (Audit logs) và thay đổi cấu hình thông số hệ thống.'),

    h3('2.4.2. Bảng ma trận phân quyền RBAC chi tiết'),
    p(
      'Bảng 2.2 dưới đây mô tả chi tiết ma trận phân quyền RBAC áp dụng cho toàn bộ 26 nhóm chức năng phần mềm được kiểm tra xác thực nghiêm ngặt tại tầng Backend:'
    ),

    p('Bảng 2.2: Ma trận phân quyền chức năng RBAC 5 cấp độ', {
      bold: true,
      size: 24,
      color: COLORS.NAVY_PRIMARY,
      before: 120,
      after: 80,
    }),
    createTable(
      ['Nhóm chức năng nghiệp vụ', 'Guest', 'Reader', 'Author', 'Editor', 'Admin'],
      [
        ['Xem bài viết công khai (PUBLISHED)', 'Có', 'Có', 'Có', 'Có', 'Có'],
        ['Tìm kiếm bài viết / Lọc chuyên mục & thẻ', 'Có', 'Có', 'Có', 'Có', 'Có'],
        ['Đăng ký tài khoản độc giả mới', 'Có', 'Không', 'Không', 'Không', 'Không'],
        ['Đăng nhập / Đăng xuất hệ thống', 'Có', 'Có', 'Có', 'Có', 'Có'],
        ['Khôi phục mật khẩu quên', 'Có', 'Có', 'Có', 'Có', 'Có'],
        ['Cập nhật thông tin hồ sơ & Đổi mật khẩu', 'Không', 'Có', 'Có', 'Có', 'Có'],
        ['Lưu bài viết yêu thích (Bookmark)', 'Không', 'Có', 'Có', 'Có', 'Có'],
        ['Gửi bình luận & Trả lời bình luận', 'Không', 'Có', 'Có', 'Có', 'Có'],
        ['Soạn thảo bài viết mới (TipTap Editor)', 'Không', 'Không', 'Có', 'Có', 'Có'],
        ['Lưu bản nháp bài viết (DRAFT)', 'Không', 'Không', 'Có', 'Có', 'Có'],
        ['Gửi bài viết đề nghị duyệt (PENDING)', 'Không', 'Không', 'Có', 'Có', 'Có'],
        ['Chỉnh sửa bài viết của chính mình (chống IDOR)', 'Không', 'Không', 'Có', 'Có', 'Có'],
        ['Tải tệp ảnh lên thư viện Media', 'Không', 'Không', 'Có', 'Có', 'Có'],
        ['Xem bài viết chờ duyệt trên toàn hệ thống', 'Không', 'Không', 'Không', 'Có', 'Có'],
        ['Phê duyệt bài viết (APPROVE -> PUBLISHED)', 'Không', 'Không', 'Không', 'Có', 'Có'],
        ['Từ chối bài viết kèm lý do (REJECT)', 'Không', 'Không', 'Không', 'Có', 'Có'],
        ['Kiểm duyệt bình luận (APPROVED/SPAM/REJECT)', 'Không', 'Không', 'Không', 'Có', 'Có'],
        ['Quản lý Danh mục (Thêm, Sửa, Xóa)', 'Không', 'Không', 'Không', 'Có', 'Có'],
        ['Quản lý Thẻ từ khóa (Tags)', 'Không', 'Không', 'Không', 'Có', 'Có'],
        ['Ghim bài viết nổi bật lên đầu trang chủ', 'Không', 'Không', 'Không', 'Không', 'Có'],
        ['Xem Bảng điều khiển thống kê (Dashboard)', 'Không', 'Không', 'Chỉ bài mình', 'Toàn bộ', 'Toàn bộ'],
        ['Xem Danh sách tài khoản người dùng', 'Không', 'Không', 'Không', 'Không', 'Có'],
        ['Thay đổi vai trò người dùng (Đổi Role RBAC)', 'Không', 'Không', 'Không', 'Không', 'Có'],
        ['Khóa / Mở khóa tài khoản người dùng', 'Không', 'Không', 'Không', 'Không', 'Có'],
        ['Xem Nhật ký kiểm toán an toàn (Audit Logs)', 'Không', 'Không', 'Không', 'Không', 'Có'],
        ['Cấu hình thông số website hệ thống', 'Không', 'Không', 'Không', 'Không', 'Có'],
      ],
      { colWidths: [36, 12, 12, 14, 13, 13] }
    ),

    h2('2.5. Mô hình hóa biểu đồ Use Case hệ thống'),
    h3('2.5.1. Đặc tả sơ đồ Use Case tổng quát toàn hệ thống'),
    p(
      'Sơ đồ Use Case tổng quát mô tả bức tranh toàn cảnh về sự tương tác giữa 5 tác nhân (Actors) và các phân hệ ranh giới chức năng của hệ thống:'
    ),
    bullet('Phân hệ Cổng thông tin công khai (Public Portal Boundary): Bao gồm các Use Case "Xem bài viết", "Tìm kiếm bài viết", "Lọc theo danh mục/thẻ", "Đăng ký tài khoản", "Đăng nhập/Đăng xuất", "Lưu bài viết yêu thích", "Gửi bình luận thảo luận".'),
    bullet('Phân hệ Tác giả và Soạn thảo (Authoring Boundary): Bao gồm các Use Case "Tạo bài viết mới", "Soạn nội dung phong phú WYSIWYG", "Tải ảnh đại diện", "Lưu bản nháp", "Gửi bài chờ duyệt", "Quản lý bài viết cá nhân".'),
    bullet('Phân hệ Biên tập và Kiểm duyệt (Editorial Boundary): Kế thừa quyền xem bài viết và bao gồm các Use Case "Xem bài viết chờ duyệt", "Thẩm định nội dung", "Phê duyệt bài viết", "Từ chối bài viết kèm lý do", "Kiểm duyệt bình luận", "Quản lý chuyên mục", "Quản lý thẻ".'),
    bullet('Phân hệ Quản trị tối cao (System Administration Boundary): Kế thừa quyền của Biên tập viên và Tác giả, mở rộng thêm các Use Case "Quản lý người dùng", "Phân quyền vai trò RBAC", "Khóa tài khoản", "Xem bảng điều khiển số liệu", "Xem nhật ký an toàn audit log", "Cấu hình tham số hệ thống".'),

    h3('2.5.2. Biểu đồ trạng thái vòng đời bài viết (Post Lifecycle)'),
    p(
      'Vòng đời của một bài viết trong hệ thống CMS được mô hình hóa qua các trạng thái chính xác:'
    ),
    bullet('Trạng thái DRAFT (Bản nháp): Bài viết đang trong quá trình thai nghén bởi Tác giả, chỉ tác giả mới nhìn thấy bài viết này.'),
    bullet('Trạng thái PENDING (Chờ duyệt): Tác giả hoàn thành và bấm gửi duyệt; bài viết xuất hiện trên danh sách thẩm định của Ban biên tập.'),
    bullet('Trạng thái PUBLISHED (Đã xuất bản): Biên tập viên chấp thuận; bài viết được công khai trên cổng thông tin cho toàn bộ người dùng Internet tiếp cận.'),
    bullet('Trạng thái REJECTED (Bị từ chối): Biên tập viên yêu cầu chỉnh sửa; bài viết kèm lý do cụ thể được gửi lại cho Tác giả để hoàn thiện lại.'),
    bullet('Trạng thái ARCHIVED (Lưu trữ): Bài viết được gỡ khỏi trang chủ để lưu vào kho lưu trữ số, bảo toàn lịch sử.'),

    h2('2.6. Đặc tả kịch bản Use Case chi tiết (Use Case Specifications)'),
    p(
      'Nhằm phục vụ việc cài đặt mã nguồn và kiểm thử phần mềm chính xác, 4 ca sử dụng trọng tâm nhất của hệ thống được đặc tả chi tiết dưới dạng bảng chuẩn kỹ thuật công nghiệp:'
    ),

    // Đặc tả UC-AUTH-02
    h3('2.6.1. Đặc tả Use Case UC-AUTH-02: Đăng nhập hệ thống'),
    createTable(
      ['Mục đặc tả', 'Nội dung chi tiết'],
      [
        ['Tên Use Case', 'Đăng nhập hệ thống (User Login)'],
        ['Mã Use Case', 'UC-AUTH-02'],
        ['Tác nhân chính', 'Khách vãng lai (Guest) / Độc giả / Tác giả / Biên tập viên / Quản trị viên'],
        ['Mô tả tóm tắt', 'Người dùng nhập email/username và mật khẩu để xác thực quyền truy cập vào hệ thống.'],
        ['Điều kiện tiên quyết', 'Tài khoản người dùng đã được tạo trong CSDL và đang ở trạng thái hoạt động (isActive = true).'],
        ['Điều kiện sau', 'Hệ thống cấp phát mã JWT token và thiết lập Cookie HttpOnly; người dùng được chuyển hướng vào trang tương ứng với vai trò.'],
        ['Luồng sự kiện chính (Main Flow)', '1. Người dùng truy cập trang /login.\n2. Người dùng nhập Email (hoặc Username) và Mật khẩu, bấm "Đăng nhập".\n3. Trình duyệt gửi HTTP POST /api/v1/auth/login kèm payload JSON.\n4. Backend kiểm thực định dạng bằng Zod Schema.\n5. Backend truy vấn CSDL tìm kiếm tài khoản theo email hoặc username.\n6. Backend so sánh mật khẩu gửi lên với mật khẩu băm Bcrypt trong CSDL.\n7. Mật khẩu khớp: Backend sinh JWT Token chứa userId và role.\n8. Backend ghi bản ghi vào audit_logs với hành động "LOGIN".\n9. Backend trả về Cookie HttpOnly access_token và JSON chứa thông tin người dùng.\n10. Frontend lưu trạng thái đăng nhập vào AuthContext và chuyển hướng người dùng.'],
        ['Luồng rẽ nhánh (Alternative Flows)', '4a. Dữ liệu đầu vào sai định dạng: Trả về HTTP 400 Bad Request kèm thông báo lỗi cụ thể.\n5a. Không tìm thấy tài khoản: Trả về HTTP 400 "Thông tin đăng nhập không chính xác".\n5b. Tài khoản bị khóa (isActive = false): Trả về HTTP 403 "Tài khoản của bạn đã bị khóa bởi Quản trị viên".\n6a. Mật khẩu không trùng khớp: Trả về HTTP 400 "Thông tin đăng nhập không chính xác".\n6b. Vượt quá 30 lần thử sai trong 15 phút: Rate Limiter trả về HTTP 429 "Quá nhiều yêu cầu, vui lòng thử lại sau".'],
      ],
      { colWidths: [26, 74] }
    ),

    // Đặc tả UC-POST-01
    h3('2.6.2. Đặc tả Use Case UC-POST-01: Soạn thảo bài viết mới và Lưu nháp'),
    createTable(
      ['Mục đặc tả', 'Nội dung chi tiết'],
      [
        ['Tên Use Case', 'Soạn thảo bài viết mới và Lưu bản nháp (Create Draft Post)'],
        ['Mã Use Case', 'UC-POST-01'],
        ['Tác nhân chính', 'Tác giả (Author), Biên tập viên (Editor), Quản trị viên (Admin)'],
        ['Mô tả tóm tắt', 'Tác giả nhập tiêu đề, đoạn tóm tắt, nội dung định dạng HTML qua TipTap, chọn danh mục, gắn thẻ và lưu trữ bài viết.'],
        ['Điều kiện tiên quyết', 'Người dùng đã đăng nhập thành công với vai trò tối thiểu là AUTHOR.'],
        ['Điều kiện sau', 'Bản ghi bài viết mới được tạo thành công trong bảng posts với trạng thái DRAFT; slug tự động sinh không trùng lặp.'],
        ['Luồng sự kiện chính (Main Flow)', '1. Tác giả truy cập vào trang Quản lý bài viết, bấm "Tạo bài viết mới" (/admin/posts/new).\n2. Giao diện hiển thị form soạn thảo gồm: Tiêu đề, Slug tự sinh, Tóm tắt ngắn, Khung soạn thảo TipTap WYSIWYG, Ảnh đại diện, Danh mục và Thẻ tags.\n3. Tác giả nhập thông tin và biên soạn nội dung, định dạng văn bản, chèn ảnh minh họa.\n4. Tác giả bấm nút "Lưu bản nháp" (Save Draft).\n5. Frontend gửi request HTTP POST /api/v1/posts với status="DRAFT".\n6. Backend xác thực quyền Author, kiểm tra tính duy nhất của slug (nếu trùng sẽ tự nối thêm chuỗi ngẫu nhiên).\n7. Backend thực hiện làm sạch mã HTML qua Sanitize-HTML để loại bỏ thẻ độc hại.\n8. Backend ghi bản ghi bài viết mới vào bảng posts và các bản ghi liên kết trong post_tags.\n9. Backend trả về HTTP 201 Created kèm dữ liệu bài viết.\n10. Giao diện hiển thị thông báo thành công và chuyển hướng về danh sách bài viết.'],
        ['Luồng rẽ nhánh', '6a. Tiêu đề bài viết bị bỏ trống: Trả về HTTP 400 "Tiêu đề không được để trống".\n8a. Lỗi kết nối CSDL: Backend ghi log và trả về HTTP 500 "Lỗi máy chủ nội bộ".'],
      ],
      { colWidths: [26, 74] }
    ),

    // Đặc tả UC-POST-03
    h3('2.6.3. Đặc tả Use Case UC-POST-03: Thẩm định và Phê duyệt bài viết'),
    createTable(
      ['Mục đặc tả', 'Nội dung chi tiết'],
      [
        ['Tên Use Case', 'Phê duyệt bài viết xuất bản (Approve Post)'],
        ['Mã Use Case', 'UC-POST-03'],
        ['Tác nhân chính', 'Biên tập viên (Editor), Quản trị viên (Admin)'],
        ['Mô tả tóm tắt', 'Biên tập viên thẩm định bài viết đang chờ duyệt (PENDING) và thực hiện phê duyệt để công khai bài viết.'],
        ['Điều kiện tiên quyết', 'Biên tập viên đã đăng nhập thành công; bài viết đang ở trạng thái PENDING.'],
        ['Điều kiện sau', 'Bài viết chuyển sang trạng thái PUBLISHED; xuất hiện trên Cổng thông tin công khai; tác giả nhận được thông báo.'],
        ['Luồng sự kiện chính (Main Flow)', '1. Biên tập viên truy cập danh mục Quản lý bài viết (/admin/posts), chọn tab "Chờ duyệt".\n2. Hệ thống hiển thị danh sách bài viết PENDING kèm tên tác giả, chuyên mục và thời gian gửi.\n3. Biên tập viên bấm vào bài viết để đọc thẩm định toàn bộ nội dung.\n4. Biên tập viên bấm nút "Phê duyệt" (Approve).\n5. Frontend hiển thị hộp thoại xác nhận duyệt xuất bản bài viết.\n6. Biên tập viên xác nhận; Frontend gửi HTTP POST /api/v1/posts/:id/approve.\n7. Backend xác thực quyền EDITOR hoặc ADMIN.\n8. Backend cập nhật status = "PUBLISHED", publishedAt = NOW() trong bảng posts.\n9. Backend tạo một bản ghi thông báo trong bảng notifications gửi tới tác giả bài viết.\n10. Backend ghi một dòng vào bảng audit_logs: action="APPROVE_POST".\n11. Backend trả về HTTP 200 OK kèm thông điệp "Phê duyệt bài viết thành công!".\n12. Giao diện cập nhật trạng thái bài viết và đưa bài ra trang chủ.'],
        ['Luồng rẽ nhánh', '7a. Người dùng không có quyền Editor/Admin: Trả về HTTP 403 Forbidden.\n8a. Bài viết không ở trạng thái PENDING: Trả về HTTP 400 "Chỉ có thể duyệt bài viết đang chờ duyệt".'],
      ],
      { colWidths: [26, 74] }
    ),

    // Đặc tả UC-POST-04
    h3('2.6.4. Đặc tả Use Case UC-POST-04: Từ chối bài viết kèm lý do phản hồi'),
    createTable(
      ['Mục đặc tả', 'Nội dung chi tiết'],
      [
        ['Tên Use Case', 'Từ chối bài viết chờ duyệt (Reject Post)'],
        ['Mã Use Case', 'UC-POST-04'],
        ['Tác nhân chính', 'Biên tập viên (Editor), Quản trị viên (Admin)'],
        ['Mô tả tóm tắt', 'Biên tập viên từ chối bài viết không đạt yêu cầu và nhập lý do phản hồi cụ thể để tác giả chỉnh sửa lại.'],
        ['Điều kiện tiên quyết', 'Biên tập viên đã đăng nhập; bài viết đang ở trạng thái PENDING.'],
        ['Điều kiện sau', 'Bài viết chuyển sang trạng thái REJECTED kèm cột rejectionReason; tác giả nhận được thông báo phản hồi.'],
        ['Luồng sự kiện chính (Main Flow)', '1. Biên tập viên xem bài viết chờ duyệt, nhận thấy nội dung chưa đạt tiêu chuẩn.\n2. Biên tập viên bấm nút "Từ chối duyệt" (Reject).\n3. Hệ thống hiển thị cửa sổ Modal yêu cầu nhập "Lý do từ chối bài viết".\n4. Biên tập viên nhập lý do chi tiết và bấm "Xác nhận từ chối".\n5. Frontend gửi request HTTP POST /api/v1/posts/:id/reject kèm body { reason: "..." }.\n6. Backend kiểm tra quyền Editor/Admin và kiểm tra lý do không được để trống.\n7. Backend cập nhật status = "REJECTED", rejectionReason = reason trong bảng posts.\n8. Backend tạo thông báo loại "WARNING" gửi tới tác giả kèm lý do cụ thể.\n9. Backend ghi bản ghi vào audit_logs với hành động "REJECT_POST".\n10. Backend trả về HTTP 200 OK.\n11. Tác giả mở trang quản lý sẽ thấy bài viết bị từ chối kèm lý do để tiến hành sửa lại.'],
        ['Luồng rẽ nhánh', '6a. Lý do từ chối bị bỏ trống: Trả về HTTP 400 "Vui lòng nhập lý do từ chối bài viết".'],
      ],
      { colWidths: [26, 74] }
    )
  );

  return elements;
}

module.exports = { getChapter2Children };
