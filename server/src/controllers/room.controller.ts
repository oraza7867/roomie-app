import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { createRoomSchema, updateRoomSchema } from '../validators/room.validator';

// ======================= CREATE =======================
export const createRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const validatedData = createRoomSchema.parse(req.body);

    const room = await prisma.roomListing.create({
      data: {
        ...validatedData,
        ownerId: userId,
      }
    });

    res.status(201).json({ success: true, message: 'Room listing created', room });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};

// ======================= READ (ALL) =======================
export const getRooms = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { city, area, maxRent, roomType, furnished, status } = req.query;

    // Build the query filters dynamically
    const filters: any = {};

    if (city) filters.city = { equals: city as string, mode: 'insensitive' };
    if (area) filters.area = { contains: area as string, mode: 'insensitive' };
    if (maxRent) filters.monthlyRent = { lte: parseInt(maxRent as string) };
    if (roomType) filters.roomType = roomType;
    if (furnished) filters.furnished = furnished;
    
    // By default, only show available rooms unless a specific status is asked for
    if (status) {
      filters.status = status;
    } else {
      filters.status = 'AVAILABLE';
    }

    const rooms = await prisma.roomListing.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: { id: true, name: true, college: true, age: true }
        }
      }
    });

    res.status(200).json({ success: true, count: rooms.length, rooms });
  } catch (error) {
    next(error);
  }
};

// ======================= READ (ONE) =======================
export const getRoomById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const room = await prisma.roomListing.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, name: true, college: true, bio: true, age: true }
        }
      }
    });

    if (!room) return res.status(404).json({ success: false, message: 'Room not found' });

    res.status(200).json({ success: true, room });
  } catch (error) {
    next(error);
  }
};

// ======================= UPDATE =======================
export const updateRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    // 1. Check if room exists and if the user is the owner
    const existingRoom = await prisma.roomListing.findUnique({ where: { id } });
    if (!existingRoom) return res.status(404).json({ success: false, message: 'Room not found' });
    
    if (existingRoom.ownerId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own listings' });
    }

    // 2. Validate incoming data
    const validatedData = updateRoomSchema.parse(req.body);

    // 3. Update the database
    const updatedRoom = await prisma.roomListing.update({
      where: { id },
      data: validatedData
    });

    res.status(200).json({ success: true, message: 'Room updated', room: updatedRoom });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};

// ======================= DELETE =======================
export const deleteRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    // 1. Check ownership
    const existingRoom = await prisma.roomListing.findUnique({ where: { id } });
    if (!existingRoom) return res.status(404).json({ success: false, message: 'Room not found' });
    
    if (existingRoom.ownerId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own listings' });
    }

    // 2. Delete from database
    await prisma.roomListing.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};
