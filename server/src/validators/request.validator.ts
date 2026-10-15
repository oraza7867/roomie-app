import { z } from 'zod';

export const createRequestSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required").regex(/^[a-f\d]{24}$/i, "Invalid user ID format"),
  message: z.string().max(500, "Message cannot exceed 500 characters").optional()
});

export const updateRequestSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED"])
});
