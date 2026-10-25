# BỘ GIÁO DỤC VÀ ĐÀO TẠO — ĐẠI HỌC THÁI NGUYÊN
## TRƯỜNG ĐẠI HỌC CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG (ICTU)
### KHOA CÔNG NGHỆ THÔNG TIN

---

<p align="center">
  <img src="ictu-logo.png" alt="Logo Trường Đại học Công nghệ Thông tin và Truyền thông" width="160" />
</p>

# BÁO CÁO ĐỒ ÁN MÔN HỌC
### MÔN HỌC: TRIỂN KHAI VÀ HỆ THỐNG PHẦN MỀM

## ĐỀ TÀI:
# XÂY DỰNG VÀ TRIỂN KHAI HỆ THỐNG BLOG / CONTENT MANAGEMENT SYSTEM (CMS) CHUYÊN NGHIỆP

---

- **Giảng viên hướng dẫn:** **ThS. Vũ Văn Diện**
- **Sinh viên thực hiện:** **Vũ Trọng Nghĩa**
- **Mã số sinh viên:** **DTC245200891**
- **Lớp chuyên ngành:** **CNTT K23L (Khóa 23)**
- **Ngành đào tạo:** **Công nghệ Thông tin**
- **Thời gian thực hiện:** **Học kỳ 1 — Năm thứ 3 (Tháng 10/2026)**
- **Địa điểm:** **Thái Nguyên, Năm 2026**

---

\newpage

# LỜI CẢM ƠN

Lời đầu tiên, em xin gửi lời bày tỏ lòng biết ơn sâu sắc và chân thành nhất tới **Thầy giáo ThS. Vũ Văn Diện** — Giảng viên giảng dạy và hướng dẫn bộ môn **Triển khai và hệ thống phần mềm**, Trường Đại học Công nghệ Thông tin và Truyền thông – Đại học Thái Nguyên (ICTU).

Trong suốt quá trình học tập và hoàn thiện đồ án môn học, Thầy đã luôn tận tình định hướng phương pháp tiếp cận kiến trúc phần mềm, chỉ dẫn các tiêu chuẩn triển khai thực tế của ngành công nghệ thông tin hiện đại, cũng như động viên, góp ý những kinh nghiệm thực tiễn quý báu giúp em hoàn thiện trọn vẹn sản phẩm cả về chất lượng mã nguồn, cơ chế bảo mật lớp sâu, tối ưu hóa cơ sở dữ liệu quan hệ và kỹ thuật container hóa ứng dụng.

Em cũng xin chân thành cảm ơn các Thầy Cô giáo trong Khoa Công nghệ Thông tin – Trường Đại học Công nghệ Thông tin và Truyền thông đã truyền thụ cho em những nền tảng tri thức học thuật vững chắc trong suốt hơn 3 năm học vừa qua. Những tri thức nền tảng về Lập trình hướng đối tượng, Cơ sở dữ liệu, Kiến trúc máy tính, Mạng máy tính và Công nghệ phần mềm chính là hành trang vô cùng quan trọng giúp em tự tin thiết kế, lập trình và triển khai các hệ thống phần mềm đáp ứng nhu cầu thực tiễn của doanh nghiệp.

Mặc dù đã rất nỗ lực nghiên cứu các tài liệu tiêu chuẩn công nghiệp và hoàn thiện sản phẩm một cách chỉn chu nhất, song do giới hạn về mặt thời gian và kinh nghiệm thực tế, báo cáo đồ án khó tránh khỏi những thiếu sót nhất định. Em rất mong nhận được những ý kiến đóng góp, chỉ dẫn quý báu từ Thầy giáo hướng dẫn và Hội đồng chấm điểm để hệ thống ngày càng hoàn thiện, ổn định và có thể đưa vào phục vụ cộng đồng sinh viên trong tương lai.

*Em xin chân thành cảm ơn!*  
<p align="right"><b>Sinh viên thực hiện: Vũ Trọng Nghĩa (DTC245200891)</b></p>

---

\newpage

# DANH MỤC THUẬT NGỮ VÀ TỪ VIẾT TẮT

| Từ viết tắt | Tên đầy đủ tiếng Anh | Giải nghĩa tiếng Việt |
|---|---|---|
| **CMS** | Content Management System | Hệ thống Quản trị Nội dung số. |
| **RBAC** | Role-Based Access Control | Mô hình Kiểm soát Truy cập Dựa trên Vai trò. |
| **JWT** | JSON Web Token | Chuẩn mã hóa thông tin xác thực an toàn định dạng JSON. |
| **ORM** | Object-Relational Mapping | Kỹ thuật ánh xạ quan hệ đối tượng cơ sở dữ liệu. |
| **API** | Application Programming Interface | Giao diện lập trình ứng dụng kết nối hệ thống. |
| **REST** | Representational State Transfer | Kiến trúc truyền trạng thái đại diện trong Web Service. |
| **SPA** | Single Page Application | Ứng dụng web một trang tải động không tải lại trình duyệt. |
| **SSR** | Server-Side Rendering | Kỹ thuật kết xuất giao diện trực tiếp từ máy chủ. |
| **XSS** | Cross-Site Scripting | Lỗ hổng tấn công tiêm mã kịch bản độc hại vào trình duyệt. |
| **CSRF** | Cross-Site Request Forgery | Tấn công giả mạo yêu cầu từ phía người dùng tin cậy. |
| **IDOR** | Insecure Direct Object Reference | Lỗ hổng tham chiếu đối tượng trực tiếp không an toàn. |
| **SQLi** | SQL Injection | Lỗ hổng tiêm mã độc vào câu lệnh truy vấn cơ sở dữ liệu. |
| **ERD** | Entity Relationship Diagram | Sơ đồ thực thể quan hệ cơ sở dữ liệu. |
| **SRS** | Software Requirements Specification | Tài liệu đặc tả yêu cầu phần mềm. |
| **UI/UX** | User Interface / User Experience | Giao diện người dùng và Trải nghiệm người dùng. |
| **CRUD** | Create, Read, Update, Delete | Bốn thao tác dữ liệu cơ bản: Tạo, Đọc, Sửa, Xóa. |
| **ACID** | Atomicity, Consistency, Isolation, Durability | Bốn thuộc tính toàn vẹn của giao dịch CSDL quan hệ. |
| **MVC** | Model - View - Controller | Mô hình kiến trúc phần mềm ba lớp phổ biến. |
| **CI/CD** | Continuous Integration / Continuous Delivery | Quy trình tích hợp liên tục và triển khai liên tục. |
| **VCS** | Version Control System | Hệ thống quản lý phiên bản mã nguồn (như Git). |
| **HMR** | Hot Module Replacement | Cơ chế cập nhật nóng module mã nguồn không tải lại trang. |
| **DoS** | Denial of Service | Tấn công từ chối dịch vụ làm quá tải tài nguyên máy chủ. |
| **UUID** | Universally Unique Identifier | Định danh duy nhất toàn cầu 128-bit. |

---

\newpage

# LỜI MỞ ĐẦU

### 1. Tính cấp thiết của đề tài
Trong kỷ nguyên của cuộc Cách mạng Công nghiệp lần thứ tư và công cuộc chuyển đổi số quốc gia đang diễn ra mạnh mẽ, thông tin và tri thức số đã trở thành tài sản vô giá của mọi tổ chức, cơ quan giáo dục và doanh nghiệp. Việc sản xuất, biên tập, xuất bản và phân phối thông tin đa phương tiện trên môi trường Internet đòi hỏi phải có một nền tảng phần mềm quản trị nội dung (Content Management System - CMS) chuyên nghiệp, an toàn, ổn định và linh hoạt.

Mặc dù trên thị trường công nghệ hiện nay đã có nhiều giải pháp phần mềm quản trị nội dung mã nguồn mở lâu đời như WordPress, Drupal hay Joomla, tuy nhiên các hệ sinh thái này sau nhiều năm phát triển đã trở nên rất cồng kềnh, tiêu tốn nhiều tài nguyên máy chủ, kiến trúc nguyên khối (Monolithic) gắn chặt giao diện với cơ sở dữ liệu gây khó khăn cho việc tối ưu tốc độ. Hơn thế nữa, việc phụ thuộc vào hàng chục plugin từ các bên thứ ba tiềm ẩn vô vàn nguy cơ bảo mật, rất khó kiểm soát mã nguồn độc hại, và đặc biệt là không thể đáp ứng linh hoạt các quy trình nghiệp vụ kiểm duyệt đa cấp độ (từ Tác giả soạn thảo, Biên tập viên thẩm định cho đến Quản trị viên điều hành).

Xuất phát từ yêu cầu đào tạo thực tiễn và các chuẩn đầu ra khắt khe của học phần "Triển khai và hệ thống phần mềm" thuộc Khoa Công nghệ Thông tin – Trường Đại học Công nghệ Thông tin và Truyền thông (ICTU), đề tài **"Xây dựng và triển khai Hệ thống Blog / Content Management System (CMS) chuyên nghiệp"** được lựa chọn nghiên cứu và thực hiện. Đề tài áp dụng toàn diện các công nghệ hiện đại hàng đầu hiện nay (React 18, TypeScript, Node.js, Express, Prisma ORM, MySQL 8, Vitest và Docker) để kiến tạo một giải pháp CMS độc lập (Decoupled), hiệu năng cao, bảo mật nhiều lớp và sẵn sàng mở rộng quy mô trong thực tế.

### 2. Mục tiêu và nhiệm vụ nghiên cứu
- **Về lý thuyết:** Nắm vững toàn diện phương pháp phân tích yêu cầu nghiệp vụ, thiết kế kiến trúc phần mềm 3 tầng phân lớp rõ ràng (Separation of Concerns), thiết kế CSDL quan hệ chuẩn hóa mức 3NF, và làm chủ quy trình phát hành phần mềm hiện đại từ môi trường phát triển cục bộ đến đóng gói container hóa sản xuất.
- **Về thực nghiệm:** Xây dựng thành công một ứng dụng web Full-stack hoàn chỉnh, có khả năng chạy thật, không lỗi cú pháp, có giao diện người dùng hiện đại đáp ứng 100% Responsive trên mọi thiết bị; thiết lập quy trình kiểm duyệt bài viết chặt chẽ và bộ kiểm thử tự động 100% Passed trước khi bảo vệ trước Hội đồng chấm điểm.

---

\newpage

# CHƯƠNG 1: TỔNG QUAN HỆ THỐNG VÀ CƠ SỞ LÝ THUYẾT - CÔNG NGHỆ ÁP DỤNG

### 1.1. Khái quát về Hệ thống quản trị nội dung (CMS) và Blog tin tức
Hệ thống quản trị nội dung (Content Management System - CMS) là một giải pháp phần mềm toàn diện cho phép người sử dụng khởi tạo, biên tập, quản lý, xuất bản và lưu trữ nội dung số trên môi trường mạng máy tính mà không nhất thiết phải có kiến thức chuyên sâu về ngôn ngữ đánh dấu siêu văn bản (HTML), định kiểu (CSS) hay các câu lệnh truy vấn cơ sở dữ liệu (SQL).

Mô hình kiến trúc tách rời (Decoupled CMS) được đề tài lựa chọn: Tầng giao diện người dùng được xây dựng hoàn toàn độc lập dưới dạng Single Page Application (SPA) sử dụng React, trong khi tầng xử lý nghiệp vụ Backend được viết bằng Express.js/Node.js cung cấp RESTful API. Hai thành phần này giao tiếp thuần túy qua giao thức HTTP/JSON, đem lại hiệu năng vượt trội, khả năng phản hồi tức thì và sự tách biệt rõ ràng về trách nhiệm (Separation of Concerns).

### 1.2. Bảng tổng hợp công nghệ sử dụng trong đồ án

| Thành phần kiến trúc | Công nghệ lựa chọn | Phiên bản | Vai trò & Ưu điểm vượt trội |
|---|---|:---:|---|
| **Frontend Library** | React | 18.3.1 | Xây dựng giao diện Single Page Application, Virtual DOM tối ưu. |
| **Ngôn ngữ phát triển** | TypeScript | 5.5.3 | Kiểm soát kiểu dữ liệu tĩnh nghiêm ngặt ở cả Frontend và Backend. |
| **Công cụ đóng gói FE** | Vite | 5.4.6 | Tốc độ khởi động siêu tốc, hỗ trợ Hot Module Replacement tức thì. |
| **Định kiểu giao diện** | Tailwind CSS | 3.4.11 | Thiết kế giao diện hiện đại, responsive đa kích thước màn hình. |
| **Soạn thảo văn bản** | TipTap Editor | 2.6.6 | Soạn thảo WYSIWYG trên nền ProseMirror, xuất HTML sạch, chống XSS. |
| **Đồ thị thống kê** | Recharts | 2.12.7 | Trực quan hóa số liệu phân bố bài viết và lượt xem thời gian thực. |
| **Bộ nhớ đệm API** | TanStack Query | 5.56.2 | Quản lý trạng thái bất đồng bộ, tự động caching và tái tìm nạp. |
| **Backend Runtime** | Node.js LTS | 24.19.0 | Môi trường chạy JavaScript phía máy chủ, xử lý I/O không chặn. |
| **Web Framework** | Express.js | 4.21.0 | Khung xây dựng RESTful API linh hoạt với chuỗi middleware bảo mật. |
| **Cơ sở dữ liệu** | MySQL / SQLite | 8.0 / 3.x | Lưu trữ dữ liệu quan hệ, đảm bảo tính toàn vẹn và giao dịch ACID. |
| **Object-Relational Mapping** | Prisma ORM | 5.19.1 | Quản lý lược đồ CSDL, sinh migration tự động, chống SQL Injection. |
| **Xác thực người dùng** | JWT + Bcrypt | 9.0 / 5.1 | Mã hóa băm mật khẩu 10 salt rounds, ký token xác thực phiên làm việc. |
| **Xác thực dữ liệu** | Zod | 3.23.8 | Kiểm thực dữ liệu đầu vào nghiêm ngặt trước khi ghi vào CSDL. |
| **Khử độc mã nguồn** | Sanitize-HTML | 2.13.0 | Loại bỏ triệt để các thẻ HTML và kịch bản JavaScript độc hại chống XSS. |
| **Kiểm thử tự động** | Vitest + Supertest | 2.1.1 / 7.0 | Tự động hóa kiểm thử đơn vị và kiểm thử tích hợp API với độ chính xác cao. |
| **Đóng gói triển khai** | Docker & Compose | 29.6.2 | Container hóa dịch vụ Nginx, Node.js Backend và MySQL 8 đồng nhất. |

---

\newpage

# CHƯƠNG 2: PHÂN TÍCH YÊU CẦU HỆ THỐNG VÀ MÔ HÌNH HÓA SƠ ĐỒ USE CASE

### 2.1. Ma trận phân quyền chức năng RBAC 5 cấp độ

| Nhóm chức năng nghiệp vụ | Guest | Reader | Author | Editor | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Xem bài viết công khai (PUBLISHED) | Có | Có | Có | Có | Có |
| Tìm kiếm bài viết / Lọc chuyên mục & thẻ | Có | Có | Có | Có | Có |
| Đăng ký tài khoản độc giả mới | Có | Không | Không | Không | Không |
| Đăng nhập / Đăng xuất hệ thống | Có | Có | Có | Có | Có |
| Khôi phục mật khẩu quên | Có | Có | Có | Có | Có |
| Cập nhật thông tin hồ sơ & Đổi mật khẩu | Không | Có | Có | Có | Có |
| Lưu bài viết yêu thích (Bookmark) | Không | Có | Có | Có | Có |
| Gửi bình luận & Trả lời bình luận | Không | Có | Có | Có | Có |
| Soạn thảo bài viết mới (TipTap Editor) | Không | Không | Có | Có | Có |
| Lưu bản nháp bài viết (DRAFT) | Không | Không | Có | Có | Có |
| Gửi bài viết đề nghị duyệt (PENDING) | Không | Không | Có | Có | Có |
| Chỉnh sửa bài viết của chính mình (chống IDOR) | Không | Không | Có | Có | Có |
| Tải tệp ảnh lên thư viện Media | Không | Không | Có | Có | Có |
| Xem bài viết chờ duyệt trên toàn hệ thống | Không | Không | Không | Có | Có |
| Phê duyệt bài viết (APPROVE -> PUBLISHED) | Không | Không | Không | Có | Có |
| Từ chối bài viết kèm lý do (REJECT) | Không | Không | Không | Có | Có |
| Kiểm duyệt bình luận (APPROVED/SPAM/REJECT) | Không | Không | Không | Có | Có |
| Quản lý Danh mục (Thêm, Sửa, Xóa) | Không | Không | Không | Có | Có |
| Quản lý Thẻ từ khóa (Tags) | Không | Không | Không | Có | Có |
| Ghim bài viết nổi bật lên đầu trang chủ | Không | Không | Không | Không | Có |
| Xem Bảng điều khiển thống kê (Dashboard) | Không | Không | Chỉ bài mình | Toàn bộ | Toàn bộ |
| Xem Danh sách tài khoản người dùng | Không | Không | Không | Không | Có |
| Thay đổi vai trò người dùng (Đổi Role RBAC) | Không | Không | Không | Không | Có |
| Khóa / Mở khóa tài khoản người dùng | Không | Không | Không | Không | Có |
| Xem Nhật ký kiểm toán an toàn (Audit Logs) | Không | Không | Không | Không | Có |
| Cấu hình thông số website hệ thống | Không | Không | Không | Không | Có |

---

\newpage

# CHƯƠNG 3: THIẾT KẾ KIẾN TRÚC PHẦN MỀM VÀ CƠ SỞ DỮ LIỆU QUAN HỆ

Hệ thống bao gồm 13 bảng dữ liệu quan hệ được chuẩn hóa 3NF:
1. `users` — Quản lý tài khoản và phân quyền người dùng.
2. `categories` — Danh mục bài viết phân cấp cha - con.
3. `tags` — Thẻ từ khóa phân loại bài viết.
4. `posts` — Bài viết trung tâm với trạng thái vòng đời.
5. `post_tags` — Bảng trung gian liên kết Bài viết và Thẻ.
6. `comments` — Bình luận của độc giả và trả lời phân cấp.
7. `bookmarks` — Danh sách bài viết yêu thích của độc giả.
8. `media` — Thư viện tệp hình ảnh tải lên máy chủ.
9. `notifications` — Thông báo người dùng theo thời gian thực.
10. `settings` — Cấu hình tham số động website.
11. `audit_logs` — Nhật ký kiểm toán an toàn thông tin.
12. `password_reset_tokens` — Quản lý mã khôi phục mật khẩu.
13. `post_views` — Lịch sử lượt đọc bài viết nguyên tử.

---

\newpage

# CHƯƠNG 4: TRIỂN KHAI VÀ XÂY DỰNG HỆ THỐNG

### 4.1. Danh mục 24 trang giao diện đã triển khai thực tế

| STT | Tên trang giao diện | Đường dẫn Route | Phân hệ | Chức năng vận hành chính |
|:---:|---|---|:---:|---|
| 1 | Trang chủ | `/` | Công khai | Hiển thị bài viết nổi bật, bài mới nhất, danh mục và thẻ từ khóa. |
| 2 | Danh sách bài viết | `/posts` | Công khai | Xem tất cả bài viết đã xuất bản, hỗ trợ lọc, sắp xếp và phân trang. |
| 3 | Chi tiết bài viết | `/posts/:slug` | Công khai | Đọc nội dung bài viết TipTap, tác giả, bình luận và lưu bài viết. |
| 4 | Chuyên mục bài viết | `/categories/:slug` | Công khai | Hiển thị các bài viết thuộc một danh mục cụ thể. |
| 5 | Thẻ từ khóa | `/tags/:slug` | Công khai | Hiển thị danh sách bài viết được gắn thẻ tương ứng. |
| 6 | Tìm kiếm bài viết | `/search` | Công khai | Tìm kiếm bài viết theo từ khóa trong tiêu đề và nội dung. |
| 7 | Trang tác giả | `/authors/:id` | Công khai | Xem thông tin tiểu sử tác giả và danh sách bài viết của tác giả đó. |
| 8 | Đăng nhập | `/login` | Công khai | Đăng nhập tài khoản, có sẵn nút 1-click điền tài khoản demo. |
| 9 | Đăng ký tài khoản | `/register` | Công khai | Đăng ký tài khoản độc giả mới với kiểm thực Zod. |
| 10 | Quên mật khẩu | `/forgot-password` | Công khai | Nhập email để nhận token khôi phục mật khẩu. |
| 11 | Đặt lại mật khẩu | `/reset-password` | Công khai | Nhập token và thiết lập mật khẩu mới an toàn. |
| 12 | Hồ sơ cá nhân | `/profile` | Độc giả | Cập nhật họ tên, tiểu sử, ảnh đại diện và đổi mật khẩu. |
| 13 | Bài viết đã lưu | `/saved-posts` | Độc giả | Quản lý danh sách các bài viết yêu thích (Bookmarks) cá nhân. |
| 14 | Trang báo lỗi 404 | `/*` | Công khai | Giao diện thông báo trang không tồn tại kèm nút quay về trang chủ. |
| 15 | Bảng điều khiển số liệu | `/admin` | Quản trị CMS | Dashboard thẻ thống kê số liệu và biểu đồ Recharts phân tích. |
| 16 | Quản lý bài viết | `/admin/posts` | Quản trị CMS | Danh sách bài viết lọc theo trạng thái (Draft, Pending, Published). |
| 17 | Tạo bài viết mới | `/admin/posts/new` | Quản trị CMS | Trình soạn thảo văn bản phong phú TipTap WYSIWYG hiện đại. |
| 18 | Chỉnh sửa bài viết | `/admin/posts/edit/:id` | Quản trị CMS | Chỉnh sửa bài viết của chính mình (chống IDOR). |
| 19 | Quản lý danh mục | `/admin/categories` | Quản trị CMS | Thêm, sửa, xóa danh mục chuyên môn (hỗ trợ parentId). |
| 20 | Quản lý thẻ từ khóa | `/admin/tags` | Quản trị CMS | Thêm, sửa, xóa các thẻ nhãn phân loại bài viết. |
| 21 | Kiểm duyệt bình luận | `/admin/comments` | Quản trị CMS | Duyệt hoặc đánh dấu bình luận spam từ độc giả. |
| 22 | Quản lý người dùng | `/admin/users` | Quản trị CMS | Xem danh sách tài khoản, thay đổi vai trò RBAC, khóa/mở tài khoản. |
| 23 | Thư viện hình ảnh Media | `/admin/media` | Quản trị CMS | Tải ảnh lên máy chủ, xem trước ảnh, sao chép URL ảnh. |
| 24 | Nhật ký an toàn (Audit) | `/admin/audit-logs` | Quản trị CMS | Xem toàn bộ lịch sử thao tác nhạy cảm, IP và trình duyệt. |

---

\newpage

# CHƯƠNG 5: KIỂM THỬ TỰ ĐỘNG VÀ ĐÁNH GIÁ CHẤT LƯỢNG HỆ THỐNG

### Báo cáo kết quả kiểm thử thực tế từ Vitest (17/17 Passed)

```text
 RUN  v2.1.9 C:/Users/vtn08/.gemini/antigravity/scratch/blog-cms/backend

 ✓ src/tests/unit.test.ts (6 tests) 503ms
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > generateSlug > chuyển đổi tiếng Việt có dấu thành slug chuẩn
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > generateSlug > loại bỏ ký tự đặc biệt và xử lý chữ đ/Đ
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > JWT Token & Bcrypt > ký và giải mã token JWT chính xác
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > JWT Token & Bcrypt > băm mật khẩu và so khớp hash thành công
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > Zod Validation Schemas > chấp nhận dữ liệu đăng ký hợp lệ
   ✓ Unit Tests: Tiện ích và Xác thực dữ liệu > Zod Validation Schemas > từ chối đăng ký khi email/mật khẩu sai

 ✓ src/tests/integration.test.ts (11 tests) 638ms
   ✓ GET /api/health - trả về mã 200 và trạng thái UP
   ✓ POST /api/v1/auth/login - Đăng nhập tài khoản Admin demo thành công
   ✓ POST /api/v1/auth/login - Đăng nhập tài khoản Reader demo thành công
   ✓ POST /api/v1/auth/login - Thất bại khi mật khẩu sai (trả về 400 Bad Request)
   ✓ GET /api/v1/posts - Lấy danh sách bài viết đã xuất bản công khai (chỉ trả về bài PUBLISHED)
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

| Nhóm kiểm thử | Số lượng ca kiểm thử | Số ca thành công (Passed) | Số ca thất bại (Failed) | Tỉ lệ đạt |
|---|:---:|:---:|:---:|:---:|
| Unit Tests (Tiện ích, Slug, Zod, JWT) | 6 ca | 6 ca | 0 ca | 100% |
| Integration Tests (API & Database) | 8 ca | 8 ca | 0 ca | 100% |
| Security Tests (RBAC 401/403/200) | 3 ca | 3 ca | 0 ca | 100% |
| **TỔNG CỘNG TOÀN BỘ HỆ THỐNG** | **17 ca kiểm thử** | **17 ca PASSED** | **0 ca FAILED** | **17/17 (100%)** |

---

\newpage

# PHỤ LỤC: BẢNG TÀI KHOẢN TRÌNH DIỄN VÀ BẢO VỆ ĐỒ ÁN

Mật khẩu dùng chung cho tất cả các tài khoản là: **`Password@123`**

| STT | Vai trò (Role) | Email đăng nhập | Tên đăng nhập (Username) | Mục đích trình diễn bảo vệ |
|:---:|---|---|---|---|
| 1 | **Quản trị viên (ADMIN)** | `admin@ictu.edu.vn` | `admin` | Toàn quyền CMS: đổi quyền vai trò RBAC, khóa tài khoản, xem biểu đồ số liệu Dashboard và xem nhật ký audit log. |
| 2 | **Biên tập viên (EDITOR)** | `editor@ictu.edu.vn` | `editor` | Phê duyệt bài viết chờ duyệt (Approve), từ chối bài viết (Reject kèm lý do phản hồi), kiểm duyệt bình luận độc giả. |
| 3 | **Tác giả 1 (AUTHOR)** | `author1@ictu.edu.vn` | `author_nghia` | Sinh viên Vũ Trọng Nghĩa: Soạn bài viết bằng TipTap WYSIWYG, lưu bản nháp, gửi bài chờ duyệt, quản lý bài viết cá nhân. |
| 4 | **Tác giả 2 (AUTHOR)** | `author2@ictu.edu.vn` | `author_linh` | Tác giả Trần Thùy Linh: Bản nháp và nghiên cứu dữ liệu. |
| 5 | **Độc giả 1 (READER)** | `reader1@ictu.edu.vn` | `reader_nam` | Gửi bình luận, trả lời bình luận, lưu bài viết yêu thích (Bookmark) vào trang `/saved-posts`. |
| 6 | **Độc giả 2 (READER)** | `reader2@ictu.edu.vn` | `reader_mai` | Tài khoản độc giả mới khám phá hệ thống. |
