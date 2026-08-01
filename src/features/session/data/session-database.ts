import * as SQLite from "expo-sqlite";

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

export function getSessionDatabase() {
  databasePromise ??= SQLite.openDatabaseAsync("reparo.db");
  return databasePromise;
}

export async function migrateSessionDatabase() {
  const database = await getSessionDatabase();
  const versionRow = await database.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  const version = versionRow?.user_version ?? 0;

  if (version === 0) {
    await database.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS local_identities (
        role TEXT PRIMARY KEY NOT NULL,
        identity_id TEXT NOT NULL,
        dummy_json_user_id INTEGER,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS active_session (
        singleton INTEGER PRIMARY KEY CHECK (singleton = 1),
        role TEXT NOT NULL,
        identity_id TEXT NOT NULL,
        dummy_json_user_id INTEGER,
        created_at TEXT NOT NULL
      );
      PRAGMA user_version = 2;
    `);
    return;
  }

  if (version < 2) {
    await database.withExclusiveTransactionAsync(async (transaction) => {
      const identityColumns = await transaction.getAllAsync<{ name: string }>(
        "PRAGMA table_info(local_identities)",
      );
      if (!identityColumns.some((column) => column.name === "created_at")) {
        await transaction.execAsync(
          "ALTER TABLE local_identities ADD COLUMN created_at TEXT",
        );
      }

      const sessionColumns = await transaction.getAllAsync<{ name: string }>(
        "PRAGMA table_info(active_session)",
      );
      if (!sessionColumns.some((column) => column.name === "created_at")) {
        await transaction.execAsync(
          "ALTER TABLE active_session ADD COLUMN created_at TEXT",
        );
      }

      await transaction.execAsync(`
        UPDATE local_identities SET created_at = datetime('now') WHERE created_at IS NULL;
        UPDATE active_session SET created_at = datetime('now') WHERE created_at IS NULL;
        PRAGMA user_version = 2;
      `);
    });
  }
}
