import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getConversations, getMessagesWithUser, sendMessage } from '../controllers/message.controller';

const router = Router();

router.use(requireAuth);

router.get('/conversations', getConversations);
router.get('/:partnerId', getMessagesWithUser);
router.post('/', sendMessage);

export default router;
