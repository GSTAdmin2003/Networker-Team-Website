# Networker site — UI/UX improvement

Date: 2026-10-05
Status: Draft (sparring)

## Problem

The site is a faithful port of a generic template. It reads as one: a
centred hero with a vague "Learn more", a uniform 3×2 icon-card grid of
services, a lone quote box for "About", and nine identical contact cards.
Worse for the business, the single thing a visitor should do — **start a
conversation** (WhatsApp / Telegram / phone) — is two scrolls and one
indirect hop away (hero CTA → `#contact` → pick a card). The services mega
menu has six links that all go to the same `#services` anchor.

## Goal

One conversion action — **message or call us** — reachable in one tap from
every section, with a layout that no longer reads as a template. Same brand
(colours, logo, fonts), same three languages, same single page.

**Craft Read:** *Sales-led accounting/consulting landing for Georgian SMEs,
founders and foreign IT entrepreneurs, marketing language, existing brand
tokens (navy + blue→green brand gradient), variance 7, signature bet:
channel-specific CTAs — "Write on WhatsApp", prefilled with the service the
visitor is looking at.*

Knobs: CRAFT 7, MOTION 5 (hover + one restrained header/scroll behaviour, no
scroll-reveal choreography), DENSITY 5.

## Non-goals

- No new photography, illustration, testimonials, client logos or metrics —
  none exist that are real, and invented proof is worse than none.
- No contact form or backend.
- No rebrand: colour tokens, logo, fonts, copy tone stay.
- No change to routing, i18n structure, hosting or metadata.

## Changes

### 1. Hero — split, conversion-first
- Left: H1 (unchanged copy, tighter tracking, `text-wrap: balance`), lead,
  CTAs. Primary CTA = **"Write on WhatsApp"** (WhatsApp icon) opening
  `wa.me` with a locale-specific prefilled greeting. Secondary = **"See
  services"** (`#services`) replacing "Learn more".
- Right: a **quick-contact panel** — a real component, not a mock: phone
  (`tel:`), WhatsApp, Telegram rows, each one tap, plus the address line.
  On ≤992 px it stacks below the text, full width.
- Headline position: H1 bounding-box top ÷ viewport height, measured on
  initial load (scroll 0) at 1280×900, must be 0.18–0.30 in ka, en and ru.

**One tap everywhere** is met by: the sticky header's WhatsApp/Telegram
buttons (always visible >768 px), the mobile action bar (≤768 px), plus
in-section CTAs in Hero, Services, About and Contact.

### 2. Services — editorial list instead of the icon-card grid
- Two columns on desktop: left column (sticky within the section): title,
  subtitle, short prompt "Not sure which one you need? Ask us." with
  WhatsApp as the main link and Call / Telegram as alternatives right below
  it (fallback when WhatsApp isn't available). Right column: six service **rows**, hairline separated,
  each: icon, title, description, and an inline link **"Ask about this"**
  that opens WhatsApp prefilled with "<greeting> <service title>".
- Each row gets an anchor id `service-<id>`. All anchor targets use
  `scroll-margin-top: calc(var(--header-height) + 16px)` (header is 85 px at
  every width); acceptance = target heading's top ≥ header bottom after the
  jump. Following any nav link closes the mobile menu (existing behaviour).
- ≤992 px: single column; sticky disabled.

### 3. Navigation
- Mega menu and footer service links point to their own
  `#service-<id>` anchor instead of all to `#services`.
- Scroll-spy: observed targets are the four top-level sections only
  (`#top` hero, `#services`, `#about`, `#contact`; service rows count as
  Services). IntersectionObserver with a thin band
  `rootMargin: "-35% 0px -60% 0px"`; the section crossing that band is
  active (sections are contiguous, so at most one crosses a 5 % band; if
  two report, the later in document order wins). At page bottom (within
  2 px of max scroll) Contact is forced active, because the last section
  may be shorter than the band offset. Active item gets
  `aria-current="location"` + an underline indicator.

### 4. About — split, no quote badge
- Left: title, subtitle, body paragraph. Right: three short principles
  taken from existing hero copy — transparency, efficiency, compliance —
  each a title + one sentence. No icons-in-tinted-squares.
- Below the body: a text CTA "Write on WhatsApp" (same label as the hero —
  one label per intent).

### 5. Contact — hierarchy instead of nine equal cards
- **Primary**: WhatsApp, Telegram, Phone as three large action tiles (the
  only cards on this section), each with channel colour, label and value.
- **Secondary panel**: email (`mailto:`), address, and a compact row of
  Viber / Instagram / Facebook / LinkedIn icon buttons with accessible names.

### 6. Mobile action bar
- ≤768 px: fixed bottom bar with two buttons — **Call** and **WhatsApp** —
  height 64 px + `env(safe-area-inset-bottom)`; `body` gets the same bottom
  padding so the footer is never covered, and `html { scroll-padding-bottom }`
  the same value so keyboard-focused elements scroll clear of it. Hidden
  while the mobile menu is open. Above 768 px it is in the DOM but
  `display: none` (so also out of the accessibility tree) — acceptance at
  1280 = not visible and not in the a11y tree.

### 7. Polish
- Replace every `transition: all` with explicit properties.
- Headings ≥24 px: `letter-spacing: -0.02em`, `text-wrap: balance`.
- Radius scale: 8 px buttons, 12 px rows/inputs, 16 px panels/tiles.
- Visible `:focus-visible` on all interactive elements (already global;
  verify on new ones).
- Hover lift effects respect `prefers-reduced-motion`.
- Language pills get `title` with the full language name.

### 8. Housekeeping
- `npm run typecheck` runs `next typegen` first (fresh checkout failed).
- `.gitignore` adds `.claude/`.

## New copy (all three languages, in dictionaries)

`hero.ctaPrimary` → "Write on WhatsApp", `hero.ctaSecondary` → "See
services", `contactPanel.title` ("Talk to us directly"), `services.prompt`,
`services.askLink` ("Ask about this"), `about.principles` (3 × title + text),
`contact.primaryTitle`/`secondaryTitle`, `actionBar.call`/`whatsapp`,
`whatsapp.greeting` (prefill), `nav` language full names. Georgian and
Russian strings are written by us and flagged for native review in the PR.

## Testing / acceptance

- Unit: WhatsApp URL builder (encodes text, correct number); every service
  row has id `service-<id>` and an "ask" link whose `text` contains the
  service title; mega-menu/footer links target `#service-<id>`; contact
  renders 3 primary tiles + 4 social buttons with accessible names; action
  bar has `tel:` + `wa.me` links; dictionaries still key-identical.
- Existing tests updated, all green; lint/typecheck/build clean; smoke 20/20.
- Browser (Playwright): no horizontal overflow at 375/1280 in ka/en/ru;
  mobile action bar visible at 375 and absent at 1280; footer not covered
  by the action bar when scrolled to bottom; scroll-spy marks Contact when
  page is scrolled to the bottom and Services when arriving via
  `#service-cfo`; after jumping to `#service-cfo` its heading is below the
  header; hero headline ratio 0.18–0.30 in ka/en/ru at 1280×900.
- Visual review of before/after screenshots.
- Deploy via PR merge + `bash deploy.sh`, then live smoke against
  https://networkerteam.ge.
