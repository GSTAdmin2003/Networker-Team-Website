// Screenshots of the new site (and optionally the original reference) plus
// browser-level behaviour checks that jsdom can't do (real CSS, layout).
//
//   node scripts/screenshots.mjs <site-url> [reference-url]
//
// reference-url serves the original static files (index.html, index_en.html,
// index_ru.html). Output goes to ./screenshots/.
import { mkdirSync } from "node:fs";
import { chromium } from "playwright";

const site = process.argv[2] ?? "http://127.0.0.1:3000";
const reference = process.argv[3];
const out = "screenshots";
mkdirSync(out, { recursive: true });

const pages = [
  { name: "ka", site: "/", reference: "/index.html" },
  { name: "en", site: "/en", reference: "/index_en.html" },
  { name: "ru", site: "/ru", reference: "/index_ru.html" },
];
const viewports = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 375, height: 812 },
];

let failures = 0;
function check(description, ok) {
  console.log(`${ok ? "ok  " : "FAIL"} ${description}`);
  if (!ok) failures++;
}

// CHROMIUM_PATH lets you reuse an already-installed Chromium instead of
// `npx playwright install`.
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
);

async function shoot(base, path, prefix, viewport, { assertLayout }) {
  const page = await browser.newPage({ viewport });
  await page.goto(base + path, { waitUntil: "networkidle" });
  const tag = `${prefix}-${viewport.name}`;
  await page.screenshot({ path: `${out}/${tag}.png`, fullPage: true });

  if (assertLayout) {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    check(`${tag}: no horizontal overflow (${overflow}px)`, overflow <= 0);
  }

  // Menus open: desktop mega menu on hover, mobile burger + services list.
  if (viewport.name === "desktop") {
    const services = page.locator('a[href="#services"]').first();
    await services.hover();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/${tag}-megamenu.png` });
  } else {
    const burger = page.locator('button[aria-controls="mainNav"], #menuToggle').first();
    await burger.click();
    const disclosure = page.locator('button[aria-controls="servicesMenu"]');
    if (await disclosure.count()) await disclosure.click();
    else await page.locator(".services-toggle-link").click();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/${tag}-menu.png` });
    if (assertLayout) {
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      );
      check(`${tag}: menu open, no horizontal overflow`, overflow <= 0);
    }
  }
  await page.close();
}

for (const p of pages) {
  for (const vp of viewports) {
    await shoot(site, p.site, `new-${p.name}`, vp, { assertLayout: true });
    if (reference) await shoot(reference, p.reference, `ref-${p.name}`, vp, { assertLayout: false });
  }
}

// Keyboard: Tab into the services menu opens it; Escape hides it even
// though focus stays inside.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(site + "/en", { waitUntil: "networkidle" });
  const mega = page.locator("#servicesMenu");
  await page.locator('#mainNav a[href="#services"]').first().focus();
  await page.waitForTimeout(400);
  check("keyboard focus opens the mega menu", (await mega.evaluate((el) => getComputedStyle(el).visibility)) === "visible");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const stillInside = await page.evaluate(() => document.getElementById("servicesMenu")?.closest("li")?.contains(document.activeElement));
  check("focus is still inside the services item", Boolean(stillInside));
  check("Escape hides the mega menu", (await mega.evaluate((el) => getComputedStyle(el).visibility)) === "hidden");

  // Anchor jump keeps the section heading below the sticky header.
  await page.goto(site + "/en#contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const headingTop = await page.locator("#contact h2").evaluate((el) => el.getBoundingClientRect().top);
  check(`#contact heading not hidden by header (top=${Math.round(headingTop)}px)`, headingTop >= 85);
  await page.close();
}

await browser.close();
console.log(failures ? `BROWSER CHECKS FAILED (${failures})` : "BROWSER CHECKS PASSED");
process.exit(failures ? 1 : 0);
