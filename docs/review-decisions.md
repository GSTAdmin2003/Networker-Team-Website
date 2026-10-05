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
Process note: codex-companion parses `-m` inside a positional prompt as its
model flag — pass prompts with `--prompt-file`.
