import { Response } from 'express';
import { db } from '../../config/db';
import { commentsTable, postsTable, usersTable } from '../../config/schema';
import { eq, desc } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export class CommentsController {
  getComments = async (req: AuthRequest, res: Response) => {
    try {
      const { postId } = req.params;
      const comments = await db
        .select({
          id: commentsTable.id,
          content: commentsTable.content,
          user: {
            id: usersTable.id,
            name: usersTable.name,
            picture: usersTable.picture,
          },
          createdAt: commentsTable.createdAt,
        })
        .from(commentsTable)
        .leftJoin(usersTable, eq(commentsTable.userId, usersTable.id))
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

  createComment = async (req: AuthRequest, res: Response) => {
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

  deleteComment = async (req: AuthRequest, res: Response) => {
    try {
      const { commentId } = req.params;

      const [existingComment] = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.id, Number(commentId)));

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
        .where(eq(commentsTable.id, Number(commentId)));

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
}

export default new CommentsController();
