import { Response } from 'express';
import { db } from '../../config/db';
import { commentsTable, usersTable } from '../../config/schema';
import { eq, desc } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await db
      .select({
        id: commentsTable.id,
        content: commentsTable.content,
        user: {
          id: usersTable.id,
          name: usersTable.name,
          picture: usersTable.picture,
        },
        createdAt: commentsTable.createdAt,
      })
      .from(commentsTable)
      .leftJoin(usersTable, eq(commentsTable.userId, usersTable.id))
      .where(eq(commentsTable.postId, Number(postId)))
      .orderBy(desc(commentsTable.createdAt));

    return res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server',
      error: error.message,
    });
  }
};
