import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  const statusCode = err.status || 500;

  // Never leak raw internal error details to the client.
  // Only expose the message for client errors (4xx).
  // For server errors (5xx), send a generic message.
  const message = statusCode < 500
    ? err.message
    : 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
  });
};
