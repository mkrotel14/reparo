import { getJobsDatabase } from "@/features/jobs/data/jobs-database";
import { seedJobsFromDummyJson } from "@/features/jobs/data/dummyjson-seed.native";

jest.mock("@/features/jobs/data/jobs-database", () => ({
  getJobsDatabase: jest.fn(),
}));

const database = {
  getFirstAsync: jest.fn(),
  withExclusiveTransactionAsync: jest.fn(),
};

const transaction = { getFirstAsync: jest.fn(), runAsync: jest.fn() };
const mockedGetJobsDatabase = jest.mocked(getJobsDatabase);

describe("DummyJSON jobs seed", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedGetJobsDatabase.mockResolvedValue(database as never);
    database.withExclusiveTransactionAsync.mockImplementation(
      async (callback) => callback(transaction),
    );
    transaction.getFirstAsync.mockResolvedValue(null);
    transaction.runAsync.mockResolvedValue({ changes: 1, lastInsertRowId: 1 });
  });

  it("imports only the demo Client todos and records the completed seed", async () => {
    database.getFirstAsync.mockResolvedValue(null);
    const fetchImpl = jest.fn().mockResolvedValue({
      json: async () => ({
        todos: [
          { completed: false, id: 1, todo: "Fix sink", userId: 1 },
          { completed: true, id: 2, todo: "Ignore me", userId: 2 },
        ],
      }),
      ok: true,
      status: 200,
    });

    await expect(
      seedJobsFromDummyJson({ clientId: "client-id", fetchImpl }),
    ).resolves.toEqual({ didSeed: true, importedCount: 1 });
    expect(transaction.runAsync).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("INSERT OR IGNORE INTO jobs"),
      "dummyjson-todo-1",
      1,
      "client-id",
      "Fix sink",
      "open",
      expect.any(String),
      expect.any(String),
    );
    expect(transaction.runAsync).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("INSERT INTO app_metadata"),
      "jobs.dummyjson.seed.v1",
      expect.any(String),
    );
  });

  it("does not call the network again after a successful seed", async () => {
    database.getFirstAsync.mockResolvedValue({
      value: "2026-08-01T00:00:00.000Z",
    });
    const fetchImpl = jest.fn();

    await expect(
      seedJobsFromDummyJson({ clientId: "client-id", fetchImpl }),
    ).resolves.toEqual({ didSeed: false, importedCount: 0 });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("does not mark a failed network seed as complete", async () => {
    database.getFirstAsync.mockResolvedValue(null);
    const fetchImpl = jest.fn().mockResolvedValue({ ok: false, status: 503 });

    await expect(
      seedJobsFromDummyJson({ clientId: "client-id", fetchImpl }),
    ).rejects.toThrow("DummyJSON seed request failed (503)");
    expect(transaction.runAsync).not.toHaveBeenCalled();
  });

  it("handles concurrent first-boot callers without failing the second caller", async () => {
    database.getFirstAsync.mockResolvedValue(null);
    transaction.getFirstAsync
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ value: "2026-08-01T00:00:00.000Z" });
    const fetchImpl = jest.fn().mockResolvedValue({
      json: async () => ({
        todos: [{ completed: false, id: 1, todo: "Fix sink", userId: 1 }],
      }),
      ok: true,
      status: 200,
    });

    await expect(
      Promise.all([
        seedJobsFromDummyJson({ clientId: "client-id", fetchImpl }),
        seedJobsFromDummyJson({ clientId: "client-id", fetchImpl }),
      ]),
    ).resolves.toEqual([
      { didSeed: true, importedCount: 1 },
      { didSeed: false, importedCount: 0 },
    ]);
  });
});
