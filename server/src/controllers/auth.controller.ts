import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { AuthRequest } from '../middleware/auth.middleware';

// Generate token helper
const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

// Cookie options — reused for both setting and clearing
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const, // 'lax' allows the cookie to be sent on same-site navigations and cross-origin POST
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Set cookie helper
const setAuthCookie = (res: Response, token: string) => {
  res.cookie('token', token, cookieOptions);
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate input
    const validatedData = registerSchema.parse(req.body);

    // 2. Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // 4. Create user
    const newUser = await prisma.user.create({
      data: {
        ...validatedData,
        password: hashedPassword,
      }
    });

    // 5. Generate token & set cookie (optional auto-login on register)
    const token = generateToken(newUser.id);
    setAuthCookie(res, token);

    // 6. Return safe user data (strip password AND role from response)
    const { password: _, role: __, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: safeUser
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Validate input
    const { email, password } = loginSchema.parse(req.body);

    // 2. Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // 4. Generate JWT
    const token = generateToken(user.id);

    // 5. Put JWT in HTTP-only cookie
    setAuthCookie(res, token);

    // 6. Return safe user data (strip password AND role from response)
    const { password: _, role: __, ...safeUser } = user;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: safeUser
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  // clearCookie must use the same options (minus maxAge) that were used when setting the cookie,
  // otherwise the browser may silently refuse to clear it.
  res.clearCookie('token', {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
       return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { password, role, ...safeUser } = user;

    res.status(200).json({
      success: true,
      user: safeUser
    });
  } catch (error) {
    next(error);
  }
};
