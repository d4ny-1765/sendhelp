import { db } from "../db/db.js";
import bcrypt from 'bcrypt';

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
        // Get current user data for password verification
        const currentUser = await trx
            .selectFrom('user')
            .select(['password'])
            .where('userId', '=', userId)
            .executeTakeFirstOrThrow();

        // Verify current password if provided
        if (user.password && !await bcrypt.compare(user.password || '', currentUser.password || '')) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password if provided
        if (user.password) {
            user.password = await bcrypt.hash(user.password || '', 10);
        }

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

export async function findUserByEmail(email: string): Promise<User | undefined> {
    return await db
        .selectFrom('user')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst();
}

export async function createAuthUser(email: string, password: string, name: string): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await db
        .insertInto('user')
        .columns(['email', 'password', 'name'])
        .values({ email, password: passwordHash, name })
        .returningAll()
        .executeTakeFirstOrThrow();
    return newUser;
}

