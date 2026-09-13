import { Router } from 'express';
import postsController from '../controllers/posts/postControllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/search', postsController.searchPosts);
router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPostById);
router.post('/', authMiddleware, postsController.createPost);
router.put('/:id', authMiddleware, postsController.updatePost);
router.delete('/:id', authMiddleware, postsController.deletePost);

export default router;
