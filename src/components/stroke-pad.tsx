import { useEffect, useRef, useState } from "react";

type Props = {
  character: string;
  paths: string[];
  onResult?: (ok: boolean) => void;
};

export function StrokePad({ character, paths, onResult }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const refs = useRef<(SVGPathElement | null)[]>([]);
  const live = useRef<number[]>([]);
  const drawing = useRef(false);
  const pointerId = useRef<number | null>(null);
  const pointerKind = useRef<string>("");
  const [strokes, setStrokes] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [hint, setHint] = useState("ลากด้วยนิ้ว ปากกา หรือเมาส์");
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  useEffect(() => {
    live.current = [];
    drawing.current = false;
    pointerId.current = null;
    stepRef.current = 0;
    setStep(0);
    setStrokes([]);
    setDraft("");
    setHint("ลากเส้นที่ 1 จากจุดที่มีเลข");
  }, [character]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function xy(e: PointerEvent) {
      const r = svg!.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return null;
      return [((e.clientX - r.left) / r.width) * 109, ((e.clientY - r.top) / r.height) * 109] as const;
    }

    function push(x: number, y: number) {
      const prev = live.current;
      if (prev.length >= 2) {
        const lx = prev[prev.length - 2];
        const ly = prev[prev.length - 1];
        if (Math.hypot(x - lx, y - ly) < 0.6) return;
      }
      live.current = [...prev, x, y];
      setDraft(toPath(live.current));
    }

    function down(e: PointerEvent) {
      if (e.pointerType === "touch" && pointerKind.current === "pen") return;
      if (drawing.current && pointerKind.current === "pen" && e.pointerType !== "pen") return;
      if (drawing.current && pointerId.current !== null && e.pointerId !== pointerId.current) return;
      e.preventDefault();
      const p = xy(e);
      if (!p) return;
      try {
        svg!.setPointerCapture(e.pointerId);
      } catch {
        /* pen/finger still draws if the browser refuses capture */
      }
      drawing.current = true;
      pointerId.current = e.pointerId;
      pointerKind.current = e.pointerType;
      live.current = [p[0], p[1]];
      setDraft(toPath(live.current));
    }

    function move(e: PointerEvent) {
      if (!drawing.current || e.pointerId !== pointerId.current) return;
      e.preventDefault();
      const events = e.getCoalescedEvents?.() ?? [e];
      for (const sample of events) {
        const p = xy(sample);
        if (p) push(p[0], p[1]);
      }
    }

    function up(e: PointerEvent) {
      if (e.pointerId !== pointerId.current) return;
      e.preventDefault();
      drawing.current = false;
      pointerId.current = null;
      pointerKind.current = "";
      const pts = live.current;
      live.current = [];
      setDraft("");
      if (pts.length < 4) {
        setHint("เส้นสั้นไป ลากให้ตลอดเส้นนี้");
        return;
      }
      const guide = refs.current[stepRef.current];
      const verdict = judgeStroke(guide, pts);
      if (!verdict.ok) {
        setHint(verdict.msg);
        return;
      }
      const ink = toPath(pts);
      setStrokes((list) => [...list, ink]);
      const next = stepRef.current + 1;
      if (!refs.current[next]) {
        stepRef.current = next;
        setStep(next);
        setHint("ครบทุกเส้นตามลำดับ");
        onResultRef.current?.(true);
      } else {
        stepRef.current = next;
        setStep(next);
        setHint(`ถูกแล้ว ต่อไปเส้น ${next + 1}`);
      }
    }

    const opts = { passive: false } as const;
    svg.addEventListener("pointerdown", down, opts);
    svg.addEventListener("pointermove", move, opts);
    svg.addEventListener("pointerup", up, opts);
    svg.addEventListener("pointercancel", up, opts);
    return () => {
      svg.removeEventListener("pointerdown", down);
      svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerup", up);
      svg.removeEventListener("pointercancel", up);
    };
  }, [character]);

  function samples() {
    const pts: number[][] = [];
    refs.current.forEach((el) => {
      if (!el) return;
      const len = el.getTotalLength();
      const step = Math.max(6, len / 18);
      for (let d = 0; d <= len; d += step) {
        const p = el.getPointAtLength(d);
        pts.push([p.x, p.y]);
      }
    });
    return pts;
  }

  function check() {
    const targets = samples();
    const mine = strokes.flatMap(pathToPoints);
    const hit = targets.filter((t) => mine.some((p) => Math.hypot(p[0] - t[0], p[1] - t[1]) < 14)).length;
    const ok = mine.length > 4 && targets.length > 0 && hit / targets.length >= 0.45;
    setHint(ok ? "เส้นทับตัวอักษรแล้ว" : "ยังไม่ชิดเส้น ลองลากใหม่");
    onResult?.(ok);
  }

  function clear() {
    live.current = [];
    drawing.current = false;
    pointerId.current = null;
    pointerKind.current = "";
    setStrokes([]);
    setDraft("");
    setStep(0);
    stepRef.current = 0;
    setHint("ลากเส้นที่ 1 จากจุดที่มีเลข");
  }

  return (
    <div className="max-w-xs">
      <svg
        ref={svgRef}
        viewBox="0 0 109 109"
        aria-label={character}
        className="aspect-square w-full select-none rounded-3xl bg-card ring-1 ring-line"
        style={{ touchAction: "none" }}
      >
        {paths.map((d, i) => (
          <path
            key={d}
            ref={(el) => {
              refs.current[i] = el;
            }}
            d={d}
            fill="none"
            className={
              i === step
                ? "pointer-events-none stroke-sakura-deep"
                : i < step
                  ? "pointer-events-none stroke-matcha-deep"
                  : "pointer-events-none stroke-line"
            }
            strokeWidth={i === step ? 7 : 5}
            opacity={i > step ? 0.35 : 1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {strokes.map((d) => (
          <path key={d} d={d} fill="none" className="pointer-events-none stroke-sakura-deep" strokeWidth="4" strokeLinecap="round" />
        ))}
        {draft && <path d={draft} fill="none" className="pointer-events-none stroke-sakura-deep" strokeWidth="4" strokeLinecap="round" />}
        {paths.map((d, i) => (
          <text
            key={`n${i}`}
            x={startX(d)}
            y={startY(d)}
            fontSize={i === step ? 11 : 8}
            className={i === step ? "pointer-events-none fill-sakura-deep" : "pointer-events-none fill-ink"}
          >
            {i + 1}
          </text>
        ))}
      </svg>
      <p className="mt-2 text-sm text-muted">{hint}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={check} className="min-h-11 rounded-full bg-sakura px-4 text-sm font-semibold text-card">
          ตรวจเส้น
        </button>
        <button type="button" onClick={clear} className="min-h-11 rounded-full bg-matcha-soft px-4 text-sm font-semibold text-ink">
          ล้าง
        </button>
      </div>
    </div>
  );
}

function judgeStroke(el: SVGPathElement | null | undefined, pts: number[]) {
  if (!el) return { ok: false, msg: "ไม่พบเส้นนี้" };
  const pairs: number[][] = [];
  for (let i = 0; i < pts.length; i += 2) pairs.push([pts[i], pts[i + 1]]);
  const len = el.getTotalLength();
  const start = el.getPointAtLength(0);
  const end = el.getPointAtLength(len);
  const first = pairs[0];
  const last = pairs[pairs.length - 1];
  const dStart = Math.hypot(first[0] - start.x, first[1] - start.y);
  const dEnd = Math.hypot(last[0] - end.x, last[1] - end.y);
  const dReverse = Math.hypot(first[0] - end.x, first[1] - end.y);
  if (dStart > 24) return { ok: false, msg: "เริ่มยังไม่ตรงเลขลำดับเส้น" };
  if (dReverse + 8 < dStart) return { ok: false, msg: "ทิศทางกลับด้าน เริ่มจากเลขลำดับ" };
  if (dEnd > 26) return { ok: false, msg: "ยังไม่ถึงปลายเส้น" };
  let hit = 0;
  let n = 0;
  for (let d = 0; d <= len; d += 7) {
    n += 1;
    const p = el.getPointAtLength(d);
    if (pairs.some((u) => Math.hypot(u[0] - p.x, u[1] - p.y) < 14)) hit += 1;
  }
  if (n === 0 || hit / n < 0.5) return { ok: false, msg: "ยังไม่ชิดเส้นนี้ ลองลากใหม่" };
  return { ok: true, msg: "" };
}

function startX(d: string) {
  const n = d.match(/-?\d+(\.\d+)?/g);
  return n ? Number(n[0]) - 4 : 8;
}
function startY(d: string) {
  const n = d.match(/-?\d+(\.\d+)?/g);
  return n ? Number(n[1]) - 2 : 10;
}

function toPath(flat: number[]) {
  let d = "";
  for (let i = 0; i < flat.length; i += 2) d += `${i === 0 ? "M" : "L"}${flat[i].toFixed(1)} ${flat[i + 1].toFixed(1)} `;
  return d;
}

function pathToPoints(d: string) {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const pts: number[][] = [];
  for (let i = 0; i < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  return pts;
}

export function speakKana(_romaji: string, character: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(character);
  utter.lang = "ja-JP";
  utter.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
