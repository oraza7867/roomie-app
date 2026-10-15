import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { otherUserId } = req.params;

    if (!userId || !otherUserId) {
      return res.status(400).json({ success: false, message: 'User IDs missing' });
    }

    // Verify request is ACCEPTED between them
    const acceptedRequest = await prisma.roomieRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId, status: 'ACCEPTED' },
          { senderId: otherUserId, receiverId: userId, status: 'ACCEPTED' }
        ]
      }
    });

    if (!acceptedRequest) {
      return res.status(403).json({ success: false, message: 'Chat is only available for accepted roomie connections' });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { receiverId, text } = req.body;

    if (!userId || !receiverId || !text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Receiver ID and text required' });
    }

    // Verify connection is ACCEPTED
    const acceptedRequest = await prisma.roomieRequest.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId, status: 'ACCEPTED' },
          { senderId: receiverId, receiverId: userId, status: 'ACCEPTED' }
        ]
      }
    });

    if (!acceptedRequest) {
      return res.status(403).json({ success: false, message: 'Chat is only available for accepted roomie connections' });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        text: text.trim()
      }
    });

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    next(error);
  }
};
