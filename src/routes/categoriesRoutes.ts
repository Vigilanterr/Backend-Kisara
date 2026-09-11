import { Router } from 'express';
import categoriesController from '../controllers/categories/categoriesControllers';

const router = Router();

router.get('/', categoriesController.getCategories);
router.post('/', categoriesController.createCategory);

export default router;