import { Kysely, sql } from 'kysely';
import { Database } from '../types.js';

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .alterTable('user')
    .addColumn('password', 'varchar(255)')
    .execute();

  await db.schema
    .createTable('room')
    .addColumn('roomId', 'serial', column => column.primaryKey())
    .addColumn('hostId', 'integer', column => column.notNull())
    .addColumn('topicId', 'integer', column => column.notNull())
    .addColumn('name', 'varchar(200)', column => column.notNull())
    .addColumn('description', 'text')
    .addColumn('createdAt', 'timestamp', column => column.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', column => column.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();

  await db.schema
    .createTable('message')
    .addColumn('messageID', 'serial', column => column.primaryKey())
    .addColumn('title', 'varchar(200)', column => column.notNull())
    .addColumn('body', 'text')
    .addColumn('senderID', 'integer', column => column.notNull())
    .addColumn('createdAt', 'timestamp', column => column.defaultTo(sql`CURRENT_TIMESTAMP`))
    .addColumn('updatedAt', 'timestamp', column => column.defaultTo(sql`CURRENT_TIMESTAMP`))
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable('message').execute();
  await db.schema.dropTable('room').execute();
  await db.schema.alterTable('user').dropColumn('password').execute();
}
