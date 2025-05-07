import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { migrateToLatest } from './db/migrate.js';
import usersRouter from './routes/users.js';
import roomRouter from './routes/rooms.js';
import messageRouter from './routes/messages.js';
import topicRouter from './routes/topic.js';
import authRouter from './routes/auth.js';
import followRouter from './routes/follow.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
await migrateToLatest();

export const app = express();
app.use(express.json()); // Add this line to parse JSON bodies

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://stack-rant-vite.onrender.com'
    : 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// API routes
app.use('/api/v1', authRouter);
app.use('/api/v1', usersRouter);
app.use('/api/v1', followRouter);
app.use('/api/v1', roomRouter);
app.use('/api/v1', messageRouter);
app.use('/api/v1', topicRouter);

// Serve static files
app.use(express.static(path.join(__dirname, '../dist')));

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start server (only in non-test environment)
if (process.env.APP_ENV !== 'test') {
  app.listen(3000, () => console.log('Listening on port 3000'));
}
