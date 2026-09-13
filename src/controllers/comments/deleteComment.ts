import { Response } from 'express';
import { db } from '../../config/db';
import { commentsTable } from '../../config/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [existingComment] = await db
      .select()
      .from(commentsTable)
      .where(eq(commentsTable.id, Number(id)));

    if (!existingComment) {
      return res.status(404).json({
        success: false,
        message: 'Komentar tidak ditemukan',
      });
    }

    if (existingComment.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Tidak memiliki izin untuk menghapus komentar ini',
      });
    }

    await db
      .delete(commentsTable)
      .where(eq(commentsTable.id, Number(id)));

    return res.status(200).json({
      success: true,
      message: 'Komentar berhasil dihapus',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};
