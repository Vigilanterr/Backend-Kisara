import { Router } from 'express';
import userController from '../../controllers/users/UserController';
import savesController from '../../controllers/saves/SavesController';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, userController.getMe);
router.get('/me/posts', authMiddleware, userController.getUserPosts);
router.get('/me/saved-posts', authMiddleware, savesController.getSavedPosts);
router.get('/search', authMiddleware, userController.searchUsers);
router.get('/:id', authMiddleware, userController.getUserById);

export default router;
