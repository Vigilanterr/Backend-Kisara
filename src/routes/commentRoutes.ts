import { Router } from 'express';
import { getComments } from '../controllers/comments/getComments';
import { createComment } from '../controllers/comments/createComment';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/:postId/comments', getComments);
router.post('/:postId/comments', authMiddleware, createComment);

export default router;
