import { Router } from 'express';
import commentsController from '../controllers/comments/commentControllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.delete('/:id', authMiddleware, commentsController.deleteComment);

export default router;
