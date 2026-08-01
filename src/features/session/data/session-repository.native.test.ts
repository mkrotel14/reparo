import * as Crypto from "expo-crypto";

import {
  getSessionDatabase,
  migrateSessionDatabase,
} from "@/features/session/data/session-database";
import { sessionRepository } from "@/features/session/data/session-repository.native";

jest.mock("expo-crypto", () => ({ randomUUID: jest.fn() }));

jest.mock("@/features/session/data/session-database", () => ({
  getSessionDatabase: jest.fn(),
  migrateSessionDatabase: jest.fn(),
}));

const database = {
  getFirstAsync: jest.fn(),
  runAsync: jest.fn(),
};

const mockedGetDatabase = jest.mocked(getSessionDatabase);
const mockedMigrate = jest.mocked(migrateSessionDatabase);
const mockedRandomUuid = jest.mocked(Crypto.randomUUID);

describe("native session repository", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedGetDatabase.mockResolvedValue(database as never);
    database.runAsync.mockResolvedValue({ changes: 1, lastInsertRowId: 1 });
  });

  it("restores the active SQLite session", async () => {
    database.getFirstAsync.mockResolvedValue({
      created_at: "2026-08-01T00:00:00.000Z",
      dummy_json_user_id: 1,
      identity_id: "client-id",
      role: "client",
    });

    await expect(sessionRepository.restore()).resolves.toEqual({
      createdAt: "2026-08-01T00:00:00.000Z",
      dummyJsonUserId: 1,
      identityId: "client-id",
      role: "client",
    });
    expect(mockedMigrate).toHaveBeenCalledTimes(1);
  });

  it("creates an identity and upserts it as the active role session", async () => {
    mockedRandomUuid.mockReturnValue("pro-uuid");
    database.getFirstAsync.mockResolvedValue({
      created_at: "2026-08-01T00:00:00.000Z",
      dummy_json_user_id: null,
      identity_id: "pro-uuid",
      role: "pro",
    });

    await expect(sessionRepository.selectRole("pro")).resolves.toMatchObject({
      identityId: "pro-uuid",
      role: "pro",
    });

    expect(database.runAsync).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("INSERT OR IGNORE INTO local_identities"),
      "pro",
      "pro-uuid",
      null,
      expect.any(String),
    );
    expect(database.runAsync).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("ON CONFLICT(singleton) DO UPDATE"),
      "pro",
      "pro-uuid",
      null,
      expect.any(String),
    );
  });

  it("clears only the active session row", async () => {
    await sessionRepository.clear();

    expect(database.runAsync).toHaveBeenCalledWith(
      "DELETE FROM active_session WHERE singleton = 1",
    );
    expect(database.runAsync).not.toHaveBeenCalledWith(
      expect.stringContaining("local_identities"),
    );
  });
});
