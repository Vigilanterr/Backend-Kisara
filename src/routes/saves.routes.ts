import { Router } from 'express';
import savesController from '../controllers/saves/SavesController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/:id/save', authMiddleware, savesController.toggleSave);

export default router;
