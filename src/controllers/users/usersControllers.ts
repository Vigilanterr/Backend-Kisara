import { Response } from 'express';
import { db } from '../../config/db';
import { usersTable } from '../../config/schema';
import { eq, or, ilike, and, SQL } from 'drizzle-orm';
import { AuthRequest } from '../../middleware/auth';

export class UsersController {
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

export default new UsersController();
