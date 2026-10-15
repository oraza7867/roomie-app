import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { preferenceSchema } from '../validators/preference.validator';

export const getMyPreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const preferences = await prisma.lifestylePreference.findUnique({
      where: { userId }
    });

    if (!preferences) {
      return res.status(404).json({ success: false, message: 'Preferences not found. Create one first.' });
    }

    res.status(200).json({ success: true, preferences });
  } catch (error) {
    next(error);
  }
};

export const updateMyPreferences = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const validatedData = preferenceSchema.parse(req.body);

    // Upsert means: "Update it if it exists, otherwise Create it"
    const preferences = await prisma.lifestylePreference.upsert({
      where: { userId },
      update: validatedData,
      create: {
        userId,
        ...validatedData
      }
    });

    res.status(200).json({ success: true, message: 'Preferences saved successfully', preferences });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};
