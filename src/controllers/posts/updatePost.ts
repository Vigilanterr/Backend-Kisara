import { Response } from 'express';
import { db } from '../../config/db';
import { postsTable } from '../../config/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryId, title, content } = req.body;
    const pictureUrl = (req as any).pictureUrl || req.body.picture || undefined;

    const [existingPost] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, Number(id)));

    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan',
      });
    }

    if (existingPost.userId !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Tidak memiliki izin untuk mengubah artikel ini',
      });
    }

    const [updatedPost] = await db
      .update(postsTable)
      .set({
        categoryId: categoryId ? Number(categoryId) : undefined,
        title,
        content,
        picture: pictureUrl,
        updatedAt: new Date(),
      })
      .where(eq(postsTable.id, Number(id)))
      .returning();

    return res.status(200).json({
      success: true,
      message: 'Artikel berhasil diperbarui',
      data: updatedPost,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};
