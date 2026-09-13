import { Router } from 'express';
import { toggleSave } from '../controllers/saves/toggleSave';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/:id/save', authMiddleware, toggleSave);

export default router;
