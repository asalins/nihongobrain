import { create } from "zustand";
import { kanaGroups, kanaLessons } from "@/data/kana";

type Parts = { sound: number; picture: number; write: number };

type State = {
  seen: string[];
  scores: Record<string, number>;
  parts: Record<string, Parts>;
  missed: string[];
  markSeen: (id: string) => void;
  saveScore: (groupId: string, score: number) => void;
  saveBreakdown: (groupId: string, parts: Parts, missedIds: string[]) => void;
  groupStatus: (groupId: string) => "done" | "open" | "locked";
  groupProgress: (groupId: string) => number;
};

const KEY = "nihongo-kana-progress";

function read(): Pick<State, "seen" | "scores" | "parts" | "missed"> {
  if (typeof window === "undefined") return { seen: [], scores: {}, parts: {}, missed: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { seen: [], scores: {}, parts: {}, missed: [] };
    const data = JSON.parse(raw) as {
      seen?: string[];
      scores?: Record<string, number>;
      parts?: Record<string, Parts>;
      missed?: string[];
    };
    return {
      seen: data.seen ?? [],
      scores: data.scores ?? {},
      parts: data.parts ?? {},
      missed: data.missed ?? [],
    };
  } catch {
    return { seen: [], scores: {}, parts: {}, missed: [] };
  }
}

function write(patch: Partial<Pick<State, "seen" | "scores" | "parts" | "missed">>) {
  let prev: Record<string, unknown> = {};
  try {
    prev = JSON.parse(localStorage.getItem(KEY) || "{}") as Record<string, unknown>;
  } catch {
    prev = {};
  }
  localStorage.setItem(KEY, JSON.stringify({ ...prev, ...patch }));
}

export const useKanaProgress = create<State>((set, get) => ({
  ...read(),
  markSeen: (id) => {
    const seen = get().seen.includes(id) ? get().seen : [...get().seen, id];
    set({ seen });
    write({ seen, scores: get().scores, parts: get().parts, missed: get().missed });
  },
  saveScore: (groupId, score) => {
    const scores = { ...get().scores, [groupId]: Math.max(get().scores[groupId] ?? 0, score) };
    set({ scores });
    write({ seen: get().seen, scores, parts: get().parts, missed: get().missed });
  },
  saveBreakdown: (groupId, nextParts, missedIds) => {
    const overall = Math.round((nextParts.sound + nextParts.picture + nextParts.write) / 3);
    const scores = { ...get().scores, [groupId]: Math.max(get().scores[groupId] ?? 0, overall) };
    const parts = { ...get().parts, [groupId]: nextParts };
    const missed = Array.from(new Set([...get().missed.filter((id) => !id.startsWith(`${groupId}:`)), ...missedIds]));
    set({ scores, parts, missed });
    write({ seen: get().seen, scores, parts, missed });
  },
  groupStatus: (groupId) => {
    const index = kanaGroups.findIndex((g) => g.id === groupId);
    const passedPrev = index === 0 || (get().scores[kanaGroups[index - 1].id] ?? 0) >= 60;
    if (!passedPrev) return "locked";
    const items = kanaLessons.filter((k) => k.groupId === groupId);
    const allSeen = items.every((k) => get().seen.includes(k.id));
    const passed = (get().scores[groupId] ?? 0) >= 60;
    return allSeen && passed ? "done" : "open";
  },
  groupProgress: (groupId) => {
    const items = kanaLessons.filter((k) => k.groupId === groupId);
    if (!items.length) return 0;
    const seen = items.filter((k) => get().seen.includes(k.id)).length;
    const practiced = (get().scores[groupId] ?? 0) > 0 ? 1 : 0;
    return Math.round(((seen + practiced) / (items.length + 1)) * 100);
  },
}));
