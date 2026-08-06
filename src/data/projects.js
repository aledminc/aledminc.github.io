// ============================================================
// Projects shown on /projects, newest first.
//
// Sourced from github.com/aledminc — every repo created on or after
// 2025-03-02. Titles, blurbs, contributors, and languages come from each
// repo's README and the GitHub API, not from guesswork; the three repos with
// no README are marked TODO below rather than described speculatively.
//
// Deliberately omitted:
//   Wells-Fargo-ForageIntership — a fork of Forage's "Task 2 Starter Repo"
//     with one commit; a training template rather than a project. Add it back
//     here if you want it shown.
//   aledminc.github.io — this site itself.
//   neetcode-submissions — a practice log, not a project.
//   Par-N-Putt — not present on the public profile, so nothing to exclude.
//
// REQUIRED fields per the spec: title, contributors, date (completed),
// thumbnail. Everything else (href, tags, blurb, lang) is optional extra.
// `date` is 'YYYY-MM' taken from the repo's last push.
// ============================================================
export const projects = [
  {
    id: 'omeglol',
    title: 'omegLOL — real-time try-not-to-laugh webcam game',
    contributors: ['Xander Minch'],
    date: '2026-07',
    thumbnail: '/assets/projects/omeglol.svg',
    href: 'https://github.com/aledminc/omegLOL',
    lang: 'JavaScript',
    tags: ['Web'],
    blurb:
      'Live 1v1 and 2v2 matches over peer-to-peer WebRTC — video never touches the server. Express + ws on one HTTP server, Postgres with an ELO ranking system, better-auth accounts, and on-device face scoring via MediaPipe.',
  },
  {
    id: 'contentfarm',
    title: 'ContentFarm',
    contributors: ['Xander Minch'],
    date: '2026-07',
    thumbnail: '/assets/projects/contentfarm.svg',
    href: 'https://github.com/aledminc/ContentFarm',
    lang: 'Python',
    tags: ['Tools'],
    // TODO(xander): this repo has no README, so there is nothing factual to
    // describe it with. Add a one-liner and confirm the tag.
    blurb: 'TODO: add a description — the repo has no README yet.',
  },
  {
    id: 'ncaacomp',
    title: 'NCAAComp — March Madness tournament seed prediction',
    contributors: ['Xander Minch'],
    date: '2026-05',
    thumbnail: '/assets/projects/ncaacomp.svg',
    href: 'https://github.com/aledminc/NCAAComp',
    lang: 'Python',
    tags: ['AI/ML'],
    blurb:
      'Two-stage pipeline: classify which teams reach the tournament, then predict overall seed from raw season stats. Placed 3rd of all IU teams in the NCAA Data Analytics Competition.',
  },
  {
    id: 'vaegenepredict',
    title: 'VAEGenePredict — variational autoencoder for gene expression',
    contributors: ['Xander Minch'],
    date: '2026-05',
    thumbnail: '/assets/projects/vaegenepredict.svg',
    href: 'https://github.com/aledminc/VAEGenePredict',
    lang: 'Python',
    tags: ['AI/ML', 'Research'],
    // TODO(xander): no README. Blurb inferred from the repo name and your
    // bioinformatics lab work — confirm or rewrite.
    blurb:
      'TODO (inferred): generative modeling of gene expression data with a variational autoencoder.',
  },
  {
    id: 'p2p-raffle',
    title: 'P2P Raffle Marketplace — peer-to-peer raffle platform',
    contributors: ['Xander Minch'],
    date: '2026-01',
    thumbnail: '/assets/projects/p2p-raffle.svg',
    href: 'https://github.com/aledminc/P2P-Raffle-Marketplace',
    lang: 'Web',
    tags: ['Web'],
    blurb:
      'Verified sellers list physical goods and buyers purchase low-cost raffle entries for a chance to win them — chance-based participation with the transparency and polish of a premium resale marketplace.',
  },
  {
    id: 'saamaproblem',
    title: 'Synthetic EHR generation with privacy metrics',
    contributors: ['Xander Minch'],
    date: '2025-05',
    thumbnail: '/assets/projects/saamaproblem.svg',
    href: 'https://github.com/aledminc/SaamaProblem',
    lang: 'Python',
    tags: ['AI/ML'],
    blurb:
      'Fits a tabular generative model to real electronic health record data and samples 1,000 synthetic patient records, evaluated with column-wise statistical tests plus PCA-distance and record-matching privacy risk.',
  },
  {
    id: 'catanai',
    title: 'CatanAI — AI players for Settlers of Catan',
    contributors: ['Liam Coveney', 'Sam Greenfield', 'Xander Minch'],
    date: '2025-05',
    thumbnail: '/assets/projects/catanai.svg',
    href: 'https://github.com/aledminc/CatanAI',
    lang: 'Python',
    tags: ['AI/ML'],
    blurb:
      'Team project extending kvombatkere/Catan-AI, a bare-bones Catan simulator, into a platform for training and evaluating automated players.',
  },
  {
    id: 'iub-schedule',
    title: 'IUB Schedule AutoBuilder — automated IU course scheduling',
    contributors: ['Xander Minch'],
    date: '2025-04',
    thumbnail: '/assets/projects/iub-schedule.svg',
    href: 'https://github.com/aledminc/IUB-Schedule-AutoBuilder',
    lang: 'Python',
    tags: ['Tools'],
    blurb:
      'Reads an IU academic advisement report, scrapes degree requirements, and searches the course catalog for classes that satisfy them — checking prerequisites, already-completed credits, and schedule conflicts.',
  },
  {
    id: 'marchmadness',
    title: 'MarchMadness',
    contributors: ['Xander Minch'],
    date: '2025-03',
    thumbnail: '/assets/projects/marchmadness.svg',
    href: 'https://github.com/aledminc/MarchMadness',
    lang: 'Python',
    tags: ['AI/ML'],
    // TODO(xander): no README. Add a description.
    blurb: 'TODO: add a description — the repo has no README yet.',
  },
]

// Chip row order for the filter bar. 'All' is prepended in the component.
export const projectTags = ['AI/ML', 'Web', 'Research', 'Tools']
