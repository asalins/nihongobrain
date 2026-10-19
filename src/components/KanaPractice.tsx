import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { JourneyLayout } from "@/components/JourneyLayout";
import { StrokePad } from "@/components/stroke-pad";
import { kanaLessons } from "@/data/kana";
import { kanaStrokePaths } from "@/data/kana-strokes";
import { useKanaProgress } from "@/lib/kana-progress";

type Step = { kind: "sound" | "picture" | "write"; id: string };

export function KanaPractice({ id }: { id: string }) {
  const items = kanaLessons.filter((k) => k.groupId === id);
  const saveScore = useKanaProgress((s) => s.saveScore);
  const statusOf = useKanaProgress((s) => s.groupStatus);
  const steps = useMemo<Step[]>(() => {
    const list: Step[] = [];
    for (const item of items) {
      list.push({ kind: "sound", id: item.id }, { kind: "picture", id: item.id }, { kind: "write", id: item.id });
    }
    return list;
  }, [items]);
  const [cursor, setCursor] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!items.length) {
    return (
      <JourneyLayout title="ไม่พบแบบฝึก" crumb="">
        <Link to="/journey/kana-palace">กลับ</Link>
      </JourneyLayout>
    );
  }

  if (statusOf(id) === "locked") {
    return (
      <JourneyLayout title="ยังไม่ปลดล็อก" crumb="ฝึก">
        <Link to="/journey/kana-palace" className="text-sakura-deep">
          กลับไปเลือกบท
        </Link>
      </JourneyLayout>
    );
  }

  const step = steps[cursor];
  const lesson = items.find((k) => k.id === step?.id) ?? items[0];
  const score = steps.length ? Math.round((correct / steps.length) * 100) : 0;

  function finish(nextCorrect: number) {
    const finalScore = Math.round((nextCorrect / steps.length) * 100);
    saveScore(id, finalScore);
    setDone(true);
  }

  function answer(ok: boolean) {
    const nextCorrect = correct + (ok ? 1 : 0);
    setCorrect(nextCorrect);
    setPicked(ok ? "yes" : "no");
    window.setTimeout(() => {
      setPicked(null);
      if (cursor + 1 >= steps.length) finish(nextCorrect);
      else setCursor((c) => c + 1);
    }, 700);
  }

  function restart() {
    setCursor(0);
    setCorrect(0);
    setPicked(null);
    setDone(false);
  }

  const options = items.map((k) => k.romaji).sort();
  const pictureOptions = [...items].sort((a, b) => a.character.localeCompare(b.character));

  return (
    <JourneyLayout title={`ฝึก ${items[0].groupCode}`} crumb="แบบฝึก">
      {done ? (
        <div className="rounded-3xl bg-card p-6 ring-1 ring-line">
          <p className="text-sm text-muted">คะแนน</p>
          <p className="text-5xl text-ink">{score}%</p>
          <p className="mt-2 text-muted">{score >= 60 ? "ผ่านแล้ว บทถัดไปปลดล็อก" : "ยังไม่ถึง 60% ลองอีกครั้ง"}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={restart} className="min-h-11 rounded-full bg-sakura px-5 font-semibold text-card">
              ทบทวนอีกครั้ง
            </button>
            <Link to="/journey/kana-palace" className="inline-flex min-h-11 items-center rounded-full bg-matcha-soft px-5 font-semibold">
              กลับโมดูล
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl bg-card p-6 ring-1 ring-line">
          <p className="text-sm text-muted">
            ข้อ {cursor + 1}/{steps.length}
            {picked === "yes" ? " · ถูก" : picked === "no" ? " · ยังไม่ถูก" : ""}
          </p>
          {step.kind === "sound" && (
            <div>
              <h2 className="mt-2 text-2xl font-semibold">เสียงของตัวนี้คืออะไร</h2>
              <p className="mt-4 text-7xl">{lesson.character}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {options.map((romaji) => (
                  <button
                    key={romaji}
                    type="button"
                    disabled={picked !== null}
                    onClick={() => answer(romaji === lesson.romaji)}
                    className="min-h-11 rounded-full bg-paper px-4 font-semibold ring-1 ring-line"
                  >
                    {romaji}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step.kind === "picture" && (
            <div>
              <h2 className="mt-2 text-2xl font-semibold">ภาพนี้คือตัวไหน</h2>
              <div className="mt-4 overflow-hidden rounded-3xl bg-matcha-soft">
                {lesson.mnemonicImage ? (
                  <img src={lesson.mnemonicImage} alt="" className="aspect-video w-full object-cover" />
                ) : (
                  <p className="p-6 text-ink">{lesson.mnemonic}</p>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {pictureOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    disabled={picked !== null}
                    onClick={() => answer(opt.id === lesson.id)}
                    className="grid size-14 place-items-center rounded-2xl bg-paper text-2xl ring-1 ring-line"
                  >
                    {opt.character}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step.kind === "write" && (
            <div>
              <h2 className="mt-2 text-2xl font-semibold">เขียน {lesson.character}</h2>
              <p className="text-muted">{lesson.romaji}</p>
              <div className="mt-4">
                <StrokePad
                  key={lesson.id + cursor}
                  character={lesson.character}
                  paths={kanaStrokePaths[lesson.id] ?? []}
                  onResult={(ok) => answer(ok)}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </JourneyLayout>
  );
}
