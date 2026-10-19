import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Trophy, BookOpen, AlertTriangle, Clock } from "lucide-react";
import { Shell } from "@/components/shell";
import { useProgress, type Strength } from "@/lib/progress";

export const Route = createFileRoute("/brain")({ component: BrainPage });

const labels: Record<keyof Strength, string> = {
  kana: "คานะ",
  vocab: "คำศัพท์",
  grammar: "ไวยากรณ์",
  kanji: "คันจิ",
};

const bar: Record<keyof Strength, string> = {
  kana: "bg-matcha-deep",
  vocab: "bg-matcha",
  grammar: "bg-sakura",
  kanji: "bg-sakura-deep",
};

const workouts = [
  { id: "w1", title: "ทบทวน あ い う え お", minutes: 5, xp: 50 },
  { id: "w2", title: "คำศัพท์ร้านอาหาร 10 คำ", minutes: 8, xp: 80 },
  { id: "w3", title: "ฝึกใช้ は ในประโยค", minutes: 10, xp: 100 },
];

function BrainPage() {
  const p = useProgress();
  const weak = (Object.keys(p.strength) as (keyof Strength)[])
    .filter((k) => p.strength[k] < 60)
    .sort((a, b) => p.strength[a] - p.strength[b]);

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-sm text-muted">หน้าแรก / สมองฉัน</p>
        <section className="mt-3 rounded-3xl bg-matcha-deep p-6 text-card sm:p-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-matcha-soft">ยินดีต้อนรับกลับ</p>
              <h1 className="mt-1 text-3xl">{p.name}</h1>
              <p className="mt-1 text-sm text-matcha-soft">
                ระดับ {p.level} · {p.xp.toLocaleString()} XP
              </p>
            </div>
            <div className="flex gap-3">
              <Stat icon={<Flame className="size-5" />} value={p.streak} label="วันติด" />
              <Stat icon={<Trophy className="size-5" />} value={p.level} label="ระดับ" />
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-3xl bg-card p-6 ring-1 ring-line">
              <h2 className="text-lg font-semibold">ความแข็งแรงของความจำ</h2>
              <ul className="mt-5 space-y-4">
                {(Object.keys(p.strength) as (keyof Strength)[]).map((k) => (
                  <li key={k}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium">{labels[k]}</span>
                      <span className="text-muted">{p.strength[k]}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-matcha-soft">
                      <div className={`h-full rounded-full ${bar[k]}`} style={{ width: `${p.strength[k]}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl bg-card p-6 ring-1 ring-line">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <BookOpen className="size-5 text-sakura-deep" />
                เรียนต่อ
              </h2>
              <div className="mt-4 flex flex-col gap-4 rounded-2xl bg-sakura-soft p-4 sm:flex-row sm:items-center">
                <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-sakura text-xl font-semibold text-card">
                  あ
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-sakura-deep">Kana Palace</p>
                  <p className="font-semibold">สระ あ い う え お</p>
                  <p className="text-sm text-muted">ひらがな · บท 1.1</p>
                </div>
                <Link
                  to="/journey/kana-palace/lesson/$id"
                  params={{ id: "a" }}
                  className="inline-flex min-h-11 items-center rounded-full bg-sakura px-5 text-sm font-semibold text-card hover:bg-sakura-deep"
                >
                  เรียนต่อ
                </Link>
              </div>
            </section>

            <section className="rounded-3xl bg-card p-6 ring-1 ring-line">
              <h2 className="text-lg font-semibold">ฝึกวันนี้</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {workouts.map((w) => {
                  const done = p.doneWorkouts.includes(w.id);
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => p.toggleWorkout(w.id)}
                      className={
                        done
                          ? "rounded-2xl bg-matcha-soft p-4 text-left ring-1 ring-matcha"
                          : "rounded-2xl bg-paper p-4 text-left ring-1 ring-line hover:ring-sakura"
                      }
                    >
                      <p className="text-sm font-semibold">{w.title}</p>
                      <p className="mt-2 flex items-center gap-1 text-xs text-muted">
                        <Clock className="size-3" />
                        {w.minutes} นาที · +{w.xp} XP
                      </p>
                      <p className="mt-2 text-xs font-semibold text-matcha-deep">
                        {done ? "ทำแล้ว" : "แตะเพื่อทำเครื่องหมาย"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <section className="rounded-3xl bg-card p-6 ring-1 ring-line">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <AlertTriangle className="size-5 text-sakura-deep" />
              จุดที่ควรทบทวน
            </h2>
            <ul className="mt-4 space-y-3">
              {weak.map((k) => (
                <li key={k} className="flex items-center gap-3 rounded-2xl bg-sakura-soft p-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-sakura text-sm font-semibold text-card">
                    {p.strength[k]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{labels[k]}</p>
                    <p className="text-xs text-muted">ยังไม่ถึง 60%</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </Shell>
  );
}

function Stat({ icon, value, label }: { icon: ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-matcha px-4 py-3 text-ink">
      {icon}
      <div>
        <p className="text-xl font-semibold leading-none">{value}</p>
        <p className="text-xs">{label}</p>
      </div>
    </div>
  );
}
