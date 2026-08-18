import { useCallback, useState } from 'react'
import {
  LuArrowUpRight,
  LuBriefcaseBusiness,
  LuFileText,
  LuGraduationCap,
  LuMicroscope,
} from 'react-icons/lu'
import { timeline } from '../data/timeline.js'
import './Trajectory.css'

const stopIcons = {
  education: LuGraduationCap,
  industry: LuBriefcaseBusiness,
  research: LuMicroscope,
  robotics: RobotArmIcon,
}

function RobotArmIcon({ size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 20h12M6 20v-3h8v3M10 17l1.5-5.2M11.5 11.8l4-3.8M15.5 8l2.8 2.7" />
      <circle cx="11.5" cy="11.8" r="1.7" />
      <circle cx="15.5" cy="8" r="1.7" />
      <path d="M18.3 10.7l1.8-1.8M18.3 10.7l1.8 1.8" />
    </svg>
  )
}

/**
 * Scene 02.
 *
 * The old version put every entry on screen at once in a two-column
 * zigzag, which made the headings, blurbs, and spine compete for the
 * same glance. This shows ONE — you move a carriage along a rail and the
 * panel reports what is at that stop. Same content, one thing to read.
 */
export default function Trajectory() {
  const [active, setActive] = useState(() =>
    Math.max(0, timeline.findIndex((item) => item.id === 'robotics')),
  )
  const entry = timeline[active]

  // Arrow keys walk the rail — expected of a tablist, and it makes the whole
  // scene usable without a pointer.
  const onKeyDown = useCallback((e) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    setActive((i) => (i + delta + timeline.length) % timeline.length)
  }, [])

  return (
    <section
      className="scene traj"
      aria-labelledby="traj-heading"
    >
      {/* Flipped: the heading sits on the RIGHT and the mechanism on the left,
          mirroring the hero so the eye crosses the page instead of running
          straight down it. */}
      <div className="container split split--flip traj__grid">
        <header className="split__aside traj__head">
          <h2 id="traj-heading">Building toward what&apos;s next.</h2>
          <p className="lede">
            Five stops between starting a CS degree and finishing a master&apos;s.
            Move the carriage.
          </p>
        </header>

        {/* Closes like a shutter on the way out — horizontally, from both
            edges — so no two consecutive scenes leave by the same gesture. */}
        <div className="split__main traj__stage">
          <div
            className="rail"
            role="tablist"
            aria-label="Career timeline"
            style={{ '--n': timeline.length, '--i': active }}
            onKeyDown={onKeyDown}
          >
            <div className="rail__track" aria-hidden="true">
              <span className="rail__fill" />
            </div>
            <span className="rail__carriage" aria-hidden="true" />

            <div className="rail__nodes">
              {timeline.map((item, i) => {
                const StopIcon = stopIcons[item.icon] ?? LuGraduationCap
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={`stop-tab-${item.id}`}
                    aria-selected={i === active}
                    aria-controls="stop-panel"
                    tabIndex={i === active ? 0 : -1}
                    className={`rail__node${i === active ? ' is-active' : ''}`}
                    onClick={() => setActive(i)}
                  >
                    <span className="sr-only">{item.title}</span>
                    <span className="rail__icon" aria-hidden="true">
                      <StopIcon size={18} />
                    </span>
                    <span className="rail__tip" aria-hidden="true">
                      {item.date}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <article
            className={`stop glass${
              entry.artifact.kind.includes('compact') ? ' stop--compact' : ''
            }`}
            id="stop-panel"
            role="tabpanel"
            aria-labelledby={`stop-tab-${entry.id}`}
            key={entry.id}
          >
            <div className="stop__layout">
              <div className="stop__copy">
                <p className="stop__line stop__meta">
                  <time>{entry.date}</time>
                  <span className="stop__tag" data-tag={entry.tag}>
                    {entry.tag}
                  </span>
                </p>

                <h3 className="stop__line stop__title">{entry.title}</h3>
                <p className="stop__line stop__org">{entry.org}</p>
                <p className="stop__line stop__blurb">{entry.blurb}</p>
              </div>

              <a
                className={`stop__artifact ${entry.artifact.kind
                  .split(' ')
                  .map((kind) => `artifact--${kind}`)
                  .join(' ')}`}
                href={entry.artifact.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${entry.artifact.title} — opens in a new tab`}
              >
                <span className="artifact__preview">
                  <img src={entry.artifact.preview} alt={entry.artifact.alt} />
                  {entry.artifact.kind.includes('document') && (
                    <span className="artifact__document-badge" aria-hidden="true">
                      <LuFileText size={14} /> PDF
                    </span>
                  )}
                </span>
                <span className="artifact__caption">
                  <span>
                    <strong>{entry.artifact.title}</strong>
                    <small>{entry.artifact.meta}</small>
                  </span>
                  <LuArrowUpRight className="artifact__arrow" size={17} aria-hidden="true" />
                </span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
