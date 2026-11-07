import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { createRoomSchema, updateRoomSchema } from '../validators/room.validator';
import { calculateDistanceFromCampus } from '../utils/distance';

// ======================= CREATE =======================
export const createRoom = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const validatedData = createRoomSchema.parse(req.body);

    const distanceFromCampusKm = calculateDistanceFromCampus(validatedData.lat, validatedData.lng);

    // Convert date string → Date object (works for both "2026-11-01" and full ISO)
    const availableFrom = new Date(validatedData.availableFrom);
    if (isNaN(availableFrom.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid availableFrom date' });
    }

    const roomData: any = {
      ...validatedData,
      availableFrom,
      distanceFromCampusKm,
      ownerId: userId,
    };
    if (roomData.preferredGender === undefined) {
      delete roomData.preferredGender;
    }

    const room = await prisma.roomListing.create({
      data: roomData
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
    const { locality, city, area, maxRent, roomType, furnished, status, maxDistanceKm } = req.query;

    // Build the query filters dynamically
    const filters: any = {};

    const targetLocality = (locality || city) as string | undefined;
    if (targetLocality) filters.locality = { equals: targetLocality, mode: 'insensitive' };
    if (area) filters.area = { contains: area as string, mode: 'insensitive' };
    if (maxRent && !isNaN(Number(maxRent))) {
      filters.monthlyRent = { lte: parseInt(maxRent as string, 10) };
    }
    if (roomType) filters.roomType = roomType;
    if (furnished) filters.furnished = furnished;
    if (maxDistanceKm && !isNaN(Number(maxDistanceKm))) {
      filters.distanceFromCampusKm = { lte: parseFloat(maxDistanceKm as string) };
    }
    
    // By default, only show available rooms unless a specific status is asked for
    if (status) {
      filters.status = status;
    } else {
      filters.status = 'AVAILABLE';
    }

    const rooms = await prisma.roomListing.findMany({
      where: filters,
      orderBy: { distanceFromCampusKm: 'asc' },
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
      where: { id: id as string },
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
    const existingRoom = await prisma.roomListing.findUnique({ where: { id: id as string } });
    if (!existingRoom) return res.status(404).json({ success: false, message: 'Room not found' });
    
    if (existingRoom.ownerId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only edit your own listings' });
    }

    // 2. Validate incoming data
    const validatedData = updateRoomSchema.parse(req.body);

    // 3. Recalculate distance if lat/lng updated
    const dataToUpdate: any = { ...validatedData };
    if (validatedData.lat !== undefined || validatedData.lng !== undefined) {
      const newLat = validatedData.lat ?? existingRoom.lat;
      const newLng = validatedData.lng ?? existingRoom.lng;
      dataToUpdate.distanceFromCampusKm = calculateDistanceFromCampus(newLat, newLng);
    }

    // 4. Update the database
    const updatedRoom = await prisma.roomListing.update({
      where: { id: id as string },
      data: dataToUpdate
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
    const existingRoom = await prisma.roomListing.findUnique({ where: { id: id as string } });
    if (!existingRoom) return res.status(404).json({ success: false, message: 'Room not found' });
    
    if (existingRoom.ownerId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: You can only delete your own listings' });
    }

    // 2. Delete from database
    await prisma.roomListing.delete({ where: { id: id as string } });

    res.status(200).json({ success: true, message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};
