# UI/UX polish — implementation plan

Spec: `docs/superpowers/specs/2026-10-05-ui-ux-polish-design.md`
Branch/worktree: `worktree-feat+ui-ux-polish`

Every task ends green: `npm run typecheck && npm test && npm run lint`.
Commit per task. Tests first where behaviour is unit-testable.

## Task 1 — Housekeeping + data layer (TDD)
- `package.json`: `"typecheck": "next typegen && tsc --noEmit"`.
- `.gitignore`: add `.claude/`.
- `lib/site.ts`: `whatsappUrl(text?: string)` →
  `https://wa.me/995597147210` plus `?text=<encodeURIComponent>` when text
  given (number from existing `contacts.whatsapp`, single source).
  `serviceAnchor(id) = "service-" + id`.
- `lib/i18n/types.ts` additions (all three dictionaries, ka copy written,
  ru/en natural):
  - `hero.ctaPrimary` = "Write on WhatsApp" (label reused by About);
    `hero.ctaSecondary` = "See services"; `hero.panelTitle`;
  - `services.prompt`, `services.askLink`, `services.orCall`,
    `services.orTelegram`;
  - `about.principles`: tuple of 3 `{title, text}` (About's CTA reuses
    `hero.ctaPrimary`; there is no existing `about.cta` to migrate);
  - `contact.primaryTitle`, `contact.secondaryTitle`, `contact.socialLabel`;
  - `actionBar.call`, `actionBar.whatsapp`;
  - `whatsapp.greeting` (general prefill) and `whatsapp.aboutService`
    (prefix, e.g. "Hello! I'm interested in:");
  - `languageNames: Record<Locale,string>` for pill `title`s.
  - `HeaderDictionary` gains `languageNames` only (the action bar is its
    own component, not part of Header). Update `toHeaderDictionary` in the
    same task so Task 1 stays green.
- Tests: whatsappUrl encodes (spaces, Georgian, `&`), no `?text` when
  omitted; dictionaries key-identical (existing test covers new keys);
  principles length 3 in every locale.

## Task 2 — Global polish tokens (globals.css)
- Radius tokens `--radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px`.
- `--action-bar-height: calc(64px + env(safe-area-inset-bottom))`.
- `section[id], [id^="service-"] { scroll-margin-top: calc(var(--header-height) + 16px) }`.
- Heading rules: `h1,h2 { letter-spacing: -0.02em; text-wrap: balance }`.
- Buttons: explicit `transition: transform .2s, opacity .2s, box-shadow .2s,
  background-color .2s, border-color .2s` (no `all`); lift transforms inside
  `@media (prefers-reduced-motion: no-preference)` only.
- `.btn-primary` gets optional leading icon spacing (`display:inline-flex;
  gap:10px; align-items:center`).
- Mobile (≤768): `body { padding-bottom: var(--action-bar-height) }`,
  `html { scroll-padding-bottom: var(--action-bar-height) }`.
- Replace `transition: all` / `var(--transition)` uses in every module CSS
  with explicit property lists; delete the `--transition` token.

## Task 3 — Hero split + quick-contact panel
- `Hero.tsx`: two-column grid (text 7fr / panel 5fr, gap 56px, max 1200).
  Left-aligned text; H1 48px desktop / 34px ≤768. Primary CTA =
  `ExternalLink` to `whatsappUrl(dict.whatsapp.greeting)` with FaWhatsapp;
  secondary `#services`.
- Panel (`<aside aria-labelledby>`): title + three rows (Phone `tel:`,
  WhatsApp, Telegram) each a full-row link: channel icon chip, label, value
  (phone number / "Chat"), chevron; then address line with FaLocationDot.
  White panel, `--radius-lg`, layered shadow, on the dark hero.
- Hero padding tuned so H1 top lands at 0.18–0.30 of 900 px.
- ≤992: single column, panel full width below text.
- Test (RTL): primary CTA href starts `https://wa.me/995597147210?text=`;
  panel contains `tel:` link and Telegram link with rel.

## Task 4 — Services editorial list
- Grid `minmax(260px, 4fr) 8fr`, aside `position: sticky; top: calc(header + 32px)`
  with title, subtitle, prompt, WhatsApp link (general greeting), then
  Call / Telegram text links.
- `<ol>` of rows: each `<li id={serviceAnchor(id)}>` with icon (plain
  green, no tinted square), `<h3>`, description, inline link
  `services.askLink` → `whatsappUrl(`${aboutService} ${title}`)`.
  Hairline `border-top` between rows; hover: row background tint.
- ≤992: one column, aside static.
- Tests: rewrite existing Services tests — 6 rows in order, each id
  `service-<id>`, each ask link's decoded `text` contains the title, all
  external links rel-safe.

## Task 5 — About split + Contact hierarchy
- About: grid 6fr/5fr; left title/subtitle/body + CTA link (WhatsApp,
  label `hero.ctaPrimary`); right `<ul>` of 3 principles (title bold +
  text), separated by hairlines, numbered markers removed. Badge removed.
  `section-title` is left-aligned here (variant class).
- Contact: `primary` grid of 3 tiles (WhatsApp, Telegram, Phone) — whole
  tile is the link, channel-colour icon, label, value. `secondary` panel:
  email `mailto:`, address, and social icon buttons (Viber, Instagram,
  Facebook, LinkedIn) with `aria-label`.
- Tests: Contact has 3 primary tile links (wa.me, t.me, tel:), email
  mailto, 4 social links with accessible names, every `_blank` rel-safe;
  About has 3 principles and a WhatsApp link.

## Task 6 — Navigation: anchors, scroll-spy, language titles
- Mega menu + Footer service links → `#${serviceAnchor(id)}`.
- `lib/useActiveSection.ts` (client hook): keeps a persistent
  `Set` of intersecting ids, updated from **every** entry's
  `isIntersecting` (callbacks only report changes). One `reconcile()`
  decides the active id: (1) if at page bottom (≤2 px from max scroll) →
  `contact`; (2) else the last id of the declared order
  `[hero, services, about, contact]` present in the set; (3) empty set →
  keep the previous value. `reconcile()` runs from the observer callback
  **and** a passive scroll listener, so bottom always takes precedence
  regardless of callback ordering. `rootMargin "-35% 0px -60% 0px"`.
  Pure selection logic lives in an exported `pickActive(set, atBottom,
  prev)` so it's unit-testable without timing.
  Hero section gets `id="top"`? — `main#top` already exists; observe the
  hero `<section id="hero">` instead and map it to `top` (nav "Home").
- Header: active item `aria-current="location"` + `styles.active`
  underline (2px brand-gradient bar under the link, desktop; left bar on
  mobile menu).
- Lang pills: `title={languageNames[l]}`.
- Tests: `pickActive` (later id wins; bottom → contact even when the set
  says otherwise; empty → prev); hook with a mocked IntersectionObserver
  delivering partial-change callbacks (enter services, enter about, leave
  services → about stays); Header renders service anchors; lang titles.

## Task 7 — Mobile action bar
- `components/ActionBar/ActionBar.tsx` (server component, CSS-only
  visibility): fixed bottom, two buttons Call (`tel:`) / WhatsApp
  (`whatsappUrl(greeting)`), `padding-bottom: env(safe-area-inset-bottom)`,
  `display:none` >768.
- Hide while mobile menu open: Header effect adds `data-menu-open` to
  `document.documentElement` only while open and **removes** it on close
  and on unmount; CSS `html[data-menu-open] .bar {display:none}`.
- Rendered in page after Footer. Tests: links correct; Header open →
  attribute present, close → attribute absent, unmount → absent.

## Task 8 — Verify + ship
- lint, typecheck, tests, build; smoke 20/20 on standalone.
- Extend `scripts/screenshots.mjs`: overflow per locale/viewport (existing);
  action bar visible at 375 / `display:none` at 1280; at 375 scrolled to
  bottom, footer's last text bottom ≤ action bar top; scroll-spy: scroll to
  bottom → Contact nav item `aria-current`; goto `#service-cfo` → Services
  active and `#service-cfo h3` top ≥ 85px; H1 ratio 0.18–0.30 for ka/en/ru
  at 1280×900. Existing keyboard/Escape checks kept.
- Look at new screenshots (desktop + mobile, all locales) and fix issues.
- Push branch, PR, merge, `bash deploy.sh` on networker-prod, live smoke
  against https://networkerteam.ge.
