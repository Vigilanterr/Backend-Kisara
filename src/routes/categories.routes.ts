import { Router } from 'express';
import categoriesController from '../controllers/categories/CategoriesController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', categoriesController.getCategories);
router.get('/:id', categoriesController.getCategoryById);
router.post('/', authMiddleware, categoriesController.createCategory);
router.put('/:id', authMiddleware, categoriesController.updateCategory);
router.delete('/:id', authMiddleware, categoriesController.deleteCategory);

export default router;
