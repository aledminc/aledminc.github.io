import { useMemo, useState } from 'react'
import { LuArrowUpRight } from 'react-icons/lu'
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

export default function Projects() {
  const [activeTag, setActiveTag] = useState('All')

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

  return (
    <div className="index page">
      <div className="container">
        <header className="index__masthead">
          <div className="index__head">
            <span className="eyebrow eyebrow--bare" aria-hidden="true" />
            <h1>Selected work.</h1>
            <p className="lede">
              Everything shipped since March 2025. Each row opens the repository.
            </p>
          </div>

          <div className="index__filter-panel">
            <div className="index__filter-heading">
              <span>Filter the index</span>
              <strong>{visible.length.toString().padStart(2, '0')}</strong>
            </div>
            <div className="switch index__filter" role="group" aria-label="Filter projects by category">
              {chips.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className={`switch__opt${tag === activeTag ? ' is-active' : ''}`}
                  onClick={() => setActiveTag(tag)}
                  aria-pressed={tag === activeTag}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </header>

        <ol className="index__list">
          {visible.map((p, i) => {
            const team = p.contributors.length > 1
            return (
              <li className="row-wrap" key={p.id}>
                <a className="row" href={p.href} target="_blank" rel="noopener noreferrer">
                  <span className="row__idx">{String(i + 1).padStart(2, '0')}</span>

                  <span className="row__main">
                    <span className="row__title">{p.title}</span>
                    <span className="row__reveal">
                      <span className="row__reveal-inner">
                        <span className="row__blurb">{p.blurb}</span>
                        {team && (
                          <span className="row__team">
                            with{' '}
                            {p.contributors
                              .filter((c) => c !== 'Xander Minch')
                              .join(', ')}
                          </span>
                        )}
                      </span>
                    </span>
                  </span>

                  <span className="row__meta">
                    {p.lang && <span className="row__lang">{p.lang}</span>}
                    <time dateTime={p.date}>{formatCompleted(p.date)}</time>
                  </span>

                  <span className="row__go" aria-hidden="true">
                    <LuArrowUpRight size={18} />
                  </span>
                </a>
              </li>
            )
          })}
        </ol>

        {visible.length === 0 && (
          <p className="index__none">Nothing tagged “{activeTag}” yet.</p>
        )}
      </div>
    </div>
  )
}
