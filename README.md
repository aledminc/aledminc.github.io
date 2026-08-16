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
  pages/                Home, Projects, Schedule
  sections/             Hero + SensorDisc, Trajectory, Pursuits,
                        SignatureWall + SignaturePad
  hooks/                useAnimeScope  — anime.js scope, reduced-motion aware
                        useSceneExit   — writes --p for the sideways exits
                        useInView      — latches when a scene is reached
                        useMediaQuery
  data/                 content: projects, schedule, hobbies, timeline, socials
public/assets/          logo, project thumbnails, hobby plates (all SVG)
public/
  CNAME                 only if a custom domain is used
```

## Deploying

Pushes to `main` trigger [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
Repo **Settings → Pages → Build and deployment → Source** must be set to
**GitHub Actions**. The workflow can also be re-run manually from the Actions tab.

### GitHub activity deploy checklist

Before pushing the contribution graph workflow:

- Add the repository Actions secret `GH_CONTRIB_TOKEN` with read-only profile/contribution access.
- Confirm `GH_USERNAME` in the workflow is the exact account name (`aledminc`).

After deployment:

- Confirm the hero shows the contribution graph beside the copy without vertical scrolling.
- Confirm the first graph column begins Sunday, June 28, 2026, with no partial leading week.
- Spot-check a recent contribution day against GitHub and confirm the one-slide timer is hidden.
- Manually run the workflow the next day and confirm the new day appears.
- Re-run the performance and reduced-motion checks after adding any future rotating slide.
