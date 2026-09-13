import { Request, Response } from 'express';
import { db } from '../../config/db';
import { categoriesTable } from '../../config/schema';
import { eq } from 'drizzle-orm';

export const deleteCategory = async (req: Request, res: Response) => {
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
