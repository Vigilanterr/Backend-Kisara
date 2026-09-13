import { Router } from 'express';
import { deleteComment } from '../controllers/comments/deleteComment';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.delete('/:id', authMiddleware, deleteComment);

export default router;
