import { Request, Response } from 'express';
import { db } from '../../config/db';
import { categoriesTable } from '../../config/schema';
import { eq } from 'drizzle-orm';

export const getCategoryById = async (req: Request, res: Response) => {
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
