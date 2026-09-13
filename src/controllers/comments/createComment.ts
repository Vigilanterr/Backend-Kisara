import { Response } from 'express';
import { db } from '../../config/db';
import { commentsTable, postsTable } from '../../config/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Konten komentar wajib diisi',
      });
    }

    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, Number(postId)));
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan',
      });
    }

    const [newComment] = await db
      .insert(commentsTable)
      .values({
        userId: req.userId!,
        postId: Number(postId),
        content,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: 'Komentar berhasil ditambahkan',
      data: newComment,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};
