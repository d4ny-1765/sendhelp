import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('book')
    .addColumn('bookId', 'serial', column => column.primaryKey())
    .addColumn('bookName', 'varchar(255)', column => column.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('book').execute();
}