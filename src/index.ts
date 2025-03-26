import express from 'express';
import { migrateToLatest } from "./db/migrate.js";
import bookRouter from './routes/books.js';

await migrateToLatest();

export const app = express();

app.use(express.json());

app.use('/api/v1', bookRouter);

if (process.env.APP_ENV !== 'test') {
    app.listen(3000, () => console.log('Listening on port 3000'));
}