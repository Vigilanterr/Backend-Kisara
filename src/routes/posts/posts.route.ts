import { Router } from 'express';
import postsController from '../../controllers/posts/PostsController';
import { authMiddleware } from '../../middleware/auth';
import { uploadImage, uploadToCloudinary } from '../../middleware/upload';

const router = Router();

router.get('/search', postsController.searchPosts);
router.get('/', postsController.getPosts);
router.get('/:id', postsController.getPostById);
router.post('/', authMiddleware, uploadImage, uploadToCloudinary, postsController.createPost);
router.put('/:id', authMiddleware, uploadImage, uploadToCloudinary, postsController.updatePost);
router.delete('/:id', authMiddleware, postsController.deletePost);

export default router;
