import { beforeEach, describe, expect, it, vi } from "vitest";

const KEY = "nihongo-kana-progress";

// Minimal browser storage for the node test environment.
function installStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  const storage = {
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, String(v)),
    removeItem: (k: string) => void data.delete(k),
    clear: () => data.clear(),
  };
  vi.stubGlobal("localStorage", storage);
  vi.stubGlobal("window", { localStorage: storage });
  return data;
}

async function loadStore() {
  vi.resetModules();
  const mod = await import("@/lib/kana-progress");
  return mod.useKanaProgress;
}

describe("kana progress storage (data contract unchanged in M0)", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("reads progress saved by the baseline app", async () => {
    installStorage({
      [KEY]: JSON.stringify({ seen: ["a", "i"], scores: { "1-1": 80 }, parts: {}, missed: [] }),
    });
    const store = await loadStore();
    expect(store.getState().seen).toEqual(["a", "i"]);
    expect(store.getState().scores["1-1"]).toBe(80);
  });

  it("starts empty when nothing or garbage is stored", async () => {
    installStorage({ [KEY]: "{not json" });
    const store = await loadStore();
    expect(store.getState().seen).toEqual([]);
    expect(store.getState().scores).toEqual({});
  });

  it("keeps the best score, never lowers it", async () => {
    const data = installStorage();
    const store = await loadStore();
    store.getState().saveScore("1-1", 70);
    store.getState().saveScore("1-1", 40);
    expect(store.getState().scores["1-1"]).toBe(70);
    expect(JSON.parse(data.get(KEY)!).scores["1-1"]).toBe(70);
  });

  it("markSeen persists and does not duplicate", async () => {
    const data = installStorage();
    const store = await loadStore();
    store.getState().markSeen("a");
    store.getState().markSeen("a");
    expect(JSON.parse(data.get(KEY)!).seen).toEqual(["a"]);
  });

  it("preserves fields it does not know about", async () => {
    const data = installStorage({ [KEY]: JSON.stringify({ seen: [], scores: {}, futureField: 42 }) });
    const store = await loadStore();
    store.getState().markSeen("u");
    expect(JSON.parse(data.get(KEY)!).futureField).toBe(42);
  });

  it("unlocks the next group at 60%, not 59%", async () => {
    installStorage({ [KEY]: JSON.stringify({ seen: [], scores: { "1-1": 59 } }) });
    let store = await loadStore();
    expect(store.getState().groupStatus("1-2")).toBe("locked");
    installStorage({ [KEY]: JSON.stringify({ seen: [], scores: { "1-1": 60 } }) });
    store = await loadStore();
    expect(store.getState().groupStatus("1-2")).toBe("open");
    expect(store.getState().groupStatus("1-1")).toBe("open");
  });

  it("group progress counts seen lessons plus one for practice", async () => {
    installStorage({ [KEY]: JSON.stringify({ seen: ["a"], scores: {} }) });
    const store = await loadStore();
    expect(store.getState().groupProgress("1-1")).toBe(17);
  });
});
