import { Router } from 'express';
import { getMe } from '../controllers/users/getMe';
import { getUserById } from '../controllers/users/getUserById';
import { searchUsers } from '../controllers/users/searchUsers';
import { getSavedPosts } from '../controllers/saves/getSavedPosts';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.get('/me/saved-posts', authMiddleware, getSavedPosts);
router.get('/search', authMiddleware, searchUsers);
router.get('/:id', authMiddleware, getUserById);

export default router;
