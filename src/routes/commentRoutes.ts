import { Router } from 'express';
import commentsController from '../controllers/comments/commentControllers';

const router = Router();

router.get('/:postId/comments', commentsController.getComments);
router.post('/:postId/comments', commentsController.createComment);

export default router;