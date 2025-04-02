import express from 'express';
import { getAllMessages, getOneMessage, createMessage, updateMessage, deleteMessage } from '../repositories/messages.js';

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

router.put('/messages/:messageId', async (req, res, next) => {
    try {
        const message = await updateMessage({ messageID: +req.params.messageId, ...req.body });
        res.json(message);
    } catch (err) {
        next(err);
    }
});

router.delete('/messages/:messageId', async (req, res, next) => {
    try {
        await deleteMessage(+req.params.messageId);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

export default router;