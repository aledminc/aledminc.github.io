// ============================================================
// Weekly routine shown on /schedule. This is Xander's routine, NOT
// availability — booking happens through the meeting-request form.
//
// !! TODO(xander): CONFIRM THE TIMES !!
// Course codes, days, titles, and class numbers below were read directly off
// your Fall 2026 schedule screenshot and are accurate. The START AND END TIMES
// ARE ESTIMATES — the screenshot shows blocks on a time grid but no printed
// times, so these were derived from block positions and are likely off by up to
// ~15 minutes. Correct them here and the grid updates itself.
//
// Two titles were cut off in the screenshot and are marked below.
// ============================================================

export const semester = 'Fall 2026'

export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

export const events = [
  // ENGR-E 533 — LEC:0001 [8480]
  {
    day: 'Tue',
    start: '09:45',
    end: '11:00',
    code: 'ENGR-E 533',
    title: 'Deep Learning Systems',
    kind: 'class',
    where: 'LEC:0001 · 8480',
  },
  {
    day: 'Thu',
    start: '09:45',
    end: '11:00',
    code: 'ENGR-E 533',
    title: 'Deep Learning Systems',
    kind: 'class',
    where: 'LEC:0001 · 8480',
  },

  // BUS-G 300 — LEC:0001 [3554]
  // TODO(xander): title truncated as "INTRODUCTION TO M..." in the screenshot.
  {
    day: 'Mon',
    start: '11:15',
    end: '12:30',
    code: 'BUS-G 300',
    title: 'Introduction to M…',
    kind: 'class',
    where: 'LEC:0001 · 3554',
  },
  {
    day: 'Wed',
    start: '11:15',
    end: '12:30',
    code: 'BUS-G 300',
    title: 'Introduction to M…',
    kind: 'class',
    where: 'LEC:0001 · 3554',
  },

  // CSCI-B 405 — LEC:0001 [12592]
  {
    day: 'Tue',
    start: '13:00',
    end: '14:15',
    code: 'CSCI-B 405',
    title: 'Applied Algorithms',
    kind: 'class',
    where: 'LEC:0001 · 12592',
  },
  {
    day: 'Thu',
    start: '13:00',
    end: '14:15',
    code: 'CSCI-B 405',
    title: 'Applied Algorithms',
    kind: 'class',
    where: 'LEC:0001 · 12592',
  },

  // ENGR-E 500 — Monday only, shorter block; no class number was visible.
  // TODO(xander): title truncated as "INTRODUCTION TO T..." in the screenshot.
  {
    day: 'Mon',
    start: '15:00',
    end: '15:50',
    code: 'ENGR-E 500',
    title: 'Introduction to T…',
    kind: 'class',
    where: 'LEC:0001',
  },

  // ENGR-E 501 — LEC:0001 [10208]
  // TODO(xander): title truncated as "INTRODUCTION TO C..." in the screenshot.
  {
    day: 'Tue',
    start: '16:00',
    end: '17:15',
    code: 'ENGR-E 501',
    title: 'Introduction to C…',
    kind: 'class',
    where: 'LEC:0001 · 10208',
  },
  {
    day: 'Thu',
    start: '16:00',
    end: '17:15',
    code: 'ENGR-E 501',
    title: 'Introduction to C…',
    kind: 'class',
    where: 'LEC:0001 · 10208',
  },

  // TODO(xander): add club meetings — e.g. Robotics at IU, which you lead.
  // The grid and legend pick up any new `kind` automatically:
  // {
  //   day: 'Wed', start: '18:00', end: '19:00',
  //   code: 'Robotics at IU', title: 'Team meeting',
  //   kind: 'club', where: 'Luddy Hall',
  // },
]

// Colors per event kind. Any kind used above needs an entry here.
export const kindLabels = {
  class: 'Class',
  club: 'Club',
}
