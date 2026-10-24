import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Integration Tests: Kiểm thử tích hợp RESTful API với Supertest', () => {
  let adminToken: string;
  let readerToken: string;

  it('GET /api/health - trả về mã 200 và trạng thái UP', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('UP');
  });

  it('GET /metrics - trả về dữ liệu giám sát Prometheus cho Grafana', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('blog_cms_');
    expect(res.text).toContain('process_cpu_user_seconds_total');
  });

  it('GET /api/v1/metrics - trả về dữ liệu định dạng Prometheus v1', async () => {
    const res = await request(app).get('/api/v1/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('blog_cms_http_requests_total');
  });

  it('POST /api/v1/auth/login - Đăng nhập tài khoản Admin demo thành công', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'admin@ictu.edu.vn',
        password: 'Password@123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('ADMIN');
    expect(res.body.data.token).toBeDefined();

    adminToken = res.body.data.token;
  });

  it('POST /api/v1/auth/login - Đăng nhập tài khoản Reader demo thành công', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'reader1@ictu.edu.vn',
        password: 'Password@123',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe('READER');

    readerToken = res.body.data.token;
  });

  it('POST /api/v1/auth/login - Thất bại khi mật khẩu sai', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        identifier: 'admin@ictu.edu.vn',
        password: 'SaiMatKhau123',
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('GET /api/v1/posts - Lấy danh sách bài viết đã xuất bản công khai', async () => {
    const res = await request(app).get('/api/v1/posts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    // Đảm bảo tất cả bài viết trả về công khai đều có status là PUBLISHED
    for (const post of res.body.data) {
      expect(post.status).toBe('PUBLISHED');
    }
  });

  it('GET /api/v1/categories - Lấy danh sách danh mục có số lượng bài viết', async () => {
    const res = await request(app).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/tags - Lấy danh sách thẻ', async () => {
    const res = await request(app).get('/api/v1/tags');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  describe('Kiểm thử bảo mật và Phân quyền RBAC', () => {
    it('Chặn truy cập người dùng chưa đăng nhập khi gọi API quản trị (401 Unauthorized)', async () => {
      const res = await request(app).get('/api/v1/users');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('Chặn người dùng READER truy cập danh sách người dùng quản trị (403 Forbidden)', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${readerToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it('Cho phép ADMIN truy cập danh sách người dùng quản trị', async () => {
      const res = await request(app)
        .get('/api/v1/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('GET /api/v1/dashboard/stats - Admin lấy số liệu thống kê thực tế', async () => {
      const res = await request(app)
        .get('/api/v1/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.cards).toBeDefined();
      expect(res.body.data.cards.totalPosts).toBeGreaterThan(0);
      expect(res.body.data.cards.totalUsers).toBeGreaterThan(0);
    });
  });
});
