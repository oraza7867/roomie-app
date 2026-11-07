import { z } from 'zod';

export const createRoomSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description too long"),
  locality: z.string().min(2, "Locality is required").max(100),
  area: z.string().max(100).optional().default("Near Campus"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  distanceFromCampusKm: z.number().nonnegative().optional(),
  monthlyRent: z.number().positive("Rent must be a positive number").max(500000),
  deposit: z.number().nonnegative("Deposit cannot be negative").max(1000000),
  // Accept both plain date ("2026-11-01") and full ISO datetime ("2026-11-01T00:00:00.000Z")
  availableFrom: z.string().min(1, "Available date is required"),
  roomType: z.enum(["PRIVATE", "SHARED", "PG"]),
  furnished: z.enum(["FULLY", "SEMI", "UNFURNISHED"]),
  preferredGender: z.enum(["MALE", "FEMALE", "ANY"]).optional(),
});


export const updateRoomSchema = createRoomSchema.partial().extend({
  status: z.enum(["AVAILABLE", "OCCUPIED", "HIDDEN"]).optional(),
});
