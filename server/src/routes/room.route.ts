import { Router } from 'express';
import { createRoom, getRooms, getRoomById, updateRoom, deleteRoom } from '../controllers/room.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Public routes (anyone can search and view rooms)
router.get('/', getRooms);
router.get('/:id', getRoomById);

// Protected routes (must be logged in to create, edit, or delete)
router.post('/', requireAuth, createRoom);
router.patch('/:id', requireAuth, updateRoom);
router.delete('/:id', requireAuth, deleteRoom);

export default router;
