import express from 'express';
import { createBook, getAllBooks, getOneBook } from '../repositories/book.js';

const router = express.Router();

router.get('/users', async (req, res, next) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
});

router.get('/users/:userId', async (req, res, next) => {
    try {
        const user = await getOneUser(+req.params.userId);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

router.post('/users', async (req, res, next) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
});


export default router;