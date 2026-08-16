import { useMemo } from 'react'
import raw from '../data/contributions.json'
import './ContributionGraph.css'

const DAY_MS = 24 * 60 * 60 * 1000

const dateAtUtc = (value) => new Date(`${value}T00:00:00Z`)
const isoDate = (value) => value.toISOString().slice(0, 10)

const levelFor = (count) =>
  count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4

export default function ContributionGraph() {
  const { weeks, monthMarkers, total, lastDate } = useMemo(() => {
    const supplied = new Map(raw.days.map((day) => [day.date, day]))
    const start = dateAtUtc(raw.anchor)
    const now = new Date()
    const today = dateAtUtc(isoDate(now))
    const end = today < start ? start : today
    const days = []

    for (let cursor = new Date(start); cursor <= end; cursor = new Date(cursor.getTime() + DAY_MS)) {
      const date = isoDate(cursor)
      days.push(supplied.get(date) ?? { date, contributionCount: 0 })
    }

    const weeks = []
    for (let index = 0; index < days.length; index += 7) {
      weeks.push(days.slice(index, index + 7))
    }

    const monthMarkers = weeks.map((week, index) => {
      const first = dateAtUtc(week[0].date)
      const previous = index > 0 ? dateAtUtc(weeks[index - 1][0].date) : null
      const startsNewMonth = !previous || first.getUTCMonth() !== previous.getUTCMonth()
      return startsNewMonth
        ? first.toLocaleString('en', { month: 'short', timeZone: 'UTC' })
        : ''
    })

    // Month starts can occupy adjacent week columns (the anchor is Jun 28,
    // only three days before July). Prefer the newer label when two would
    // overlap; the precise anchor remains visible in the header above.
    let previousMarker = -4
    monthMarkers.forEach((month, index) => {
      if (!month) return
      if (index - previousMarker < 3) monthMarkers[previousMarker] = ''
      previousMarker = index
    })

    return {
      weeks,
      monthMarkers,
      total: days.reduce((sum, day) => sum + day.contributionCount, 0),
      lastDate: days.at(-1)?.date,
    }
  }, [])

  const status = raw.source === 'github' && raw.generatedAt
    ? `Updated ${new Date(raw.generatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}`
    : 'Local preview data'

  return (
    <section className="contrib" aria-labelledby="contrib-heading">
      <header className="contrib__head">
        <div>
          <h2 id="contrib-heading">GitHub activity</h2>
          <p>{raw.anchor} → {lastDate}</p>
        </div>
        <div className="contrib__total">
          <strong>{total}</strong>
          <span>contributions</span>
        </div>
      </header>

      <div className="contrib__well">
        <div className="contrib__viewport">
          <div className="contrib__calendar" style={{ '--weeks': weeks.length }}>
            <div className="contrib__months" aria-hidden="true">
              {monthMarkers.map((month, index) => (
                <span key={`${month}-${index}`}>{month}</span>
              ))}
            </div>

            <div
              className="contrib__grid"
              role="img"
              aria-label={`GitHub contributions for ${raw.username} from ${raw.anchor} through ${lastDate}`}
            >
              {weeks.map((week, weekIndex) => (
                <div className="contrib__col" key={week[0]?.date ?? weekIndex}>
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const day = week[dayIndex]
                    return day ? (
                      <span
                        key={day.date}
                        className="contrib__cell"
                        data-level={levelFor(day.contributionCount)}
                        aria-hidden="true"
                        title={`${day.contributionCount} contributions on ${day.date}`}
                      />
                    ) : <span key={`empty-${dayIndex}`} className="contrib__cell is-empty" aria-hidden="true" />
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="contrib__foot">
          <span>{status}</span>
          <div className="contrib__legend" aria-label="Contribution intensity: less to more">
            <span>Less</span>
            {Array.from({ length: 5 }, (_, level) => (
              <i key={level} className="contrib__cell" data-level={level} aria-hidden="true" />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  )
}
