import { Response } from 'express';
import { db } from '../../config/db';
import { savedPostsTable, postsTable, categoriesTable, usersTable } from '../../config/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export const getSavedPosts = async (req: AuthRequest, res: Response) => {
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
