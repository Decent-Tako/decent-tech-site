# decent.tech site

Static HTML under this folder, served by nginx from the container. The
design-system bundle `assets/site.js` and `assets/site.css` mounts the
Infinite Menu on the home page and one React Bits scene on every other page.
The copy sits on a plate in front; the scene runs full-bleed behind it.

## Every page is the inside of its dot

The home page is a sphere of five dots. A click on a dot opens that page, and
the page **is** the inside of that dot: it paints in the dot colour, a
signature motion in the contrasting brand colours develops out of that field,
and the copy sits on a plate in front.

The field colour sits on `<html>` as a `field--<token>` class, so the page
paints in its colour before any script or scene loads. That first paint is
what the view transition lands on.

## The colour system

| Page | Field, the dot colour | Plate | Plate type | Motion colours |
| --- | --- | --- | --- | --- |
| Home `/` | navy `#182534`, the stage | navy | cream | the five discs on navy |
| About `/about/` | gold `#ffcb73` | navy | cream | molten waves in terracotta `#d97757` and cream `#f2f1e8` |
| Portfolio `/portfolio/` | vermilion `#e34234` | navy | cream | stars in cream and gold |
| Blog `/blog/` | terracotta `#d97757` | navy | cream | ink threads in navy `#182534` |
| About Ben `/ben/` | steel `#5b8fa3` | navy | cream | aurora in gold and cream |
| Get in touch `/contact/` | cream `#f2f1e8` | none, type on the field | navy | light in gold |

The wordmark word and the running head are navy on every field. Both are
display type, so the WCAG large-text threshold of 3:1 applies; navy clears it
on all five fields, 3.77:1 on vermilion being the lowest. The running head is
1.5rem bold, 24 pixels, and 1.35rem bold on a phone.

The right-hand list keeps the navy scrim and the cream type it has on the home
page, because its small type needs the full 4.5:1 over whatever the scene
draws behind it.

### The full stop

The full stop of every wordmark is always a contrasting colour, Ben's rule.
The rule has two parts: the stop must differ from the word it sits in, and it
must also read against the field behind it. Cream on gold is 1.3:1 and was
almost invisible on the About page, so the stop is set per field:

| Field | Full stop | Ratio, stop on field |
| --- | --- | --- |
| gold `#ffcb73`, About | vermilion `#e34234` | 2.76:1 |
| vermilion `#e34234`, Portfolio | cream `#f2f1e8` | 3.64:1 |
| terracotta `#d97757`, Blog | cream `#f2f1e8` | 2.75:1 |
| steel `#5b8fa3`, About Ben | cream `#f2f1e8` | 3.14:1 |
| cream `#f2f1e8`, Get in touch | vermilion `#e34234` | 3.64:1 |
| navy `#182534`, the home stage | gold `#ffcb73` | 10.38:1 |

The stop is a decorative accent inside the navy word, not text that stands
alone, so no 3:1 floor is set for it. On the terracotta field no brand colour
other than the word colour reaches 3:1, and cream at 2.75:1 is the best of
them. The gold field takes vermilion for the same reason: gold is the only
brand colour with a higher ratio there, and gold is the field.

Every `decent.` wraps its stop in `<span class="wordmark-dot">`, in the home
wordmark, in the page wordmarks, and in the phrases of the list. The colour
comes from the `--wordmark-dot` token, never from an inline style.

### The right-hand list entries

Each list link is a flex box with `row-reverse`, so the colour swatch sits to
the right of the phrase. A link must therefore hold exactly two flex children:
the swatch, and the whole phrase in one `<span class="menu-list__phrase">`.
Without that span the reversal takes the words and the full stop as separate
children and the entry reads backwards, "work . decent".

## Page to scene

| Page | Background scene (`data-scene`) | Extra (`data-effect`) |
| --- | --- | --- |
| Home `/` | Infinite Menu on `#menu-stage`, filling the viewport | |
| About `/about/` | Liquid Ether (`liquid-ether`), the molten field | Split Text on the h1 (`split-text`), the section discs (`section-dots`), the next dot (`next-dot`) |
| Portfolio `/portfolio/` | Galaxy (`galaxy`), the starfield | the next dot (`next-dot`) |
| Blog `/blog/` | Threads (`threads`), the ink threads | Scrambled Text on the h1 (`scrambled-text`), the next dot (`next-dot`) |
| About Ben `/ben/` | Iridescence (`iridescence`), the aurora | the next dot (`next-dot`) |
| Get in touch `/contact/` | Plasma (`plasma`), the light | Shiny Text on the email link (`shiny-text`), the magnet on the contact form (`magnetic-form`), the next dot (`next-dot`) |

Galaxy draws on a transparent canvas, so the vermilion field shows through;
its stars take a hue shift to the gold angle with a part saturation, which
spreads the star hues between cream and gold. Plasma and Threads carry alpha
in the same way. Iridescence paints an opaque canvas, so on About Ben the
canvas is drawn at `--scene-veil` opacity over the flat steel field; that is
what `data-veil` on the scene element turns on.

The five scenes already vendored carry the whole colour system. Nothing new
was imported: the open React Bits batch pull requests hold every component the
table could otherwise have used, and an import into one of those folders would
collide with them.

Cursor effects off by Ben's request 2026-09-10. `splash-cursor` and
`ribbons` stay in the registry and in Storybook, but no page mounts them, and
every background scene ignores the pointer. Each background keeps its own
motion.

## Continuity between the pages

`site/styles.css` opts the whole site into cross-document view transitions
with `@view-transition { navigation: auto; }`. Three elements are shared
across the navigation:

| Name | On the home page | On a page |
| --- | --- | --- |
| `field` | the expanding circle `.menu-expand` | the full-bleed `.scene` |
| `wordmark` | `.home .site-header` | `.page-wordmark` |
| `pages` | `.home .menu-list` | `.page .menu-list` |

So the circle in the disc colour morphs into the field of the page it opens,
and the wordmark and the list slide from their home place to their page place.
The transition runs about 500 ms with an ease-out, and 0 s under
`prefers-reduced-motion: reduce`.

The site runs the circle or the shared element, never both. `SiteMenu.tsx`
detects `'startViewTransition' in document` and
`CSS.supports('view-transition-name: x')`. With them it navigates straight
away and lets the browser own the motion; without them it grows its own circle
and then navigates. Either way the page opens on its flat field colour, and
the scene fades in over that field in 400 ms once its first frame is ready.

The scene names are the keys of `SCENES` in
`design-system/src/site/scenes.ts`. Colours and numbers come from `data-*`
attributes on the mount element; every colour is one of the seven brand
colours: cream `#f2f1e8`, navy `#182534`, vermilion `#e34234`, gold
`#ffcb73`, terracotta `#d97757`, charcoal `#2c2c2c`, steel blue `#5b8fa3`.

## Home layout

The home page is immersive: a wordmark and a sphere. The stage fills the
viewport edge to edge. The wordmark sits over it top left in cream, large, in
the serif stack, and it is the only text on the sphere; the "Technology
Group" line is left out here. The five pages sit over the stage on the right
as a vertical list, vertically centred, and on a phone at the bottom right.
There is no header band, no bottom link row, and no footer.

Every other page is laid out the same way, and Ben removed the header band and
the footer from all of them on 2026-09-10. The wordmark overlays the field top
left and reads that page's phrase, the list of pages overlays the right with
the current page marked `aria-current="page"`, the disc label of the page sits
above the plate as a running head, and the plate holds the copy. On a page the
list entries are plain links; they turn no sphere. The five-link markup stays
in the HTML, so the navigation works with no script.

The sphere is never wholly inside the screen. `SiteMenu.tsx` computes the
scale from the viewport instead of a fixed number, so the projected diameter
stays about 1.35 times the shorter viewport side, and applies it again on
every resize through `setScale` (local change 15). The discs are cut at the
top and the bottom in landscape and at the left and the right in portrait.

Each disc carries its own label as text in `site/menu/<slug>.svg`: navy
`#182534` on the disc colour, the serif stack, centred.

## Phrases

Ben wrote these on 2026-09-10. `design-system/src/site/pages.ts` is the one
source, as the `phrase` and `label` fields.

| Dot | Page | Phrase | Disc label |
| --- | --- | --- | --- |
| gold | About `/about/` | Hey, we're decent. | hey. |
| vermilion | Portfolio `/portfolio/` | decent. work | work. |
| terracotta | Blog `/blog/` | decent. read | read. |
| steel | About Ben `/ben/` | decent. people | people. |
| cream | Get in touch `/contact/` | decent. contact | contact. |

## Home behaviour

The sphere starts on the gold disc, so the wordmark reads "Hey, we're
decent." at load. A change of dot crossfades the wordmark to the new phrase
in about 250 ms; under `prefers-reduced-motion: reduce` it swaps at once. A
visually hidden live region mirrors the phrase for assistive technology.

A click or a tap on a disc grows a circle in the disc colour over the stage
and then opens that page. The wordmark does the same on a click, on Enter,
and on Space, from its own centre, and it opens the active page. A click on a
list entry opens that entry's page the same way. Under reduced motion the
page opens at once with no circle.

A pointer over a list entry, or keyboard focus on it, turns the sphere to
that dot through `turnToItem` (local change 14). Leaving the entry does
nothing; the sphere stays. The wheel turns the sphere one page per step, and
the arrow keys do the same while the wordmark has focus. A step walks the
five pages in the order of the table above and wraps at the ends, so a
forward step from About reaches Portfolio and a step back from About reaches
Get in touch. The home page itself does not scroll.

Every turn glides. The snap covers a constant part of the angle that is left
on each frame, so the sphere leaves quickest, arrives slowest, and is about
99 per cent of the way there after 600 ms. It can never pass the dot. One
trackpad gesture is one disc: wheel events inside 250 ms count as one step,
and events below 4 units are the tail of a gesture and are ignored.

The list is the keyboard path and the no-WebGL path. It holds a real link to
every page, so it works with no bundle and with no WebGL.

## The contact form

Get in touch holds one form: name, email, message, and a Send button. It is
its own plate, navy type and fields on a cream card, and it works with no
script at all.

The page is now the inside of the cream dot, so the cream card has no edge
against its own field. The page draws that edge, navy at 12 per cent, from
the `.page--contact .contact-form__card` rule; the tokens of the form block
itself are unchanged. The Shiny Text on the email link above the form also
moved from cream to navy with a vermilion shine, because cream type would be
invisible on the cream field.

There is no backend yet. The form posts to `mailto:hello@decent.tech` with
`enctype="text/plain"`, so Send opens the reader's mail program with the
three fields in the body. `nginx.conf` already allows `form-action 'self'
mailto:`. A real endpoint comes later; only the `action` changes then.

The `magnetic-form` scene makes the form magnetic. Its host is an empty
element next to the form that names the wrapper with `data-target`, because a
React root replaces the children of the element it mounts into. The scene
renders nothing and moves the wrapper with a transform only, so the layout,
the field order, the tab order, and the focus never change.

While the pointer is on the page and away from the form, the wrapper closes
about 8 per cent of the distance to the pointer on each frame. It chases; it
never jumps. The travel is capped at 40 per cent of the viewport and at the
viewport edges, so the form never leaves the screen.

The form holds still, at once and completely, when any one of these is true:

- the pointer is inside the form plus a 24 pixel margin;
- any field or the button has focus;
- the reader has typed in any field this visit;
- the pointer is a touch or a pen;
- the viewport is narrower than 720 pixels;
- `prefers-reduced-motion: reduce` is on.

The first Tab into the page also freezes it, so a keyboard reader never sees
it move. Once the reader has typed, the form stays still for the rest of the
visit and eases back to its resting place in 300 ms.

## Sections as dots

On About the three services fold into three discs in the page's field colour,
each labelled with a short word. A press grows a circle out of the disc, in
the same motion the home sphere uses, and the section's plate fades in over
it. A close control, a small disc with an x, shrinks it back; Escape does the
same from anywhere on the page. There is no route change and no scroll jump.

The labels take the serif and the dot rule of the running heads: the short
word in navy on the field, with the full stop in a `wordmark-dot` span.

| Disc | Section |
| --- | --- |
| strategy. | Technology strategy |
| build. | Software delivery |
| run. | Infrastructure and operations |

The markup is whole without the script. The HTML holds the three articles with
their headings and their copy, so a reader with no bundle reads all three at
once; the `section-dots` scene only folds them. Its host is an empty element
next to the grid that names the grid with `data-target`, for the same reason
the magnetic form uses one: a React root replaces the children of the element
it mounts into.

Each disc is a real `button`, so Enter, Space, and the tab order work with
nothing added. The heading names the section for assistive technology through
`aria-label`, and the short word stays the visible label.

The discs keep their row. The plate of the section that is open is a grid item
of its own, under that row, with the class `section-dot__panel--full`: it spans
every column, so the heading and the copy read at the measure of the other
plates and the close control sits in its top right. In the article of its
section the plate kept the width of one column, and the copy read in a strip
about a third of the plate wide, beside the discs.

Under reduced motion the plate appears at once: no circle, no fade.

The same component is ready for Portfolio, Blog, and About Ben when their
content arrives. Those pages are unchanged for now.

## Scroll to the next dot

At the bottom of every page, below the plate, the next dot in the cycle rises
into view as a disc in its colour with its label. The cycle is About,
Portfolio, Blog, About Ben, Get in touch, and back to About, so the whole site
is one loop that echoes the sphere.

A press opens that page through the view transition. Reaching the bottom of a
page opens nothing: it only shows the disc. The next page opens on a deliberate
push. Once the page is already at its bottom, the reader must keep pushing, and
the wheel or the touch drag must gather more than the disc's own height within
1.5 seconds. A reader who simply reads to the end of the page stays there.

The scene listens to the wheel and to touch, never to the scroll event. The
scroll event only drives the rise of the disc.

The disc is a real link in the HTML, so a reader with no bundle still reaches
the next page, and a keyboard reader simply tabs to it. Under reduced motion
the disc is a plain link with no rise, no listener is attached, and no push can
open the next page.

## The wordmark morphs between pages

The cross-document view transition already shares the wordmark element. The
phrase inside it carries its own name, `wordmark-word`, so `decent.` and its
full stop hold still while the word that changes crossfades over about 350 ms:
"decent. work" becomes "decent. read" in place.

Where the browser has no view transitions, the destination page fades the new
word in as it did before. Under reduced motion the word swaps at once.

## Idle life

After 20 seconds with no pointer, wheel, key, or touch, every scene and the
home sphere slow to about a third of their motion. The first input of any of
those kinds brings them back at once.

One watcher runs per page, started by the site entry, and it sets
`data-idle="true"` on the stage and on every scene host, so the site check can
read the flag and CSS can slow what it animates through the `--idle-rate`
token.

Each scene takes the rate through the speed prop it already had.
`Threads` gained a `speed` prop (local change 4) and the Infinite Menu gained
`setRate()` and a `rate` prop (local change 17), because neither had one. Both
accumulate the scaled step instead of scaling the timestamp, so a change of
rate changes the speed and never jumps the motion.

Reduced motion never idles: nothing is moving to slow down.

## Behaviour

- WebGL 2 is probed once. Without it a scene mounts nothing and its element
  reports `data-webgl="unavailable"`; the copy stays as it is.
- `prefers-reduced-motion: reduce` pauses every loop on its first frame and
  is followed when it changes.
- A hidden tab or an off-screen scene pauses the loop.
- Every canvas is `aria-hidden`. Text effects render the text already in the
  HTML, so a heading reads the same with no script.

## Checks

`tests/test_site.py` checks the markup: the field class of every page, the
wordmark with its coloured full stop, the five-link list with `aria-current`,
the running head, the `@view-transition` rule, and the contrast of every plate
pair and every running head on its field.

`design-system/scripts/check-site.mjs` runs in the container workflow: it opens
all six pages at two viewports in Chromium, asserts zero console errors and a
settled `data-webgl` on every scene, reads the first-paint field colour of
each page, checks that each wordmark reads its phrase, and saves twelve
screenshots to the `site-shots` artifact. It then runs both continuity paths
per viewport, one home click with cross-document view transitions on and one
with them off, and both must land on the page with its field element present.

The check also presses one section disc on About and asserts that its plate is
visible and that the page did not navigate, then presses Escape and asserts
that the section closed; scrolls to the bottom of Blog past the next dot and
asserts that About Ben opened; and waits 21 seconds on the home page with no
input, asserts `data-idle`, then moves the pointer and asserts that it
cleared. The About screenshot is taken with one section open.
