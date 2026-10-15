import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Read JWT from HTTP-only cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated. No token provided.' });
    }

    // 2. Verify token
    const secret = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';
    const decoded = jwt.verify(token, secret) as { userId: string };

    // 3. Attach user info to request
    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authenticated. Invalid token.' });
  }
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
    }

    next();
  } catch (error) {
    next(error);
  }
};
