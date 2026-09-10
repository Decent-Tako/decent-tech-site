# decent.tech site

Static HTML under this folder, served by nginx from the container. The
design-system bundle `assets/site.js` and `assets/site.css` mounts the
Infinite Menu on the home page and one React Bits scene on every other page.
The copy sits on a plate in front; the scene runs full-bleed behind it.

## Page to scene

| Page | Background scene (`data-scene`) | Extra (`data-effect`) | Dominant colour |
| --- | --- | --- | --- |
| Home `/` | Infinite Menu on `#menu-stage`, filling the viewport | | navy `#182534` |
| About `/about/` | Liquid Ether (`liquid-ether`) | Split Text on the h1 (`split-text`) | navy and steel blue `#5b8fa3` |
| Portfolio `/portfolio/` | Galaxy (`galaxy`) | | vermilion `#e34234` |
| Blog `/blog/` | Threads (`threads`) | Scrambled Text on the h1 (`scrambled-text`) | terracotta `#d97757` on charcoal `#2c2c2c` |
| About Ben `/ben/` | Iridescence (`iridescence`) | | steel blue `#5b8fa3` |
| Get in touch `/contact/` | Plasma (`plasma`) | Shiny Text on the email link (`shiny-text`) | gold `#ffcb73` on navy |

Cursor effects off by Ben's request 2026-09-10. `splash-cursor` and
`ribbons` stay in the registry and in Storybook, but no page mounts them, and
every background scene ignores the pointer. Each background keeps its own
motion.

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
There is no header band, no bottom link row, and no footer. The other five
pages keep the header, the plate, and the footer.

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

## Behaviour

- WebGL 2 is probed once. Without it a scene mounts nothing and its element
  reports `data-webgl="unavailable"`; the copy stays as it is.
- `prefers-reduced-motion: reduce` pauses every loop on its first frame and
  is followed when it changes.
- A hidden tab or an off-screen scene pauses the loop.
- Every canvas is `aria-hidden`. Text effects render the text already in the
  HTML, so a heading reads the same with no script.

## Checks

`tests/test_site.py` checks the markup. `design-system/scripts/check-site.mjs`
runs in the container workflow: it opens all six pages at two viewports in
Chromium, asserts zero console errors and a settled `data-webgl` on every
scene, and saves twelve screenshots to the `site-shots` artifact.
