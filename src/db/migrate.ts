import * as path from 'path'
import { Pool } from 'pg'
import { promises as fs } from 'fs'
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from 'kysely'
import { db } from './db.js'

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(import.meta.dirname, 'migrations'),
  }),
})

export async function migrateToLatest() {
  const { error, results } = await migrator.migrateToLatest()

  let migrationErrored = false;
  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
      migrationErrored = true;
    }
  })

  if (error || migrationErrored) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }
}