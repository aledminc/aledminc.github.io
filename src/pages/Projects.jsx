import { useMemo, useState } from 'react'
import { animate, stagger } from 'animejs'
import { useAnimeScope } from '../hooks/useAnimeScope.js'
import { projects, projectTags } from '../data/projects.js'
import './Projects.css'

/** '2026-07' -> 'Jul 2026' */
function formatCompleted(value) {
  const [year, month] = value.split('-')
  return new Date(Number(year), Number(month || 1) - 1).toLocaleString('en', {
    month: 'short',
    year: 'numeric',
  })
}

/** Channel-style avatar: initials of the first contributor. */
function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Projects() {
  const [activeTag, setActiveTag] = useState('All')

  // Only offer chips for tags that actually appear in the data.
  const chips = useMemo(() => {
    const present = new Set(projects.flatMap((p) => p.tags ?? []))
    return ['All', ...projectTags.filter((t) => present.has(t))]
  }, [])

  const visible = useMemo(
    () =>
      activeTag === 'All'
        ? projects
        : projects.filter((p) => (p.tags ?? []).includes(activeTag)),
    [activeTag],
  )

  // Subtle staggered entrance; re-runs when the filter changes so the new set
  // animates in too. The grid is the point, so this stays understated.
  const { root } = useAnimeScope(
    () => {
      animate('.yt-card', {
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 420,
        delay: stagger(45),
        ease: 'out(2)',
      })
    },
    [activeTag],
  )

  return (
    <div className="yt" ref={root}>
      <header className="yt__head">
        <p className="eyebrow">{projects.length} repositories · 2025 — 2026</p>
        <h1>Projects</h1>
        <p className="yt__lead">
          Everything I've shipped since March 2025. Each tile opens the repo.
        </p>
      </header>

      <div className="yt__chips" role="group" aria-label="Filter projects by category">
        {chips.map((tag) => (
          <button
            type="button"
            key={tag}
            className={`yt__chip${tag === activeTag ? ' is-active' : ''}`}
            onClick={() => setActiveTag(tag)}
            aria-pressed={tag === activeTag}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="yt-grid">
        {visible.map((p) => {
          const who = p.contributors.join(', ')
          return (
            <article className="yt-card" key={p.id}>
              <a
                className="yt-card__link"
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="yt-thumb">
                  <img
                    src={p.thumbnail}
                    alt=""
                    width="640"
                    height="360"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* YouTube's duration pill, repurposed for the language. */}
                  {p.lang && <span className="yt-thumb__pill">{p.lang}</span>}
                </div>

                <div className="yt-meta">
                  <span className="yt-avatar" aria-hidden="true">
                    {initials(p.contributors[0])}
                  </span>
                  <div className="yt-meta__text">
                    <h3 className="yt-title">{p.title}</h3>
                    <p className="yt-channel">{who}</p>
                    <p className="yt-sub">
                      Completed <time dateTime={p.date}>{formatCompleted(p.date)}</time>
                    </p>
                  </div>
                </div>
              </a>
            </article>
          )
        })}
      </div>

      {visible.length === 0 && (
        <p className="yt__none">Nothing tagged “{activeTag}” yet.</p>
      )}
    </div>
  )
}
