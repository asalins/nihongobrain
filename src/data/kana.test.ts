import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { kanaGroups, kanaLessons } from "@/data/kana";
import { kanaStrokePaths } from "@/data/kana-strokes";

// Standard hiragana stroke counts (KanjiVG): the stroke checker relies on these.
const STROKES: Record<string, number> = {
  a: 3, i: 2, u: 2, e: 2, o: 3,
  ka: 3, ki: 4, ku: 1, ke: 3, ko: 2,
  sa: 3, shi: 1, su: 2, se: 3, so: 1,
  ta: 4, chi: 2, tsu: 1, te: 1, to: 2,
};

describe("kana lesson data (must match baseline-grok)", () => {
  it("has 20 lessons in 4 groups of 5", () => {
    expect(kanaLessons).toHaveLength(20);
    expect(kanaGroups.map((g) => [g.id, g.lessons.length])).toEqual([
      ["1-1", 5], ["1-2", 5], ["1-3", 5], ["1-4", 5],
    ]);
  });

  it("every lesson has stroke paths with the correct stroke count", () => {
    for (const k of kanaLessons) {
      expect(kanaStrokePaths[k.id], k.id).toBeDefined();
      expect(kanaStrokePaths[k.id].length, k.id).toBe(STROKES[k.id]);
    }
  });

  it("every referenced mnemonic image exists in public/", () => {
    for (const k of kanaLessons.filter((l) => l.mnemonicImage)) {
      expect(existsSync(`public${k.mnemonicImage}`), k.mnemonicImage).toBe(true);
    }
  });

  it("each lesson has a romaji, a mnemonic and example words", () => {
    for (const k of kanaLessons) {
      expect(k.romaji, k.id).toBeTruthy();
      expect(k.mnemonic, k.id).toBeTruthy();
      expect(k.exampleWords.length, k.id).toBeGreaterThan(0);
    }
  });
});
