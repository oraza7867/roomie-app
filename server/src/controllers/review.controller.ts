import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { createReviewSchema, updateReviewSchema } from '../validators/review.validator';

// ======================= CREATE =======================
export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reviewerId = req.user?.id;
    if (!reviewerId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const { reviewedUserId, rating, comment } = createReviewSchema.parse(req.body);

    // 1. Prevent self-review
    if (reviewerId === reviewedUserId) {
      return res.status(400).json({ success: false, message: 'You cannot review yourself' });
    }

    // 2. Check if user exists
    const userExists = await prisma.user.findUnique({ where: { id: reviewedUserId } });
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // 3. Prevent duplicate reviews
    const existingReview = await prisma.review.findFirst({
      where: {
        reviewerId,
        reviewedUserId
      }
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this user' });
    }

    // 4. Create Review
    const newReview = await prisma.review.create({
      data: {
        reviewerId,
        reviewedUserId,
        rating,
        comment
      }
    });

    res.status(201).json({ success: true, message: 'Review created', review: newReview });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};

// ======================= UPDATE =======================
export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reviewerId = req.user?.id;
    const { id } = req.params;

    if (!reviewerId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const existingReview = await prisma.review.findUnique({ where: { id } });
    if (!existingReview) return res.status(404).json({ success: false, message: 'Review not found' });

    // Authorization
    if (existingReview.reviewerId !== reviewerId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own reviews' });
    }

    const validatedData = updateReviewSchema.parse(req.body);

    const updatedReview = await prisma.review.update({
      where: { id },
      data: validatedData
    });

    res.status(200).json({ success: true, message: 'Review updated', review: updatedReview });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};

// ======================= DELETE =======================
export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reviewerId = req.user?.id;
    const { id } = req.params;

    if (!reviewerId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const existingReview = await prisma.review.findUnique({ where: { id } });
    if (!existingReview) return res.status(404).json({ success: false, message: 'Review not found' });

    // Authorization
    if (existingReview.reviewerId !== reviewerId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own reviews' });
    }

    await prisma.review.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ======================= READ BY USER =======================
export const getUserReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // The ID of the user whose reviews we are looking up
    const { id: reviewedUserId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { reviewedUserId },
      orderBy: { createdAt: 'desc' },
      include: {
        // Only fetch basic safe info about the reviewer
        reviewer: {
          select: { id: true, name: true, college: true }
        }
      }
    });

    // Calculate Average Rating
    let averageRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((total, review) => total + review.rating, 0);
      averageRating = parseFloat((sum / reviews.length).toFixed(1));
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating,
      reviews
    });
  } catch (error) {
    next(error);
  }
};
