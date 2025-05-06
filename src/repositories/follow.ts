import { db } from "../db/db.js";
import { Database } from "../db/types.js";
import { User } from './user.js';

export type UserFollows = {
    followerId: number;
    followingId: number;
    createdAt: Date;
}
export async function followUser(followerId: number, followingId: number): Promise<void> {
    try {
      await db.transaction().execute(async (trx) => {
        await trx.insertInto('user_follows')
            .values({ followerId, followingId, createdAt: new Date() })
            .execute();
      });
    } catch (err: any) {
      if (err.code === '23505') {
        throw new Error("You are already following this user")
      }
      throw err
    }
}

export async function unfollowUser(followerId: number, followingId: number): Promise<void> {
    await db.transaction().execute(async (trx) => {
        await trx.deleteFrom('user_follows')
            .where('followerId', '=', followerId)
            .where('followingId', '=', followingId)
            .execute();
    });
}

export async function getAllFollowers(): Promise<User[]> {
    return await db
        .selectFrom('user_follows')
        .innerJoin('user', 'user.userId', 'user_follows.followerId')
        .select(['user.userId', 'user.name', 'user.email', 'user.bio', 'user.avatar','password'])
        .execute();
}

export async function getAllFollowing(): Promise<User[]> {
    return await db
        .selectFrom('user_follows')
        .innerJoin('user', 'user.userId', 'user_follows.followerId')
        .select(['user.userId', 'user.name', 'user.email', 'user.bio', 'user.avatar','password'])
        .execute();
}

export async function getFollowersById(userId: number): Promise<User[]> {
    return await db
        .selectFrom('user_follows')
        .innerJoin('user', 'user.userId', 'user_follows.followerId')
        .where('user_follows.followingId', '=', userId)
        .select(['user.userId', 'user.name', 'user.email', 'user.bio', 'user.avatar','password'])
        .execute();
}

export async function getFollowingById(userId: number): Promise<User[]> {
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