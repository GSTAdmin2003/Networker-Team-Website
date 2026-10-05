# Next.js rebuild — implementation plan

Spec: `docs/superpowers/specs/2026-10-05-nextjs-rebuild-design.md`
Branch/worktree: `worktree-feat+nextjs-rebuild`

Versions: next 16.3.8, react/react-dom 19.3, react-icons 5.7.
Dev deps (installed explicitly in Task 1): typescript, @types/node,
@types/react, @types/react-dom, eslint, eslint-config-next 16.3.8, vitest 5,
@vitejs/plugin-react, jsdom, @testing-library/react,
@testing-library/user-event, @testing-library/jest-dom (setup imports
`@testing-library/jest-dom/vitest`), playwright (uses the already-installed
Chromium; no browser download in CI). Node 22 (matches `node:22-alpine`).

Commit after each task. Every task ends with `npm run typecheck && npm test`
green (from Task 2 on).

## Task 1 — Scaffold

- `package.json` (private, `"type": "module"` not set — Next default), scripts:
  `dev`, `build`, `postbuild` (copies `public/` → `.next/standalone/public`
  and `.next/static` → `.next/standalone/.next/static`, so the standalone
  bundle is always complete), `start` (`node .next/standalone/server.js`), `lint`
  (`eslint .`), `typecheck` (`tsc --noEmit`), `test` (`vitest run`),
  `smoke` (`bash scripts/smoke.sh`).
- `tsconfig.json` (strict, `@/*` path alias), `next.config.ts`
  (`output: 'standalone'`, `poweredByHeader: false`, redirects, rewrites —
  filled in Task 3), `eslint.config.mjs` (flat, `eslint-config-next`),
  `vitest.config.ts` (jsdom, `@vitejs/plugin-react`, `@` alias,
  `setupFiles: vitest.setup.ts` with jest-dom matchers).
- `.gitignore`: `node_modules`, `.next`, `next-env.d.ts`, `STATUS.md`,
  `*.tsbuildinfo`, `test-results`, `screenshots`.
- Move assets: `images/logo main.svg` → `public/images/logo-main.svg`,
  `images/logo2.png` → `public/images/logo2.png`, `images/text main.svg` →
  `public/images/text-main.svg` (`git mv`). Copy `logo2.png` → `app/icon.png`.
- Verify: `npm install` succeeds; `npx tsc --noEmit` on empty app passes.

## Task 2 — i18n data (TDD)

- `lib/i18n/config.ts`: `locales = ['ka','en','ru'] as const`, `Locale`,
  `defaultLocale = 'ka'`, `isLocale()`, `localePath(locale)` (`ka` → `/`,
  else `/${locale}`).
- `lib/site.ts`: phone (`+995597147210`, display `+995 597 14 72 10`),
  email, Telegram/WhatsApp/Viber/Instagram/Facebook/LinkedIn URLs;
  `export const serviceIds = ['company','entrepreneur','virtualZone',
  'accounting','cfo','workPermit'] as const` and
  `export type ServiceId = (typeof serviceIds)[number]` — dictionaries, the
  icon map and render order all consume these; `siteUrl` from
  `NEXT_PUBLIC_SITE_URL` with `http://localhost:3000` fallback.
- `lib/i18n/types.ts`: `Dictionary` type — meta (title, description),
  nav (home, services, about, contact, ourServices), hero (titleBefore,
  titleHighlight, titleAfter, lead, ctaPrimary, ctaSecondary), services
  (title, subtitle, items: Record<ServiceId,{title,description,footerLabel}>),
  about (title, subtitle, body), contact (title, subtitle, address, phone,
  email, labels + CTA text per channel), footer (description, navigation,
  services, contactInfo, rights), a11y (openMenu, closeMenu, toggleServices,
  languages, home).
  Also export `HeaderDictionary = { nav, a11y, serviceTitles:
  Record<ServiceId,string> }` and `toHeaderDictionary(dict)` that builds it
  (serviceTitles from `services.items[id].title`) — the only props Header
  gets besides `locale`.
- `lib/i18n/dictionaries/{ka,en,ru}.ts`: copy from the reference HTML,
  RU address fixed to `Тбилиси, ул. Важа-Пшавела 45`.
  `lib/i18n/index.ts`: `getDictionary(locale)` (sync map — static data).
- Tests first `lib/i18n/__tests__/dictionaries.test.ts`: deep key sets of
  en/ru equal ka; no empty strings; RU address contains no Latin or Georgian
  letters; `localePath`.

## Task 3 — Routing, layout, metadata (TDD where unit-testable)

- `next.config.ts`: redirects (permanent) `/ka`→`/`, `/index.html`→`/`,
  `/index_en.html`→`/en`, `/index_ru.html`→`/ru`; rewrite `/`→`/ka`
  (`beforeFiles`).
- `app/[locale]/layout.tsx` (root layout): `generateStaticParams`,
  `dynamicParams = false`, fonts via `next/font/google` (Inter latin+cyrillic,
  Noto Sans Georgian georgian) as CSS variables, `<html lang>`,
  `globals.css`. Params are a Promise in Next 16 — `await params`; call
  `notFound()` if `!isLocale`.
- `lib/i18n/metadata.ts`: `buildMetadata(locale)` → title, description,
  `metadataBase: new URL(siteUrl)`, canonical `localePath(locale)`,
  languages `{ka:'/', en:'/en', ru:'/ru', 'x-default':'/'}`, openGraph
  (locale `ka_GE`/`en_US`/`ru_RU`, siteName NETWORKER). Unit test it.
- `app/[locale]/page.tsx`: `generateMetadata` → `buildMetadata`; in this
  task it renders an empty `<main>` only. Sections are added to it as they
  are built in Tasks 4–5, so every task stays green.
- 404: `app/[locale]/not-found.tsx` (locale-scoped) plus
  `app/global-not-found.tsx` (complete `<html>/<body>` document, imports
  `globals.css`) for unmatched paths outside any locale — the documented
  pattern for a dynamic `[locale]` root layout. Check the installed
  `node_modules/next/dist/docs` for whether it still needs
  `experimental.globalNotFound` in 16.3 and set it if so. Verify `/xx` and
  `/en/xx` both 404 in Task 7.
- `app/globals.css`: tokens from reference `:root`, reset, body font
  `var(--font-inter), var(--font-georgian), "Segoe UI", sans-serif`,
  `html { scroll-behavior: smooth }` inside
  `@media (prefers-reduced-motion: no-preference)`, `section[id]
  { scroll-margin-top: 85px }`, shared `.container`, buttons, section title
  utility classes (kept global since reused by every section).

## Task 4 — Static sections

Each a server component + `*.module.css` ported 1:1 from `style.css`
(same values, same breakpoints 992/768):
- `components/Hero`, `components/Services` (icon map
  `ServiceId → react-icons/fa6`: FaBuilding, FaUserTie, FaLaptopCode,
  FaCalculator, FaChartLine, FaPassport), `components/About` (FaQuoteLeft
  badge), `components/Contact` (FaLocationDot, FaPhone, FaEnvelope,
  FaTelegram, FaWhatsapp, FaViber, FaInstagram, FaFacebookF, FaLinkedinIn;
  per-brand colour classes), `components/Footer`.
- `components/ExternalLink.tsx`: `<a target="_blank" rel="noopener
  noreferrer">` — every external link uses it.
- Icons get `aria-hidden`.
- Tests: Contact — every `target=_blank` anchor has the rel; phone `tel:`,
  email `mailto:`; renders 9 cards. Services renders 6 cards in id order.

## Task 5 — Header (client) (TDD)

- `components/Header/Header.tsx` (`'use client'`), props
  `{ locale, dict: HeaderDictionary }` built server-side with
  `toHeaderDictionary` in the page.
- State: `menuOpen`, `servicesOpen`, `megaDismissed`. Toggle `<button
  aria-controls="mainNav" aria-expanded aria-label>` swaps FaBars/FaXmark.
  Escape (document keydown) closes the mobile menu and services disclosure
  and sets `megaDismissed`. Clicking any nav link closes the menu and sets
  `megaDismissed`.
- Services: desktop = link `#services` + mega menu shown on `:hover` and
  `:focus-within` (CSS) **unless** the item has the `dismissed` class
  (`megaDismissed`). `megaDismissed` resets on `pointerleave` of the item
  and on focus leaving it (`onBlur` with `relatedTarget` outside), so the next
  fresh hover/focus opens it again. Mobile (≤992px) = separate disclosure
  `<button aria-expanded>` next to the link that toggles `servicesOpen`.
- Mobile-menu link click also scrolls normally (native anchor), no JS scroll.
- Page now composes Header + all sections.
- Lang switch: `<Link href={localePath(l)} aria-current>`; logo link to
  `localePath(locale)` + `#` top.
- Tests: toggle aria-expanded true/false, Escape closes, clicking a nav link
  closes, lang links hrefs `/`, `/en`, `/ru` and `aria-current` on current.

## Task 6 — Hosting

- Replace `Dockerfile` with 3-stage node:22-alpine (deps `npm ci` → builder
  with `ARG NEXT_PUBLIC_SITE_URL` → runner non-root, copies `public`,
  `.next/standalone`, `.next/static`), `EXPOSE 3000`, `CMD node server.js`.
- `.dockerignore`: node_modules, .next, .git, docs, STATUS.md, screenshots.
- `docker-compose.yml`: build arg `NEXT_PUBLIC_SITE_URL:
  ${NEXT_PUBLIC_SITE_URL:?...}`, `expose: 3000`, alias, `crm_default`.
  `.env.example` with `NEXT_PUBLIC_SITE_URL=https://team.example.com`.
- `deploy.sh`: require `.env`; `--env-file .env`; in-container wget loop
  grepping `NETWORKER`, `exit 1` on failure.
- `deploy/Caddyfile.snippet` → port 3000. Delete `deploy/nginx.conf`.
- Delete reference `index.html`, `index_en.html`, `index_ru.html`,
  `style.css`, `script.js`. Rewrite `README.md` (dev, test, deploy).

## Task 7 — Verify

- `npm run lint && npm run typecheck && npm test && npm run build`.
- `scripts/smoke.sh BASE` (curl; asserts listed in spec). Run against
  standalone (copy `public` + `.next/static` into `.next/standalone`, start
  on a free port) and against `docker build` + `docker run -p` image.
- Reference reconstruction: `git archive upstream/main` extracted whole
  (original paths, incl. `images/logo main.svg`) into the scratchpad, served
  by a static server. Mapping: `/`↔`index.html`, `/en`↔`index_en.html`,
  `/ru`↔`index_ru.html`.
- `scripts/screenshots.mjs` (Playwright dev dep, `chromium.launch()` with
  the cached browser): new site and reference — `/`, `/en`, `/ru` at
  1280/375, desktop mega menu hovered, mobile menu expanded. Inspect side by
  side. On every new-site shot assert `scrollWidth <= innerWidth`.
- Browser behaviour checks in the same script: Tab into Services opens the
  mega menu; Escape with focus still inside hides it (computed
  `visibility: hidden`); `/ka` and `/index_en.html` redirect.
