import pg from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { Database } from './types.js'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Required for Render-hosted PostgreSQL
    },
    max: 10,
  }),
})

export const db = new Kysely<Database>({
  dialect,
})
