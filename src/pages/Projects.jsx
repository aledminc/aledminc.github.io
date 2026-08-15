import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, stagger } from 'animejs'
import { LuArrowUpRight } from 'react-icons/lu'
import { useAnimeScope } from '../hooks/useAnimeScope.js'
import { useSceneExit } from '../hooks/useSceneExit.js'
import { useMediaQuery } from '../hooks/useMediaQuery.js'
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
  const [hovered, setHovered] = useState(null)

  // Nine thumbnails at once was the old page's whole problem. On a real
  // pointer the artwork moves to a single panel that follows the cursor, so
  // the list stays an index; touch devices get the thumbnail inline instead,
  // because there is no hover to reveal it with.
  const canPreview = useMediaQuery('(pointer: fine)')
  const previewRef = useRef(null)

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

  // Pointer tracking writes two custom properties straight onto the panel and
  // never touches React state — a setState per mousemove would re-render the
  // whole list sixty times a second.
  useEffect(() => {
    if (!canPreview) return undefined
    let frame = 0
    let x = 0
    let y = 0
    const apply = () => {
      frame = 0
      const el = previewRef.current
      if (el) {
        el.style.setProperty('--x', `${x}px`)
        el.style.setProperty('--y', `${y}px`)
      }
    }
    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!frame) frame = requestAnimationFrame(apply)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [canPreview])

  const scene = useSceneExit([activeTag])

  const { root } = useAnimeScope(
    () => {
      // Rows arrive on a horizontal sweep — the same axis they will leave on.
      animate('.row', {
        opacity: [0, 1],
        translateX: [-26, 0],
        duration: 520,
        delay: stagger(42, { start: 60 }),
        ease: 'out(3)',
      })
    },
    [activeTag],
  )

  const active = hovered ? projects.find((p) => p.id === hovered) : null

  return (
    <div className="index page" ref={scene}>
      <div className="container" ref={root}>
        <header className="layer layer--left layer--soft index__head">
          <p className="eyebrow">
            {projects.length} repositories · 2025 — 2026
          </p>
          <h1>Selected work.</h1>
          <p className="lede">
            Everything shipped since March 2025. Each row opens the repository.
          </p>
        </header>

        <div className="layer index__filter" data-exit-start="0.16">
          <div className="switch" role="group" aria-label="Filter projects by category">
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

        <ol
          className="index__list"
          onPointerLeave={() => setHovered(null)}
        >
          {visible.map((p, i) => {
            const team = p.contributors.length > 1
            return (
              // The <li> carries the exit so the <a> inside keeps its own
              // hover transform to itself.
              <li className="layer row-wrap" key={p.id} data-exit-start="0.12">
                <a
                  className={`row${canPreview ? '' : ' row--thumbed'}`}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerEnter={() => setHovered(p.id)}
                  onFocus={() => setHovered(p.id)}
                  onBlur={() => setHovered(null)}
                >
                  <span className="row__idx">{String(i + 1).padStart(2, '0')}</span>

                  <span className="row__main">
                    <span className="row__title">{p.title}</span>

                    {/* Collapsed by default and opened by hover or keyboard
                        focus. It stays in the DOM either way, so assistive
                        tech reads it without needing the interaction.
                        Everything collapsible lives in ONE grid child — a
                        second child would land in an implicit auto row and
                        never collapse at all. */}
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

                  {!canPreview && (
                    <span className="row__thumb">
                      <img src={p.thumbnail} alt="" loading="lazy" decoding="async" />
                    </span>
                  )}

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

      {/* One preview panel for the whole page, parked off-screen until a row
          claims it. */}
      {canPreview && (
        <div
          className={`preview${active ? ' is-on' : ''}`}
          ref={previewRef}
          aria-hidden="true"
        >
          {active && <img src={active.thumbnail} alt="" />}
        </div>
      )}
    </div>
  )
}
