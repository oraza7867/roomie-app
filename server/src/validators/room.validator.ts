import { z } from 'zod';

export const createRoomSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description too long"),
  city: z.string().min(2, "City is required").max(100),
  area: z.string().min(2, "Area is required").max(100),
  monthlyRent: z.number().int().positive("Rent must be a positive number").max(500000, "Rent seems unrealistic"),
  deposit: z.number().int().nonnegative("Deposit cannot be negative").max(1000000, "Deposit seems unrealistic"),
  availableFrom: z.string().datetime({ message: "Must be a valid ISO Date (e.g., 2024-01-01T00:00:00Z)" }),
  roomType: z.enum(["PRIVATE", "SHARED", "PG"]),
  furnished: z.enum(["FULLY", "SEMI", "UNFURNISHED"]),
  preferredGender: z.enum(["MALE", "FEMALE", "ANY"]).optional(),
});

export const updateRoomSchema = createRoomSchema.partial().extend({
  status: z.enum(["AVAILABLE", "OCCUPIED", "HIDDEN"]).optional(),
});
