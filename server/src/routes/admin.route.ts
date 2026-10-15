import { Router } from 'express';
import { getAdminReports, updateAdminReport } from '../controllers/report.controller';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// All admin routes must be authenticated AND have the ADMIN role
router.use(requireAuth);
router.use(requireAdmin);

router.get('/reports', getAdminReports);
router.patch('/reports/:id', updateAdminReport);

export default router;
