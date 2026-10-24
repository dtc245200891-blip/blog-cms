import { Router, Request, Response } from 'express';
import { getMetrics, getContentType } from './metrics.service';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', getContentType());
    const metrics = await getMetrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).end(error);
  }
});

export default router;
