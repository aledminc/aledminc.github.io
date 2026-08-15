import { useCallback, useState } from 'react'
import { animate, stagger } from 'animejs'
import { LuArrowUpRight, LuFileText } from 'react-icons/lu'
import { useAnimeScope } from '../hooks/useAnimeScope.js'
import { useSceneExit } from '../hooks/useSceneExit.js'
import { useInView } from '../hooks/useInView.js'
import { timeline } from '../data/timeline.js'
import './Trajectory.css'

/**
 * Scene 02.
 *
 * The old version put all six entries on screen at once in a two-column
 * zigzag, which is six headings, six blurbs and a spine competing for the
 * same glance. This shows ONE — you move a carriage along a rail and the
 * panel reports what is at that stop. Same content, one thing to read.
 */
export default function Trajectory() {
  const scene = useSceneExit()
  // Gate the first run on arrival: an entrance that has already played by the
  // time you scroll to it is just a static section.
  const reached = useInView(scene)
  const [active, setActive] = useState(timeline.length - 3)
  const entry = timeline[active]

  const { root } = useAnimeScope(
    () => {
      if (!reached) return

      // Panel contents restate themselves on every stop. The wipe runs on the
      // inner .stop element, never on the .layer wrapper — anime would leave
      // an inline opacity there and kill the scene exit.
      animate('.stop__line, .stop__artifact', {
        opacity: [0, 1],
        translateX: [26, 0],
        delay: stagger(70),
        duration: 560,
        ease: 'out(3)',
      })

    },
    [active, reached],
  )

  // Arrow keys walk the rail — expected of a tablist, and it makes the whole
  // scene usable without a pointer.
  const onKeyDown = useCallback((e) => {
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!delta) return
    e.preventDefault()
    setActive((i) => (i + delta + timeline.length) % timeline.length)
  }, [])

  return (
    // `is-in` drives the once-only scene intro from CSS. It is deliberately
    // NOT anime: this scope re-runs on every stop change, and a reverted
    // scope would put the heading and rail back at their start states.
    <section
      ref={scene}
      className={`scene traj${reached ? ' is-in' : ''}`}
      data-scene
      data-scene-label="Trajectory"
      aria-labelledby="traj-heading"
    >
      {/* Flipped: the heading sits on the RIGHT and the mechanism on the left,
          mirroring the hero so the eye crosses the page instead of running
          straight down it. */}
      <div className="container split split--flip traj__grid" ref={root}>
        <header className="layer layer--right layer--soft split__aside traj__head">
          <p className="eyebrow">Trajectory</p>
          <h2 id="traj-heading">Building toward what&apos;s next.</h2>
          <p className="lede">
            Six stops between starting a CS degree and finishing a master&apos;s.
            Move the carriage.
          </p>
        </header>

        {/* Closes like a shutter on the way out — horizontally, from both
            edges — so no two consecutive scenes leave by the same gesture. */}
        <div className="layer layer--iris split__main traj__stage">
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
              {timeline.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`stop-tab-${item.id}`}
                  aria-selected={i === active}
                  aria-controls="stop-panel"
                  tabIndex={i === active ? 0 : -1}
                  className={`rail__node${i === active ? ' is-active' : ''}${
                    item.upcoming ? ' is-upcoming' : ''
                  }`}
                  onClick={() => setActive(i)}
                >
                  <span className="sr-only">{item.title}</span>
                  <span className="rail__tip" aria-hidden="true">
                    {item.date}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <article
            className="stop glass"
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
                    {entry.upcoming ? 'Expected' : entry.tag}
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
