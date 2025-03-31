import express from 'express';
import { createBook, getAllBooks, getOneBook } from '../repositories/book.js';

const router = express.Router();

router.get('/messages', async (req, res, next) => {
    try {
        const messages = await getAllMessages();
        res.json(messages);
    } catch (err) {
        next(err);
    }
});

router.get('/messages/:messageId', async (req, res, next) => {
    try {
        const message = await getOneMessage(+req.params.messageId);
        res.json(message);
    } catch (err) {
        next(err);
    }
});

router.post('/messages', async (req, res, next) => {
    try {
        const message = await createMessage(req.body);
        res.status(201).json(message);
    } catch (err) {
        next(err);
    }
});



export default router;