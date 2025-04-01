import express from 'express';
import { createTopic, getAllTopics, getTopicById, updateTopic, deleteTopic } from '../repositories/topic.js';

const router = express.Router();

router.get('/topics', async (req, res, next) => {
    try {
        const topics = await getAllTopics();
        res.json(topics);
    } catch (err) {
        next(err);
    }
});

router.get('/topics/:topicId', async (req, res, next) => {
    try {
        const topic = await getTopicById(+req.params.topicId);
        res.json(topic);
    } catch (err) {
        next(err);
    }
});

router.post('/topics', async (req, res, next) => {
    try {
        const topic = await createTopic(req.body);
        res.status(201).json(topic);
    } catch (err) {
        next(err);
    }
});

router.put('/topics/:topicId', async (req, res, next) => {
    try {
        const topic = await updateTopic({ topicId: +req.params.topicId, ...req.body });
        res.json(topic);
    } catch (err) {
        next(err);
    }
});

router.delete('/topics/:topicId', async (req, res, next) => {
    try {
        await deleteTopic(+req.params.topicId);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

export default router;