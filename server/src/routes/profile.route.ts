import { Router } from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/profile.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All profile routes require authentication
router.use(requireAuth);

router.get('/', getMyProfile);
router.get('/me', getMyProfile);
router.patch('/', updateMyProfile);
router.patch('/me', updateMyProfile);

export default router;
