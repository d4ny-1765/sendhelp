import { db } from "../db/db.js";
import { Database } from "../db/types.js";

export type User = {
    userId: number;
    name: string | null;
    email: string | null;
    bio: string | null;
    avatar: string | null;
    password: string | null;
};

export async function getAllUsers(): Promise<User[]> {
    return await db
        .selectFrom('user')
        .select(['userId', 'name', 'email', 'bio', 'avatar', 'password'])
        .execute();
}

export async function getUserById(userId: number): Promise<User> {
    return await db
        .selectFrom('user')
        .select(['userId', 'name', 'email', 'bio', 'avatar', 'password'])
        .where('userId', '=', userId)
        .executeTakeFirstOrThrow();
}

export async function createUser(user: Omit<User, 'userId'>): Promise<User> {
    const { name, email, bio = null, avatar = null, password = null } = user;
    const insertedUser = await db.transaction().execute(async (trx) => {
        const result = await trx
            .insertInto('user')
            .columns(['name', 'email', 'bio', 'avatar', 'password'])
            .values({ name, email, bio, avatar, password })
            .returning(['userId', 'name', 'email', 'bio', 'avatar', 'password'])
            .executeTakeFirstOrThrow();
        return result;
    });
    return insertedUser;
}

export async function updateUser(user: User): Promise<User> {
    const { userId, name, email, bio = null, avatar = null, password = null } = user;
    const updatedUser = await db.transaction().execute(async (trx) => {
        const result = await trx
            .updateTable('user')
            .set({ name, email, bio, avatar, password })
            .where('userId', '=', userId)
            .returning(['userId', 'name', 'email', 'bio', 'avatar', 'password'])
            .executeTakeFirstOrThrow();
        return result;
    });
    return updatedUser;
}

export async function deleteUser(userId: number): Promise<User> {
    const deletedUser = await db
        .deleteFrom('user')
        .where('userId', '=', userId)
        .returning(['userId', 'name', 'email', 'bio', 'avatar', 'password'])
        .executeTakeFirstOrThrow();
    return deletedUser;
}
