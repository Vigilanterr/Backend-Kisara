import { Request, Response } from 'express';
import { db } from '../../config/db';
import { categoriesTable } from '../../config/schema';

export class CategoriesController {
  getCategories = async (req: Request, res: Response) => {
    try {
      const categories = await db.select().from(categoriesTable);
      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
      });
    }
  };

  createCategory = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nama kategori wajib diisi',
        });
      }

      const [newCategory] = await db
        .insert(categoriesTable)
        .values({ name })
        .returning();

      return res.status(201).json({
        success: true,
        message: 'Kategori berhasil dibuat',
        data: newCategory,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
      });
    }
  };
}

export default new CategoriesController();