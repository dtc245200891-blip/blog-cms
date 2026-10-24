import client from 'prom-client';

// Khởi tạo Prometheus Registry
export const register = new client.Registry();

// Bổ sung các default metric của Node.js runtime (CPU, Memory, Event Loop, GC...)
client.collectDefaultMetrics({
  register,
  prefix: 'blog_cms_',
});

// Metric đếm tổng số HTTP requests
export const httpRequestsTotal = new client.Counter({
  name: 'blog_cms_http_requests_total',
  help: 'Tổng số lượt gọi HTTP requests tới hệ thống Blog/CMS',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// Metric đo độ trễ (latency) của từng HTTP request
export const httpRequestDurationSeconds = new client.Histogram({
  name: 'blog_cms_http_request_duration_seconds',
  help: 'Thời gian xử lý HTTP request tính bằng giây',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// Metric giám sát số lượt đăng nhập thành công / thất bại
export const authAttemptsTotal = new client.Counter({
  name: 'blog_cms_auth_attempts_total',
  help: 'Tổng số lượt xác thực đăng nhập (thành công hoặc thất bại)',
  labelNames: ['status'],
  registers: [register],
});

// Metric đếm số bài viết và tương tác
export const systemActivityTotal = new client.Counter({
  name: 'blog_cms_system_activity_total',
  help: 'Tổng số hoạt động ghi nhận trên hệ thống (tạo bài viết, bình luận, v.v.)',
  labelNames: ['action'],
  registers: [register],
});

export const getMetrics = async () => {
  return register.metrics();
};

export const getContentType = () => {
  return register.contentType;
};
