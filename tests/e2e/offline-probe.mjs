// PWA probe: manifest + icons reachable, service worker installs, app works offline after first visit.
// usage: node tests/e2e/offline-probe.mjs <baseUrl>   (run against a production build)
import { chromium } from "playwright";

const BASE = process.argv[2] ?? "http://127.0.0.1:8081";
const browser = await chromium.launch(
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {},
);
const results = [];
const rec = (id, ok, detail = "") => {
  results.push({ id, ok });
  console.log(`${ok ? "PASS" : "FAIL"} ${id} ${detail}`);
};

const ctx = await browser.newContext({ viewport: { width: 360, height: 780 }, hasTouch: true });
const page = await ctx.newPage();
const logs = [];
page.on("console", (m) => logs.push(`${m.type()}: ${m.text()}`));
page.on("pageerror", (e) => logs.push(`pageerror: ${e.message}`));
page.on("requestfailed", (r) => logs.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`));

// Manifest and icons
const manifestRes = await page.request.get(BASE + "/manifest.webmanifest");
const manifest = manifestRes.ok() ? await manifestRes.json() : null;
rec("PWA-manifest", !!manifest && manifest.display === "standalone" && manifest.start_url === "/", `status=${manifestRes.status()}`);
for (const icon of manifest?.icons ?? []) {
  const r = await page.request.get(BASE + icon.src);
  rec(`PWA-icon ${icon.src}`, r.ok() && (r.headers()["content-type"] ?? "").includes("image/png"));
}

// Service worker takes control
await page.goto(BASE + "/");
const swReady = await page.evaluate(() =>
  Promise.race([navigator.serviceWorker.ready.then(() => true), new Promise((r) => setTimeout(() => r(false), 10000))]),
);
rec("PWA-sw-installed", swReady);
await page.reload();
const controlled = await page.evaluate(() => !!navigator.serviceWorker.controller);
rec("PWA-sw-controls-page", controlled);

// Seed progress so group 1.2 is unlocked, then go offline
await page.evaluate(() =>
  localStorage.setItem("nihongo-kana-progress", JSON.stringify({ seen: [], scores: { "1-1": 100 }, parts: {}, missed: [] })),
);
await ctx.setOffline(true);

for (const path of ["/", "/journey/kana-palace", "/journey/kana-palace/lesson/a", "/journey/kana-palace/lesson/ka", "/journey/kana-palace/practice/1-1", "/brain"]) {
  let ok = false;
  let detail = "";
  try {
    await page.goto(BASE + path, { waitUntil: "load", timeout: 15000 });
    await page.waitForSelector("h1", { timeout: 5000 });
    const h1 = await page.locator("h1").first().innerText();
    const imgs = await page.locator("img").evaluateAll((els) => els.map((e) => e.complete && e.naturalWidth > 0));
    ok = h1.length > 0 && imgs.every(Boolean);
    detail = `h1="${h1.slice(0, 30)}" images=${imgs.length} allLoaded=${imgs.every(Boolean)}`;
  } catch (e) {
    detail = String(e).slice(0, 120) + ` | body="${(await page.locator("body").innerText().catch(() => "")).slice(0, 60)}" | logs=${logs.slice(-6).join(" ; ")}`;
  }
  rec(`OFFLINE ${path}`, ok, detail);
}

await browser.close();
const fails = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - fails} pass, ${fails} fail`);
process.exit(fails ? 1 : 0);
