import { Response } from 'express';
import { db } from '../../config/db';
import { savedPostsTable, postsTable, categoriesTable, usersTable } from '../../config/schema';
import { eq, and } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export class SavesController {
  toggleSave = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const [existingSave] = await db
        .select()
        .from(savedPostsTable)
        .where(
          and(
            eq(savedPostsTable.userId, userId),
            eq(savedPostsTable.postId, Number(id))
          )
        );

      if (existingSave) {
        await db
          .delete(savedPostsTable)
          .where(eq(savedPostsTable.id, existingSave.id));

        return res.status(200).json({
          success: true,
          message: 'Artikel tidak disimpan',
          saved: false,
        });
      }

      await db
        .insert(savedPostsTable)
        .values({
          userId,
          postId: Number(id),
        });

      return res.status(200).json({
        success: true,
        message: 'Artikel disimpan',
        saved: true,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
      });
    }
  };

  getSavedPosts = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.userId!;

      const savedPosts = await db
        .select({
          id: postsTable.id,
          title: postsTable.title,
          content: postsTable.content,
          picture: postsTable.picture,
          categoryId: postsTable.categoryId,
          categoryName: categoriesTable.name,
          author: {
            id: usersTable.id,
            name: usersTable.name,
            picture: usersTable.picture,
          },
          createdAt: postsTable.createdAt,
        })
        .from(savedPostsTable)
        .innerJoin(postsTable, eq(savedPostsTable.postId, postsTable.id))
        .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
        .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
        .where(eq(savedPostsTable.userId, userId));

      return res.status(200).json({
        success: true,
        data: savedPosts,
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

export default new SavesController();
