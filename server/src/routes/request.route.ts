import { Router } from 'express';
import { createRequest, getReceivedRequests, getSentRequests, updateRequestStatus, cancelRequest } from '../controllers/request.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// All request routes require authentication
router.use(requireAuth);

router.post('/', createRequest);
router.get('/received', getReceivedRequests);
router.get('/sent', getSentRequests);
router.patch('/:id', updateRequestStatus);
router.delete('/:id', cancelRequest);

export default router;
