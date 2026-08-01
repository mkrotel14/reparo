import { getSessionDatabase, migrateSessionDatabase } from '@/features/session/data/session-database';

const jobsDatabaseVersion = 4;

export async function getJobsDatabase() {
  await migrateSessionDatabase();
  const database = await getSessionDatabase();
  const versionRow = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');

  if ((versionRow?.user_version ?? 0) < jobsDatabaseVersion) {
    await database.withExclusiveTransactionAsync(async (transaction) => {
      await transaction.execAsync(`
        CREATE TABLE IF NOT EXISTS jobs (
          id TEXT PRIMARY KEY NOT NULL,
          source_todo_id INTEGER UNIQUE,
          client_id TEXT NOT NULL,
          pro_id TEXT,
          title TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          location TEXT NOT NULL DEFAULT 'Your location',
          budget INTEGER NOT NULL DEFAULT 0,
          status TEXT NOT NULL CHECK (status IN ('open', 'claimed', 'completed')),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS jobs_client_id_idx ON jobs(client_id);
        CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
        CREATE TABLE IF NOT EXISTS app_metadata (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL
        );
        PRAGMA user_version = 4;
      `);
    });
  } else if ((versionRow?.user_version ?? 0) < jobsDatabaseVersion) {
    await database.withExclusiveTransactionAsync(async (transaction) => {
      const columns = await transaction.getAllAsync<{ name: string }>('PRAGMA table_info(jobs)');
      if (!columns.some((column) => column.name === 'location')) {
        await transaction.execAsync("ALTER TABLE jobs ADD COLUMN location TEXT NOT NULL DEFAULT 'Your location'");
      }
      if (!columns.some((column) => column.name === 'budget')) {
        await transaction.execAsync('ALTER TABLE jobs ADD COLUMN budget INTEGER NOT NULL DEFAULT 0');
      }
      await transaction.execAsync('PRAGMA user_version = 4');
    });
  }

  return database;
}
