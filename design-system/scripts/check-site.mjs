// Check of the site in a headless Chromium. Runs in GitHub Actions only,
// never on a developer machine. Opens all six pages at two viewports,
// asserts zero console errors, waits for #menu-stage and every [data-scene]
// element to settle on data-webgl="ready" or "unavailable", prints which
// WebGL branch each page took, and saves one screenshot per page per
// viewport to site-shots/ (twelve in all). On the home page, when the menu
// is ready, it drags the sphere 200 pixels and asserts the overlay link
// points at one of the five pages.
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

async function checkMenu(page, viewportName, state) {
  const stage = page.locator('#menu-stage');
  if (state === 'ready') {
    const overlay = page.locator('a.menu-overlay');
    await overlay.waitFor({ state: 'visible', timeout: STAGE_TIMEOUT_MS });
    const box = await stage.boundingBox();
    if (!box) {
      fail(`${viewportName}: #menu-stage has no bounding box`);
      return;
    }
    const startX = box.x + box.width / 2 - 100;
    const y = box.y + box.height / 2;
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(startX + 200, y, { steps: 20 });
    await page.mouse.up();
    // Let the sphere snap to the nearest vertex.
    await page.waitForTimeout(1500);
    const href = await overlay.getAttribute('href');
    const pathname = href ? new URL(href, SITE_URL).pathname : null;
    if (!pathname || !PAGE_PATHS.includes(pathname)) {
      fail(`${viewportName}: overlay href "${href}" is not one of ${PAGE_PATHS.join(', ')}`);
    } else {
      console.log(`check-site: ${viewportName} /: after a 200 px drag the overlay links to ${pathname}`);
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

  if (pagePath === '/') {
    const menuState = await settle(page, '#menu-stage', `${label} #menu-stage`);
    console.log(`check-site: ${label}: menu WebGL branch "${menuState}"`);
    await checkMenu(page, viewport.name, menuState);
  }

  const sceneCount = await page.locator('[data-scene]').count();
  const expected = 1;
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
  // Effects are text animations and cursors; they only need to settle.
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

  // Let the first frames draw, then ask for reduced motion. Every scene
  // follows the query and pauses on its current frame, so the screenshot
  // does not wait behind a software renderer. This also proves the query is
  // followed after mount.
  await page.waitForTimeout(800);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(300);
  const shot = path.join(SHOTS_DIR, `${slugOf(pagePath)}-${viewport.name}.png`);
  await page.screenshot({ path: shot, fullPage: false, timeout: 60_000 });
  console.log(`check-site: ${label}: screenshot ${shot}`);

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
