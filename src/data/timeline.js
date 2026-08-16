// Career timeline entries, oldest first. Each stop carries one inspectable
// artifact so the timeline reads as evidence, not only biography.
export const timeline = [
  {
    id: 'iu-bs-start',
    date: 'Aug 2023 – May 2027 (expected)',
    title: 'B.S. in Computer Science',
    org: 'Indiana University, Bloomington',
    blurb:
      'Specializing in Artificial Intelligence, with minors in Data Science, Mathematics, and Business.',
    tag: 'education',
    icon: 'education',
    artifact: {
      title: 'Undergraduate Transcript',
      meta: 'PDF · 2 pages',
      preview: '/assets/timeline/transcript-preview.webp',
      href: '/assets/timeline/undergraduate-transcript.pdf',
      alt: 'Cropped preview of Xander Minch’s undergraduate transcript',
      kind: 'document portrait compact',
    },
  },
  {
    id: 'saama',
    date: 'Jun – Aug 2025',
    title: 'Software Engineering Intern',
    org: 'Saama Technologies',
    blurb:
      'Designed an AI-powered clinical protocol review system built on LLM summarization pipelines, cutting manual document review time by 40–60%.',
    tag: 'industry',
    icon: 'industry',
    artifact: {
      title: 'Saama Technologies',
      meta: 'Company website',
      preview: '/assets/timeline/saama-logo.svg',
      href: 'https://www.saama.com/',
      alt: 'Saama Technologies logo',
      kind: 'brand',
    },
  },
  {
    id: 'bioinformatics',
    date: 'Sep 2025 – May 2026',
    title: 'Undergraduate Researcher',
    org: 'IU–Bloomington Bioinformatics Lab',
    blurb:
      'Built an end-to-end pipeline for single-cell RNA expression data across 30k+ genes and millions of cells, reaching 0.065 reconstruction loss on the main task.',
    tag: 'research',
    icon: 'research',
    artifact: {
      title: 'CIGS-TTVAE Research Poster',
      meta: 'PDF · Research artifact',
      preview: '/assets/timeline/poster-preview.webp',
      href: '/assets/timeline/cigs-ttvae-poster.pdf',
      alt: 'Preview of the CIGS-TTVAE research poster',
      kind: 'document',
    },
  },
  {
    id: 'robotics',
    date: 'Aug 2026 – Present',
    title: 'Team Lead, Robotics at IU',
    org: 'Indiana University',
    blurb:
      'Leading a competition rover build across mechanical, hardware, and software subteams — sensors, firmware, controls, and autonomous navigation.',
    tag: 'leadership',
    icon: 'robotics',
    artifact: {
      title: 'University Rover Competition (URC)',
      meta: 'Mars Society · Competition',
      preview: '/assets/timeline/urc-rover.webp',
      href: 'https://urc.marssociety.org/',
      alt: 'A competition rover operating in desert terrain',
      kind: 'image',
    },
  },
  {
    id: 'iu-ms',
    date: 'Aug 2026 – Dec 2027',
    title: 'Accelerated M.S. in Intelligent Systems Engineering',
    org: 'Indiana University, Bloomington',
    blurb:
      'Accelerated Master of Science program specializing in Cyber-Physical Systems. Start: Aug 2026. Expected completion: Dec 2027.',
    tag: 'education',
    icon: 'education',
    artifact: {
      title: 'M.S. Intelligent Systems Engineering',
      meta: 'Luddy School · Program',
      preview: '/assets/timeline/iu-trident.png',
      href: 'https://luddy.iu.edu/academics/masters/ise.html',
      alt: 'Indiana University trident',
      kind: 'brand',
    },
  },
]
