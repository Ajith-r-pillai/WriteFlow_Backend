import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import userRouts from './routes/userRoutes.js';

dotenv.config();
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.LOCAL_FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

app.use('/WriteFlow/auth', authRoutes);
app.use('/WriteFlow/notes', noteRoutes);
app.use('/WriteFlow/users', userRouts);

app.use(errorHandler);
export default app;
