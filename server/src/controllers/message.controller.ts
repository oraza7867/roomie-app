import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

export const getConversations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    // Get accepted connections (where user is sender or receiver)
    const acceptedRequests = await prisma.roomieRequest.findMany({
      where: {
        status: 'ACCEPTED',
        OR: [{ senderId: userId }, { receiverId: userId }]
      },
      include: {
        sender: { select: { id: true, name: true, college: true } },
        receiver: { select: { id: true, name: true, college: true } }
      }
    });

    const connections = acceptedRequests.map(reqItem => {
      const partner = reqItem.senderId === userId ? reqItem.receiver : reqItem.sender;
      return partner;
    });

    res.status(200).json({ success: true, connections });
  } catch (error) {
    next(error);
  }
};

export const getMessagesWithUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { partnerId } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
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
    const { receiverId, content } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Message content required' });
    }

    // Verify accepted relationship exists
    const matchRequest = await prisma.roomieRequest.findFirst({
      where: {
        status: 'ACCEPTED',
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId }
        ]
      }
    });

    if (!matchRequest) {
      return res.status(403).json({ success: false, message: 'You can only message matched roomies who accepted your request.' });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: userId,
        receiverId,
        content: content.trim()
      }
    });

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    next(error);
  }
};
