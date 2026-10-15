import { Router } from 'express';
import { createReview, updateReview, deleteReview } from '../controllers/review.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Protected routes (must be logged in to create, edit, or delete)
router.post('/', requireAuth, createReview);
router.patch('/:id', requireAuth, updateReview);
router.delete('/:id', requireAuth, deleteReview);

export default router;
