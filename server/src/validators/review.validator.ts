import { z } from 'zod';

export const createReviewSchema = z.object({
  reviewedUserId: z.string().min(1, "Reviewed user ID is required").regex(/^[a-f\d]{24}$/i, "Invalid user ID format"),
  rating: z.number().int("Rating must be an integer").min(1, "Minimum rating is 1").max(5, "Maximum rating is 5"),
  comment: z.string().max(1000, "Comment cannot exceed 1000 characters").optional()
});

export const updateReviewSchema = z.object({
  rating: z.number().int("Rating must be an integer").min(1, "Minimum rating is 1").max(5, "Maximum rating is 5").optional(),
  comment: z.string().max(1000, "Comment cannot exceed 1000 characters").optional()
});
