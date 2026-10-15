import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { createRequestSchema, updateRequestSchema } from '../validators/request.validator';

// ======================= CREATE REQUEST =======================
export const createRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const senderId = req.user?.id;
    if (!senderId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const { receiverId, message } = createRequestSchema.parse(req.body);

    // 1. Prevent sending to yourself
    if (senderId === receiverId) {
      return res.status(400).json({ success: false, message: 'You cannot send a request to yourself' });
    }

    // 2. Validate receiver exists
    const receiverExists = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiverExists) {
      return res.status(404).json({ success: false, message: 'Receiver not found' });
    }

    // 3. Prevent duplicate pending requests
    const existingRequest = await prisma.roomieRequest.findFirst({
      where: {
        senderId,
        receiverId,
        status: 'PENDING'
      }
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already have a pending request with this user' });
    }

    // 4. Create request
    const newRequest = await prisma.roomieRequest.create({
      data: {
        senderId,
        receiverId,
        message: message || "Hey, our living preferences seem pretty similar. Would you be open to connecting?",
        status: 'PENDING'
      }
    });

    res.status(201).json({ success: true, message: 'Request sent successfully', request: newRequest });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};

// ======================= GET RECEIVED REQUESTS =======================
export const getReceivedRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const requests = await prisma.roomieRequest.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
            course: true,
            year: true,
            city: true,
            age: true,
            bio: true,
            lifestylePreference: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

// ======================= GET SENT REQUESTS =======================
export const getSentRequests = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const requests = await prisma.roomieRequest.findMany({
      where: { senderId: userId },
      include: {
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
            course: true,
            year: true,
            city: true,
            age: true,
            bio: true,
            lifestylePreference: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({ success: true, count: requests.length, requests });
  } catch (error) {
    next(error);
  }
};

// ======================= UPDATE REQUEST (ACCEPT/REJECT) =======================
export const updateRequestStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    // 1. Validate incoming data
    const { status } = updateRequestSchema.parse(req.body);

    // 2. Fetch the request
    const existingRequest = await prisma.roomieRequest.findUnique({ where: { id } });
    if (!existingRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // 3. Authorization: Only the receiver can accept or reject
    if (existingRequest.receiverId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Only the receiver can modify this request' });
    }

    // 4. State validation: Only PENDING requests can be accepted or rejected
    if (existingRequest.status !== 'PENDING') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot change status. Request is already ${existingRequest.status}` 
      });
    }

    // 5. Update
    const updatedRequest = await prisma.roomieRequest.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ success: true, message: `Request ${status.toLowerCase()}`, request: updatedRequest });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};

// ======================= CANCEL REQUEST (DELETE) =======================
export const cancelRequest = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    // 1. Fetch the request
    const existingRequest = await prisma.roomieRequest.findUnique({ where: { id } });
    if (!existingRequest) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // 2. Authorization: Only the sender can cancel
    if (existingRequest.senderId !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden: Only the sender can cancel this request' });
    }

    // 3. State validation: Only PENDING requests can be cancelled
    if (existingRequest.status !== 'PENDING') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot cancel. Request is already ${existingRequest.status}` 
      });
    }

    // 4. Update status to CANCELLED instead of hard deleting (or we can just hard delete)
    // The instructions say "DELETE /api/requests/:id", usually implying hard delete or soft delete.
    // We will update the status to CANCELLED for history, or just delete. Let's delete it completely.
    await prisma.roomieRequest.delete({ where: { id } });

    res.status(200).json({ success: true, message: 'Request cancelled successfully' });
  } catch (error) {
    next(error);
  }
};
