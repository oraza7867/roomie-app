import { Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { AuthRequest } from '../middleware/auth.middleware';
import { createReportSchema, updateReportSchema } from '../validators/report.validator';

// ======================= CREATE REPORT =======================
export const createReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reporterId = req.user?.id;
    if (!reporterId) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const { reportedUserId, reason, description } = createReportSchema.parse(req.body);

    // Prevent reporting oneself
    if (reporterId === reportedUserId) {
      return res.status(400).json({ success: false, message: 'You cannot report yourself' });
    }

    const userExists = await prisma.user.findUnique({ where: { id: reportedUserId } });
    if (!userExists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const report = await prisma.report.create({
      data: {
        reporterId,
        reportedUserId,
        reason,
        description,
        status: 'PENDING'
      }
    });

    res.status(201).json({ success: true, message: 'Report submitted successfully', report });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};

// ======================= ADMIN: GET ALL REPORTS =======================
export const getAdminReports = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        reportedUser: { select: { id: true, name: true, email: true } }
      }
    });

    res.status(200).json({ success: true, count: reports.length, reports });
  } catch (error) {
    next(error);
  }
};

// ======================= ADMIN: UPDATE REPORT STATUS =======================
export const updateAdminReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = updateReportSchema.parse(req.body);

    const existingReport = await prisma.report.findUnique({ where: { id } });
    if (!existingReport) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const updatedReport = await prisma.report.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ success: true, message: 'Report status updated', report: updatedReport });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.errors });
    }
    next(error);
  }
};
