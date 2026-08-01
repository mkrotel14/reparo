import * as Crypto from "expo-crypto";

import { getJobsDatabase } from "@/features/jobs/data/jobs-database";
import { jobsRepository } from "@/features/jobs/data/jobs-repository.native";

jest.mock("expo-crypto", () => ({ randomUUID: jest.fn() }));
jest.mock("@/features/jobs/data/jobs-database", () => ({
  getJobsDatabase: jest.fn(),
}));

const database = { getAllAsync: jest.fn(), runAsync: jest.fn() };
const mockedGetDatabase = jest.mocked(getJobsDatabase);
const mockedUuid = jest.mocked(Crypto.randomUUID);

describe("native jobs repository", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedGetDatabase.mockResolvedValue(database as never);
    database.runAsync.mockResolvedValue({ changes: 1, lastInsertRowId: 1 });
  });

  it("maps persisted rows and creates a Client-owned open job", async () => {
    database.getAllAsync.mockResolvedValue([
      {
        budget: 120,
        client_id: "client-id",
        created_at: "2026-08-01T00:00:00.000Z",
        description: "",
        id: "job-1",
        location: "Centro",
        pro_id: null,
        status: "open",
        title: "Fix door",
        updated_at: "2026-08-01T00:00:00.000Z",
      },
    ]);
    mockedUuid.mockReturnValue("new-job");

    await expect(jobsRepository.list()).resolves.toMatchObject([
      { id: "job-1", clientId: "client-id", status: "open" },
    ]);
    await expect(
      jobsRepository.create({ clientId: "client-id", title: "Fix tap" }),
    ).resolves.toMatchObject({
      id: "new-job",
      clientId: "client-id",
      status: "open",
    });
  });

  it("rejects invalid claim and completion transitions", async () => {
    database.runAsync.mockResolvedValue({ changes: 0, lastInsertRowId: 0 });

    await expect(jobsRepository.claim("job-1", "pro-id")).rejects.toThrow(
      "Only open jobs can be claimed",
    );
    await expect(jobsRepository.complete("job-1", "pro-id")).rejects.toThrow(
      "Only the assigned Pro can complete this job",
    );
  });
});
