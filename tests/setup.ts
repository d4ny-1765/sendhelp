import { NO_MIGRATIONS } from "kysely";
import { migrator } from "../src/db/migrate.js";
import { db } from "../src/db/db.js";

const results = await migrator.migrateTo(NO_MIGRATIONS);
await migrator.migrateToLatest();
await db.destroy();