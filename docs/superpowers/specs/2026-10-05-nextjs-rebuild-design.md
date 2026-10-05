# Networker Team Website — Next.js rebuild

Date: 2026-10-05
Status: Draft (sparring)

## Goal

Rebuild the static Networker site (reference: `index.html`, `index_en.html`,
`index_ru.html`, `style.css`, `script.js` — mirrored from
`https://kal-el89.github.io/networker/`) as a proper React + Next.js (App Router,
TypeScript) app. Same content, same visual identity, same three languages —
with the reference's defects fixed. It replaces the nginx static container
committed in `8304c8f`, and keeps the same hosting shape (own compose project
on the Hetzner box, behind the CRM's Caddy on `crm_default`).

## Non-goals

- No redesign. Layout, colours, spacing and copy stay as the reference.
- No CMS, contact form, analytics or backend. Content lives in typed
  dictionaries in the repo.
- No deploy to production in this change (needs domain + repo from the user).

## Stack

- Next.js 16 (App Router), React 19, TypeScript strict.
- Styling: CSS Modules per component + one `globals.css` for tokens/reset.
  Rationale: a faithful port of the existing hand-written CSS; no class-name
  translation layer (Tailwind) that could drift visually.
- Icons: `react-icons` (Font Awesome 6 set `react-icons/fa6`) rendered as
  inline SVG — removes the cdnjs Font Awesome stylesheet entirely.
- Fonts: `next/font/google` — `Noto Sans Georgian` (Georgian) + `Inter`
  (latin, cyrillic), self-hosted at build time. Reference used the system
  `Segoe UI` stack, which renders Georgian with fallback glyphs on non-Windows.
  **This is the one allowed visual deviation from "no redesign"**: font
  metrics may change line wrapping and card heights. Acceptance is "no
  overflow, clipping or broken layout at 375 and 1280 px", not pixel-identical
  wrapping; sizes, weights, colours and spacing values stay as the reference.
- Output: `output: 'standalone'`, run with `node server.js` in Docker — same
  pattern as `Networker CRM Website`.
- Tests: Vitest + React Testing Library (jsdom). Lint: ESLint (next config).

## Routing & i18n

- Locales: `ka` (default), `en`, `ru`.
- `app/[locale]/layout.tsx` is the root layout; sets `<html lang>` per locale.
  `generateStaticParams` returns the three locales; `dynamicParams = false`
  so unknown locales 404. All pages are statically prerendered.
- URLs: `/` → Georgian (rewrite `/` → `/ka`), `/en`, `/ru`. `/ka` redirects
  (308) to `/` so there is one canonical Georgian URL.
- Legacy URLs redirect permanently: `/index.html` → `/`,
  `/index_en.html` → `/en`, `/index_ru.html` → `/ru`.
- Language switcher: plain `<Link>`s (the reference's 200 ms delayed
  `location.href` hack is dropped). Active pill gets `aria-current="page"`.
- Metadata per locale: `title`, `description`, `alternates.canonical`,
  `alternates.languages` (hreflang ka/en/ru/x-default), Open Graph basics.
  All absolute URLs derive from one origin, `NEXT_PUBLIC_SITE_URL`
  (`metadataBase`), passed as a Docker build arg since pages are prerendered.
  Default when unset: `http://localhost:3000` (dev/test). The real domain must
  be set before production deploy (`docker-compose.yml` requires it).
  Georgian canonical and `ka`/`x-default` hreflang point to `/`, never `/ka`.
- Dictionaries: `lib/i18n/dictionaries/{ka,en,ru}.ts`, each typed as
  `Dictionary` so a missing key is a type error. Locale-independent data
  (phone numbers, social URLs, service icon keys) lives once in
  `lib/site.ts`.

## Page structure (single page per locale, same order as reference)

Components in `components/`:

| Component | Client? | Notes |
|---|---|---|
| `Header` | yes | sticky header, logo, nav, mega menu, lang switch, socials, mobile toggle |
| `Hero` | no | h1 with gradient span, two CTA buttons |
| `Services` | no | 6 cards, data-driven |
| `About` | no | quote badge uses an icon element instead of the FA `::before` glyph |
| `Contact` | no | 9 cards: address, phone, email, Telegram, WhatsApp, Viber, Instagram, Facebook, LinkedIn |
| `Footer` | no | brand, nav, services, contact info, copyright |

Only `Header` ships client JS.

## Fixes vs. reference

1. Russian address: `Тбилиси, ул. Важа-Пшавела 45` everywhere (reference
   mixed Latin and Georgian script).
2. External `target="_blank"` links get `rel="noopener noreferrer"`.
3. Mega menu reachable by keyboard: opens on `:hover` **and**
   `:focus-within`; on mobile it is a `<button aria-expanded>` disclosure.
4. Mobile menu toggle is a `<button>` with `aria-label`, `aria-expanded`,
   `aria-controls`; Escape closes the menu; following a nav link closes it.
5. Anchor jumps: `scroll-behavior: smooth` (disabled under
   `prefers-reduced-motion`) and `scroll-margin-top: 85px` on sections so the
   sticky header doesn't cover headings. Replaces the JS scroll handler.
6. Email rendered as `mailto:`, footer phone as `tel:`.
7. Logo `<img>` gets a real alt (`Networker`), explicit width/height (no CLS).
8. Mixed-language `<title>` replaced by per-locale titles.
9. Icons/fonts no longer depend on a third-party CDN at runtime.

## Assets

`public/images/logo-main.svg` (renamed — no space), `logo2.png`,
`text-main.svg` kept. Favicon generated from `logo2.png` via `app/icon.png`.
`logo main.svg` is an SVG wrapping a base64 JPEG (~56 KB); kept as-is for
fidelity, served with `next/image` `unoptimized` (SVG).

## Hosting

- `Dockerfile`: 3-stage node:22-alpine build (deps → build → standalone
  runner, non-root), as in `Networker CRM Website`. Listens on 3000.
- `docker-compose.yml`: unchanged shape, `expose: 3000`, alias
  `networker-team-website` on external `crm_default`.
- `deploy/Caddyfile.snippet`: `reverse_proxy networker-team-website:3000`.
- `deploy.sh`: health check runs **inside the web container**
  (`docker compose exec -T web wget -qO- http://localhost:3000/`) and must
  both succeed and contain `NETWORKER`, so an unrelated host service can't
  satisfy it. Exits non-zero if it never passes within the retry window.
- Old static files (`index*.html`, `style.css`, `script.js`, `images/`,
  `deploy/nginx.conf`) are removed from the root; the reference stays
  reachable in git history and as `upstream/main`. Copied to
  `reference/` ? — **no**: keep the tree clean; history is enough.

## Testing / acceptance

- Unit (Vitest + RTL):
  - every dictionary has identical key structure (runtime deep-key compare,
    on top of the type check);
  - `Header`: toggle sets `aria-expanded`, Escape closes, link click closes;
    lang switch marks the current locale active and links to `/`, `/en`, `/ru`;
  - `Contact`: all external links carry `rel="noopener noreferrer"`;
    phone/email are `tel:`/`mailto:`.
- `npm run lint`, `tsc --noEmit`, `npm run build` all clean.
- Smoke (script `scripts/smoke.sh <base-url>`), run twice: against the
  standalone artifact (`node .next/standalone/server.js` with `public/` and
  `.next/static` copied in, exactly as the runner image does) and against the
  final Docker image. Checks: `/`, `/en`, `/ru` → 200 with correct `lang` and
  canonical; `/ka` → 308 `/`; `/index_en.html` → 308 `/en`; `/xx` → 404;
  `/images/logo-main.svg` and a `/_next/static/` CSS file → 200.
- Visual: headless-browser screenshots of `/`, `/en`, `/ru` at 1280 and
  375 px, plus desktop mega menu open and mobile menu expanded, compared by
  eye with the matching reference page. Pass = no overflow/clipping/broken
  layout and same visual hierarchy (see Fonts deviation).
