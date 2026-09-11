import { Router } from 'express';
import postsController from '../controllers/posts/postControllers';

const router = Router();

router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPostById);
router.post('/', postsController.createPost);
router.put('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);

export default router;