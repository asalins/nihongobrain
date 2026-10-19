# NihongoBrain

เรียนภาษาญี่ปุ่นด้วยภาพ เรื่องราว และสี — «เลิกท่องจำ แล้วสมองจะจำเอง»

Vite + React SPA (TanStack Router, Zustand, Tailwind 4), offline-capable PWA, hosted on Cloudflare Pages.

## Commands

| Command | What it does |
|---|---|
| `npm ci` | install exact dependencies |
| `npm run dev` | dev server on http://localhost:8080 |
| `npm run build` | typecheck + production build into `dist/` (also writes `dist/sw.js`) |
| `npm run preview` | serve `dist/` on http://127.0.0.1:8081 |
| `npm run verify:all` | typecheck, lint, unit tests, build |
| `npm run test:e2e` | regression + offline probes against `npm run preview` (Playwright) |

If Playwright's own browser is not installed, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to a Chromium binary.

## Cloudflare Pages

Build command `npm run build`, output directory `dist`, Node 22. `public/_redirects` gives SPA deep links; `public/_headers` sets security headers and caching.

## Data

Progress is stored in the browser only (`localStorage` keys `nihongo-kana-progress` and `nihongo-brain-progress`). The format is unchanged from the original Grok version.

## Credits and licences

- Stroke data in `src/data/kana-strokes.ts` is adapted from [KanjiVG](https://kanjivg.tagaini.net) © Ulrich Apel, licensed [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/). That file stays under CC BY-SA 3.0.
- Mnemonic images `public/kana/*.jpg` (except `to`) were generated with Grok Imagine; commercial-use terms to be confirmed before sale.

## History

The app was first generated in Grok App Builder. That original snapshot is the git tag `baseline-grok`. Platform files that only worked inside Grok are parked in `_retired-grok/` until the M0 gate approves removing them.
