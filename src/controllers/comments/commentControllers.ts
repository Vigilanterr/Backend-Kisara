import { Request, Response } from 'express';
import { db } from '../../config/db';
import { commentsTable, postsTable } from '../../config/schema';
import { eq, desc } from 'drizzle-orm';

export class CommentsController {
  getComments = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const comments = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.postId, Number(postId)))
        .orderBy(desc(commentsTable.createdAt));

      return res.status(200).json({
        success: true,
        data: comments,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
      });
    }
  };

  createComment = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const { content, userName } = req.body;

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
          postId: Number(postId),
          content,
          userName: userName || 'Anonim',
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
}

export default new CommentsController();