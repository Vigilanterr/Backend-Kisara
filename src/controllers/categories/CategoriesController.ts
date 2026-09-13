import { Request, Response } from 'express';
import { db } from '../../config/db';
import { categoriesTable } from '../../config/schema';
import { eq } from 'drizzle-orm';

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

  getCategoryById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [category] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, Number(id)));

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Kategori tidak ditemukan',
        });
      }

      return res.status(200).json({
        success: true,
        data: category,
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

  updateCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Nama kategori wajib diisi',
        });
      }

      const [existingCategory] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, Number(id)));

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: 'Kategori tidak ditemukan',
        });
      }

      const [updatedCategory] = await db
        .update(categoriesTable)
        .set({ name })
        .where(eq(categoriesTable.id, Number(id)))
        .returning();

      return res.status(200).json({
        success: true,
        message: 'Kategori berhasil diperbarui',
        data: updatedCategory,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
      });
    }
  };

  deleteCategory = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const [existingCategory] = await db
        .select()
        .from(categoriesTable)
        .where(eq(categoriesTable.id, Number(id)));

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: 'Kategori tidak ditemukan',
        });
      }

      await db
        .delete(categoriesTable)
        .where(eq(categoriesTable.id, Number(id)));

      return res.status(200).json({
        success: true,
        message: 'Kategori berhasil dihapus',
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
