## This file

Principles, patterns, locations, invisible-bug rules. No code docs, no names/props/behaviour readable from file. Example → name one file, never describe.

## Work style

- Each rec once. No recap/summary/"what to do". Ordered steps → one numbered list only.
- **No comments.** Intent in code: fn name = what it does, named var > explained expr, split branch needing heading, bool named for condition. Line needs comment → change code. Comments only when asked.
- Named class bundle = reusable/semantic JSX element → small component owns element + base classes. Callers pass content, state, real variants; never recompose bundle.
- No build, no dev server, no browser test, no commit/branch — user does visual QA. Stop at lint (`npx eslint <files>`). Runtime bug survives two blind fixes → ask to run it (dev server usually up on :3000; attach, don't start another).

## Where

| Kind | Loc |
| --- | --- |
| Anim utils by concern | `utils/anim/` |
| Hooks, 1/file | `utils/hooks/` |
| Browser/env probes | `utils/browser/` |
| FX components | `ui/fx/` |
| Sections | `ui/sections/` |
| Multi-part features + contexts | `ui/features/<feature>/` |
| Pure formatters | `utils/formatters/` |

>2 args → options object. `utils/anim/` module = one concern (pure fns beside hooks using them).

## Scroll & anim

**Libs.** `framer-motion` all component + scroll motion; `lenis` smooth scroll; `three.js` one WebGL layer. No hand-roll:

- Scroll read: `useScroll` → `useTransform`/`useMotionTemplate`. Never scroll listener.
- Programmatic scroll: `utils/anim/lenis.ts` (singleton, mounted once at root). Never element/`scrollIntoView`. Scroll lock → pause/resume via `useScrollLock`.
- Bg video: no `autoPlay`, no preload on mount. `useVideoInView` arms after settle, play/pause via `IntersectionObserver`.
- Every `<video>` gets no-op `filter`. Firefox macOS promotes unfiltered, fully-visible, untransformed video to native compositor surface, skips limited-range (`color_range=tv`) expand → grey blacks, only while clear of viewport edges → looks like scroll bug. Filter blocks promotion. Chrome/Safari fine → no local repro outside Firefox. Ref `VideoOpenable.tsx`.

**Feature scroll state.** Context per feature in `ui/features/<feature>/` via `createContextWithHook`, no prop drilling; degrade quietly outside provider. Hooks return refs flat, never in object (`react-hooks/refs` flags member access on ref container in render).

**Timelines.** `timeline` consts mix units; name tells: progress (0…1) ends `At`/`Start`/`End`, pixels `Y`/`Offset`/`Px`. Scroll budget in viewport fractions > measured px. Don't abstract `timeline` consts — tuning surface.

**Easings.** Sections use `utils/anim/motion-ease.ts` roles, not a specific easing (one-offs excepted). New easing → named in `utils/anim/easings.ts`, never raw bezier at call site.

**Readiness gate.** Gate entrances, lazy `import()`, media downloads on `utils/browser/idle.ts`, not `load` (browser still busy).
**Hand rAF loops.** Outside framer-motion: anchor progress to first frame actually run, accumulate clamped delta. Never wall-clock — stall/paused tab starts mid-anim. framer-motion does this already.

**Measure.** `useElementSize`/`useElementHeight` for layout vs unsettled text. Layout-relevant image geometry derived at build in Astro page-data assembly → island props, not by hand.

**Unused on purpose.** `utils/anim/canvas-util.ts`, `utils/anim/webgl-utils.ts` — keep.

### Perf

- **Compositor-only anim**: `transform`, `opacity`. Never layout/paint props (`top`/`left`/`width`/`height`/`margin`, box-shadow, filter) on scroll — entrances too (wipe = `overflow-hidden` mask, not blur).
- **Scroll off React state**: MotionValues. `useState` only at edge for display, never per frame.
- **Measure** via `useResizeObserver`, not scroll handlers. Many observers one callback → only one fires on mount.
- **Pause hidden/idle**: gate FX on visibility; stop RAF/WebGL off-screen; cap canvas backing-store res.
- **Heavy out of hydration**: one `client:load` island → module-scope imports parsed before interaction. Big optional deps → dynamic `import()` gated on settled. Defer below-fold (lazy img, in-view play, visibility-gated raster), not on mount.

## Adaptivity

Tailwind v4 in CSS, no `tailwind.config.js`. Breakpoints + scaling tokens in `styles/`; components tune at call site w/ variants/utils. Few component `.css` in `styles/` for what utils can't (`scribble-strike.css`, `hud.css`) — only for pseudo-elements, `clip-path`, keyframes; not just for responsive.

**Desktop-first.** Stock breakpoints wiped → `max-width` `@custom-variant`s in `styles/tailwind-breakpoints.css`. Base = large screen, override down (`flex-row tablet-s:flex-col`). No `sm:`/`md:`/`lg:` — gone. `--breakpoint-*` `:root` vars inert; `@custom-variant` queries = truth, edit those.

**Fluid tokens > variants for size/spacing.** `styles/tailwind-spacings.css`, `styles/tailwind-fonts.css` redefine props at own `@media`, re-export via `@theme inline` → one util (`text-title-1`, `p-section-padding`, `w-content-width`) rescales, no variant. Use for site-wide scaling values (type ramp, section rhythm, content width); tune by editing token breakpoints, never override at call site. Component-own sizes (own padding ladder, fixed el size) stay `max-width` variants in component, as do layout changes (direction, hide/show, cols).

**Three breakpoint scales on purpose** — layout variants, spacing tokens, font tokens break at different widths. Don't align. Adjust in layer owning the thing.

**Per-breakpoint value → JS only if JS consumes.** Plain CSS size → native `max-width` variants, never JS config. `utils/browser/breakpoints.ts` (`ResponsiveValue<T>` keyed by bp name; `resolveResponsiveValue` imperative, `useResponsiveValue` render) only when number feeds non-CSS computation (WebGL camera dim, measurement driving scroll keyframe).

**Sibling gap** = `margin-bottom` on preceding el, never `margin-top`. Last sibling can change → derive margin from state, not `:last-child`.

**Viewport height** = `--viewport-height` var (JS-synced), never `100vh` — mobile chrome breaks `vh`.
