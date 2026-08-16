import { mkdir, writeFile } from 'node:fs/promises'

const TOKEN = process.env.GH_CONTRIB_TOKEN
const USER = process.env.GH_USERNAME || 'aledminc'
const ANCHOR = new Date('2026-06-28T00:00:00Z')
const DAY_MS = 24 * 60 * 60 * 1000
const MAX_WINDOW_MS = 364 * DAY_MS

if (!TOKEN) {
  throw new Error(
    'GH_CONTRIB_TOKEN is required. Add it under repository Settings → Secrets and variables → Actions.',
  )
}

const QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          weeks {
            contributionDays { date contributionCount color }
          }
        }
      }
    }
  }
`

async function fetchWindow(from, to) {
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `bearer ${TOKEN}`,
      'Content-Type': 'application/json',
      'User-Agent': 'aledminc-portfolio-build',
    },
    body: JSON.stringify({
      query: QUERY,
      variables: {
        login: USER,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`GitHub GraphQL request failed: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  if (json.errors) throw new Error(`GitHub GraphQL error: ${JSON.stringify(json.errors)}`)
  if (!json.data?.user) throw new Error(`GitHub user “${USER}” was not found.`)

  return json.data.user.contributionsCollection.contributionCalendar.weeks
}

function chunkRanges(start, end) {
  const ranges = []
  let from = new Date(start)

  while (from <= end) {
    const to = new Date(Math.min(end.getTime(), from.getTime() + MAX_WINDOW_MS))
    ranges.push([new Date(from), to])
    from = new Date(to.getTime() + DAY_MS)
  }

  return ranges
}

const now = new Date()
const today = now.toISOString().slice(0, 10)
const anchorDate = ANCHOR.toISOString().slice(0, 10)

if (now < ANCHOR) {
  throw new Error(`Contribution anchor ${anchorDate} is later than the build date ${today}.`)
}

const allDays = []
for (const [from, to] of chunkRanges(ANCHOR, now)) {
  const weeks = await fetchWindow(from, to)
  for (const week of weeks) {
    for (const day of week.contributionDays) allDays.push(day)
  }
}

// GitHub pads calendar responses to full weeks, and chunk boundaries can
// overlap. Keep precisely the fixed anchor-to-today window, then de-duplicate.
const byDate = new Map(
  allDays
    .filter((day) => day.date >= anchorDate && day.date <= today)
    .map((day) => [day.date, day]),
)
const days = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))

await mkdir('src/data', { recursive: true })
await writeFile(
  'src/data/contributions.json',
  `${JSON.stringify({
    anchor: anchorDate,
    generatedAt: now.toISOString(),
    source: 'github',
    username: USER,
    days,
  })}\n`,
  'utf8',
)

console.log(`Wrote ${days.length} contribution days for ${USER} (${anchorDate} → ${today}).`)
