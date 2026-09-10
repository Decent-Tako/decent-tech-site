# decent.tech site

Static HTML under this folder, served by nginx from the container. The
design-system bundle `assets/site.js` and `assets/site.css` mounts the
Infinite Menu on the home page and one React Bits scene on every other page.
The copy sits on a plate in front; the scene runs full-bleed behind it.

## Page to scene

| Page | Background scene (`data-scene`) | Extra (`data-effect`) | Dominant colour |
| --- | --- | --- | --- |
| Home `/` | Infinite Menu on `#menu-stage` | | navy `#182534` |
| About `/about/` | Liquid Ether (`liquid-ether`) | Split Text on the h1 (`split-text`) | navy and steel blue `#5b8fa3` |
| Portfolio `/portfolio/` | Galaxy (`galaxy`) | Splash Cursor over the page (`splash-cursor`) | vermilion `#e34234`, gold splats `#ffcb73` |
| Blog `/blog/` | Threads (`threads`) | Scrambled Text on the h1 (`scrambled-text`) | terracotta `#d97757` on charcoal `#2c2c2c` |
| About Ben `/ben/` | Iridescence (`iridescence`) | Ribbons cursor over the page (`ribbons`) | steel blue `#5b8fa3` |
| Get in touch `/contact/` | Plasma (`plasma`) | Shiny Text on the email link (`shiny-text`) | gold `#ffcb73` on navy |

The scene names are the keys of `SCENES` in
`design-system/src/site/scenes.ts`. Colours and numbers come from `data-*`
attributes on the mount element; every colour is one of the seven brand
colours: cream `#f2f1e8`, navy `#182534`, vermilion `#e34234`, gold
`#ffcb73`, terracotta `#d97757`, charcoal `#2c2c2c`, steel blue `#5b8fa3`.

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
