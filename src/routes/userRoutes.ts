import { Router } from 'express';
import usersController from '../controllers/users/usersControllers';
import savesController from '../controllers/saves/saveControllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, usersController.getMe);
router.get('/me/saved-posts', authMiddleware, savesController.getSavedPosts);
router.get('/search', authMiddleware, usersController.searchUsers);
router.get('/:id', authMiddleware, usersController.getUserById);

export default router;
