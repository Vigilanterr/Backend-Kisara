import { Router } from 'express';
import savesController from '../controllers/saves/saveControllers';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/:id/save', authMiddleware, savesController.toggleSave);

export default router;
