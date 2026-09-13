import { Router } from 'express';
import { toggleLike } from '../controllers/likes/toggleLike';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/:id/like', authMiddleware, toggleLike);

export default router;
