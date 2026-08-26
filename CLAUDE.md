# Jaljyoti — design engineering notes

## DESIGN ENGINEERING STACK

### MCPs installed

Configured in project-scoped `.mcp.json` (committed, no secrets). The pre-existing
`iconscout` server stays where it was, in `~/.claude.json`, untouched.

| MCP | Transport | Verified | Use it for |
|---|---|---|---|
| `context7` | remote http | handshake OK, v4.0.3 | Current docs for Next/React/Three/R3F/GSAP/Tailwind/Drei/Lenis. Query before writing against any of these APIs. |
| `shadcn` | npx stdio | handshake OK, 7 tools | Search registries, view component source, get the add command. |
| `magicui` | npx stdio | handshake OK, 3 tools | Animated landing-page components and interaction patterns. |
| `playwright` | npx stdio | handshake OK, 24 tools | Responsive QA, hover/scroll/nav behaviour, screenshots in a **real** Chrome. |
| `chrome-devtools` | npx stdio | handshake OK, 29 tools | Perf traces, Lighthouse, console/network/DOM, animation and rendering diagnosis. |
| `figma` | remote http | reachable, **401 — OAuth needed** | Design context, components, variables/tokens. |
| `blender` | — | **not installed**, `uvx` missing | Would cover Blender → GLB → R3F. |

Deliberately not installed: Storybook (none in repo), 21st.dev/Magic (overlaps
`magicui`, needs a key), Framelink Figma (unofficial fork — official server exists),
Design System Extractor (no official source), GitHub (the `gh` CLI already covers
it), Filesystem (native file tools), Sequential Thinking (native reasoning),
Sentry (no Sentry in this project).

### Frontend libraries currently present

All of these are genuinely imported — none are dead weight.

- **Next.js 15.2.8 / React 19**, App Router, npm
- **Tailwind v4** (`@theme` tokens in `globals.css`) — the design system
- **GSAP 3.15 + ScrollTrigger + `@gsap/react`** — all scroll choreography
- **Lenis 1.3.26** — smooth scroll, driven off GSAP's ticker
- **Three 0.185 + R3F 9.7 + Drei 10.7** — the test-kit showcase
- **`@pmndrs/assets`** — HDRI environment (dynamic import)
- **motion 13.1** — only `border-beam` and `spotlight-new`
- **ogl 1.0** — only the Aurora hero background
- **clsx + tailwind-merge** — `cn()` in `src/lib/utils.js` (shadcn convention, shadcn itself not initialised)
- **MUI 6** — legacy `/classic` and `/admin-dashboard` only; kept off the main routes

### Recommended

Keep the current stack. It is already the right small combination:

- **GSAP + ScrollTrigger** owns scroll choreography, pinning and scrubbing. It is
  the single animation authority — do not introduce a second one.
- **Lenis** stays, on GSAP's ticker, so scroll position never drifts a frame behind.
- **Three + R3F + Drei** for the product showcase. Drei covers what the scene needs.
- **Tailwind v4 tokens** remain the styling source of truth.

### Rejected, and why

- **Framer Motion** — `motion` *is* its successor and is already installed. Adding it would be the same library twice.
- **GLSL shaders** — nothing on the roadmap needs a custom shader; R3F + Drei materials cover it. Reach for one only when a specific effect demands it.
- **CSS scroll-driven animations** — ScrollTrigger already does this with full browser support and integrates with Lenis. Native support is still uneven.
- **View Transitions** — conflicts with Lenis-managed scroll, and App Router support is still moving.
- **Lottie** — would add a runtime (~250KB) for effects the hand-built animated SVG set in `src/components/icons/` already covers.
- **Rive** — excellent, but needs an editor, a runtime and an asset pipeline this project does not have.
- **Raw WebGL** — already covered by Three (and ogl).

### Two things worth fixing

1. **Three WebGL contexts on the homepage** — Aurora (ogl) plus two `TestKitScene`
   canvases. Aurora also overlaps the CSS `.jj-ambient` layer that is already
   behind it. Folding Aurora into CSS would drop a whole WebGL context and the
   `ogl` dependency.
2. **`motion` earns its place twice only** — `border-beam` and `spotlight-new` are
   both simple loops that CSS can do. Converting them removes the second animation
   runtime entirely.

Neither is urgent; both are pure subtraction.

## How to use the MCPs here

**Before writing code against a library**, ask `context7` — this project sits on
React 19, Next 15, R3F 9 and Drei 10, all of which moved fast and are easy to get
subtly wrong from memory.

**Browser work — pick the right surface.** There are now four. In order of preference
for this repo:

1. `chrome-devtools` — anything about *why* something is slow or broken: perf traces,
   Lighthouse, console, network, layout.
2. `playwright` — responsive checks, interaction QA, screenshots across viewports.
3. The built-in browser pane — quick DOM/console checks only.

**Important:** the built-in pane does not initialise WebGL (canvases come back
unsized) and its screenshots are blank, so the 3D scenes **cannot** be verified
there. Use `playwright` or `chrome-devtools` for anything touching
`TestKitScene`, `HeroScene` or Aurora, and actually look at the result.

**Components** — search `shadcn` and `magicui` before hand-rolling a pattern, but
restyle to the `@theme` tokens in `globals.css`. Do not import a component's own
palette.

**Figma** — once authorised, pull variables/tokens rather than eyeballing values.

**Verification standard for this repo:** never report a visual change as done
without looking at the rendered result. Geometry and timing can be proven by
computation; appearance cannot.
