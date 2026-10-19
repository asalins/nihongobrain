import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { JourneyLayout } from "@/components/JourneyLayout";
import { StrokePad, speakKana } from "@/components/stroke-pad";
import { kanaStrokePaths } from "@/data/kana-strokes";
import { getKana, neighbors } from "@/data/kana";
import { useKanaProgress } from "@/lib/kana-progress";

export function KanaLesson({ id }: { id: string }) {
  const lesson = getKana(id);
  const markSeen = useKanaProgress((s) => s.markSeen);
  const statusOf = useKanaProgress((s) => s.groupStatus);

  useEffect(() => {
    if (lesson && statusOf(lesson.groupId) !== "locked") markSeen(lesson.id);
  }, [lesson, markSeen, statusOf]);

  if (!lesson) {
    return (
      <JourneyLayout title="ไม่พบบทเรียน" crumb="">
        <Link to="/journey/kana-palace" className="text-sakura-deep">
          กลับหน้าโมดูล
        </Link>
      </JourneyLayout>
    );
  }

  if (statusOf(lesson.groupId) === "locked") {
    return (
      <JourneyLayout title="ยังไม่ปลดล็อก" crumb={lesson.character}>
        <p className="text-muted">ฝึกบทก่อนให้ได้อย่างน้อย 60% ก่อน</p>
        <Link to="/journey/kana-palace" className="mt-4 inline-flex min-h-11 items-center text-sakura-deep">
          กลับไปเลือกบท
        </Link>
      </JourneyLayout>
    );
  }

  const { prev, next } = neighbors(lesson.id);

  return (
    <JourneyLayout title={lesson.title} crumb={`${lesson.groupCode} ${lesson.character}`}>
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="rounded-3xl bg-card p-6 ring-1 ring-line">
          <p className="text-7xl leading-none text-ink">{lesson.character}</p>
          <p className="mt-2 text-lg text-muted">{lesson.romaji}</p>
          <button
            type="button"
            onClick={() => speakKana(lesson.romaji, lesson.character)}
            className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-matcha-soft px-4 text-sm font-semibold text-ink"
          >
            <Volume2 className="size-4" />
            ฟังเสียง
          </button>
          <div className="mt-6 overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
            {lesson.mnemonicImage ? (
              <img src={lesson.mnemonicImage} alt="" className="aspect-square w-full object-cover" />
            ) : (
              <div className="grid aspect-square place-items-center bg-matcha-soft text-7xl text-matcha-deep">
                {lesson.character}
              </div>
            )}
          </div>
          <p className="mt-4 text-ink">{lesson.mnemonic}</p>
          <ul className="mt-4 space-y-2">
            {lesson.exampleWords.map((w) => (
              <li key={w.japanese} className="flex items-baseline justify-between gap-3 rounded-2xl bg-paper px-3 py-2">
                <span className="text-lg">{w.japanese}</span>
                <span className="text-sm text-muted">
                  {w.romaji} · {w.thai}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">ลำดับเส้น</h2>
          <div className="mt-3">
            <StrokePad key={lesson.id} character={lesson.character} paths={kanaStrokePaths[lesson.id] ?? []} />
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        {prev && statusOf(prev.groupId) !== "locked" ? (
          <Link
            to="/journey/kana-palace/lesson/$id"
            params={{ id: prev.id }}
            className="inline-flex min-h-11 items-center rounded-full bg-card px-5 font-semibold ring-1 ring-line"
          >
            ก่อนหน้า
          </Link>
        ) : null}
        <Link
          to="/journey/kana-palace/practice/$id"
          params={{ id: lesson.groupId }}
          className="inline-flex min-h-11 items-center rounded-full bg-matcha-deep px-5 font-semibold text-card"
        >
          ฝึกบทนี้
        </Link>
        {next && statusOf(next.groupId) !== "locked" ? (
          <Link
            to="/journey/kana-palace/lesson/$id"
            params={{ id: next.id }}
            className="inline-flex min-h-11 items-center rounded-full bg-sakura px-5 font-semibold text-card"
          >
            ถัดไป
          </Link>
        ) : null}
      </div>
    </JourneyLayout>
  );
}
