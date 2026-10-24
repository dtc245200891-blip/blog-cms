import { Request, Response, NextFunction } from 'express';
import { httpRequestsTotal, httpRequestDurationSeconds } from './metrics.service';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Bỏ qua việc ghi metric cho chính endpoint /metrics để tránh nhiễu
  if (req.path.startsWith('/metrics') || req.path.startsWith('/api/v1/metrics')) {
    return next();
  }

  const start = process.hrtime();

  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationInSeconds = diff[0] + diff[1] / 1e9;

    // Chuẩn hóa route path để tránh cardinality nổ (thay uuid/id bằng :id)
    let route = req.baseUrl + (req.route ? req.route.path : req.path);
    if (!route || route === '') {
      route = req.originalUrl.split('?')[0];
    }

    const statusCode = res.statusCode.toString();
    const method = req.method;

    httpRequestsTotal.inc({ method, route, status_code: statusCode });
    httpRequestDurationSeconds.observe({ method, route, status_code: statusCode }, durationInSeconds);
  });

  next();
};
