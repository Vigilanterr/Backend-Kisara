import { Request, Response } from 'express';
import { db } from '../config/db';
import { postsTable, categoriesTable } from '../config/schema';
import { eq, desc } from 'drizzle-orm';

export class PostsController {
  // GET ALL POSTS
  getPosts = async (req: Request, res: Response) => {
    try {
      const posts = await db
        .select({
          id: postsTable.id,
          title: postsTable.title,
          content: postsTable.content,
          image: postsTable.image,
          author: postsTable.author,
          categoryId: postsTable.categoryId,
          categoryName: categoriesTable.name,
          createdAt: postsTable.createdAt,
        })
        .from(postsTable)
        .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
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

  // GET POST BY ID
  getPostById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const [post] = await db
        .select({
          id: postsTable.id,
          title: postsTable.title,
          content: postsTable.content,
          image: postsTable.image,
          author: postsTable.author,
          categoryId: postsTable.categoryId,
          categoryName: categoriesTable.name,
          createdAt: postsTable.createdAt,
        })
        .from(postsTable)
        .leftJoin(categoriesTable, eq(postsTable.categoryId, categoriesTable.id))
        .where(eq(postsTable.id, Number(id)));

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

  // CREATE POST
  createPost = async (req: Request, res: Response) => {
    try {
      const { categoryId, title, content, image, author } = req.body;

      if (!title || !content || !categoryId) {
        return res.status(400).json({
          success: false,
          message: 'Title, content, dan categoryId wajib diisi',
        });
      }

      const [newPost] = await db
        .insert(postsTable)
        .values({
          categoryId: Number(categoryId),
          title,
          content,
          image: image || null,
          author: author || 'Anonim',
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

  // UPDATE POST
  updatePost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { categoryId, title, content, image, author } = req.body;

      const [updatedPost] = await db
        .update(postsTable)
        .set({
          categoryId: categoryId ? Number(categoryId) : undefined,
          title,
          content,
          image,
          author,
          updatedAt: new Date(),
        })
        .where(eq(postsTable.id, Number(id)))
        .returning();

      if (!updatedPost) {
        return res.status(404).json({
          success: false,
          message: 'Artikel tidak ditemukan',
        });
      }

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

  // DELETE POST
  deletePost = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const [deletedPost] = await db
        .delete(postsTable)
        .where(eq(postsTable.id, Number(id)))
        .returning();

      if (!deletedPost) {
        return res.status(404).json({
          success: false,
          message: 'Artikel tidak ditemukan',
        });
      }

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
}

export default new PostsController();