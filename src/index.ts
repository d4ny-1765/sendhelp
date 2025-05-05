import dotenv from 'dotenv';
import express from 'express';
import { migrateToLatest } from "./db/migrate.js";
import usersRouter from './routes/users.js';
import roomRouter from './routes/rooms.js';
import messageRouter from './routes/messages.js';
import topicRouter from './routes/topic.js';
import authRouter from './routes/auth.js';

dotenv.config();
await migrateToLatest();

export const app = express();

app.use(express.json());

app.use('/api/v1', authRouter);

app.use('/api/v1', usersRouter);

app.use('/api/v1', roomRouter);

app.use('/api/v1', messageRouter);

app.use('/api/v1', topicRouter);

if (process.env.APP_ENV !== 'test') {
    app.listen(3000, () => console.log('Listening on port 3000'));
}