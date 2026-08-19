export const hobbies = [
  {
    id: 'golf',
    label: 'Golf',
    kind: 'golf',
    accent: '#2c6a51',
    handicap: 15,
    recentScores: [96, 89, 87, 93, 91],
    courses: [
      'Sahm’s Golf Course',
      'Cascades Golf Course',
      'Taylor’s Par 3',
      'West Chase Golf Course',
      'Saddlebrook Golf Course',
    ],
    media: {
      type: 'gif',
      src: null,
      alt: 'Xander’s golf swing',
    },
  },
  {
    id: 'gaming',
    label: 'Video games',
    kind: 'gaming',
    accent: '#33507a',
    ranks: [
      {
        game: 'VALORANT',
        mode: 'Peak rank',
        rank: 'Diamond 2',
        visual: {
          type: 'image',
          src: 'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/19/largeicon.png',
        },
      },
      {
        game: 'Rocket League',
        mode: 'Standard · 3v3',
        rank: 'Champion II',
        division: 'Division I',
        visual: {
          type: 'image',
          src: 'https://gist.githubusercontent.com/armollica/2d03767d66218066680493b1f16cb21f/raw/c4e1b7fe3a63933de7fe9c71514ca1e29d7eff7b/champion-2.png',
        },
      },
      {
        game: 'Rocket League',
        mode: 'Doubles · 2v2',
        rank: 'Champion II',
        division: 'Division II',
        visual: {
          type: 'image',
          src: 'https://gist.githubusercontent.com/armollica/2d03767d66218066680493b1f16cb21f/raw/c4e1b7fe3a63933de7fe9c71514ca1e29d7eff7b/champion-2.png',
        },
      },
      {
        game: 'Counter-Strike 2',
        mode: 'Premier · CS Rating',
        rank: '10,562',
        visual: {
          type: 'premier',
          color: '#4777d3',
        },
      },
    ],
  },
  {
    id: 'chess',
    label: 'Chess',
    kind: 'classic',
    media: {
      type: 'image',
      src: '/assets/hobbies/chess.svg',
      alt: 'Geometric chessboard illustration',
    },
    accent: '#2c6a51',
    stats: [
      { label: 'Rapid rating', value: 1480 },
      { label: 'Win rate', value: 54, unit: '%' },
      { label: 'Games played', value: 920 },
    ],
  },
]
