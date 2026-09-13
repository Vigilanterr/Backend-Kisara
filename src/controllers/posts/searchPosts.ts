import { Response } from 'express';
import { db } from '../../config/db';
import { postsTable, categoriesTable, usersTable, postLikesTable, commentsTable } from '../../config/schema';
import { eq, desc, sql, ilike, or } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export const searchPosts = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || String(q).trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query pencarian wajib diisi',
      });
    }

    const searchTerm = `%${String(q)}%`;

    const posts = await db
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
      .where(
        or(
          ilike(postsTable.title, searchTerm),
          ilike(postsTable.content, searchTerm)
        )
      )
      .groupBy(postsTable.id, categoriesTable.id, usersTable.id)
      .orderBy(desc(postsTable.createdAt));

    return res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};
