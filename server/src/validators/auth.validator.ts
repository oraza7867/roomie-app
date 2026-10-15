import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72, "Password too long"),
  college: z.string().min(2, "College name is required"),
  age: z.number().int().min(16).max(100).optional(),
  course: z.string().max(100).optional(),
  year: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
