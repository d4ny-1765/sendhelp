import { Kysely, sql } from 'kysely';
import { Database } from '../types.js';

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .createTable('user_follows')
        .addColumn('followerId', 'integer', col => col.primaryKey())
        .addColumn('followingId', 'integer', col => col.notNull())
        .addColumn('createdAt', 'timestamp', column => column.defaultTo(sql`CURRENT_TIMESTAMP`))
        .addForeignKeyConstraint(
            'fk_follower_user',
            ['followerId'],
            'user',
            ['userId']
        )
        .addForeignKeyConstraint(
            'fk_following_user',
            ['followingId'],
            'user',
            ['userId']
        )
        .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
    await db.schema.dropTable('follower').execute();
}
