import { Router } from 'express';
import categoriesController from '../controllers/categories/categoriesControllers';

const router = Router();

router.get('/categories', categoriesController.getCategories);
router.post('/categories', categoriesController.createCategory);

export default router;