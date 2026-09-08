import express, { type Request, type Response } from 'express';
import type { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDb } from '../config/db.js';
import { ObjectId } from 'mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

export const authenticateAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token!, JWT_SECRET) as any;

    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }

    const db = getDb();
    const adminData = await db.collection('admins').findOne({
      $or: [
        { _id: new ObjectId(decoded.id) },
        { id: decoded.id }
      ]
    });

    if (!adminData) {
      return res.status(403).json({ success: false, message: 'Administrative access denied' });
    }

    req.user = {
      id: (adminData._id || adminData.id).toString(),
      role: adminData.role,
      email: adminData.email || decoded.email || '',
    };

    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const authorizeRole = (requiredRole: 'admin' | 'super_admin') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (req.user.role === 'super_admin') {
      return next();
    }

    if (requiredRole === 'admin' && req.user.role === 'admin') {
      return next();
    }

    return res.status(403).json({ success: false, message: 'Insufficient permissions for this operation' });
  };
};
