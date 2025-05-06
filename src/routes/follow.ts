import express from 'express';
import { followUser, unfollowUser, getFollowersById, getFollowingById, getAllFollowing, getAllFollowers } from '../repositories/follow.js';

const router = express.Router();

router.post('/follow/:followingId', async (req, res, next) => {
    try {
        const followingId = +req.params.followingId;
        const followerId = +req.body.followerId;
        await followUser(followerId, followingId);
        res.status(204).end();
    } catch (err: any) {
        if (err.message === "Can't follow yourself") {
            res.status(400).json({ error: err.message });
        } else {
            next(err);
        }
    }
});

router.delete('/follow/:followingId', async (req, res, next) => {
    try {
        const followingId = +req.params.followingId;
        const followerId = +req.body.followerId;
        await unfollowUser(followerId, followingId);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.get('/followers/:followerId', async (req, res, next) => {
    try {
        const followers = await getFollowersById(+req.params.followerId);
        res.json(followers);
    } catch (err) {
        next(err);
    }
});

router.get('/following/:followingId', async (req, res, next) => {
    try {
        const following = await getFollowingById(+req.params.followingId);
        res.json(following);
    } catch (err) {
        next(err);
    }
});

router.get('/following', async (req, res, next) => {
    try {
        const following = await getAllFollowing();
        res.json(following);
    } catch (err) {
        next(err);
    }
});

router.get('/followers', async (req, res, next) => {
    try {
        const followers = await getAllFollowers();
        res.json(followers);
    } catch (err) {
        next(err);
    }
});

export default router;