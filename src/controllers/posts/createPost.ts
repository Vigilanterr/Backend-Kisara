import { Response } from 'express';
import { db } from '../../config/db';
import { postsTable } from '../../config/schema';
import { AuthRequest } from '../../middleware/auth';

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { categoryId, title, content } = req.body;
    const pictureUrl = (req as any).pictureUrl || req.body.picture || null;

    if (!title || !content || !categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, dan categoryId wajib diisi',
      });
    }

    const [newPost] = await db
      .insert(postsTable)
      .values({
        userId: req.userId!,
        categoryId: Number(categoryId),
        title,
        content,
        picture: pictureUrl,
      })
      .returning();

    return res.status(201).json({
      success: true,
      message: 'Artikel berhasil dibuat',
      data: newPost,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};
