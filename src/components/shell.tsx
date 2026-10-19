import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Brain, BookOpen, Flame, Home, UserRound } from "lucide-react";
import { useProgress } from "@/lib/progress";

const links = [
  { to: "/", label: "หน้าแรก", icon: Home },
  { to: "/journey/kana-palace", label: "เรียน", icon: BookOpen },
  { to: "/brain", label: "สมองฉัน", icon: UserRound },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const streak = useProgress((s) => s.streak);
  const landing = path === "/";

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <header
        className={
          landing
            ? "sticky top-0 z-40 border-b border-line/60 bg-matcha-soft/80 backdrop-blur-md"
            : "sticky top-0 z-40 border-b border-line bg-card/90 backdrop-blur-md"
        }
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-10 place-items-center rounded-2xl bg-sakura text-card">
              <Brain className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-base font-semibold text-ink">NihongoBrain</span>
              <span className="hidden text-xs text-muted sm:block">เลิกท่องจำ แล้วสมองจะจำเอง</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={
                  path === l.to || (l.to !== "/" && path.startsWith(l.to))
                    ? "rounded-full bg-sakura px-4 py-2 text-sm font-semibold text-card"
                    : "rounded-full px-4 py-2 text-sm font-medium text-ink hover:bg-matcha-soft"
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {!landing && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sakura-soft px-3 py-1.5 text-sm font-semibold text-sakura-deep">
                <Flame className="size-4" />
                {streak}
              </span>
            )}
            <Link
              to="/brain"
              className="inline-flex min-h-11 items-center rounded-full bg-sakura px-4 text-sm font-semibold text-card hover:bg-sakura-deep"
            >
              เรียนต่อ
            </Link>
          </div>
        </div>
      </header>
      {children}
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-card md:hidden">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={
                path === l.to || (l.to !== "/" && path.startsWith(l.to))
                  ? "flex min-h-16 flex-col items-center justify-center gap-1 text-sakura-deep"
                  : "flex min-h-16 flex-col items-center justify-center gap-1 text-muted"
              }
            >
              <Icon className="size-5" />
              <span className="text-xs font-medium">{l.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function KanaMark() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      <div className="absolute inset-6 rounded-full bg-card shadow-[0_20px_50px_-24px_rgba(28,43,36,0.45)] ring-1 ring-line" />
      <div className="absolute inset-6 grid place-items-center">
        <Brain className="size-28 text-matcha-deep" strokeWidth={1.25} />
      </div>
      {[
        { c: "あ", x: "4%", y: "18%" },
        { c: "日", x: "72%", y: "6%" },
        { c: "本", x: "78%", y: "58%" },
        { c: "語", x: "2%", y: "62%" },
        { c: "学", x: "38%", y: "0%" },
      ].map((p) => (
        <span
          key={p.c}
          className="absolute grid size-14 place-items-center rounded-2xl bg-sakura text-2xl font-semibold text-card shadow-md"
          style={{ left: p.x, top: p.y }}
        >
          {p.c}
        </span>
      ))}
      <span className="sr-only">สมองประกอบด้วยตัวอักษรญี่ปุ่น</span>
    </div>
  );
}
