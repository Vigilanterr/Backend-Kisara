import { Router } from 'express';
import postsController from '../controllers/posts/postControllers';

const router = Router();

router.get('/posts', postsController.getPosts);
router.get('/posts/:id', postsController.getPostById);
router.post('/posts', postsController.createPost);
router.put('/posts/:id', postsController.updatePost);
router.delete('/posts/:id', postsController.deletePost);

export default router;