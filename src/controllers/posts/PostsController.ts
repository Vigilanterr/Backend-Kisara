import { Response } from 'express';
import { db } from '../../config/db';
import { postsTable, categoriesTable, usersTable, postLikesTable, commentsTable } from '../../config/schema';
import { eq, desc, sql, ilike, or } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export class PostsController {
  getPosts = async (req: AuthRequest, res: Response) => {
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

  getPostById = async (req: AuthRequest, res: Response) => {
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

  createPost = async (req: AuthRequest, res: Response) => {
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

  updatePost = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { categoryId, title, content } = req.body;
      const pictureUrl = (req as any).pictureUrl || req.body.picture || undefined;

      const [existingPost] = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, Number(id)));

      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Artikel tidak ditemukan',
        });
      }

      if (existingPost.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'Tidak memiliki izin untuk mengubah artikel ini',
        });
      }

      const [updatedPost] = await db
        .update(postsTable)
        .set({
          categoryId: categoryId ? Number(categoryId) : undefined,
          title,
          content,
          picture: pictureUrl,
          updatedAt: new Date(),
        })
        .where(eq(postsTable.id, Number(id)))
        .returning();

      return res.status(200).json({
        success: true,
        message: 'Artikel berhasil diperbarui',
        data: updatedPost,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
      });
    }
  };

  deletePost = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;

      const [existingPost] = await db
        .select()
        .from(postsTable)
        .where(eq(postsTable.id, Number(id)));

      if (!existingPost) {
        return res.status(404).json({
          success: false,
          message: 'Artikel tidak ditemukan',
        });
      }

      if (existingPost.userId !== req.userId) {
        return res.status(403).json({
          success: false,
          message: 'Tidak memiliki izin untuk menghapus artikel ini',
        });
      }

      await db
        .delete(postsTable)
        .where(eq(postsTable.id, Number(id)));

      return res.status(200).json({
        success: true,
        message: 'Artikel berhasil dihapus',
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan pada server',
        error: error.message,
      });
    }
  };

  searchPosts = async (req: AuthRequest, res: Response) => {
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
}

export default new PostsController();
