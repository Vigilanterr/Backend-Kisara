import { Request, Response } from 'express';
import * as postsService from '../../services/posts.service';

export class PostsController {
  // GET ALL POSTS
  getPosts = async (req: Request, res: Response) => {
    try {
      const posts = await postsService.getAllPosts();

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
      const post = await postsService.getPostById(Number(id));

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

      const newPost = await postsService.createPost({
        categoryId: Number(categoryId),
        title,
        content,
        image,
        author,
      });

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

      const updatedPost = await postsService.updatePost(Number(id), {
        categoryId: categoryId ? Number(categoryId) : undefined,
        title,
        content,
        image,
        author,
      });

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

      const deletedPost = await postsService.deletePost(Number(id));

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
