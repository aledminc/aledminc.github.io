# Xander Minch — Personal Portfolio

React + Vite single-page portfolio, deployed to GitHub Pages via GitHub Actions.

## Design system — "Meridian"

A daylight instrument panel: warm cream ground, deep navy for everything
structural, dark forest green as the only "live" colour (active states, the
status lamp in `.eyebrow`, the one accent in a chart). Tokens live in
[src/index.css](src/index.css) and nothing should hard-code a hex outside it.

Three rules the components depend on:

- **Two materials, used against each other.** `.raise` is neumorphic relief
  (anything pressable, and the stage a scene sits on); `.glass` is translucent
  and blurred so the site-wide field shows through; `.well` is a recess (tracks,
  boards, inputs). One light source, upper-left, for the whole site.
- **One call to action per scene**, and two or three elements on screen at a
  time. `.switch` is the site's single selector idiom — it filters projects,
  picks a pursuit, and chooses a signature method.
- **Scenes never exit upward.** The background ([`MeridianField`](src/layout/MeridianField.jsx))
  is fixed and continuous, so content is staged on top of it; a `.layer` leaves
  sideways or dissolves in place. Sliding up would just read as scrolling. The
  mechanism is [useSceneExit.js](src/hooks/useSceneExit.js) writing one custom
  property, `--p`, that the `.layer` rules in `index.css` turn into motion.

Type is three roles, do not collapse them: **Space Grotesk** headlines,
**Inter** prose, **JetBrains Mono** for data only — times, counts, codes,
labels. Numbers should always look like a readout.

## Stack

| Concern    | Choice                                     |
| ---------- | ------------------------------------------ |
| Build tool | Vite                                       |
| Framework  | React 19 + `react-router-dom` v7           |
| Animation  | anime.js v4 (`animejs`)                    |
| Email      | EmailJS (`@emailjs/browser`) — client-side |
| Deploy     | GitHub Actions → GitHub Pages              |

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview  # serve the production build locally
```

## Hosting notes

GitHub Pages is static hosting. Two constraints shape the architecture:

- **No server-side routing.** Deep links like `/projects` would 404 on direct
  load. The deploy workflow copies `dist/index.html` to `dist/404.html` so Pages
  serves the app for any unmatched path and the router renders the right route.
  (This returns an HTTP 404 status while rendering correctly — acceptable here;
  the [spa-github-pages](https://github.com/rafgraph/spa-github-pages) redirect
  script is the upgrade path if strict 200s ever matter for SEO.)
- **No backend.** The `/schedule` meeting form cannot send mail itself; it posts
  through EmailJS from the browser. No Node/PHP/serverless mail handler will run.

This is a **user site** repo (`<username>.github.io`), so it serves from the
domain root and `base` is `'/'` in [vite.config.js](vite.config.js). A project
repo would instead need `base: '/<repo-name>/'` plus a matching router
`basename`.

## Project layout

```
src/
  main.jsx              entry; mounts <App/> in Router
  App.jsx               route table
  index.css             design tokens, materials, .layer/.scene, .switch, .btn
  layout/               Layout (field + nav + <Outlet/> + footer),
                        MeridianField — the fixed canvas every page sits on
  components/           HeroRotator and the build-fed ContributionGraph
  pages/                Home, Projects, Schedule
  sections/             Hero, Trajectory, Pursuits,
                        SignatureWall + SignaturePad
  hooks/                useAnimeScope  — anime.js scope, reduced-motion aware
                        useSceneExit   — writes --p for the sideways exits
                        useInView      — latches when a scene is reached
                        useMediaQuery
  data/                 content: projects, schedule, hobbies, timeline, socials,
                        and the local contribution-data fallback
public/assets/          logo, project thumbnails, hobby plates (all SVG)
public/
  CNAME                 only if a custom domain is used
```

## Deploying

Pushes to `main` trigger [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
Repo **Settings → Pages → Build and deployment → Source** must be set to
**GitHub Actions**. The workflow can also be re-run manually from the Actions tab.

### Required Actions secrets

The build expects these repository secrets under **Settings → Secrets and
variables → Actions**:

- `GH_CONTRIB_TOKEN` — a read-only GitHub token used only inside Actions to
  fetch the contribution calendar. It is never included in client JavaScript.
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_TEMPLATE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`

The GitHub username is set to `aledminc` in the workflow. The contribution job
runs before Vite builds, daily at `06:17 UTC`, on pushes to `main`, and through
manual workflow dispatch. It writes fresh data to `src/data/contributions.json`
inside the ephemeral Actions checkout; it does not commit generated data back.

## GitHub activity pipeline

The fetch implementation lives at
[`.github/scripts/fetch-contributions.mjs`](.github/scripts/fetch-contributions.mjs).
GitHub limits contribution-calendar queries to roughly one year, so the script
chunks the anchor-to-today range into 364-day windows, joins the responses,
removes padded/overlapping days, and bakes the exact date range into the deploy.

Local development uses the committed placeholder contribution file. The graph
fills every missing date from its fixed Sunday anchor (`2026-06-28`) with zero,
so the calendar remains structurally accurate without requiring a local token.
Do not put `GH_CONTRIB_TOKEN` in a `VITE_*` variable or `.env`: Vite variables
are public by design.

For an optional local real-data refresh, expose the token only to the script
process and run:

```bash
GH_CONTRIB_TOKEN=... GH_USERNAME=aledminc node .github/scripts/fetch-contributions.mjs
```

The hero rotator currently has one slide, so its segmented timer is correctly
hidden. Adding another entry to `HERO_SLIDES` in `src/sections/Hero.jsx`
automatically enables the eight-second timer, keyboard tabs, and hover/focus
pause behavior.
