import { sessionRepository } from "@/features/session/data/session-repository.web";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();

  get length() {
    return this.values.size;
  }
  clear() {
    this.values.clear();
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

describe("web session repository", () => {
  const storage = new MemoryStorage();

  beforeEach(() => {
    storage.clear();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: storage,
    });
    Object.defineProperty(globalThis, "crypto", {
      configurable: true,
      value: { randomUUID: jest.fn().mockReturnValue("local-uuid") },
    });
  });

  it("creates a stable role identity and restores the active session", async () => {
    const firstSession = await sessionRepository.selectRole("client");
    const secondSession = await sessionRepository.selectRole("client");

    expect(firstSession.identityId).toBe("local-uuid");
    expect(secondSession.identityId).toBe(firstSession.identityId);
    expect(secondSession.dummyJsonUserId).toBe(1);
    await expect(sessionRepository.restore()).resolves.toEqual(secondSession);
  });

  it("clears only the active session and preserves unrelated local data", async () => {
    storage.setItem("reparo.jobs", JSON.stringify([{ id: "job-1" }]));
    await sessionRepository.selectRole("pro");

    await sessionRepository.clear();

    await expect(sessionRepository.restore()).resolves.toBeNull();
    expect(storage.getItem("reparo.identity.pro")).not.toBeNull();
    expect(storage.getItem("reparo.jobs")).toBe(
      JSON.stringify([{ id: "job-1" }]),
    );
  });
});
