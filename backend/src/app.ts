import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from './database/connection';
import authRoutes from './routes/authRoutes';
import materialRoutes from './routes/materialRoutes';
import aiRoutes from './routes/aiRoutes';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use('/api', limiter);

// Connect to Database
connectDB();

// Setup Sockets
import setupSockets from './sockets/chatHandler';
setupSockets(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Matinformatics API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      materials: '/api/materials',
      ai: '/api/ai',
      upload: '/api/upload',
      health: '/health'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Matinformatics API is running smoothly' });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
