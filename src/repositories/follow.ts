import { db } from "../db/db.js";
import { Database } from "../db/types.js";
import { User } from './user.js';

export type UserFollows = {
    followerId: number;
    followingId: number;
    createdAt: Date;
}

export async function followUser(followerId: number, followingId: number, createdAt: Date): Promise<void> {
    if (followerId === followingId) {
        throw new Error("Can't follow yourself");
    }

    await db
        .insertInto('user_follows')
        .values({ followerId, followingId, createdAt })
        .execute();
}

export async function unfollowUser(followerId: number, followingId: number): Promise<void> {
    await db
        .deleteFrom('user_follows')
        .where('followerId', '=', followerId)
        .where('followingId', '=', followingId)
        .execute();
}

export async function getFollowers(userId: number): Promise<User[]> {
    return await db
        .selectFrom('user_follows')
        .innerJoin('user', 'user.userId', 'user_follows.followerId')
        .where('user_follows.followingId', '=', userId)
        .select(['user.userId', 'user.name', 'user.email', 'user.bio', 'user.avatar','password'])
        .execute();
}

export async function getFollowing(userId: number): Promise<User[]> {
    return await db
        .selectFrom('user_follows')
        .innerJoin('user', 'user.userId', 'user_follows.followingId')
        .where('user_follows.followerId', '=', userId)
        .select(['user.userId', 'user.name', 'user.email', 'user.bio', 'user.avatar','password'])
        .execute();
}

export async function isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const result = await db
        .selectFrom('user_follows')
        .where('followerId', '=', followerId)
        .where('followingId', '=', followingId)
        .executeTakeFirst();
    return !!result;
}