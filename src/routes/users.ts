import express from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../repositories/user.js';
import { db } from '../db/db.js';

const router = express.Router();

router.get('/users', async (req, res, next) => {
    try {
        const users = await getAllUsers();
        const usersWithStats = await Promise.all(users.map(async user => {
            const followers = await db
                .selectFrom('user_follows')
                .where('followingId', '=', user.userId)
                .select('followerId')
                .execute();

            const following = await db
                .selectFrom('user_follows')
                .where('followerId', '=', user.userId)
                .select('followingId')
                .execute();

            return {
                ...user,
                followers: followers.length,
                following: following.length
            };
        }));
        res.json(usersWithStats);
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

// Get user stats (followers and following)
router.get('/users/:userId/stats', async (req, res, next) => {
    try {
        const userId = +req.params.userId;
        
        const followers = await db
            .selectFrom('user_follows')
            .where('followingId', '=', userId)
            .select('followerId')
            .execute();

        const following = await db
            .selectFrom('user_follows')
            .where('followerId', '=', userId)
            .select('followingId')
            .execute();

        res.json({
            followers: followers.length,
            following: following.length,
            followingIds: following.map(f => f.followingId)
        });
    } catch (err) {
        next(err);
    }
});

export default router;