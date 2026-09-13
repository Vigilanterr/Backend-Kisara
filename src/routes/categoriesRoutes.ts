import { Router } from 'express';
import categoriesController from '../controllers/categories/categoriesControllers';

const router = Router();

router.get('/', categoriesController.getCategories);
router.get('/:id', categoriesController.getCategoryById);
router.post('/', categoriesController.createCategory);
router.put('/:id', categoriesController.updateCategory);
router.delete('/:id', categoriesController.deleteCategory);

export default router;
