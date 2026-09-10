# Rebrand this library

This package is the Uncomfortable Academy component library, copied from
`Decent-Tako/uncomfortable-academy/design-system` on 2026-09-10. It still
carries the Academy palette and copy. It is not rebranded yet: that happens
when the Decent brand kit arrives, by the steps below. Every component keeps
its mechanism, its controls, its `play` test, and its attribution through a
rebrand. Only the brand binding changes.

One change was made in the copy because this repository is public: the two
faces are now aliases, **Brand Sans** and **Brand Script**, bound to SIL OFL
files. The Academy face, FF DIN for PUMA, is not here; its name table forbids
copying.

The brand lives in four places. Change them in this order.

## 1. Faces: two font files

The library names two faces and nothing else. They are declared once, in
`src/brand/tokens.css`, and bound to three files:

| Alias | Weight | File | Shipped as |
| --- | --- | --- | --- |
| Brand Sans | 400 | `public/fonts/brand-sans-400.woff2` | Uncomfortable Sans Regular, SIL OFL |
| Brand Sans | 700 | `public/fonts/brand-sans-700.woff2` | Uncomfortable Sans Bold, SIL OFL |
| Brand Script | 400 | `public/fonts/brand-script-400.woff2` | Nothing You Could Do, SIL OFL |

To change a face, replace the file and keep the alias. Put the licence text
next to it, as `brand-sans-OFL.txt` and `brand-script-OFL.txt` are now. Do not
add a third family name anywhere; the guard below will not know about it. If
the brand kit has no script face, bind Brand Script to the same file as Brand
Sans 400 and change the wordmark in step 3.

Every story asserts at load that the face it renders is the real file and not
a system fallback, through `assertFaceNotFallback('Brand Sans', 400)` and
`700`, and `Brand Script` where the wordmark appears. A broken font path fails
`npm run storybook:test` instead of rendering Arial quietly.

## 2. Colours: one token block plus eight literals

`src/brand/tokens.css` holds the palette as custom properties under `:root`,
currently the Academy values:

| Token | Role | Value now |
| --- | --- | --- |
| `--ink` | text, plates | `#212121` |
| `--paper` | page | `#FFFFFF` |
| `--soft` | raised surface | `#F2F2F2` |
| `--line` | hairlines | `#D9D9D9` |
| `--quiet` | disabled marks | `#A6A6A6` |
| `--charcoal` | muted text | `#4A4A4A` |
| `--accent-blue` | hover and focus | `#0035B1` |
| `--accent-yellow` | press and confirmed | `#DEF54F` |

Keep the token names when the hues change. `--accent-blue` means "the hover
and focus colour" and `--accent-yellow` means "the press colour".

Every stylesheet under `src/` reads these tokens. TypeScript files that need a
literal, for example a motion colour interpolation between two hex values, or
a test that asserts a computed `rgb()` colour, carry the value directly. To
change them in one pass:

```sh
cd design-system
grep -rli '#0035B1\|#DEF54F\|#212121\|#FFFFFF\|#F2F2F2\|#D9D9D9\|#A6A6A6\|#4A4A4A' src
grep -rl 'rgb(33, 33, 33)\|rgb(255, 255, 255)\|rgb(0, 53, 177)\|rgb(222, 245, 79)' src
```

Replace each value in those files, keeping eight-digit forms such as
`#0035B100` intact apart from the first six digits. Update
`src/brand/colors.ts`, which the Brand pages document and the contrast report
checks, and the `rgb()` assertions in the page and wordmark stories. Then run
`npm run storybook:test`. The contrast report fails on any text pair below
4.5 to 1, and the Colors story compares the rendered tokens with `colors.ts`,
so a weak or mismatched value shows up there first.

## 3. Wordmark: one component

`src/brand/Wordmark.tsx` renders two lines, a Brand Sans uppercase lead over a
Brand Script line, and reads "Uncomfortable" over "Academy". Change the words
and the `label` there. Page stories assert the wordmark text through
`src/pages/storySupport.ts`, so change `expectLiveWordmark` in the same commit.

## 4. Photographs and copy

`public/photos/` holds five placeholder gradients at the exact dimensions of
the Academy photographs they replace, so every layout holds. The Academy
photographs are campaign material and were not copied into this public
repository. Replace each file and keep its name, or change the paths and alt
text in `src/pages/content.ts`. Every photograph renders in full colour in
every state; a rule in `tokens.css` enforces that.

The copy inside the stories is Academy copy: Week 0, the $3,000 goal, the
Challenge week. It is content, not brand. Change it per story when you lift a
component into the site, not here.

## Run it

```sh
cd design-system
npm ci
npm run storybook          # http://127.0.0.1:6012
npm run storybook:test     # rubric check, then every story in Chromium
npm run storybook:build    # storybook-static/
```

Port 6012 leaves 6011 free for the Academy library on the same machine.

## What was removed in the copy

- `public/fonts/DINPuma400.woff` and `DINPuma700.woff`: licensed, not distributable.
- `public/photos/*`: replaced by same-size placeholders.
- `src/typefaces/` and `public/fonts/matches/`: research comparing DIN matches
  against the Academy face; meaningless without it.
- `src/brand/Fallback.stories.tsx`: compared the licensed face with its fallback.

Everything else is intact, including the 115 Motion example components, the
Motion Primitives vendored files, and Runtime additions.
