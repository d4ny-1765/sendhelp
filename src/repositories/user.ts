import { db } from "../db/db.js";
import { Database } from "../db/types.js";

export type User = {
    userId: number;
    name: string | null;
    email: string | null;
    bio: string | null;
    avatar: string | null;
};

export async function getAllUsers(): Promise<User[]> {
    return await db
        .selectFrom('user')
        .select(['userId', 'name', 'email', 'bio', 'avatar'])
        .execute();
}

export async function getUserById(userId: number): Promise<User> {
    return await db
        .selectFrom('user')
        .select(['userId', 'name', 'email', 'bio', 'avatar'])
        .where('userId', '=', userId)
        .executeTakeFirstOrThrow();
}

export async function createUser(user: Omit<User, 'userId'>): Promise<User> {
    const { name, email, bio, avatar } = user;
    const insertedUser = await db.transaction().execute(async (trx) => {
        const result = await trx
            .insertInto('user')
            .columns(['name', 'email', 'bio', 'avatar'])
            .values({ name, email, bio, avatar })
            .returning(['userId', 'name', 'email', 'bio', 'avatar'])
            .executeTakeFirstOrThrow();
        return result;
    });
    return insertedUser;
}