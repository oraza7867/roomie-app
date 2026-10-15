import { Request, Response } from 'express';

export const checkHealth = (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Roomie API is running"
  });
};
