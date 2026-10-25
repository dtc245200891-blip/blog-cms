import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const defaultPrisma = new PrismaClient();

export async function seedDatabase(customPrisma?: PrismaClient) {
  const prisma = customPrisma || defaultPrisma;
  console.log('🌱 Bắt đầu tạo dữ liệu mẫu (Seeding database)...');

  // Xóa sạch dữ liệu cũ
  await prisma.postView.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.postTag.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.media.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash('Password@123', 10);

  // 1. Tạo Users
  console.log('👤 Đang tạo tài khoản người dùng...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@ictu.edu.vn',
      username: 'admin',
      passwordHash: defaultPasswordHash,
      fullName: 'Quản Trị Viên Hệ Thống',
      bio: 'Quản trị viên cấp cao của hệ thống Blog/CMS ICTU.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'ADMIN',
      isActive: true,
    },
  });

  const editor = await prisma.user.create({
    data: {
      email: 'editor@ictu.edu.vn',
      username: 'editor',
      passwordHash: defaultPasswordHash,
      fullName: 'Biên Tập Viên Nguyễn Văn Duyệt',
      bio: 'Chịu trách nhiệm kiểm duyệt nội dung và bình luận trên hệ thống.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'EDITOR',
      isActive: true,
    },
  });

  const author1 = await prisma.user.create({
    data: {
      email: 'author1@ictu.edu.vn',
      username: 'author_nghia',
      passwordHash: defaultPasswordHash,
      fullName: 'Vũ Trọng Nghĩa (Sinh viên K23L)',
      bio: 'Sinh viên năm 3 ngành Công nghệ Thông tin, đam mê lập trình Full-stack.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      role: 'AUTHOR',
      isActive: true,
    },
  });

  const author2 = await prisma.user.create({
    data: {
      email: 'author2@ictu.edu.vn',
      username: 'author_linh',
      passwordHash: defaultPasswordHash,
      fullName: 'Trần Thùy Linh',
      bio: 'Nghiên cứu sinh ngành Khoa học Dữ liệu và Trí tuệ Nhân tạo.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      role: 'AUTHOR',
      isActive: true,
    },
  });

  const reader1 = await prisma.user.create({
    data: {
      email: 'reader1@ictu.edu.vn',
      username: 'reader_nam',
      passwordHash: defaultPasswordHash,
      fullName: 'Hoàng Hải Nam',
      bio: 'Độc giả yêu công nghệ và thích thảo luận chuyên môn.',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      role: 'READER',
      isActive: true,
    },
  });

  const reader2 = await prisma.user.create({
    data: {
      email: 'reader2@ictu.edu.vn',
      username: 'reader_mai',
      passwordHash: defaultPasswordHash,
      fullName: 'Lê Thị Ngọc Mai',
      bio: 'Sinh viên năm 1 tìm hiểu về lập trình web hiện đại.',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
      role: 'READER',
      isActive: true,
    },
  });

  // 2. Tạo Danh mục (Categories)
  console.log('📁 Đang tạo danh mục bài viết...');
  const catTech = await prisma.category.create({
    data: {
      name: 'Công nghệ thông tin',
      slug: 'cong-nghe-thong-tin',
      description: 'Tổng hợp các bài viết chuyên sâu về kiến trúc phần mềm, hệ cơ sở dữ liệu và công nghệ mới.',
    },
  });

  const catWeb = await prisma.category.create({
    data: {
      name: 'Lập trình Web',
      slug: 'lap-trinh-web',
      description: 'Chia sẻ kiến thức về React, Node.js, Express, TypeScript và các công nghệ Frontend, Backend.',
      parentId: catTech.id,
    },
  });

  const catAI = await prisma.category.create({
    data: {
      name: 'Trí tuệ nhân tạo',
      slug: 'tri-tue-nhan-tao',
      description: 'Các nghiên cứu và ứng dụng của Machine Learning, Deep Learning và LLM trong thực tiễn.',
      parentId: catTech.id,
    },
  });

  const catCampus = await prisma.category.create({
    data: {
      name: 'Đời sống sinh viên ICTU',
      slug: 'doi-song-sinh-vien-ictu',
      description: 'Góc nhìn sinh viên, hoạt động ngoại khóa và kinh nghiệm học tập tại Trường ĐH CNTT&TT Thái Nguyên.',
    },
  });

  const catNews = await prisma.category.create({
    data: {
      name: 'Thông báo & Học vụ',
      slug: 'thong-bao-hoc-vu',
      description: 'Tin tức chính thức về lịch thi, đăng ký tín chỉ và các hội thảo khoa học.',
    },
  });

  // 3. Tạo Thẻ (Tags)
  console.log('🏷️ Đang tạo các thẻ...');
  const tagReact = await prisma.tag.create({ data: { name: 'React', slug: 'react' } });
  const tagNode = await prisma.tag.create({ data: { name: 'Node.js', slug: 'nodejs' } });
  const tagPrisma = await prisma.tag.create({ data: { name: 'Prisma ORM', slug: 'prisma-orm' } });
  const tagTS = await prisma.tag.create({ data: { name: 'TypeScript', slug: 'typescript' } });
  const tagAI = await prisma.tag.create({ data: { name: 'AI & Data', slug: 'ai-data' } });
  const tagICTU = await prisma.tag.create({ data: { name: 'ICTU', slug: 'ictu' } });
  const tagDoAn = await prisma.tag.create({ data: { name: 'Đồ án K23L', slug: 'do-an-k23l' } });

  // 4. Tạo Bài viết (Posts)
  console.log('📝 Đang tạo các bài viết mẫu...');
  const post1 = await prisma.post.create({
    data: {
      title: 'Xây dựng kiến trúc Full-stack hiện đại với React, TypeScript và Node.js',
      slug: 'xay-dung-kien-truc-full-stack-hien-dai-voi-react-typescript-va-nodejs',
      excerpt: 'Hướng dẫn toàn diện về cách tổ chức mã nguồn, phân tầng kiến trúc và bảo mật cho ứng dụng web thực tế.',
      content: `<h2>1. Đặt vấn đề</h2><p>Khi xây dựng ứng dụng web hiện đại cho đồ án hoặc sản phẩm thực tế, việc phân tách các tầng Route, Controller, Service và Repository là yếu tố cốt lõi giúp mã nguồn dễ mở rộng và kiểm thử.</p><h2>2. Tầng Presentation và Business Logic</h2><p>React với TypeScript cung cấp khả năng bắt lỗi tĩnh ngay trong quá trình biên dịch, trong khi Express kết hợp Prisma ORM đảm bảo tính toàn vẹn của dữ liệu quan hệ.</p><blockquote>Kiến trúc chuẩn là nền tảng của một hệ thống bền vững.</blockquote>`,
      featuredImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      status: 'PUBLISHED',
      isPinned: true,
      allowComments: true,
      viewsCount: 342,
      publishedAt: new Date('2026-10-15T08:30:00Z'),
      seoTitle: 'Kiến trúc Full-stack React TypeScript Node.js - ICTU',
      seoDescription: 'Hướng dẫn kiến trúc phân lớp chuyên nghiệp cho ứng dụng Blog/CMS.',
      authorId: author1.id,
      categoryId: catWeb.id,
      postTags: {
        create: [
          { tagId: tagReact.id },
          { tagId: tagNode.id },
          { tagId: tagTS.id },
          { tagId: tagDoAn.id },
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Tối ưu hóa cơ sở dữ liệu quan hệ với Prisma ORM và MySQL 8',
      slug: 'toi-uu-hoa-co-so-du-lieu-quan-he-voi-prisma-orm-va-mysql-8',
      excerpt: 'Phân tích chiến lược lập chỉ mục (index), ràng buộc toàn vẹn và tối ưu truy vấn n+1 trong Prisma.',
      content: `<h2>Chiến lược Indexing hiệu quả</h2><p>Để tăng tốc độ tìm kiếm và sắp xếp cho các bảng lớn như Posts hay Comments, chúng ta cần đánh chỉ mục trên các cột thường xuyên lọc như <code>status</code>, <code>publishedAt</code> và <code>authorId</code>.</p><p>Prisma Migrate giúp sinh ra các file migration chuẩn SQL phiên bản hóa, an toàn khi triển khai.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
      status: 'PUBLISHED',
      isPinned: true,
      allowComments: true,
      viewsCount: 215,
      publishedAt: new Date('2026-10-18T14:15:00Z'),
      seoTitle: 'Tối ưu CSDL MySQL và Prisma ORM',
      seoDescription: 'Các kỹ thuật đánh index và tối ưu hiệu năng CSDL quan hệ.',
      authorId: author1.id,
      categoryId: catTech.id,
      postTags: {
        create: [{ tagId: tagPrisma.id }, { tagId: tagNode.id }],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Ứng dụng Mô hình Ngôn ngữ Lớn (LLM) trong hệ thống gợi ý nội dung',
      slug: 'ung-dung-mo-hinh-ngon-ngu-lon-llm-trong-he-thong-goi-y-noi-dung',
      excerpt: 'Khám phá cách tích hợp AI để phân loại bài viết tự động và gợi ý các chủ đề liên quan cho độc giả.',
      content: `<h2>Ứng dụng thực tế của AI trong CMS</h2><p>Các thuật toán NLP hiện đại giúp tự động trích xuất từ khóa, tạo bản tóm tắt nội dung và phát hiện các bình luận mang tính chất spam hoặc tiêu cực.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800',
      status: 'PUBLISHED',
      isPinned: false,
      allowComments: true,
      viewsCount: 189,
      publishedAt: new Date('2026-10-20T10:00:00Z'),
      authorId: author2.id,
      categoryId: catAI.id,
      postTags: {
        create: [{ tagId: tagAI.id }],
      },
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: 'Kinh nghiệm học tập và hoàn thành đồ án công nghệ thông tin tại ICTU',
      slug: 'kinh-nghiem-hoc-tap-va-hoan-thanh-do-an-cong-nghe-thong-tin-tai-ictu',
      excerpt: 'Chia sẻ của sinh viên khóa K23L về cách quản lý thời gian, phối hợp nhóm và chuẩn bị báo cáo trước hội đồng.',
      content: `<h2>Hành trình 3 năm tại ICTU</h2><p>Đồ án môn học là cơ hội tuyệt vời để sinh viên áp dụng toàn bộ kiến thức lý thuyết vào một sản phẩm phần mềm hoàn chỉnh, sẵn sàng cho công việc tương lai.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800',
      status: 'PUBLISHED',
      isPinned: false,
      allowComments: true,
      viewsCount: 450,
      publishedAt: new Date('2026-10-21T09:30:00Z'),
      authorId: author1.id,
      categoryId: catCampus.id,
      postTags: {
        create: [{ tagId: tagICTU.id }, { tagId: tagDoAn.id }],
      },
    },
  });

  const post5 = await prisma.post.create({
    data: {
      title: 'Thông báo về kế hoạch đăng ký tín chỉ và lịch bảo vệ đồ án học kỳ 1',
      slug: 'thong-bao-ve-ke-hoach-dang-ky-tin-chi-va-lich-bao-ve-do-an-hoc-ky-1',
      excerpt: 'Phòng đào tạo thông báo mốc thời gian nộp mã nguồn, báo cáo kỹ thuật và lịch trình chấm đồ án.',
      content: `<p>Sinh viên các lớp chuyên ngành CNTT lưu ý hoàn thiện mã nguồn, kịch bản kiểm thử và tài liệu hướng dẫn vận hành trước hạn chót.</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      status: 'PUBLISHED',
      isPinned: false,
      allowComments: false,
      viewsCount: 520,
      publishedAt: new Date('2026-10-22T08:00:00Z'),
      authorId: admin.id,
      categoryId: catNews.id,
      postTags: {
        create: [{ tagId: tagICTU.id }],
      },
    },
  });

  // Bài viết PENDING (Chờ duyệt)
  const postPending = await prisma.post.create({
    data: {
      title: 'Bảo mật ứng dụng Node.js: Chống tấn công CSRF, XSS và SQL Injection',
      slug: 'bao-mat-ung-dung-nodejs-chong-tan-cong-csrf-xss-va-sql-injection',
      excerpt: 'Tổng hợp các kỹ thuật phòng thủ lớp sâu cho backend API viết bằng Express.',
      content: `<p>Nội dung chi tiết về cấu hình Helmet, Content-Security-Policy, HttpOnly Cookies và Sanitize input...</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      status: 'PENDING',
      isPinned: false,
      allowComments: true,
      authorId: author1.id,
      categoryId: catWeb.id,
      postTags: {
        create: [{ tagId: tagNode.id }],
      },
    },
  });

  // Bài viết DRAFT (Bản nháp của tác giả 2)
  const postDraft = await prisma.post.create({
    data: {
      title: 'Nghiên cứu về thuật toán phân cụm trong khai phá dữ liệu giáo dục',
      slug: 'nghien-cuu-ve-thuat-toan-phan-cum-trong-khai-pha-du-lieu-giao-duc',
      excerpt: 'Bản nháp đang thu thập số liệu và xử lý dataset thực nghiệm.',
      content: `<p>Bản phác thảo sơ bộ các công thức toán học và biểu đồ phân tán dữ liệu...</p>`,
      status: 'DRAFT',
      isPinned: false,
      allowComments: true,
      authorId: author2.id,
      categoryId: catAI.id,
    },
  });

  // Bài viết REJECTED (Bị từ chối bởi Editor với lý do cụ thể)
  const postRejected = await prisma.post.create({
    data: {
      title: 'Hướng dẫn cài đặt hack game trên máy chủ cục bộ',
      slug: 'huong-dan-cai-dat-hack-game-tren-may-chu-cuc-bo',
      excerpt: 'Bài viết không phù hợp với quy định nội dung của cổng thông tin học thuật.',
      content: `<p>Nội dung vi phạm tiêu chuẩn cộng đồng trường ICTU.</p>`,
      status: 'REJECTED',
      rejectionReason: 'Nội dung không phù hợp với mục tiêu học thuật và vi phạm quy chế an toàn thông tin.',
      authorId: author1.id,
      categoryId: catTech.id,
    },
  });

  // Bài viết SCHEDULED (Đã lên lịch xuất bản)
  const postScheduled = await prisma.post.create({
    data: {
      title: 'Lễ ra mắt Câu lạc bộ Lập trình Web và Mã nguồn mở ICTU 2026',
      slug: 'le-ra-mat-cau-lac-bo-lap-trinh-web-va-ma-nguon-mo-ictu-2026',
      excerpt: 'Sự kiện giao lưu học thuật và định hướng nghề nghiệp cùng các doanh nghiệp công nghệ hàng đầu.',
      content: `<p>Chi tiết chương trình và link đăng ký tham dự trực tiếp tại hội trường A...</p>`,
      featuredImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      status: 'SCHEDULED',
      scheduledAt: new Date('2026-11-01T08:00:00Z'),
      authorId: admin.id,
      categoryId: catCampus.id,
    },
  });

  // Bài viết ARCHIVED (Lưu trữ)
  const postArchived = await prisma.post.create({
    data: {
      title: 'Lưu trữ thông báo học bổng khuyến khích học tập kỳ 2 năm học trước',
      slug: 'luu-tru-thong-bao-hoc-bong-khuyen-khich-hoc-tap-ky-2-nam-hoc-truoc',
      excerpt: 'Tài liệu lưu trữ cho sinh viên đối chiếu điểm rèn luyện.',
      content: `<p>Danh sách lưu trữ sinh viên nhận học bổng khuyến khích.</p>`,
      status: 'ARCHIVED',
      authorId: admin.id,
      categoryId: catNews.id,
    },
  });

  // 5. Tạo Bình luận mẫu (Comments)
  console.log('💬 Đang tạo bình luận...');
  const c1 = await prisma.comment.create({
    data: {
      content: 'Bài viết phân tích kiến trúc rất sâu sắc và rõ ràng! Mình đã áp dụng cấu trúc này vào bài tập lớn.',
      status: 'APPROVED',
      postId: post1.id,
      authorId: reader1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Cảm ơn Nam nhé! Nếu bạn cần tìm hiểu thêm về tầng Service và Repository thì mình sẽ ra bài tiếp theo.',
      status: 'APPROVED',
      postId: post1.id,
      authorId: author1.id,
      parentId: c1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Chờ duyệt: Đề tài này có áp dụng cho mô hình Microservices được không tác giả?',
      status: 'PENDING',
      postId: post1.id,
      authorId: reader2.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Prisma ORM dùng với MySQL rất tiện lợi, cảm ơn anh Nghĩa!',
      status: 'APPROVED',
      postId: post2.id,
      authorId: reader2.id,
    },
  });

  // 6. Tạo Bookmarks
  console.log('⭐ Đang tạo bài viết đã lưu...');
  await prisma.bookmark.create({
    data: {
      userId: reader1.id,
      postId: post1.id,
    },
  });
  await prisma.bookmark.create({
    data: {
      userId: reader1.id,
      postId: post2.id,
    },
  });
  await prisma.bookmark.create({
    data: {
      userId: author1.id,
      postId: post3.id,
    },
  });

  // 7. Tạo Thông báo (Notifications)
  console.log('🔔 Đang tạo thông báo mẫu...');
  await prisma.notification.create({
    data: {
      userId: author1.id,
      title: 'Bài viết được xuất bản',
      message: 'Bài viết "Xây dựng kiến trúc Full-stack hiện đại..." của bạn đã được duyệt và xuất bản thành công.',
      type: 'SUCCESS',
      link: `/posts/${post1.slug}`,
    },
  });

  await prisma.notification.create({
    data: {
      userId: author1.id,
      title: 'Bình luận mới',
      message: 'Độc giả Hoàng Hải Nam vừa bình luận vào bài viết của bạn.',
      type: 'INFO',
      link: `/posts/${post1.slug}`,
    },
  });

  await prisma.notification.create({
    data: {
      userId: author1.id,
      title: 'Bài viết bị từ chối',
      message: 'Bài viết "Hướng dẫn cài đặt hack game..." đã bị từ chối do vi phạm quy định cộng đồng.',
      type: 'DANGER',
      link: '/admin/posts',
    },
  });

  // 8. Cấu hình hệ thống (Settings)
  console.log('⚙️ Đang khởi tạo cấu hình hệ thống...');
  const settingsData = [
    { key: 'site_name', value: 'ICTU Blog/CMS Platform', description: 'Tên hệ thống xuất bản nội dung' },
    { key: 'site_description', value: 'Nền tảng xuất bản bài viết và quản trị nội dung học thuật - ICTU', description: 'Mô tả ngắn website' },
    { key: 'contact_email', value: 'nghia.vt@ictu.edu.vn', description: 'Email quản trị viên' },
    { key: 'allow_registration', value: 'true', description: 'Cho phép người dùng tự đăng ký' },
    { key: 'comments_require_approval', value: 'true', description: 'Bình luận của độc giả cần kiểm duyệt trước khi hiển thị' },
    { key: 'items_per_page', value: '10', description: 'Số lượng bài viết trên mỗi trang' },
  ];

  for (const s of settingsData) {
    await prisma.setting.create({ data: s });
  }

  // 9. Nhật ký hoạt động (Audit Logs)
  console.log('📜 Đang ghi nhận nhật ký hoạt động hệ thống...');
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'SYSTEM_INIT',
      entity: 'SYSTEM',
      details: 'Khởi tạo hệ thống và cấu hình cơ sở dữ liệu mẫu thành công.',
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: editor.id,
      action: 'APPROVE_POST',
      entity: 'POST',
      entityId: post1.id,
      details: `Biên tập viên đã duyệt bài viết: "${post1.title}"`,
      ipAddress: '127.0.0.1',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
  });

  console.log('✅ Dữ liệu mẫu đã được tạo thành công 100%!');
  console.log('----------------------------------------------------');
  console.log('🔑 DANH SÁCH TÀI KHOẢN TRÌNH DIỄN (Password chung: Password@123):');
  console.log('1. Admin:   admin@ictu.edu.vn   (Username: admin)');
  console.log('2. Editor:  editor@ictu.edu.vn  (Username: editor)');
  console.log('3. Author1: author1@ictu.edu.vn (Username: author_nghia)');
  console.log('4. Author2: author2@ictu.edu.vn (Username: author_linh)');
  console.log('5. Reader1: reader1@ictu.edu.vn (Username: reader_nam)');
  console.log('6. Reader2: reader2@ictu.edu.vn (Username: reader_mai)');
  console.log('----------------------------------------------------');
}

if (require.main === module || (process.argv[1] && process.argv[1].includes('seed'))) {
  seedDatabase()
    .catch((e) => {
      console.error('❌ Lỗi khi chạy seed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await defaultPrisma.$disconnect();
    });
}
