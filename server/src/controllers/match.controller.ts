import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { calculateCompatibility } from '../services/matching.service';

export const getMatches = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    // 1. Get my own preferences
    const myPreferences = await prisma.lifestylePreference.findUnique({
      where: { userId }
    });

    if (!myPreferences) {
      return res.status(400).json({ 
        success: false, 
        message: 'You must set your Living Vibe preferences before finding matches.' 
      });
    }

    // 2. Fetch existing request connections (both sent and received) to exclude
    const existingRequests = await prisma.roomieRequest.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ],
        status: { in: ['PENDING', 'ACCEPTED'] }
      },
      select: { senderId: true, receiverId: true }
    });

    const connectedUserIds = new Set<string>();
    existingRequests.forEach(r => {
      if (r.senderId !== userId) connectedUserIds.add(r.senderId);
      if (r.receiverId !== userId) connectedUserIds.add(r.receiverId);
    });

    // 3. Fetch all other users who are NOT connected and have preferences set
    const otherUsers = await prisma.user.findMany({
      where: {
        id: { 
          notIn: [userId, ...Array.from(connectedUserIds)] 
        },
        lifestylePreference: { isNot: null }
      },
      select: {
        id: true,
        name: true,
        college: true,
        city: true,
        age: true,
        bio: true,
        lifestylePreference: true
      }
    });

    // 3. Calculate compatibility for each user
    const potentialMatches = otherUsers.map(otherUser => {
      // We know it's not null because of the query filter above, but TypeScript needs convincing
      const theirPreferences = otherUser.lifestylePreference!; 
      
      const scoreData = calculateCompatibility(myPreferences, theirPreferences);

      return {
        user: {
          id: otherUser.id,
          name: otherUser.name,
          college: otherUser.college,
          city: otherUser.city,
          age: otherUser.age,
          bio: otherUser.bio
        },
        compatibility: scoreData.compatibility,
        whyYouMatch: scoreData.whyYouMatch,
        differences: scoreData.differences
      };
    });

    // 4. Sort matches from highest compatibility to lowest
    potentialMatches.sort((a, b) => b.compatibility - a.compatibility);

    res.status(200).json({
      success: true,
      count: potentialMatches.length,
      matches: potentialMatches
    });
  } catch (error) {
    next(error);
  }
};
