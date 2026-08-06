# Xander Minch — Personal Portfolio

React + Vite single-page portfolio, deployed to GitHub Pages via GitHub Actions.

## Stack

| Concern    | Choice                                     |
| ---------- | ------------------------------------------ |
| Build tool | Vite                                       |
| Framework  | React + `react-router-dom` v6              |
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
  index.css             global tokens + resets
  layout/               NavHeader, Footer, Layout (nav + <Outlet/> + footer)
  pages/                Home, Projects, Schedule
  sections/             AboutMe, CareerTimeline, HobbiesRolodex, SignatureCollage
  hooks/                useAnimeScope.js — reusable anime.js scope hook
  data/                 JSON content: projects, schedule, hobbies, timeline
  assets/               logo, thumbnails, hobby media
public/
  CNAME                 only if a custom domain is used
```

## Deploying

Pushes to `main` trigger [.github/workflows/deploy.yml](.github/workflows/deploy.yml).
Repo **Settings → Pages → Build and deployment → Source** must be set to
**GitHub Actions**. The workflow can also be re-run manually from the Actions tab.
