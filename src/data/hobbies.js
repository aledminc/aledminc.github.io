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
          src: '/assets/hobbies/rocket-league-champion-2.webp',
        },
      },
      {
        game: 'Fortnite',
        mode: 'Peak rank',
        rank: 'Unreal',
        visual: {
          type: 'image',
          src: '/assets/hobbies/fortnite-unreal.png',
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
]
