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
  // A fast keyboard user: Tab immediately after focusing "Services" must enter the menu.
  await page.locator('#mainNav a[href="#services"]').first().focus();
  await page.keyboard.press("Tab");
  const fastTab = await page.evaluate(() => document.getElementById("servicesMenu").contains(document.activeElement));
  check("immediate Tab from Services enters the mega menu", fastTab);
  await page.locator('#mainNav a[href="#services"]').first().focus();
  await page.waitForTimeout(400);
  check("keyboard focus opens the mega menu", (await mega.evaluate((el) => getComputedStyle(el).visibility)) === "visible");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  const focusBack = await page.evaluate(() => document.activeElement?.getAttribute("href"));
  check(`Escape returns focus to the Services link (got ${focusBack})`, focusBack === "#services");
  check("Escape hides the mega menu", (await mega.evaluate((el) => getComputedStyle(el).visibility)) === "hidden");

  // Anchor jump keeps the section heading below the sticky header.
  await page.goto(site + "/en#contact", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const headingTop = await page.locator("#contact h2").evaluate((el) => el.getBoundingClientRect().top);
  check(`#contact heading not hidden by header (top=${Math.round(headingTop)}px)`, headingTop >= 85);

  // Scroll-spy: bottom of page marks Contact.
  await page.goto(site + "/en", { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(500);
  const bottomActive = await page.locator('#mainNav a[aria-current="location"]').getAttribute("href");
  check(`scroll-spy at page bottom marks #contact (got ${bottomActive})`, bottomActive === "#contact");

  // Action bar is desktop-hidden (display:none also removes it from the a11y tree).
  const barDisplay = await page.locator('nav[aria-label] a[href^="tel:"]').last().evaluate((el) => getComputedStyle(el.parentElement).display);
  check(`action bar hidden at 1280 (display=${barDisplay})`, barDisplay === "none");
  await page.close();
}

// Arriving on a service anchor (fresh load, like a shared link): Services is
// active and the row title is clear of the header.
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(site + "/en#service-cfo", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const serviceActive = await page.locator('#mainNav a[aria-current="location"]').getAttribute("href");
  check(`#service-cfo marks Services active (got ${serviceActive})`, serviceActive === "#services");
  const rowTop = await page.locator("#service-cfo h3").evaluate((el) => el.getBoundingClientRect().top);
  check(`#service-cfo title below header (top=${Math.round(rowTop)}px)`, rowTop >= 85);

  // In-page: clicking the mega-menu entry lands on the row too.
  await page.goto(site + "/en", { waitUntil: "networkidle" });
  await page.locator('#mainNav a[href="#services"]').first().hover();
  await page.locator('#servicesMenu a[href="#service-workPermit"]').click();
  await page.waitForTimeout(2000);
  const clickTop = await page.locator("#service-workPermit h3").evaluate((el) => el.getBoundingClientRect().top);
  check(`menu click lands on #service-workPermit (top=${Math.round(clickTop)}px)`, clickTop >= 85 && clickTop < 450);
  await page.close();
}

// Hero headline sits 18–30% down the fold in every language.
for (const p of pages) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(site + p.site, { waitUntil: "networkidle" });
  const ratio = await page.locator("h1").evaluate((el) => el.getBoundingClientRect().top / window.innerHeight);
  check(`${p.name}: hero H1 at ${(ratio * 100).toFixed(1)}% of the fold`, ratio >= 0.18 && ratio <= 0.3);
  await page.close();
}

// Mobile action bar: visible, and never covers the footer at the bottom.
{
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto(site + "/en", { waitUntil: "networkidle" });
  const bar = page.locator('a[href^="tel:"]').last().locator("xpath=..");
  check("action bar visible at 375", await bar.isVisible());
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(300);
  const barTop = await bar.evaluate((el) => el.getBoundingClientRect().top);
  const footerBottom = await page.locator("footer p").last().evaluate((el) => el.getBoundingClientRect().bottom);
  check(`footer clear of action bar (text ${Math.round(footerBottom)} ≤ bar ${Math.round(barTop)})`, footerBottom <= barTop);
  await page.locator('button[aria-controls="mainNav"]').click();
  check("action bar hidden while menu open", !(await bar.isVisible()));
  await page.close();
}

await browser.close();
console.log(failures ? `BROWSER CHECKS FAILED (${failures})` : "BROWSER CHECKS PASSED");
process.exit(failures ? 1 : 0);
