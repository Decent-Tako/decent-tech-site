// Check of the site in a headless Chromium. Runs in GitHub Actions only,
// never on a developer machine. Opens all six pages at two viewports,
// asserts zero console errors, waits for #menu-stage and every [data-scene]
// and [data-effect] element to settle on data-webgl="ready" or
// "unavailable", prints which WebGL branch each page took, and saves one
// screenshot per page per viewport to site-shots/ (twelve in all). The home
// page holds the menu only, so it expects zero [data-scene] elements. On the
// home page, when the menu is ready, it asserts that the wordmark reads
// "Hey, we're decent." at load, then takes the home screenshot, which must
// show the gold disc at the centre. It then asserts that one wheel step
// changes the phrase and that a pointer over the "decent. read" entry of the
// right-hand list turns the sphere to that dot.
//
// On each of the five pages it also asserts that <html> is painted in the
// dot colour of that page before the bundle runs, and that the wordmark reads
// that page's phrase.
//
// Last per viewport it runs the two continuity paths: one click on the home
// wordmark with cross-document view transitions on, where the browser owns
// the motion and the site must not grow its own circle, and one with them
// off, where the site grows the .menu-expand circle. Both must land on the
// page with its field element present and painted in the dot colour.
//
// It then opens the home page once more, with no screenshot, for the three
// presses on the sphere: a press on empty stage reads data-last-click "miss"
// and changes nothing, a press on an off-centre disc reads "turn" and moves
// the wordmark to that disc's phrase, and a press on the centred disc reads
// "open" and opens its page. The discs come from data-hit-points, the list of
// front-facing discs the stage publishes once a second. That pass runs with
// view transitions off, because the press that opens is read from the stage
// and from the circle, and both need the stage to outlive the press.
//
// On the Get in touch page it drives the magnetic contact form, before the
// reduced-motion switch: a pointer in a far corner pulls the form, a pointer
// on the form stops the chase, a word typed with the keyboard freezes the
// form and is kept, and the three fields filled leave Send enabled with a
// mailto: action. The Contact screenshot comes after that first pull.
//
// Usage: node scripts/check-site.mjs [url]   (default http://127.0.0.1:8080/)
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const SITE_URL = process.argv[2] ?? process.env.SITE_URL ?? 'http://127.0.0.1:8080/';
const PAGE_PATHS = ['/about/', '/portfolio/', '/blog/', '/ben/', '/contact/'];

// Every page is the inside of its dot. The field colour sits on <html>, so
// the page paints in the dot colour before any script or scene loads. These
// are the same five values as the --dot-* tokens in site/styles.css and the
// disc textures in site/menu/<slug>.svg.
const FIELDS = {
  '/about/': { token: 'gold', rgb: 'rgb(255, 203, 115)' },
  '/portfolio/': { token: 'vermilion', rgb: 'rgb(227, 66, 52)' },
  '/blog/': { token: 'terracotta', rgb: 'rgb(217, 119, 87)' },
  '/ben/': { token: 'steel', rgb: 'rgb(91, 143, 163)' },
  '/contact/': { token: 'cream', rgb: 'rgb(242, 241, 232)' },
};

// The wordmark phrase of each page. The full stop sits in its own span, so
// the check reads the text of the whole wordmark, spans and all.
const PAGE_PHRASES = {
  '/about/': "Hey, we're decent.",
  '/portfolio/': 'decent. work',
  '/blog/': 'decent. read',
  '/ben/': 'decent. people',
  '/contact/': 'decent. contact',
};
// The phrase of the dot the sphere starts on, the phrases one and two wheel
// steps along from it, and the phrase the check hovers. A step walks the five
// pages in order, so the first two steps from load are fixed. The hover goes
// to an entry the two steps did not reach, so it proves the turn on its own.
const FIRST_PHRASE = "Hey, we're decent.";
const SECOND_PHRASE = 'decent. work';
const THIRD_PHRASE = 'decent. read';
const HOVER_PHRASE = 'decent. contact';
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

// The phrase the wordmark shows now, with the leading and trailing space of
// the markup removed. The outgoing phrase of a crossfade is aria-hidden and
// is left out, so this is one phrase at any moment.
function wordmarkPhrase(page) {
  return page.locator('.wordmark .wordmark-phrase__in').innerText();
}

// Wait until the wordmark reads something other than `before`, or until it
// reads exactly `wanted`. Returns the phrase it settled on.
function waitForPhrase(page, { before, wanted }) {
  return page.waitForFunction(
    ({ before: had, wanted: want }) => {
      const node = document.querySelector('.wordmark .wordmark-phrase__in');
      if (node === null) return false;
      const now = node.textContent?.trim() ?? '';
      return want === null ? now !== had : now === want;
    },
    { before, wanted: wanted ?? null },
    { timeout: 2000 },
  );
}

// The sphere starts on the gold disc, so the wordmark reads the About phrase
// with no drag. This runs before the home screenshot, which must show that
// first state.
async function checkMenu(page, viewportName, state) {
  if (state === 'ready') {
    const wordmark = page.locator('a.wordmark');
    await wordmark.waitFor({ state: 'visible', timeout: STAGE_TIMEOUT_MS });
    const first = (await wordmarkPhrase(page)).trim();
    if (first !== FIRST_PHRASE) {
      fail(`${viewportName}: at load the wordmark reads "${first}", expected "${FIRST_PHRASE}"`);
    } else {
      console.log(`check-site: ${viewportName} /: at load the wordmark reads "${first}"`);
    }
    const href = pathOf(await wordmark.getAttribute('href'));
    if (href !== '/about/') {
      fail(`${viewportName}: at load the wordmark links to "${href}", expected /about/`);
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

// One wheel step moves the sphere on to another disc, and a pointer over a
// list entry turns it to that entry's dot. Both run after the home
// screenshot, because both move the sphere off the gold disc it starts on.
async function checkMenuWheel(page, viewportName) {
  const stage = page.locator('#menu-stage');
  const box = await stage.boundingBox();
  if (!box) {
    fail(`${viewportName}: #menu-stage has no bounding box`);
    return;
  }
  // Read the phrase before the wheel. The sphere may move before the next
  // command runs, so a value read afterwards can already be the new one.
  const beforeWheel = (await wordmarkPhrase(page)).trim();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  // One wheel event on the stage. A dispatched event is one step; the
  // trackpad-like stream of page.mouse.wheel is not.
  const wheelOnce = () => stage.dispatchEvent('wheel', { deltaY: 200, deltaMode: 0 });
  await wheelOnce();
  try {
    try {
      await waitForPhrase(page, { before: beforeWheel });
    } catch {
      // The throttle drops a step that follows another too closely. One
      // more event, after the window, proves the wheel drives the sphere.
      await page.waitForTimeout(400);
      await wheelOnce();
      await waitForPhrase(page, { before: beforeWheel });
    }
    const next = (await wordmarkPhrase(page)).trim();
    // A step walks the five pages in order, so one step from the About dot
    // the sphere starts on always reaches Portfolio.
    if (next !== SECOND_PHRASE) {
      fail(
        `${viewportName}: one wheel step from load moves the wordmark to "${next}", ` +
          `expected "${SECOND_PHRASE}"`,
      );
    } else {
      console.log(`check-site: ${viewportName} /: one wheel step moves the wordmark to "${next}"`);
    }
  } catch {
    const steps = await stage.getAttribute('data-steps');
    fail(
      `${viewportName}: one wheel step did not change the wordmark phrase within 2 s ` +
        `(the stage counted ${steps ?? 'no'} step(s))`,
    );
  }

  await checkSecondWheelStep(page, viewportName, stage, wheelOnce);
  await checkHoverTurnsTheSphere(page, viewportName);
}


// A second wheel step walks one more page along the order, so two steps from
// the About dot the sphere starts on always reach Blog. The wait is longer
// than the throttle, so the second event is a step of its own and not one the
// throttle folds into the first.
async function checkSecondWheelStep(page, viewportName, stage, wheelOnce) {
  await page.waitForTimeout(400);
  await wheelOnce();
  try {
    await waitForPhrase(page, { before: null, wanted: THIRD_PHRASE });
    console.log(`check-site: ${viewportName} /: two wheel steps move the wordmark to "${THIRD_PHRASE}"`);
  } catch {
    const now = (await wordmarkPhrase(page).catch(() => '')).trim();
    const steps = await stage.getAttribute('data-steps');
    fail(
      `${viewportName}: two wheel steps from load move the wordmark to "${now}", ` +
        `expected "${THIRD_PHRASE}" (the stage counted ${steps ?? 'no'} step(s))`,
    );
  }
}

// A pointer over an entry of the right-hand list turns the sphere to that
// dot, so the wordmark takes that entry's phrase.
async function checkHoverTurnsTheSphere(page, viewportName) {
  const entry = page.locator('.menu-list a', { hasText: HOVER_PHRASE }).first();
  try {
    await entry.hover({ timeout: 2000 });
    await waitForPhrase(page, { before: null, wanted: HOVER_PHRASE });
    console.log(`check-site: ${viewportName} /: a pointer over "${HOVER_PHRASE}" turns the sphere there`);
  } catch {
    const now = (await wordmarkPhrase(page).catch(() => '')).trim();
    fail(
      `${viewportName}: a pointer over the "${HOVER_PHRASE}" entry did not make the ` +
        `wordmark read it within 2 s (it reads "${now}")`,
    );
  }
}

// A click on the wordmark opens the active page. The site has two paths to
// get there and runs exactly one of them.
//
//   viewTransitions: true   the browser morphs the shared `field` element of
//                           the home circle into the field of the page, so
//                           the site must not also grow its own circle.
//   viewTransitions: false  the site grows the .menu-expand circle in the
//                           disc colour and then navigates.
//
// Either way the page must land with its field element present and painted in
// the dot colour. This runs after the home screenshot, because it leaves the
// home page.
async function checkMenuClick(page, viewportName, viewTransitions) {
  const path = viewTransitions ? 'with view transitions' : 'without view transitions';
  const wordmark = page.locator('a.wordmark');
  const expandSeen = page
    .waitForSelector('.menu-expand', { state: 'attached', timeout: 2000 })
    .then(() => true)
    .catch(() => false);
  await wordmark.click();
  const grew = await expandSeen;
  if (viewTransitions) {
    if (grew) {
      fail(
        `${viewportName}: ${path}, the site grew its own .menu-expand circle as well; ` +
          `the shared element and the circle must not both run`,
      );
    } else {
      console.log(`check-site: ${viewportName} /: ${path}, the shared element owns the motion`);
    }
  } else if (!grew) {
    fail(`${viewportName}: ${path}, no .menu-expand element appeared after the click`);
  } else {
    console.log(`check-site: ${viewportName} /: ${path}, the .menu-expand circle grew`);
  }

  // The sphere may still be easing on to a dot, so the page it opens is the
  // active one at the moment of the click. Any of the five is a pass.
  let landed = null;
  try {
    await page.waitForURL((url) => PAGE_PATHS.includes(url.pathname), {
      timeout: STAGE_TIMEOUT_MS,
    });
    landed = new URL(page.url()).pathname;
    console.log(`check-site: ${viewportName} /: ${path}, the wordmark opened ${landed}`);
  } catch {
    fail(
      `${viewportName}: ${path}, the click on the wordmark did not open one of ` +
        `${PAGE_PATHS.join(', ')} (the page is at ${new URL(page.url()).pathname})`,
    );
    return;
  }

  // Both paths land the same way: the field element is present and <html> is
  // painted in the dot colour of the page.
  const field = FIELDS[landed];
  const present = await page.locator('.scene').count();
  if (present !== 1) {
    fail(`${viewportName}: ${path}, ${landed} has ${present} field elements, expected 1`);
    return;
  }
  const painted = await page.evaluate(
    () => getComputedStyle(document.documentElement).backgroundColor,
  );
  if (painted !== field.rgb) {
    fail(
      `${viewportName}: ${path}, ${landed} landed on ${painted}, expected the ` +
        `${field.token} field ${field.rgb}`,
    );
    return;
  }
  console.log(
    `check-site: ${viewportName} /: ${path}, ${landed} landed on the ${field.token} ` +
      `field with its field element`,
  );
}

// One home click per continuity path. The second run opens its own page, so
// the sphere starts on the gold disc again, and takes away the browser's
// cross-document view transitions before the bundle can detect them.
async function checkContinuityPaths(browser, viewport) {
  for (const viewTransitions of [true, false]) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
    });
    const page = await context.newPage();
    if (!viewTransitions) await withoutViewTransitions(page);
    await page.goto(SITE_URL, { waitUntil: 'load' });
    const state = await settle(page, '#menu-stage', `${viewport.name} / #menu-stage`);
    if (state === 'ready') {
      await checkMenuClick(page, viewport.name, viewTransitions);
    } else {
      console.log(
        `check-site: ${viewport.name} /: menu branch "${state}", ` +
          `the continuity paths need the sphere and are left out`,
      );
    }
    await context.close();
  }
}

// The field colour of <html> at first paint, before the bundle runs. The
// route below holds the bundle back until the colour has been read, so the
// value is the one the view transition lands on and not one a scene set.
async function checkFirstPaint(page, label, pagePath) {
  const field = FIELDS[pagePath];
  if (!field) return;
  const { html, body } = await page.evaluate(() => ({
    html: getComputedStyle(document.documentElement).backgroundColor,
    body: getComputedStyle(document.body).backgroundColor,
  }));
  if (html !== field.rgb) {
    fail(
      `${label}: at first paint <html> is ${html}, expected the ${field.token} ` +
        `field ${field.rgb}`,
    );
    return;
  }
  // The body must not paint over the field, or the flat dot colour would
  // never be seen and the transition would land on the paper colour.
  if (body !== 'rgba(0, 0, 0, 0)') {
    fail(
      `${label}: the body paints ${body} over the ${field.token} field; it must be ` +
        `transparent`,
    );
    return;
  }
  console.log(
    `check-site: ${label}: first paint is the ${field.token} field ${html}`,
  );
}

// The wordmark of a page reads that page's phrase. The full stop sits in its
// own span for its contrasting colour, so the text of the whole wordmark is
// read and its inner spacing is squeezed out.
async function checkPageWordmark(page, label, pagePath) {
  const wanted = PAGE_PHRASES[pagePath];
  if (!wanted) return;
  const wordmark = page.locator('.page-wordmark .wordmark-phrase').first();
  const reads = (await wordmark.innerText()).replace(/\s+/g, ' ').trim();
  if (reads !== wanted) {
    fail(`${label}: the wordmark reads "${reads}", expected "${wanted}"`);
    return;
  }
  console.log(`check-site: ${label}: the wordmark reads "${reads}"`);
}

// The discs the stage shows now, as {x, y, r, vertex} in stage pixels. The
// stage republishes them once a second, so a stale read is at most that old;
// the checks below read them again right before they click.
async function hitPoints(page) {
  const raw = await page.locator('#menu-stage').getAttribute('data-hit-points');
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Take cross-document view transitions away from a page before any script
// runs, so the site takes the path it takes in a browser without the feature.
// `delete` removes the property from the prototype, so the site sees neither
// the key nor a callable value.
function withoutViewTransitions(page) {
  return page.addInitScript(() => {
    delete Document.prototype.startViewTransition;
  });
}

function lastClick(page) {
  return page.locator('#menu-stage').getAttribute('data-last-click');
}

// A point on the stage that no disc covers. The corners are the emptiest part
// of the frame, so the search starts there and keeps the one furthest from
// every disc, in units of that disc's own radius.
function emptyPoint(box, discs) {
  const inset = 6;
  const corners = [
    { x: inset, y: inset },
    { x: box.width - inset, y: inset },
    { x: inset, y: box.height - inset },
    { x: box.width - inset, y: box.height - inset },
  ];
  let best = corners[0];
  let bestClearance = -Infinity;
  for (const corner of corners) {
    let clearance = Infinity;
    for (const disc of discs) {
      clearance = Math.min(clearance, Math.hypot(corner.x - disc.x, corner.y - disc.y) / disc.r);
    }
    if (clearance > bestClearance) {
      bestClearance = clearance;
      best = corner;
    }
  }
  return { point: best, clearance: bestClearance };
}

// A press on empty stage changes nothing and reads `miss`.
async function checkMissClick(page, viewportName, box) {
  const discs = await hitPoints(page);
  if (!discs.length) {
    fail(`${viewportName}: the stage published no data-hit-points`);
    return;
  }
  const { point, clearance } = emptyPoint(box, discs);
  const beforePhrase = (await wordmarkPhrase(page)).trim();
  await page.mouse.click(box.x + point.x, box.y + point.y);
  await page.waitForTimeout(300);
  const what = await lastClick(page);
  const afterPhrase = (await wordmarkPhrase(page)).trim();
  if (what !== 'miss') {
    fail(
      `${viewportName}: a press on empty stage reads data-last-click "${what}", expected "miss" ` +
        `(the point was ${clearance.toFixed(1)} disc radii from the nearest disc)`,
    );
  } else if (afterPhrase !== beforePhrase) {
    fail(
      `${viewportName}: a press on empty stage changed the wordmark from ` +
        `"${beforePhrase}" to "${afterPhrase}"`,
    );
  } else {
    console.log(`check-site: ${viewportName} /: a press on empty stage reads "miss" and changes nothing`);
  }
}

// A press on a visible off-centre disc turns the sphere to it and reads
// `turn`. The disc is the one furthest from the centre of the stage, so it is
// certainly not the centred one.
async function checkTurnClick(page, viewportName, box) {
  const [discs, centredRaw] = await Promise.all([
    hitPoints(page),
    page.locator('#menu-stage').getAttribute('data-centred-vertex'),
  ]);
  const centred = Number(centredRaw);
  // Several vertices carry the same page, so a disc that is not the centred
  // vertex can still be the centred *page*, and turning to it would leave the
  // wordmark alone. The item of a vertex is its index modulo the five pages,
  // so the target must differ there, not just in the vertex.
  const centredItem = ((centred % PAGE_PATHS.length) + PAGE_PATHS.length) % PAGE_PATHS.length;
  const centre = { x: box.width / 2, y: box.height / 2 };
  let target = null;
  let furthest = -Infinity;
  for (const disc of discs) {
    if (disc.vertex % PAGE_PATHS.length === centredItem) continue;
    // Big enough to click without landing on a neighbour, and wholly on the
    // stage, so the click cannot fall outside the viewport.
    if (disc.r < 12) continue;
    if (disc.x - disc.r < 0 || disc.x + disc.r > box.width) continue;
    if (disc.y - disc.r < 0 || disc.y + disc.r > box.height) continue;
    const away = Math.hypot(disc.x - centre.x, disc.y - centre.y);
    if (away > furthest) {
      furthest = away;
      target = disc;
    }
  }
  if (!target) {
    fail(
      `${viewportName}: no off-centre disc of another page big enough to click ` +
        `among ${discs.length} discs`,
    );
    return;
  }
  const beforePhrase = (await wordmarkPhrase(page)).trim();
  await page.mouse.click(box.x + target.x, box.y + target.y);
  const what = await lastClick(page);
  if (what !== 'turn') {
    fail(
      `${viewportName}: a press on an off-centre disc reads data-last-click "${what}", ` +
        `expected "turn"`,
    );
    return;
  }
  try {
    await waitForPhrase(page, { before: beforePhrase });
    const now = (await wordmarkPhrase(page)).trim();
    console.log(
      `check-site: ${viewportName} /: a press on an off-centre disc reads "turn" ` +
        `and moves the wordmark to "${now}"`,
    );
  } catch {
    fail(
      `${viewportName}: a press on an off-centre disc read "turn" but the wordmark stayed ` +
        `at "${beforePhrase}" for 2 s`,
    );
  }
}

// A press on the centred disc opens its page and reads `open`. This is the
// last check, because it leaves the home page.
async function checkOpenClick(page, viewportName, box) {
  // The turn above is still gliding. Wait for it to settle, then read the
  // discs and the centred vertex together, so the two agree.
  //
  // The centred vertex is the one nearest the snap direction, which is not
  // always the disc nearest the middle of the stage. Picking by screen
  // distance clicked the wrong disc and read "turn"; the stage names the
  // right one, so the check asks it.
  await page.waitForTimeout(2000);
  const [discs, centredRaw] = await Promise.all([
    hitPoints(page),
    page.locator('#menu-stage').getAttribute('data-centred-vertex'),
  ]);
  const centred = Number(centredRaw);
  const target = discs.find((disc) => disc.vertex === centred) ?? null;
  if (!target) {
    fail(
      `${viewportName}: the centred vertex ${centredRaw} is not among the ` +
        `${discs.length} discs the stage shows`,
    );
    return;
  }
  const expandSeen = page
    .waitForSelector('.menu-expand', { state: 'attached', timeout: 2000 })
    .then(() => true)
    .catch(() => false);
  await page.mouse.click(box.x + target.x, box.y + target.y);
  const what = await lastClick(page);
  if (what !== 'open') {
    fail(
      `${viewportName}: a press on the centred disc reads data-last-click "${what}", ` +
        `expected "open"`,
    );
    return;
  }
  if (!(await expandSeen)) {
    fail(`${viewportName}: no .menu-expand element appeared after the press on the centred disc`);
  }
  try {
    await page.waitForURL((url) => PAGE_PATHS.includes(url.pathname), {
      timeout: STAGE_TIMEOUT_MS,
    });
    console.log(
      `check-site: ${viewportName} /: a press on the centred disc reads "open" and opened ` +
        `${new URL(page.url()).pathname}`,
    );
  } catch {
    fail(
      `${viewportName}: the press on the centred disc did not open one of ${PAGE_PATHS.join(', ')} ` +
        `(the page is at ${new URL(page.url()).pathname})`,
    );
  }
}

// The three presses, in the order the issue asks for: miss, turn, open. The
// last one leaves the home page, so it comes last.
async function checkDiscClicks(page, viewportName) {
  const box = await page.locator('#menu-stage').boundingBox();
  if (!box) {
    fail(`${viewportName}: #menu-stage has no bounding box for the presses`);
    return;
  }
  await checkMissClick(page, viewportName, box);
  await checkTurnClick(page, viewportName, box);
  await checkOpenClick(page, viewportName, box);
}

// The transform the magnet writes on the form wrapper, as a string. An empty
// transform is the resting place.
function formTransform(page) {
  return page.evaluate(() => {
    const wrapper = document.querySelector('.contact-form');
    return wrapper ? getComputedStyle(wrapper).transform : 'missing';
  });
}

// Wait until the transform is other than `before`. Returns true on a change.
function waitForTransformChange(page, before, timeout = 1000) {
  return page
    .waitForFunction(
      (had) => {
        const wrapper = document.querySelector('.contact-form');
        if (!wrapper) return false;
        return getComputedStyle(wrapper).transform !== had;
      },
      before,
      { timeout },
    )
    .then(() => true)
    .catch(() => false);
}

// The contact form chases the pointer, holds still the moment the reader
// means to use it, and keeps what the reader typed. Below 720 pixels the form
// never moves, so the narrow viewport asserts that it holds from the start.
async function checkContactForm(page, label, viewport) {
  const wrapper = page.locator('.contact-form');
  if ((await wrapper.count()) !== 1) {
    fail(`${label}: found ${await wrapper.count()} .contact-form wrappers, expected 1`);
    return;
  }
  // The Send button and the mailto action, with no motion involved.
  const action = await page.locator('.contact-form form').getAttribute('action');
  if (!action?.startsWith('mailto:')) {
    fail(`${label}: the form action is "${action}", expected a mailto: address`);
  }

  const narrow = viewport.width < 720;
  const atRest = await formTransform(page);

  // 1. A pointer in a far corner pulls the form. It must move within 1 s.
  await page.mouse.move(viewport.width - 8, viewport.height - 8);
  const pulled = await waitForTransformChange(page, atRest);
  if (narrow) {
    if (pulled) fail(`${label}: the form moved on a viewport narrower than 720 pixels`);
    else console.log(`check-site: ${label}: the form holds still below 720 pixels`);
    return;
  }
  if (!pulled) {
    fail(`${label}: the pointer in the far corner did not move the form within 1 s`);
    return;
  }
  console.log(`check-site: ${label}: the pointer pulls the form (transform ${await formTransform(page)})`);

  // 2. A pointer on the form stops the chase at once.
  await wrapper.hover();
  await page.waitForTimeout(200);
  const held = await formTransform(page);
  await page.waitForTimeout(400);
  if ((await formTransform(page)) !== held) {
    fail(`${label}: the form kept moving while the pointer was on it`);
  } else {
    console.log(`check-site: ${label}: the form holds still under the pointer`);
  }

  // 3. The keyboard focuses the name field and types. The form must then
  // stay still, and the typed value must survive the motion.
  const name = page.locator('#contact-name');
  await name.focus();
  await page.keyboard.type('Ben');
  // The freeze eases back to the resting place in 300 ms. The scene sets
  // data-at-rest when that ease has finished, so the read below is not of a
  // frame in the middle of it.
  await page
    .waitForSelector('[data-effect="magnetic-form"][data-at-rest="true"]', {
      state: 'attached',
      timeout: 2000,
    })
    .catch(() => fail(`${label}: the form did not return to its resting place within 2 s`));
  // One more frame, so the read is of the frame the compositor now shows.
  await page.waitForTimeout(100);
  const frozen = await formTransform(page);
  await page.mouse.move(8, 8);
  await page.waitForTimeout(600);
  const after = await formTransform(page);
  if (after !== frozen) {
    fail(`${label}: the form moved after the reader had typed: "${frozen}" then "${after}"`);
  } else {
    console.log(`check-site: ${label}: the form stays still once the reader has typed`);
  }
  const kept = await name.inputValue();
  if (kept !== 'Ben') {
    fail(`${label}: the name field reads "${kept}" after the pointer moved, expected "Ben"`);
  } else {
    console.log(`check-site: ${label}: the typed value "${kept}" is kept`);
  }

  // 4. The three fields filled, and the Send button ready to submit.
  await page.locator('#contact-email').fill('ben@decent.tech');
  await page.locator('#contact-message').fill('Hello.');
  const send = page.locator('.contact-form button[type="submit"]');
  if (!(await send.isEnabled())) {
    fail(`${label}: the Send button is disabled with the three fields filled`);
  } else {
    console.log(`check-site: ${label}: the three fields are filled and Send is enabled`);
  }
  // Leave the form as the reader found it, so the screenshot shows the page
  // and not a half-filled card.
  await page.locator('.contact-form form').evaluate((form) => form.reset());
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

  // The field colour lives on <html>, which no scene touches, so the value
  // read here is the one the page painted before the bundle ran.
  await checkFirstPaint(page, label, pagePath);
  await checkPageWordmark(page, label, pagePath);

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
  // The contact form is magnetic while the page is in live motion, so its
  // checks run before the reduced-motion switch below. Below 720 pixels the
  // form never moves, so only the desktop viewport runs the chase.
  if (pagePath === '/contact/') {
    await checkContactForm(page, label, viewport);
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

  // The wheel step moves the sphere off the gold disc, so it comes after the
  // screenshot. The presses that leave the page run in a context of their
  // own: checkDiscPage for the three presses on the sphere, and
  // checkContinuityPaths once per continuity path.
  if (pagePath === '/' && menuState === 'ready') {
    await checkMenuWheel(page, viewport.name);
  }

  if (consoleErrors.length) {
    fail(`${label}: ${consoleErrors.length} console error(s):\n  ${consoleErrors.join('\n  ')}`);
  }
  await context.close();
}

// A home page of its own for the three presses on the sphere. It takes no
// screenshot: the twelve the run saves come from `checkPage()`.
//
// The presses run without cross-document view transitions. The press that
// opens a page is read through `data-last-click` on the stage and through the
// .menu-expand circle, and both of those need the stage to still be there
// after the press. With view transitions the site navigates at once, so the
// stage is gone before either can be read; without them the circle holds the
// page for its 450 ms and both are readable. `checkContinuityPaths` covers
// the other path.
async function checkDiscPage(browser, viewport) {
  const label = `${viewport.name} / discs`;
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();
  await withoutViewTransitions(page);
  const consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));

  const response = await page.goto(SITE_URL, { waitUntil: 'load' });
  if (!response || !response.ok()) {
    fail(`${label}: ${SITE_URL} answered ${response?.status() ?? 'no response'}`);
  }
  const state = await settle(page, '#menu-stage', `${label} #menu-stage`);
  if (state === 'ready') {
    // The stage publishes the discs on its first frame, but the sphere is
    // still settling on to the gold disc it starts on. Let it arrive.
    await page.waitForTimeout(1000);
    await checkDiscClicks(page, viewport.name);
  } else {
    console.log(`check-site: ${label}: menu WebGL branch "${state}", the presses do not apply`);
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
      // The three presses on the sphere need a home page of their own: the
      // press that opens ends on another page. This pass takes no screenshot.
      await checkDiscPage(browser, viewport);
      // One home click with cross-document view transitions on, and one with
      // them off. Both must land on the page with its field element present.
      await checkContinuityPaths(browser, viewport);
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
