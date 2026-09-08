import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const db = getDb();
    const admin = await db.collection('admins').findOne({ email });

    if (!admin || !admin.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id || admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: admin._id || admin.id,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const db = getDb();
    const existingAdmin = await db.collection('admins').findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('admins').insertOne({
      email,
      password: hashedPassword,
      role: role || 'admin',
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      userId: result.insertedId,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
