import express from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../repositories/user.js';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../repositories/follow.js';

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
        const user = await getUserById(+req.params.userId);
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

router.put('/users/:userId', async (req, res, next) => {
    try {
        const user = await updateUser({ userId: +req.params.userId, ...req.body });
        res.json(user);
    } catch (err) {
        next(err);
    }
});

router.delete('/users/:userId', async (req, res, next) => {
    try {
        const user = await deleteUser(+req.params.userId);
        res.json(user);
    } catch (err) {
        next(err);
    }
});

router.post('/users/:userId/follow', async (req, res, next) => {
    try {
        const followingId = +req.params.userId;
        const followerId = +req.body.followerId;
        await followUser(followerId, followingId, new Date());
        res.status(204).end();
    } catch (err: any) {
        if (err.message === "Can't follow yourself") {
            res.status(400).json({ error: err.message });
        } else {
            next(err);
        }
    }
});

router.delete('/users/:userId/follow', async (req, res, next) => {
    try {
        const followingId = +req.params.userId;
        const followerId = +req.body.followerId;
        await unfollowUser(followerId, followingId);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.get('/users/:userId/followers', async (req, res, next) => {
    try {
        const followers = await getFollowers(+req.params.userId);
        res.json(followers);
    } catch (err) {
        next(err);
    }
});

router.get('/users/:userId/following', async (req, res, next) => {
    try {
        const following = await getFollowing(+req.params.userId);
        res.json(following);
    } catch (err) {
        next(err);
    }
});

export default router;