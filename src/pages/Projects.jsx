import { useMemo, useState } from 'react'
import { LuArrowUpRight } from 'react-icons/lu'
import { projects, projectTags } from '../data/projects.js'
import './Projects.css'

/** '2026-07' -> 'Jul 2026' */
function formatPublished(value) {
  const [year, month] = value.split('-')
  return new Date(Number(year), Number(month || 1) - 1).toLocaleString('en', {
    month: 'short',
    year: 'numeric',
  })
}

function initials(name) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export default function Projects() {
  const [activeTag, setActiveTag] = useState('All')

  const chips = useMemo(() => {
    const present = new Set(projects.flatMap((project) => project.tags ?? []))
    return ['All', ...projectTags.filter((tag) => present.has(tag))]
  }, [])

  const visible = useMemo(
    () => activeTag === 'All'
      ? projects
      : projects.filter((project) => (project.tags ?? []).includes(activeTag)),
    [activeTag],
  )

  return (
    <div className="yt" aria-labelledby="projects-heading">
      <header className="yt__browsebar">
        <div className="yt__heading">
          <span>Project library</span>
          <h1 id="projects-heading">My selected work.</h1>
        </div>

        <div className="yt__filters">
          <span className="yt__count" aria-live="polite">
            {visible.length.toString().padStart(2, '0')} projects
          </span>
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
        </div>
      </header>

      <section className="yt-grid" aria-label={`${activeTag} projects`}>
        {visible.map((project) => {
          const contributors = project.contributors.join(', ')
          return (
            <article className="yt-card" key={project.id}>
              <a
                className="yt-card__link"
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} — open project`}
              >
                <div className="yt-thumb">
                  <img
                    src={project.thumbnail}
                    alt=""
                    width="640"
                    height="360"
                    loading="lazy"
                    decoding="async"
                  />
                  {project.lang && <span className="yt-thumb__pill">{project.lang}</span>}
                  <span className="yt-thumb__open" aria-hidden="true">
                    <LuArrowUpRight size={18} />
                  </span>
                </div>

                <div className="yt-meta">
                  <span className="yt-avatar" aria-hidden="true">
                    {initials(project.contributors[0])}
                  </span>
                  <div className="yt-meta__text">
                    <h2 className="yt-title">{project.title}</h2>
                    <p className="yt-channel">{contributors}</p>
                    <p className="yt-sub">
                      Published <time dateTime={project.date}>{formatPublished(project.date)}</time>
                    </p>
                  </div>
                </div>
              </a>
            </article>
          )
        })}
      </section>

      {visible.length === 0 && (
        <p className="yt__none">Nothing tagged “{activeTag}” yet.</p>
      )}
    </div>
  )
}
