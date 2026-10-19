import { create } from "zustand";

export type Strength = {
  kana: number;
  vocab: number;
  grammar: number;
  kanji: number;
};

type ProgressState = {
  name: string;
  streak: number;
  xp: number;
  level: number;
  strength: Strength;
  doneWorkouts: string[];
  toggleWorkout: (id: string) => void;
};

const KEY = "nihongo-brain-progress";

function load(): Partial<ProgressState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<ProgressState>) : {};
  } catch {
    return {};
  }
}

export const useProgress = create<ProgressState>((set, get) => ({
  name: "คุณซาลิน",
  streak: 12,
  xp: 2450,
  level: 5,
  strength: { kana: 85, vocab: 62, grammar: 45, kanji: 30 },
  doneWorkouts: [],
  ...load(),
  toggleWorkout: (id) => {
    const cur = get().doneWorkouts;
    const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
    const delta = cur.includes(id) ? -40 : 40;
    const state = { ...get(), doneWorkouts: next, xp: Math.max(0, get().xp + delta) };
    set(state);
    localStorage.setItem(
      KEY,
      JSON.stringify({
        name: state.name,
        streak: state.streak,
        xp: state.xp,
        level: state.level,
        strength: state.strength,
        doneWorkouts: state.doneWorkouts,
      }),
    );
  },
}));
