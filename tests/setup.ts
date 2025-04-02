import { NO_MIGRATIONS } from "kysely";
import { migrator } from "../src/db/migrate.js";
import { db } from "../src/db/db.js";

await migrator.migrateTo(NO_MIGRATIONS);
await migrator.migrateToLatest();
await db.destroy();