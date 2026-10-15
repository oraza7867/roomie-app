import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getMessages, sendMessage } from '../controllers/chat.controller';

const router = Router();

router.use(requireAuth);

router.get('/:otherUserId', getMessages);
router.post('/', sendMessage);

export default router;
