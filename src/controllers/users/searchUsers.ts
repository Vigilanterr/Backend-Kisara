import { Response } from 'express';
import { db } from '../../config/db';
import { usersTable } from '../../config/schema';
import { or, ilike } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export const searchUsers = async (req: AuthRequest, res: Response) => {
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
