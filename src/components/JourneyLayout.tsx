import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Check, Lock, Unlock } from "lucide-react";
import { Shell } from "@/components/shell";
import { kanaGroups, kanaLessons } from "@/data/kana";
import { useKanaProgress } from "@/lib/kana-progress";

export function JourneyLayout({
  title,
  crumb,
  children,
}: {
  title: string;
  crumb: string;
  children: ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const statusOf = useKanaProgress((s) => s.groupStatus);
  const progressOf = useKanaProgress((s) => s.groupProgress);
  const seen = useKanaProgress((s) => s.seen);
  const doneGroups = kanaGroups.filter((g) => statusOf(g.id) === "done").length;

  return (
    <Shell>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-3xl bg-card p-4 ring-1 ring-line lg:sticky lg:top-20 lg:self-start">
          <p className="text-xs font-semibold text-muted">Kana Palace</p>
          <p className="mt-1 text-sm font-semibold text-ink">
            {doneGroups}/{kanaGroups.length} บทผ่านแล้ว
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-matcha-soft">
            <div className="h-full bg-matcha-deep" style={{ width: `${(doneGroups / kanaGroups.length) * 100}%` }} />
          </div>
          <nav className="mt-4 space-y-4">
            {kanaGroups.map((g) => {
              const status = statusOf(g.id);
              return (
                <div key={g.id}>
                  <p className="text-xs font-semibold text-matcha-deep">
                    {g.code} {g.title}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {g.lessons.map((lesson) => {
                      const href = `/journey/kana-palace/lesson/${lesson.id}`;
                      const on = path.endsWith(`/lesson/${lesson.id}`);
                      const locked = status === "locked";
                      return (
                        <li key={lesson.id}>
                          {locked ? (
                            <span className="flex items-center gap-2 rounded-xl px-2 py-2 text-sm text-muted">
                              <Lock className="size-3.5" />
                              {lesson.character}
                            </span>
                          ) : (
                            <Link
                              to="/journey/kana-palace/lesson/$id"
                              params={{ id: lesson.id }}
                              className={
                                on
                                  ? "flex items-center gap-2 rounded-xl bg-sakura-soft px-2 py-2 text-sm font-semibold text-sakura-deep"
                                  : "flex items-center gap-2 rounded-xl px-2 py-2 text-sm hover:bg-matcha-soft"
                              }
                            >
                              {seen.includes(lesson.id) ? (
                                <Check className="size-3.5 text-matcha-deep" />
                              ) : (
                                <Unlock className="size-3.5" />
                              )}
                              {lesson.character}
                              <span className="text-muted">{lesson.romaji}</span>
                            </Link>
                          )}
                          <span className="sr-only">{href}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-1 text-xs text-muted">{progressOf(g.id)}%</p>
                </div>
              );
            })}
          </nav>
        </aside>
        <div>
          <p className="text-sm text-muted">
            <Link to="/" className="hover:text-sakura-deep">
              หน้าแรก
            </Link>
            {" / "}
            <Link to="/journey/kana-palace" className="hover:text-sakura-deep">
              Kana Palace
            </Link>
            {crumb ? ` / ${crumb}` : ""}
          </p>
          <h1 className="mt-2 text-3xl text-ink">{title}</h1>
          <div className="mt-5">{children}</div>
        </div>
      </div>
      <span className="sr-only">{kanaLessons.length}</span>
    </Shell>
  );
}
