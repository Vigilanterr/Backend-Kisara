import { Request, Response } from 'express';
import { db } from '../../config/db';
import { categoriesTable } from '../../config/schema';

export const getCategories = async (req: Request, res: Response) => {
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
