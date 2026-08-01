import { getSessionDatabase, migrateSessionDatabase } from '@/features/session/data/session-database';
import { getJobsDatabase } from '@/features/jobs/data/jobs-database';

jest.mock('@/features/session/data/session-database', () => ({
  getSessionDatabase: jest.fn(),
  migrateSessionDatabase: jest.fn(),
}));

const database = {
  getFirstAsync: jest.fn(),
  withExclusiveTransactionAsync: jest.fn(),
};
const transaction = { execAsync: jest.fn() };
const mockedGetDatabase = jest.mocked(getSessionDatabase);
const mockedMigrate = jest.mocked(migrateSessionDatabase);

describe('jobs database migration', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedGetDatabase.mockResolvedValue(database as never);
    database.getFirstAsync.mockResolvedValue({ user_version: 2 });
    database.withExclusiveTransactionAsync.mockImplementation(async (callback) => callback(transaction));
    transaction.execAsync.mockResolvedValue(undefined);
  });

  it('creates job and metadata tables after the session migration', async () => {
    await expect(getJobsDatabase()).resolves.toBe(database);

    expect(mockedMigrate).toHaveBeenCalledTimes(1);
    expect(transaction.execAsync).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS jobs'));
    expect(transaction.execAsync).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS app_metadata'));
    expect(transaction.execAsync).toHaveBeenCalledWith(expect.stringContaining('PRAGMA user_version = 4'));
  });
});
