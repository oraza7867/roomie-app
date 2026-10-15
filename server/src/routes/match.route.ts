import { Router } from 'express';
import { getMatches } from '../controllers/match.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Matches should only be visible to logged-in users
router.get('/', requireAuth, getMatches);

export default router;
