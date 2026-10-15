import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import healthRoutes from './routes/health.route';
import authRoutes from './routes/auth.route';
import profileRoutes from './routes/profile.route';
import preferenceRoutes from './routes/preference.route';
import roomRoutes from './routes/room.route';
import matchRoutes from './routes/match.route';
import requestRoutes from './routes/request.route';
import reviewRoutes from './routes/review.route';
import userRoutes from './routes/user.route';
import reportRoutes from './routes/report.route';
import adminRoutes from './routes/admin.route';
import chatRoutes from './routes/chat.route';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
