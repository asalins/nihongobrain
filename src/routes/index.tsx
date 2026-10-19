import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Palette, BarChart3, Brain } from "lucide-react";
import { Shell, KanaMark } from "@/components/shell";

export const Route = createFileRoute("/")({ component: Home });

const features = [
  {
    title: "ภาพจำ",
    body: "ตัวอักษรกลายเป็นภาพที่สมองเก็บได้ทันที ไม่ต้องท่องซ้ำ",
    icon: Brain,
  },
  {
    title: "เรื่องคันจิ",
    body: "จำคันจิจากเรื่องสั้นที่ผูก radical เข้าด้วยกัน",
    icon: BookOpen,
  },
  {
    title: "ไวยากรณ์สี",
    body: "ประธาน อนุภาค และกริยาแยกสี ให้เห็นแพทเทิร์นชัด",
    icon: Palette,
  },
  {
    title: "ทบทวนอัจฉริยะ",
    body: "ทบทวนตามจังหวะที่กำลังจะลืม ไม่ใช่ท่องทั้งก้อน",
    icon: BarChart3,
  },
];

const quotes = [
  {
    name: "มิ้นท์",
    role: "นักศึกษา",
    text: "เคยท่อง あ い う เป็นปี พอมีภาพจำ ใช้ได้ภายในสองสัปดาห์",
  },
  {
    name: "พีช",
    role: "ทำงานกับบริษัทญี่ปุ่น",
    text: "สีของไวยากรณ์ทำให้โครงสร้างประโยคอ่านออกทันที",
  },
  {
    name: "นานะ",
    role: "เตรียม N3",
    text: "พิมพ์คันจิที่ยาก ได้เรื่องจำกลับมาทันที ใช้ทบทวนได้จริง",
  },
];

function Home() {
  return (
    <Shell>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-card px-3 py-1 text-sm font-medium text-matcha-deep ring-1 ring-line">
            ภาพ · เรื่อง · สี
          </p>
          <h1 className="text-4xl leading-tight text-ink sm:text-6xl">
            เลิกท่องจำ
            <span className="mt-1 block text-sakura-deep">แล้วสมองจะจำเอง</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            เรียนภาษาญี่ปุ่นด้วยการเชื่อมโยงภาพ เรื่องราว และบริบท ไม่ใช่การท่องซ้ำจนลืม
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/brain"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-sakura px-6 font-semibold text-card hover:bg-sakura-deep"
            >
              ทดสอบสไตล์การเรียนรู้ของคุณ
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#features"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-card px-6 font-semibold text-ink ring-1 ring-line hover:bg-matcha-soft"
            >
              ดูวิธีเรียน
            </a>
          </div>
        </div>
        <KanaMark />
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-3xl text-ink">สี่วิธีที่สมองจำได้เอง</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <article key={f.title} className="rounded-3xl bg-card p-5 ring-1 ring-line">
              <span className="grid size-11 place-items-center rounded-2xl bg-matcha-soft text-matcha-deep">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-card py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3">
          {[
            ["1. ผูกภาพ", "ทุกตัวอักษรมีภาพจำของตัวเอง สมองเก็บภาพได้ดีกว่าตาราง"],
            ["2. แยกสี", "เห็นหน้าที่ของคำในประโยคทันทีโดยไม่ต้องแปลทีละคำ"],
            ["3. ทบทวนตรงจุด", "ระบบดึงเฉพาะสิ่งที่กำลังจะลืมกลับมาให้ฝึก"],
          ].map(([t, d]) => (
            <div key={t}>
              <h3 className="text-xl font-semibold text-ink">{t}</h3>
              <p className="mt-2 text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl text-ink">ผู้เรียนพูดถึง</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {quotes.map((q) => (
            <blockquote key={q.name} className="rounded-3xl bg-card p-5 ring-1 ring-line">
              <p className="text-sm text-ink">“{q.text}”</p>
              <footer className="mt-4 text-sm">
                <span className="font-semibold">{q.name}</span>
                <span className="text-muted"> · {q.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-4 mb-10 rounded-3xl bg-sakura px-6 py-12 text-center text-card">
        <h2 className="text-3xl">พร้อมให้สมองจำเองหรือยัง</h2>
        <Link
          to="/brain"
          className="mt-6 inline-flex min-h-12 items-center rounded-full bg-card px-6 font-semibold text-sakura-deep"
        >
          เริ่มจากสมองฉัน
        </Link>
      </section>
    </Shell>
  );
}
