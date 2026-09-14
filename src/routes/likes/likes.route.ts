import { Router } from 'express';
import likesController from '../../controllers/likes/LikesController';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.post('/:id/like', authMiddleware, likesController.toggleLike);

export default router;
