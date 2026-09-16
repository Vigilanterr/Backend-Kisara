import { Router } from 'express';
import userController from '../../controllers/users/UserController';
import savesController from '../../controllers/saves/SavesController';
import { authMiddleware } from '../../middleware/auth';
import { uploadImage, uploadToCloudinary } from '../../middleware/upload';

const router = Router();

router.get('/me', authMiddleware, userController.getMe);
router.put('/me', authMiddleware, uploadImage, uploadToCloudinary, userController.updateProfile);
router.get('/me/posts', authMiddleware, userController.getUserPosts);
router.get('/me/saved-posts', authMiddleware, savesController.getSavedPosts);
router.get('/search', authMiddleware, userController.searchUsers);
router.get('/:id', authMiddleware, userController.getUserById);

export default router;
