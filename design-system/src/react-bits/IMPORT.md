# Import one React Bits component

This is the procedure for one component. Follow it in order. Touch only
the files it names. Every import touches its own two folders and
`package.json`. No shared file changes.

Read `vendor/README.md` first. It holds the licence and the runtime policy.

## Files you own

```
src/react-bits/vendor/<section>/<name>/<UpstreamFile>   the upstream copy, with header
src/react-bits/<section>/<name>/source.ts              provenance, defaults, REACT_BITS_SOURCE
src/react-bits/<section>/<name>/<Name>.tsx             the wrapper in ReactBitsFrame
src/react-bits/<section>/<name>/<Name>.stories.tsx     three stories minimum
src/react-bits/<section>/<name>/<name>.css             brand styling, if needed
```

`<section>` is `animations`, `backgrounds`, `components`, or
`text-animations`. `<name>` is the upstream name in kebab case. The script
writes the first four.

## The five commands

Run every command in `design-system/`.

1. Vendor the upstream files and scaffold the folder.

   ```sh
   node scripts/vendor-react-bits.mjs Animations/FadeContent
   ```

   Use the upstream section and folder name from `catalogue.ts`. The script
   is idempotent. It never overwrites a file that exists.

2. Install the runtime packages. Copy the line the script printed.

   ```sh
   npm install --save-exact gsap@3.15.0
   ```

   The script skips this line when nothing is needed. Do not install a
   package the upstream file does not import.

3. Open the story while you edit the three scaffolded files.

   ```sh
   npm run storybook
   ```

   Local Storybook uses port 6012. If it is in use, run
   `npx storybook dev --host 127.0.0.1 --port <free port> --no-open`.

4. Check lint, types, and the rubric.

   ```sh
   npm run lint && npm run type && npm run rubric
   ```

5. Run the stories in Chromium and build.

   ```sh
   npm run storybook:test && npm run storybook:build
   ```

Then commit, push, and open the pull request. Say what the local changes to
the vendored file are, if any, and paste the last lines of the four checks.

## Edit source.ts

1. Keep `REACT_BITS_SOURCE` as written. Change only the `runtime` rows.
2. Write `why` for every runtime row: what the package does in this
   component. Tidy `licence` to a short name, for example
   `GSAP Standard License, no charge (https://gsap.com/standard-license)`.
3. Check `<NAME>_DEFAULTS` against the vendored file. The script guesses
   it from the props destructuring. Every upstream prop that a person can
   set becomes an entry with the upstream default. Remove props that take
   children, DOM nodes, refs, or callbacks. Say which ones in the fixed note.
4. Where the upstream exposes a colour prop, set the default to a brand
   token value: `#212121` ink, `#FFFFFF` paper, `#0035B1` accent blue,
   `#DEF54F` accent yellow. Record the upstream value in the control
   description.

## Edit the wrapper

1. Render the upstream component inside `ReactBitsFrame`. Do not build the
   frame yourself. The frame has the heading, the attribution paragraph,
   the runtime line, the fixed note, Pause and Replay, `MotionConfig`, and
   the stage with `data-testid`, `data-paused`, `data-webgl`, and
   `stageRef`.
2. Fill `mechanism` and `controls` in `ReactBitsAttribution`. Name what
   moves, how, and which upstream props drive it. Name what Pause and
   Replay do.
3. Fill `fixedNote`: what stays fixed, why, and which upstream props are
   not controls.
4. Pass every default as a prop. Pass `key={run}` so Replay remounts the
   upstream component.
5. Wire Pause. Use the upstream API when there is one. When the upstream
   file keeps its animation private, add the smallest local change to the
   vendored file, for example a `paused` prop, and list it in the header.
6. Wire reduced motion with `useReduce(reducedMotion)`. When it is true,
   show the final state at once: zero duration, no loop, or a static frame.
   Put `data-reduced` on the stage through `stageData`.
7. Write the state a play function needs onto the stage through
   `stageData`: for example `data-state`, `data-active`, `data-count`.
8. Text renders in Brand Sans. The frame sets it on `p`, `h2`, and
   `button`. Set `font-family: 'Brand Sans', Arial, sans-serif` on any
   other text node in your CSS.
9. Colours use brand tokens. `var(--ink)`, `var(--paper)`, `var(--soft)`,
   `var(--line)`, `var(--quiet)`, `var(--charcoal)`, `var(--accent-blue)`,
   `var(--accent-yellow)`. Add `rb-frame__stage--ink` for a dark stage.
10. Content comes from `src/pages/content.ts`: `FEATURES`, `HERO`,
    `PHOTOS`, `DESTINATIONS`. Photographs come from `public/photos/`
    through `publicAsset()`. No remote image. No other text source.

## WebGL and canvas components

1. Probe the context once in a state initialiser. When `getContext`
   returns null, pass `webgl="unavailable"` to the frame. The frame renders
   `<p data-webgl="unavailable">` in place of the children. Pass `pending`
   until the sketch has drawn, then `ready`.
2. Bind pointer listeners to the stage element, not `window` or
   `document.body`. Use `stageRef`.
3. In `play`, assert the stage exists, wait until `data-webgl` is not
   `pending`, then branch. Unavailable: assert the fallback paragraph.
   Ready: interact and assert.
4. Call `assertCanvasPainted(canvas, backgroundHex)` from
   `frame/canvasSupport.ts` in the ready branch. It samples a grid of
   pixels and throws when every sample equals the background. A WebGL
   sketch that draws once and then stops needs `preserveDrawingBuffer:
   true` as a local change, or assert a data attribute instead. Say which
   in the fixed note.
5. Use `movePointer` and `dragPointer` from `frame/pointerSupport.ts`.

## Edit the stories

Three stories minimum: `Default`, one variant with a different upstream
prop and a name that says what it changes, and `ReducedMotion` with
`reducedMotion: 'always'`. Add a story for each further mode the upstream
page shows.

1. `title` is `React Bits/<Section>/<Component name>`. The script sets it.
   Do not edit `.storybook/preview.tsx`.
2. `argTypes` has one typed entry per key in `<NAME>_DEFAULTS`. Use
   `range` for numbers with sensible bounds, `boolean`, `color`, `select`
   with `options` for enums and ease names, and `text` for free strings.
   Every description ends with `Upstream default <value>.`
3. `parameters.docs.description.component` names the mechanism, the
   commit, the date, the licence, the page, the runtime, and what Pause
   and Replay do.
4. Every `play` calls `assertFaceNotFallback('Brand Sans', 400)` and
   `700`, asserts the heading with `getByRole('heading', { name })`,
   interacts with the stage, and asserts the state changed. Then it
   clicks Pause and asserts `data-paused="true"`. `Default` also clicks
   Replay and asserts the restart.
5. Keep `a11y: { test: 'error' }` in `parameters`. Fix violations in your
   CSS, not with an exclusion.

## Definition of done

- [ ] `vendor/<section>/<name>/` holds every upstream file with the
      attribution header and a true `Local changes` list.
- [ ] `source.ts` exports `REACT_BITS_SOURCE` with one `runtime` row per
      package and a `why` on each.
- [ ] Every upstream prop a person can set is a typed control with the
      upstream default. Exceptions are named in the fixed note.
- [ ] Colours use brand tokens. Where the upstream has a colour prop, its
      default is a brand token value.
- [ ] Text renders in Brand Sans.
- [ ] Content is Academy copy from `src/pages/content.ts`; photographs
      come from `public/photos/` through `publicAsset()`. No remote image.
- [ ] Three stories minimum: `Default`, one variant, `ReducedMotion`.
- [ ] Every `play` interacts and asserts. Canvas components call
      `assertCanvasPainted` and pass with and without WebGL.
- [ ] Pause and Replay work and the play functions prove it.
- [ ] `npm run lint`, `npm run type`, `npm run rubric`,
      `npm run storybook:test`, and `npm run storybook:build` pass.
- [ ] The component shows on **React Bits / Overview** as built, with its
      story link, and its packages show on **React Bits / Runtime**. No
      edit to any file outside your two folders and `package.json`.

## Worked example

`animations/fade-content/` is the reference import. `Animations/FadeContent`
went through the script and this recipe on 2026-09-10. Compare your three
files to it.
