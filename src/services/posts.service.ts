import { eq, desc } from 'drizzle-orm';

import { db } from '../config/db';
import { postsTable, categoriesTable } from '../config/schema';

import {
  CreatePost,
  UpdatePost,
} from '../types/posts.type';

// GET ALL POSTS
export const getAllPosts = async () => {
  return await db
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
};

// GET POST BY ID
export const getPostById = async (id: number) => {
  const post = await db
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
    .where(eq(postsTable.id, id));

  return post[0];
};

// CREATE POST
export const createPost = async (data: CreatePost) => {
  const [newPost] = await db
    .insert(postsTable)
    .values({
      categoryId: data.categoryId,
      title: data.title,
      content: data.content,
      image: data.image || null,
      author: data.author || 'Anonim',
    })
    .returning();

  return newPost;
};

// UPDATE POST
export const updatePost = async (id: number, data: UpdatePost) => {
  const [updatedPost] = await db
    .update(postsTable)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(postsTable.id, id))
    .returning();

  return updatedPost;
};

// DELETE POST
export const deletePost = async (id: number) => {
  const [deletedPost] = await db
    .delete(postsTable)
    .where(eq(postsTable.id, id))
    .returning();

  return deletedPost;
};
