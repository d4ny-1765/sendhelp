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

dotenv.config();
await migrateToLatest();

export const app = express();

app.use(cors({
    origin: ['https://stack-rant-vite.onrender.com', 'http://localhost:5173'],
    credentials: true,
}));

app.use(express.json());

app.use('/api/v1/auth', authRouter); 
app.use('/api/v1/users', usersRouter); 
app.use('/api/v1/follow', followRouter); 
app.use('/api/v1/rooms', roomRouter); 
app.use('/api/v1/messages', messageRouter); 
app.use('/api/v1/topics', topicRouter); 

if (process.env.APP_ENV !== 'test') {
  app.listen(3000, () => console.log('Listening on port 3000'));
}
