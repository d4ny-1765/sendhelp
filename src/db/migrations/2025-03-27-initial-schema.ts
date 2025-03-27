import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('book')
    .addColumn('bookId', 'serial', column => column.primaryKey())
    .addColumn('bookName', 'varchar(255)', column => column.notNull())
    .execute()
  
  await db.schema
    .createTable('user')
    .addColumn('userId', 'serial', column => column.primaryKey())
    .addColumn('name', 'varchar(200)')
    .addColumn('email', 'varchar(255)', column => column.unique())
    .addColumn('bio', 'text')
    .addColumn('avatar', 'varchar(255)')
    .execute();

  await db.schema
    .createTable('topic')
    .addColumn('topicId', 'serial', column => column.primaryKey())
    .addColumn('name', 'varchar(200)', column => column.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('topic').execute();
  await db.schema.dropTable('user').execute();
  await db.schema.dropTable('book').execute();
}