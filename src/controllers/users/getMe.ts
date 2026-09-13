import { Response } from 'express';
import { db } from '../../config/db';
import { usersTable } from '../../config/schema';
import { eq } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export const getMe = async (req: AuthRequest, res: Response) => {
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
