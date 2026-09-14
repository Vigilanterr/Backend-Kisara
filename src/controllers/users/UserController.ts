import { Response } from 'express';
import { db } from '../../config/db';
import { usersTable, postsTable, categoriesTable, postLikesTable, commentsTable } from '../../config/schema';
import { eq, or, ilike, desc, sql } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export class UserController {
  getMe = async (req: AuthRequest, res: Response) => {
    try {
      const [user] = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          picture: usersTable.picture,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, req.userId!));

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan',
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
      });
    }
  };

  getUserById = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const [user] = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          picture: usersTable.picture,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, Number(id)));

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User tidak ditemukan',
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
      });
    }
  };

  getUserPosts = async (req: AuthRequest, res: Response) => {
    try {
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
        .where(eq(postsTable.userId, req.userId!))
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

  searchUsers = async (req: AuthRequest, res: Response) => {
    try {
      const { q } = req.query;

      if (!q || String(q).trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Query pencarian wajib diisi',
        });
      }

      const searchTerm = `%${String(q)}%`;

      const users = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          picture: usersTable.picture,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(
          or(
            ilike(usersTable.name, searchTerm),
            ilike(usersTable.email, searchTerm)
          )
        );

      return res.status(200).json({
        success: true,
        data: users,
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

export default new UserController();
