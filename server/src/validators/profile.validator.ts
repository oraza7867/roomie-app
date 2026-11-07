import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  age: z.number().int().min(16, "Must be at least 16").max(100).optional(),
  course: z.string().optional(),
  year: z.string().optional(),
  city: z.string().optional(),
  hostelOrLocality: z.string().optional(),
  bio: z.string().max(500, "Bio cannot exceed 500 characters").optional(),
  lookingFor: z.enum(["ROOM_AND_ROOMMATE", "ROOMMATE_ONLY"]).optional(),
  vibeAnswers: z.any().optional(),
}).strict();
// .strict() rejects any extra fields (like 'email', 'password', 'role') that aren't listed above.
// Without this, a malicious user could send { role: "ADMIN" } and Zod would silently pass it through.
