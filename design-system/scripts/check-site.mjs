// Check of the site in a headless Chromium. Runs in GitHub Actions only,
// never on a developer machine. Opens all six pages at two viewports,
// asserts zero console errors, waits for #menu-stage and every [data-scene]
// and [data-effect] element to settle on data-webgl="ready" or
// "unavailable", prints which WebGL branch each page took, and saves one
// screenshot per page per viewport to site-shots/ (twelve in all). The home
// page holds the menu only, so it expects zero [data-scene] elements. On the
// home page, when the menu is ready, it asserts that the overlay pill links to
// /about/ at load, that one wheel step changes the link, and that a click on
// the centre of the stage grows the .menu-expand circle and opens one of the
// five pages. The home screenshot is taken before that click.
//
// Usage: node scripts/check-site.mjs [url]   (default http://127.0.0.1:8080/)
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const SITE_URL = process.argv[2] ?? process.env.SITE_URL ?? 'http://127.0.0.1:8080/';
const PAGE_PATHS = ['/about/', '/portfolio/', '/blog/', '/ben/', '/contact/'];
const ALL_PATHS = ['/', ...PAGE_PATHS];
const STAGE_TIMEOUT_MS = 10_000;
const SHOTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site-shots');
const VIEWPORTS = [
  { name: 'desktop-1280x800', width: 1280, height: 800 },
  { name: 'phone-390x844', width: 390, height: 844 },
];

let failures = 0;

function fail(message) {
  console.error(`check-site: FAIL ${message}`);
  failures += 1;
}

function slugOf(pagePath) {
  return pagePath === '/' ? 'home' : pagePath.replaceAll('/', '');
}

// Wait until the element leaves data-webgl="pending". Returns the state.
async function settle(page, selector, label) {
  const locator = page.locator(selector).first();
  try {
    await page.waitForFunction(
      (sel) => {
        const el = document.querySelector(sel);
        return el !== null && el.dataset.webgl !== 'pending';
      },
      selector,
      { timeout: STAGE_TIMEOUT_MS },
    );
    return (await locator.getAttribute('data-webgl')) ?? 'missing';
  } catch {
    const state = (await locator.getAttribute('data-webgl').catch(() => null)) ?? 'missing';
    fail(`${label} stayed at data-webgl="${state}" after ${STAGE_TIMEOUT_MS} ms`);
    return state;
  }
}

function pathOf(href) {
  return href ? new URL(href, SITE_URL).pathname : null;
}

// The sphere starts on the gold disc, so the pill reads About with no drag.
// One wheel step then moves the sphere on to another disc.
async function checkMenu(page, viewportName, state) {
  const stage = page.locator('#menu-stage');
  if (state === 'ready') {
    const overlay = page.locator('a.menu-overlay');
    await overlay.waitFor({ state: 'visible', timeout: STAGE_TIMEOUT_MS });
    const first = pathOf(await overlay.getAttribute('href'));
    if (first !== '/about/') {
      fail(`${viewportName}: at load the overlay links to "${first}", expected /about/`);
    } else {
      console.log(`check-site: ${viewportName} /: at load the overlay links to /about/`);
    }

    const box = await stage.boundingBox();
    if (!box) {
      fail(`${viewportName}: #menu-stage has no bounding box`);
      return;
    }
    // Read the link before the wheel. The sphere may move before the next
    // command runs, so a value read afterwards can already be the new one.
    const beforeWheel = await overlay.getAttribute('href');
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    // One wheel event on the stage. A dispatched event is one step; the
    // trackpad-like stream of page.mouse.wheel is not.
    await stage.dispatchEvent('wheel', { deltaY: 200, deltaMode: 0 });
    try {
      await page.waitForFunction(
        (before) => {
          const link = document.querySelector('a.menu-overlay');
          return link !== null && link.getAttribute('href') !== before;
        },
        beforeWheel,
        { timeout: 2000 },
      );
      const next = pathOf(await overlay.getAttribute('href'));
      if (!next || !PAGE_PATHS.includes(next)) {
        fail(`${viewportName}: after one wheel step the overlay href "${next}" is not a page`);
      } else {
        console.log(`check-site: ${viewportName} /: one wheel step moves the overlay to ${next}`);
      }
    } catch {
      fail(`${viewportName}: one wheel step did not change the overlay href within 2 s`);
    }
  } else if (state === 'unavailable') {
    const linkCount = await page.locator('.menu-list a').count();
    if (linkCount !== PAGE_PATHS.length) {
      fail(`${viewportName}: the link list holds ${linkCount} links, expected ${PAGE_PATHS.length}`);
    } else {
      console.log(`check-site: ${viewportName} /: the link list is the navigation (${linkCount} links)`);
    }
  }
}

// A click on the centre of the stage grows a circle in the disc colour and
// then opens the page behind that disc. This runs after the home screenshot,
// because it leaves the home page.
async function checkMenuClick(page, viewportName) {
  const box = await page.locator('#menu-stage').boundingBox();
  if (!box) {
    fail(`${viewportName}: #menu-stage has no bounding box for the click`);
    return;
  }
  const expandSeen = page
    .waitForSelector('.menu-expand', { state: 'attached', timeout: 2000 })
    .then(() => true)
    .catch(() => false);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  if (!(await expandSeen)) {
    fail(`${viewportName}: no .menu-expand element appeared after the click`);
  }
  try {
    await page.waitForURL(
      (url) => PAGE_PATHS.includes(url.pathname),
      { timeout: STAGE_TIMEOUT_MS },
    );
    console.log(`check-site: ${viewportName} /: the click opened ${new URL(page.url()).pathname}`);
  } catch {
    fail(`${viewportName}: the click did not open one of ${PAGE_PATHS.join(', ')}`);
  }
}

async function checkPage(browser, viewport, pagePath) {
  const label = `${viewport.name} ${pagePath}`;
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));

  const url = new URL(pagePath, SITE_URL).toString();
  const response = await page.goto(url, { waitUntil: 'load' });
  if (!response || !response.ok()) {
    fail(`${label}: ${url} answered ${response?.status() ?? 'no response'}`);
  }

  let menuState = null;
  if (pagePath === '/') {
    menuState = await settle(page, '#menu-stage', `${label} #menu-stage`);
    console.log(`check-site: ${label}: menu WebGL branch "${menuState}"`);
    await checkMenu(page, viewport.name, menuState);
  }

  // One background scene on every page but the home page, which is the menu.
  const sceneCount = await page.locator('[data-scene]').count();
  const expected = pagePath === '/' ? 0 : 1;
  if (sceneCount !== expected) {
    fail(`${label}: found ${sceneCount} [data-scene] elements, expected ${expected}`);
  }
  for (let index = 0; index < sceneCount; index += 1) {
    const host = page.locator('[data-scene]').nth(index);
    const name = await host.getAttribute('data-scene');
    const selector = `[data-scene="${name}"]`;
    const state = await settle(page, selector, `${label} ${selector}`);
    console.log(`check-site: ${label}: scene "${name}" WebGL branch "${state}"`);
    if (state === 'ready') {
      const hidden = await host
        .locator('canvas')
        .evaluateAll((nodes) => nodes.every((node) => node.getAttribute('aria-hidden') === 'true'));
      if (!hidden) fail(`${label}: a canvas in ${selector} is not aria-hidden`);
    }
  }
  // The scenes have settled live. Now ask for reduced motion: every scene
  // follows the query and pauses on its current frame, so the software
  // renderer stops starving the page. Split Text then lands its letters at
  // once, the effects report done, and the screenshot returns in seconds.
  // This also proves the query is followed after mount.
  //
  // The home page holds no scene, and reduced motion there removes the expand
  // circle the click below asserts. So the home page stays in live motion.
  if (pagePath !== '/') {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(300);
  }

  // Effects are text animations and cursors; they settle and report done.
  const effectCount = await page.locator('[data-effect]').count();
  for (let index = 0; index < effectCount; index += 1) {
    const name = await page.locator('[data-effect]').nth(index).getAttribute('data-effect');
    const state = await settle(page, `[data-effect="${name}"]`, `${label} [data-effect="${name}"]`);
    console.log(`check-site: ${label}: effect "${name}" branch "${state}"`);
    // Every effect sets data-done once its entry animation has finished.
    // Split Text raises its letters one by one, so the word measure below
    // must not run before then.
    try {
      await page.waitForSelector(`[data-effect="${name}"][data-done="true"]`, {
        state: 'attached',
        timeout: STAGE_TIMEOUT_MS,
      });
      console.log(`check-site: ${label}: effect "${name}" reports done`);
    } catch {
      fail(`${label}: effect "${name}" did not report data-done within ${STAGE_TIMEOUT_MS} ms`);
    }
  }

  // A text effect splits its text into letter spans. The letters of one word
  // must stay on one line: every letter shares its wrapper's line top, and
  // wrapping happens only at the spaces between wrappers.
  const countSplitWords = () => {
    const groups = new Map();
    document.querySelectorAll('[data-effect] .char, [data-effect] .split-char').forEach((letter) => {
      const wrapper = letter.parentElement;
      if (!wrapper) return;
      if (!groups.has(wrapper)) groups.set(wrapper, []);
      groups.get(wrapper).push(letter.getBoundingClientRect().top);
    });
    let broken = 0;
    for (const tops of groups.values()) {
      if (Math.max(...tops) - Math.min(...tops) > 1) broken += 1;
    }
    return { words: groups.size, broken };
  };
  const settled = await page.evaluate(countSplitWords);
  if (settled.words > 0) {
    if (settled.broken > 0) {
      fail(`${label}: ${settled.broken} of ${settled.words} split words break across lines`);
    } else {
      console.log(`check-site: ${label}: ${settled.words} split words each stay on one line`);
    }
  }

  // The scenes are paused on their current frame (see above), so the
  // screenshot does not wait behind the software renderer.
  await page.waitForTimeout(300);
  const shot = path.join(SHOTS_DIR, `${slugOf(pagePath)}-${viewport.name}.png`);
  await page.screenshot({ path: shot, fullPage: false, timeout: 60_000 });
  console.log(`check-site: ${label}: screenshot ${shot}`);

  // The click leaves the home page, so it comes after the screenshot.
  if (pagePath === '/' && menuState === 'ready') {
    await checkMenuClick(page, viewport.name);
  }

  if (consoleErrors.length) {
    fail(`${label}: ${consoleErrors.length} console error(s):\n  ${consoleErrors.join('\n  ')}`);
  }
  await context.close();
}

async function main() {
  await mkdir(SHOTS_DIR, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    // Software WebGL when the runner has no GPU. Chromium may still report
    // WebGL 2 as unavailable; the "unavailable" branch above is a pass.
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  try {
    for (const viewport of VIEWPORTS) {
      for (const pagePath of ALL_PATHS) {
        await checkPage(browser, viewport, pagePath);
      }
    }
  } finally {
    await browser.close();
  }
  if (failures) {
    console.error(`check-site: ${failures} failure(s)`);
    process.exit(1);
  }
  console.log(`check-site: pass (${VIEWPORTS.length * ALL_PATHS.length} screenshots)`);
}

main().catch((error) => {
  console.error('check-site: error', error);
  process.exit(1);
});
