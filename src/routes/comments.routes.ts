import { Router } from 'express';
import commentsController from '../controllers/comments/CommentsController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/:postId/comments', commentsController.getComments);
router.post('/:postId/comments', authMiddleware, commentsController.createComment);
router.delete('/:postId/comments/:commentId', authMiddleware, commentsController.deleteComment);

export default router;
