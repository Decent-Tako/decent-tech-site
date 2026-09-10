// Check of the site Infinite Menu in a headless Chromium. Runs in GitHub
// Actions only, never on a developer machine. Opens the served site, asserts
// zero console errors, waits for #menu-stage to settle on data-webgl="ready"
// or "unavailable", and when ready drags the sphere 200 pixels and asserts
// the overlay link points at one of the five pages. Saves two screenshots to
// site-shots/.
//
// Usage: node scripts/check-site-menu.mjs [url]   (default http://127.0.0.1:8080/)
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const SITE_URL = process.argv[2] ?? process.env.SITE_URL ?? 'http://127.0.0.1:8080/';
const PAGE_PATHS = ['/about/', '/portfolio/', '/blog/', '/ben/', '/contact/'];
const STAGE_TIMEOUT_MS = 10_000;
const SHOTS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'site-shots');
const VIEWPORTS = [
  { name: 'desktop-1280x800', width: 1280, height: 800 },
  { name: 'phone-390x844', width: 390, height: 844 },
];

let failures = 0;

function fail(message) {
  console.error(`check-site-menu: FAIL ${message}`);
  failures += 1;
}

async function checkViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));

  const response = await page.goto(SITE_URL, { waitUntil: 'load' });
  if (!response || !response.ok()) {
    fail(`${viewport.name}: ${SITE_URL} answered ${response?.status() ?? 'no response'}`);
  }

  const stage = page.locator('#menu-stage');
  let state = 'missing';
  try {
    await page.waitForSelector(
      '#menu-stage[data-webgl="ready"], #menu-stage[data-webgl="unavailable"]',
      { timeout: STAGE_TIMEOUT_MS },
    );
    state = await stage.getAttribute('data-webgl');
  } catch {
    state = (await stage.getAttribute('data-webgl')) ?? 'missing';
    fail(`${viewport.name}: #menu-stage stayed at data-webgl="${state}" after ${STAGE_TIMEOUT_MS} ms`);
  }
  console.log(`check-site-menu: ${viewport.name}: WebGL branch "${state}"`);

  if (state === 'ready') {
    const overlay = page.locator('a.menu-overlay');
    await overlay.waitFor({ state: 'visible', timeout: STAGE_TIMEOUT_MS });
    const box = await stage.boundingBox();
    if (!box) {
      fail(`${viewport.name}: #menu-stage has no bounding box`);
    } else {
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
        fail(`${viewport.name}: overlay href "${href}" is not one of ${PAGE_PATHS.join(', ')}`);
      } else {
        console.log(`check-site-menu: ${viewport.name}: after a 200 px drag the overlay links to ${pathname}`);
      }
    }
  } else if (state === 'unavailable') {
    const linkCount = await page.locator('.menu-list a').count();
    if (linkCount !== PAGE_PATHS.length) {
      fail(`${viewport.name}: the link list holds ${linkCount} links, expected ${PAGE_PATHS.length}`);
    } else {
      console.log(`check-site-menu: ${viewport.name}: the link list is the navigation (${linkCount} links)`);
    }
  }

  const shot = path.join(SHOTS_DIR, `${viewport.name}.png`);
  await page.screenshot({ path: shot, fullPage: false });
  console.log(`check-site-menu: ${viewport.name}: screenshot ${shot}`);

  if (consoleErrors.length) {
    fail(`${viewport.name}: ${consoleErrors.length} console error(s):\n  ${consoleErrors.join('\n  ')}`);
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
      await checkViewport(browser, viewport);
    }
  } finally {
    await browser.close();
  }
  if (failures) {
    console.error(`check-site-menu: ${failures} failure(s)`);
    process.exit(1);
  }
  console.log('check-site-menu: pass');
}

main().catch((error) => {
  console.error('check-site-menu: error', error);
  process.exit(1);
});
