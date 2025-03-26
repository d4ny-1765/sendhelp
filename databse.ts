import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('UserID', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('UserName', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('JoinDate', 'timestamp', (col) => col.defaultTo(sql`now()`))
    .execute();

  await db.schema
    .createTable('posts')
    .addColumn('PostID', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('Title', 'varchar(255)', (col) => col.notNull())
    .addColumn('Text', 'text', (col) => col.notNull())
    .addColumn('CreatedBy', 'uuid', (col) => col.notNull().references('users.UserID').onDelete('cascade'))
    .execute();

  await db.schema
    .createTable('comments')
    .addColumn('CommentID', 'uuid', (col) => col.primaryKey().defaultTo(sql`gen_random_uuid()`))
    .addColumn('Title', 'varchar(255)', (col) => col.notNull())
    .addColumn('Text', 'text', (col) => col.notNull())
    .addColumn('CommentedBy', 'uuid', (col) => col.notNull().references('users.UserID').onDelete('cascade'))
    .addColumn('PostID', 'uuid', (col) => col.notNull().references('posts.PostID').onDelete('cascade'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('comments').execute();
  await db.schema.dropTable('posts').execute();
  await db.schema.dropTable('users').execute();
}
