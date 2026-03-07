import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import circlesRouter from './routes/circles';
import { errorHandler } from './middleware/errors';

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), chain: 'Creditcoin Testnet' });
});

// API Routes
app.use('/api/circles', circlesRouter);

// Error handling
app.use(errorHandler);

// Socket.io for real-time updates
export const io = new IOServer(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('subscribe:circle', (circleId: string) => {
        socket.join(`circle:${circleId}`);
        console.log(`Socket ${socket.id} subscribed to circle ${circleId}`);
    });

    socket.on('unsubscribe:circle', (circleId: string) => {
        socket.leave(`circle:${circleId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

httpServer.listen(PORT, () => {
    console.log(`
  ┌────────────────────────────────────────┐
  │   TrustCircle API Server               │
  │   Port: ${PORT}                           │
  │   Chain: Creditcoin Testnet            │
  │   Status: ✅ Running                   │
  └────────────────────────────────────────┘
  `);
});

export default app;
