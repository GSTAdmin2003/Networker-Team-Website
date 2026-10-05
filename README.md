# Networker Team Website

Marketing site for Networker Business Consulting — **https://networkerteam.ge**.
Next.js 16 (App Router) + React 19 + TypeScript, in Georgian (`/`), English
(`/en`) and Russian (`/ru`).

Rebuilt from the original static site
([Kal-El89/networker](https://github.com/Kal-El89/networker), kept as the
`upstream` git remote) with the same content and design.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
```

| Command | What it does |
|---|---|
| `npm test` | Vitest + Testing Library unit tests |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |
| `npm run build` | production build (`output: 'standalone'`, assets copied by `postbuild`) |
| `npm start` | run the standalone build (`PORT=3000`) |
| `npm run smoke -- <url> [origin]` | HTTP smoke test of a running instance |
| `npm run screenshots` | Playwright screenshots + browser checks (see `scripts/screenshots.mjs`) |

## Content

All copy lives in `lib/i18n/dictionaries/{ka,en,ru}.ts`, typed by
`lib/i18n/types.ts` — a key missing from one language is a type error.
Phone, email and social links are in `lib/site.ts`.

## Structure

- `app/[locale]/` — root layout (`<html lang>`), the single page, locale 404
- `app/global-not-found.tsx` — 404 for paths outside any locale
- `components/` — `Header` (the only client component), `Hero`, `Services`,
  `About`, `Contact`, `Footer`; styles are CSS Modules next to each component
- `next.config.ts` — `/` serves Georgian; `/ka` and the old `index*.html`
  URLs redirect

## Deploy

Runs on the Hetzner box (`networker-prod`) as its own compose project in
`/opt/networker-team-website`, behind the CRM's Caddy on the `crm_default`
network — same setup as `Networker CRM Website`.

```bash
# on the server, first time
git clone <repo> /opt/networker-team-website
cd /opt/networker-team-website
cp .env.example .env            # NEXT_PUBLIC_SITE_URL=https://networkerteam.ge
bash deploy.sh                  # pull, build, start, health check
```

Then append `deploy/Caddyfile.snippet` to `/opt/crm/deploy/Caddyfile.hetzner`
and reload Caddy. DNS: `networkerteam.ge` and `www` are **DNS-only** (grey
cloud) A records to the box so Caddy can issue the certificates.

Later updates: `bash deploy.sh` on the server.
