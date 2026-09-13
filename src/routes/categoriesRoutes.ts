import { Router } from 'express';
import { getCategories } from '../controllers/categories/getCategories';
import { getCategoryById } from '../controllers/categories/getCategoryById';
import { createCategory } from '../controllers/categories/createCategory';
import { updateCategory } from '../controllers/categories/updateCategory';
import { deleteCategory } from '../controllers/categories/deleteCategory';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
