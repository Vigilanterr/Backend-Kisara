import { Response } from 'express';
import { db } from '../../config/db';
import { postsTable, categoriesTable, usersTable, postLikesTable, commentsTable } from '../../config/schema';
import { eq, sql } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export const getPostById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [post] = await db
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
        likeCount: sql<number>`count(${postLikesTable.id})::int`,
        commentCount: sql<number>`count(${commentsTable.id})::int`,
        createdAt: postsTable.createdAt,
      })
      .from(postsTable)
      .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
      .leftJoin(usersTable, eq(postsTable.userId, usersTable.id))
      .leftJoin(postLikesTable, eq(postsTable.id, postLikesTable.postId))
      .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
      .where(eq(postsTable.id, Number(id)))
      .groupBy(postsTable.id, categoriesTable.id, usersTable.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Artikel tidak ditemukan',
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};
