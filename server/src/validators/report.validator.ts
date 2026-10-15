import { z } from 'zod';

export const createReportSchema = z.object({
  reportedUserId: z.string().min(1, "Reported User ID is required").regex(/^[a-f\d]{24}$/i, "Invalid user ID format"),
  reason: z.enum([
    "INAPPROPRIATE_BEHAVIOR",
    "MISLEADING_PROFILE",
    "FAKE_LISTING",
    "SPAM",
    "OTHER"
  ], { errorMap: () => ({ message: "Invalid report reason" }) }),
  description: z.string().max(1000, "Description too long").optional()
});

export const updateReportSchema = z.object({
  status: z.enum(["PENDING", "REVIEWED", "RESOLVED", "DISMISSED"])
});
