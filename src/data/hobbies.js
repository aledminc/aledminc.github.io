// ============================================================
// PLACEHOLDER CONTENT — TODO(xander): this is scaffolding, not real data.
// Replace the hobbies, stats, and media below with your own. The `note` fields
// deliberately say TODO so nothing here reads as a real claim while it's live.
//
// Shape notes:
//   media.type : 'video' | 'image'
//   media.src  : path under /public (served from the domain root)
//   accent     : per-hobby accent; overrides --accent inside the dashboard
//   stats      : keep the SAME THREE SHAPES for every hobby — two plain
//                count-ups and one bar (the one with `max`). That consistency
//                is what makes it read as a dashboard instead of loose figures.
// ============================================================
export const hobbies = [
  {
    id: 'basketball',
    label: 'Basketball',
    media: {
      type: 'image',
      src: '/assets/hobbies/basketball.svg',
      poster: '/assets/hobbies/basketball.svg',
    },
    accent: '#ff7a59',
    stats: [
      { label: 'Years playing', value: 12, unit: '' },
      { label: 'Free-throw %', value: 78, unit: '%', max: 100 },
      { label: 'Games / week', value: 4, unit: '' },
    ],
    note: 'TODO: a sentence or two about what you like about it.',
  },
  {
    id: 'photography',
    label: 'Photography',
    media: {
      type: 'image',
      src: '/assets/hobbies/photography.svg',
      poster: '/assets/hobbies/photography.svg',
    },
    accent: '#6c8cff',
    stats: [
      { label: 'Rolls shot', value: 34, unit: '' },
      { label: 'Keeper rate', value: 62, unit: '%', max: 100 },
      { label: 'Cameras owned', value: 3, unit: '' },
    ],
    note: 'TODO: a sentence or two about what you like about it.',
  },
  {
    id: 'chess',
    label: 'Chess',
    media: {
      type: 'image',
      src: '/assets/hobbies/chess.svg',
      poster: '/assets/hobbies/chess.svg',
    },
    accent: '#43d6a8',
    stats: [
      { label: 'Rapid rating', value: 1480, unit: '' },
      { label: 'Win rate', value: 54, unit: '%', max: 100 },
      { label: 'Games played', value: 920, unit: '' },
    ],
    note: 'TODO: a sentence or two about what you like about it.',
  },
]
