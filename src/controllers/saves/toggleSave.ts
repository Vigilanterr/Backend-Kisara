import { Response } from 'express';
import { db } from '../../config/db';
import { savedPostsTable, postsTable, categoriesTable, usersTable } from '../../config/schema';
import { eq, and } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export const toggleSave = async (req: AuthRequest, res: Response) => {
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
