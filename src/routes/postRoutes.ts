import { Router } from 'express';
import { getPosts } from '../controllers/posts/getPosts';
import { getPostById } from '../controllers/posts/getPostById';
import { createPost } from '../controllers/posts/createPost';
import { updatePost } from '../controllers/posts/updatePost';
import { deletePost } from '../controllers/posts/deletePost';
import { searchPosts } from '../controllers/posts/searchPosts';
import { authMiddleware } from '../middleware/auth';
import { uploadImage, uploadToCloudinary } from '../middleware/upload';

const router = Router();

router.get('/search', searchPosts);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.post('/', authMiddleware, uploadImage, uploadToCloudinary, createPost);
router.put('/:id', authMiddleware, uploadImage, uploadToCloudinary, updatePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
