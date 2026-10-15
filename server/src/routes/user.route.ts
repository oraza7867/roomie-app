import { Router } from 'express';
import { getUserReviews } from '../controllers/review.controller';

const router = Router();

// Public route to view a user's reviews
router.get('/:id/reviews', getUserReviews);

export default router;
