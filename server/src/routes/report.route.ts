import { Router } from 'express';
import { createReport } from '../controllers/report.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, createReport);

export default router;
