// Career timeline entries, oldest first — the section animates top to bottom.
// Content pulled from the 2026 resume. Edit here, never in the JSX.
//
// tag       -> visual grouping; each maps to a --tag-* color token in index.css
// upcoming  -> renders as "Expected" with a hollow node (not yet completed)
export const timeline = [
  {
    id: 'iu-bs-start',
    // TODO(xander): the resume lists only the May 2027 completion date, so this
    // start date is inferred from a four-year track. Confirm or correct.
    date: 'Aug 2023',
    title: 'Started B.S. in Computer Science',
    org: 'Indiana University, Bloomington',
    blurb:
      'Specializing in Artificial Intelligence, with minors in Data Science, Mathematics, and Business.',
    tag: 'education',
  },
  {
    id: 'saama',
    date: 'Jun – Aug 2025',
    title: 'Software Engineering Intern',
    org: 'Saama Technologies',
    blurb:
      'Designed an AI-powered clinical protocol review system built on LLM summarization pipelines, cutting manual document review time by 40–60%.',
    tag: 'industry',
  },
  {
    id: 'bioinformatics',
    date: 'Sep 2025 – May 2026',
    title: 'Undergraduate Researcher',
    org: 'IU–Bloomington Bioinformatics Lab',
    blurb:
      'Built an end-to-end pipeline for single-cell RNA expression data across 30k+ genes and millions of cells, reaching 0.065 reconstruction loss on the main task.',
    tag: 'research',
  },
  {
    id: 'robotics',
    date: 'Aug 2026 – Present',
    title: 'Team Lead, Robotics at IU',
    org: 'Indiana University',
    blurb:
      'Leading a competition rover build across mechanical, hardware, and software subteams — sensors, firmware, controls, and autonomous navigation.',
    tag: 'leadership',
  },
  {
    id: 'iu-bs',
    date: 'May 2027',
    title: 'B.S. Computer Science',
    org: 'Indiana University, Bloomington',
    blurb: 'GPA 3.7. AI specialization.',
    tag: 'education',
    upcoming: true,
  },
  {
    id: 'iu-ms',
    date: 'Dec 2027',
    title: 'Accelerated M.S., Intelligent Systems Engineering',
    org: 'Indiana University, Bloomington',
    blurb: 'Specializing in Cyber-Physical Systems.',
    tag: 'education',
    upcoming: true,
  },
]
