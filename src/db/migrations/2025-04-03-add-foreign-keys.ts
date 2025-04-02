import { Kysely, sql } from 'kysely';
import { Database } from '../types.js';

export async function up(db: Kysely<Database>): Promise<void> {
    await db.schema
        .alterTable('room')
        .addForeignKeyConstraint('room_hostID_fkey', ['hostId'], 'user', ['userId'])
        .execute();
    await db.schema
        .alterTable('room')
        .addForeignKeyConstraint('room_topicID_fkey', ['topicId'], 'topic', ['topicId'])
        .execute();
    await db.schema
        .alterTable('message')
        .addForeignKeyConstraint('message_senderID_fkey', ['senderID'], 'user', ['userId'])
        .execute();
}
export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('room').execute();
  await db.schema.dropTable('message').execute();
}