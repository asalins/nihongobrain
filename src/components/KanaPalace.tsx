import { Link } from "@tanstack/react-router";
import { Check, Lock, Unlock } from "lucide-react";
import { JourneyLayout } from "@/components/JourneyLayout";
import { kanaGroups } from "@/data/kana";
import { useKanaProgress } from "@/lib/kana-progress";

export function KanaPalace() {
  const statusOf = useKanaProgress((s) => s.groupStatus);
  const progressOf = useKanaProgress((s) => s.groupProgress);

  return (
    <JourneyLayout title="Kana Palace" crumb="">
      <p className="max-w-xl text-muted">
        จำฮิรางานะจากภาพ ไม่ใช่จากตาราง บทถัดไปจะปลดเมื่อฝึกบทก่อนได้ตั้งแต่ 60%
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {kanaGroups.map((g) => {
          const status = statusOf(g.id);
          const progress = progressOf(g.id);
          return (
            <article key={g.id} className="rounded-3xl bg-card p-5 ring-1 ring-line">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-matcha-deep">{g.code}</p>
                  <h2 className="mt-1 text-xl font-semibold">{g.title}</h2>
                  <p className="mt-1 text-lg tracking-wide">{g.characters}</p>
                </div>
                <StatusIcon status={status} />
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-matcha-soft">
                <div className="h-full bg-matcha-deep" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted">{progress}%</p>
              {status === "locked" ? (
                <p className="mt-4 text-sm text-muted">ปลดเมื่อผ่านบทก่อน</p>
              ) : (
                <Link
                  to="/journey/kana-palace/lesson/$id"
                  params={{ id: g.firstId }}
                  className="mt-4 inline-flex min-h-11 items-center rounded-full bg-sakura px-4 text-sm font-semibold text-card"
                >
                  {progress > 0 ? "เรียนต่อ" : "เริ่มเรียน"}
                </Link>
              )}
            </article>
          );
        })}
      </div>
    </JourneyLayout>
  );
}

function StatusIcon({ status }: { status: "done" | "open" | "locked" }) {
  if (status === "done") {
    return (
      <span className="grid size-9 place-items-center rounded-full bg-matcha-soft text-matcha-deep">
        <Check className="size-4" />
      </span>
    );
  }
  if (status === "locked") {
    return (
      <span className="grid size-9 place-items-center rounded-full bg-paper text-muted">
        <Lock className="size-4" />
      </span>
    );
  }
  return (
    <span className="grid size-9 place-items-center rounded-full bg-sakura-soft text-sakura-deep">
      <Unlock className="size-4" />
    </span>
  );
}
