// Regression probe: runs the same behaviour checks against any build (baseline or M0).
// usage: node baseline-probe.mjs <baseUrl> <outDir>
import { chromium } from "playwright";
import fs from "fs";
import crypto from "crypto";

const BASE = process.argv[2] ?? "http://127.0.0.1:8080";
const OUT = process.argv[3] ?? "./out";
fs.mkdirSync(OUT, { recursive: true });
const KEY = "nihongo-kana-progress";
const results = [];
const rec = (id, ok, detail = "") => {
  results.push({ id, result: ok ? "PASS" : "FAIL", detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${id} ${detail}`);
};
const hash = (s) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);

const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {},
);
const consoleErrors = [];

async function newPage(vp) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: vp.width < 500 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => consoleErrors.push(`${vp.width}: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(`${vp.width}: ${m.text()}`));
  return { ctx, page };
}
const store = (page) => page.evaluate((k) => JSON.parse(localStorage.getItem(k) || "null"), KEY);
const settle = (page) => page.waitForLoadState("networkidle").catch(() => {});

// Draw every stroke of the StrokePad by tracing its guide paths.
async function traceAllStrokes(page) {
  const svg = page.locator("svg[viewBox='0 0 109 109']").first();
  await svg.scrollIntoViewIfNeeded();
  for (let i = 0; ; i++) {
    const pts = await page.evaluate(() => {
      const svg = document.querySelector("svg[viewBox='0 0 109 109']");
      const guides = [...svg.querySelectorAll("path")].filter((p) => p.getAttribute("stroke-width") === "7");
      const el = guides[0];
      if (!el) return null;
      const r = svg.getBoundingClientRect();
      const len = el.getTotalLength();
      const out = [];
      for (let d = 0; d <= len; d += 2) {
        const p = el.getPointAtLength(d);
        out.push([r.left + (p.x / 109) * r.width, r.top + (p.y / 109) * r.height]);
      }
      const e = el.getPointAtLength(len);
      out.push([r.left + (e.x / 109) * r.width, r.top + (e.y / 109) * r.height]);
      return out;
    });
    if (!pts) return i;
    await page.mouse.move(pts[0][0], pts[0][1]);
    await page.mouse.down();
    for (const [x, y] of pts.slice(1)) await page.mouse.move(x, y);
    await page.mouse.up();
    await page.waitForTimeout(60);
    if (i > 8) return -1;
  }
}

// ---------- 1. Route render + screenshots ----------
const routes = [
  ["home", "/"],
  ["brain", "/brain"],
  ["palace", "/journey/kana-palace"],
  ["lesson-a", "/journey/kana-palace/lesson/a"],
  ["practice-1-1", "/journey/kana-palace/practice/1-1"],
];
const textHashes = {};
for (const vp of [{ width: 360, height: 780 }, { width: 1280, height: 800 }]) {
  const { ctx, page } = await newPage(vp);
  for (const [name, path] of routes) {
    const res = await page.goto(BASE + path);
    await settle(page);
    const text = (await page.locator("body").innerText()).replace(/\s+/g, " ").trim();
    textHashes[`${name}@${vp.width}`] = { hash: hash(text), len: text.length, prefix: text.slice(0, 80) };
    await page.screenshot({ path: `${OUT}/${name}-${vp.width}.png`, fullPage: true });
    const hScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    rec(`R-${name}@${vp.width}`, res.status() === 200 && text.length > 50 && !hScroll, `status=${res.status()} len=${text.length} hScroll=${hScroll}`);
  }
  await ctx.close();
}

// ---------- 2. Content: 20 lessons render ----------
{
  const { ctx, page } = await newPage({ width: 1280, height: 800 });
  const ids = ["a","i","u","e","o","ka","ki","ku","ke","ko","sa","shi","su","se","so","ta","chi","tsu","te","to"];
  // unlock everything via stored scores so locked groups don't hide lessons
  await page.goto(BASE + "/");
  await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ seen: [], scores: { "1-1": 100, "1-2": 100, "1-3": 100, "1-4": 100 }, parts: {}, missed: [] })), KEY);
  let ok = 0; const lessonInfo = {};
  for (const id of ids) {
    await page.goto(`${BASE}/journey/kana-palace/lesson/${id}`);
    await settle(page);
    const strokes = await page.locator("svg[viewBox='0 0 109 109'] path[stroke-width]").count();
    const img = await page.locator("img").first().getAttribute("src").catch(() => null);
    const h1 = await page.locator("h1").first().innerText().catch(() => "");
    lessonInfo[id] = { strokes, img, h1 };
    if (strokes > 0 && h1) ok++;
  }
  rec("C-20-lessons-render", ok === 20, `${ok}/20`);
  fs.writeFileSync(`${OUT}/lessons.json`, JSON.stringify(lessonInfo, null, 1));
  await ctx.close();
}

// ---------- 3. Storage: seen persists across refresh and back ----------
{
  const { ctx, page } = await newPage({ width: 360, height: 780 });
  await page.goto(BASE + "/journey/kana-palace");
  await page.evaluate((k) => localStorage.removeItem(k), KEY);
  await page.reload(); await settle(page);
  await page.goto(BASE + "/journey/kana-palace/lesson/a"); await settle(page);
  let s = await store(page);
  rec("S-seen-written", !!s && s.seen.includes("a"), JSON.stringify(s));
  await page.reload(); await settle(page);
  s = await store(page);
  rec("S-seen-after-refresh", !!s && s.seen.includes("a"));
  await page.goBack(); await settle(page);
  const url = page.url();
  const progressText = await page.locator("body").innerText();
  rec("S-back-navigation", url.endsWith("/journey/kana-palace") && /\d+%/.test(progressText), url);
  // progress for 1-1 should reflect one seen item: round(1/6*100)=17
  rec("S-progress-reflects-seen", progressText.includes("17%"), "expects 17% for 1 of 5 seen + not practiced");
  await ctx.close();
}

// ---------- 4. Unlock rule (60%) ----------
{
  const { ctx, page } = await newPage({ width: 1280, height: 800 });
  await page.goto(BASE + "/");
  await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ seen: [], scores: { "1-1": 59 }, parts: {}, missed: [] })), KEY);
  await page.goto(BASE + "/journey/kana-palace/lesson/ka"); await settle(page);
  const locked59 = (await page.locator("h1").first().innerText()).includes("ยังไม่ปลดล็อก");
  await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ seen: [], scores: { "1-1": 60 }, parts: {}, missed: [] })), KEY);
  await page.reload(); await settle(page);
  const open60 = !(await page.locator("h1").first().innerText()).includes("ยังไม่ปลดล็อก");
  rec("U-locked-at-59", locked59);
  rec("U-unlocked-at-60", open60);
  // stored data with unknown extra field must survive a write
  await page.evaluate((k) => localStorage.setItem(k, JSON.stringify({ seen: [], scores: { "1-1": 60 }, parts: {}, missed: [], futureField: 42 })), KEY);
  await page.reload(); await settle(page);
  await page.goto(BASE + "/journey/kana-palace/lesson/i"); await settle(page);
  const s = await store(page);
  rec("S-unknown-field-preserved", s?.futureField === 42 && s.seen.includes("i"));
  await ctx.close();
}

// ---------- 5. Practice 1-1 all-correct → 100% + score saved ----------
for (const vp of [{ width: 360, height: 780 }, { width: 1280, height: 800 }]) {
  const { ctx, page } = await newPage(vp);
  await page.goto(BASE + "/");
  await page.evaluate((k) => localStorage.removeItem(k), KEY);
  await page.goto(BASE + "/journey/kana-palace/practice/1-1"); await settle(page);
  const romaji = { "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o" };
  const order = ["a", "i", "u", "e", "o"];
  let writeOk = 0;
  for (let q = 0; q < 15; q++) {
    const h2 = await page.locator("h2").first().innerText();
    const cur = order[Math.floor(q / 3)];
    if (h2.includes("เสียง")) {
      await page.getByRole("button", { name: cur, exact: true }).click();
    } else if (h2.includes("ภาพ")) {
      const ch = Object.keys(romaji).find((k) => romaji[k] === cur);
      await page.getByRole("button", { name: ch, exact: true }).click();
    } else if (h2.includes("เขียน")) {
      const n = await traceAllStrokes(page);
      if (n > 0) writeOk++;
    }
    await page.waitForTimeout(900);
  }
  const body = await page.locator("body").innerText();
  const s = await store(page);
  rec(`P-practice-100@${vp.width}`, body.includes("100%") && s?.scores?.["1-1"] === 100, `writeTraced=${writeOk}/5 stored=${s?.scores?.["1-1"]}`);
  await page.screenshot({ path: `${OUT}/practice-done-${vp.width}.png`, fullPage: true });
  await ctx.close();
}

// ---------- 6. Wrong stroke direction rejected ----------
{
  const { ctx, page } = await newPage({ width: 1280, height: 800 });
  await page.goto(BASE + "/journey/kana-palace/lesson/a"); await settle(page);
  const pts = await page.evaluate(() => {
    const svg = document.querySelector("svg[viewBox='0 0 109 109']");
    const el = [...svg.querySelectorAll("path")].find((p) => p.getAttribute("stroke-width") === "7");
    const r = svg.getBoundingClientRect(); const len = el.getTotalLength(); const out = [];
    for (let d = len; d >= 0; d -= 2) { const p = el.getPointAtLength(d); out.push([r.left + (p.x / 109) * r.width, r.top + (p.y / 109) * r.height]); }
    return out;
  });
  await page.mouse.move(...pts[0]); await page.mouse.down();
  for (const p of pts.slice(1)) await page.mouse.move(...p);
  await page.mouse.up();
  const hint = await page.locator("svg[viewBox='0 0 109 109'] + p").innerText();
  rec("W-reverse-stroke-rejected", !hint.startsWith("ถูกแล้ว"), hint);
  await ctx.close();
}

// ---------- 7. D1 probe: "ตรวจเส้น" passes without stroke order? (documents known bug) ----------
{
  const { ctx, page } = await newPage({ width: 1280, height: 800 });
  await page.goto(BASE + "/journey/kana-palace/lesson/a"); await settle(page);
  await page.getByRole("button", { name: "ตรวจเส้น" }).click();
  const hint = await page.locator("svg[viewBox='0 0 109 109'] + p").innerText();
  results.push({ id: "D1-probe-check-empty", result: "INFO", detail: hint });
  console.log("INFO D1 check with no strokes →", hint);
  await ctx.close();
}

// The sandbox blocks outbound requests (Google Fonts); those are environment-only, not app errors.
const envOnly = consoleErrors.filter((e) => e.includes("ERR_TUNNEL_CONNECTION_FAILED"));
const appErrors = consoleErrors.filter((e) => !e.includes("ERR_TUNNEL_CONNECTION_FAILED"));
rec("E-no-app-console-errors", appErrors.length === 0, `app=${appErrors.length} envBlocked=${envOnly.length} ${appErrors.slice(0, 3).join(" | ")}`);
fs.writeFileSync(`${OUT}/results.json`, JSON.stringify({ base: BASE, at: new Date().toISOString(), results, textHashes, consoleErrors }, null, 1));
await browser.close();
const fails = results.filter((r) => r.result === "FAIL").length;
console.log(`\n${results.filter((r) => r.result === "PASS").length} pass, ${fails} fail`);
