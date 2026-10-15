import { Router } from 'express';
import { getMyPreferences, updateMyPreferences } from '../controllers/preference.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All preference routes require authentication
router.use(requireAuth);

router.get('/me', getMyPreferences);
router.put('/me', updateMyPreferences);

export default router;
