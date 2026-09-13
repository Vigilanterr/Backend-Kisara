import { Response } from 'express';
import { db } from '../../config/db';
import { postLikesTable, postsTable } from '../../config/schema';
import { eq, sql, and } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export class LikesController {
  toggleLike = async (req: AuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.userId!;

      const [existingLike] = await db
        .select()
        .from(postLikesTable)
        .where(
          and(
            eq(postLikesTable.userId, userId),
            eq(postLikesTable.postId, Number(id))
          )
        );

      if (existingLike) {
        await db
          .delete(postLikesTable)
          .where(eq(postLikesTable.id, existingLike.id));

        const [result] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(postLikesTable)
          .where(eq(postLikesTable.postId, Number(id)));

        return res.status(200).json({
          success: true,
          message: 'Like dibatalkan',
          liked: false,
          likeCount: result.count,
        });
      }

      await db
        .insert(postLikesTable)
        .values({
          userId,
          postId: Number(id),
        });

      const [result] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(postLikesTable)
        .where(eq(postLikesTable.postId, Number(id)));

      return res.status(200).json({
        success: true,
        message: 'Artikel disukai',
        liked: true,
        likeCount: result.count,
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

export default new LikesController();
