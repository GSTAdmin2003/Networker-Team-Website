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

## 2026-10-05 — ui-ux-polish spec review
Accepted: one-tap contact everywhere made explicit (header buttons >768 px,
action bar ≤768 px, About CTA); deterministic scroll-spy rule; anchor offset
+ menu close; action-bar DOM/a11y/focus semantics; headline measurement.
Partly accepted: WhatsApp fallback — Call/Telegram shown beside the services
WhatsApp prompt; rejected the manual "with/without WhatsApp app installed"
check: not executable in this environment and `wa.me` already falls back to
WhatsApp Web.
Rejected: native-review gate before merge/deploy — no reviewer can be
assigned inside an autonomous run; the handful of new ka/ru strings are
flagged to the user in the final report instead, and are trivially editable
in the dictionaries.

## 2026-10-05 — ui-ux-polish plan review
All 5 findings accepted: (about.cta wording — no such field exists, clarified),
persistent intersecting-set + single reconcile() with bottom precedence and a
pure pickActive(), HeaderDictionary producer updated in the same task (and
trimmed to languageNames), data-menu-open removed on close/unmount with test.
