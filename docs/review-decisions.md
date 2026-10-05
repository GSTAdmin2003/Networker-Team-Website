# Review decisions

Findings from Codex review gates that were rejected, with reason.

## 2026-10-05 — nextjs-rebuild spec review
All 5 findings accepted and applied (health check in-container, font
deviation made explicit, visual check for all locales + menus, smoke against
standalone + Docker, configurable site origin). None rejected.

## 2026-10-05 — nextjs-rebuild plan review
All 8 findings accepted and applied (task ordering / incremental page
composition, global-not-found for [locale] root layout, explicit dev deps,
exported serviceIds/ServiceId, HeaderDictionary, Escape dismisses desktop
mega menu, Playwright + full reference extraction, postbuild asset copy for
standalone). None rejected.
Deploy note: the spec's health check used `http://localhost:3000/`; inside
node:22-alpine, busybox wget resolves localhost to ::1 while Next binds
0.0.0.0 (IPv4) → connection refused. Changed to 127.0.0.1 (found on first
prod deploy, site itself was healthy).
Process note: codex-companion parses `-m` inside a positional prompt as its
model flag — pass prompts with `--prompt-file`.
