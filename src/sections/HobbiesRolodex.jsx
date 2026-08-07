import { useState } from 'react'
import { animate, stagger } from 'animejs'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { useAnimeScope } from '../hooks/useAnimeScope.js'
import { hobbies } from '../data/hobbies.js'
import './HobbiesRolodex.css'

const pct = (s) => Math.round((100 * s.value) / s.max)

export default function HobbiesRolodex() {
  const [active, setActive] = useState(0)
  const hobby = hobbies[active]

  const go = (delta) =>
    setActive((i) => (i + delta + hobbies.length) % hobbies.length)

  // Re-runs on every hobby change: anime reverts the previous hobby's instances
  // first, so there is nothing to leak.
  const { root } = useAnimeScope(
    (self) => {
      animate('.hobby__media', {
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 500,
        ease: 'out(2)',
      })

      animate('.hobby__dash-title', {
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 450,
        ease: 'out(2)',
      })

      animate('.stat', {
        opacity: [0, 1],
        translateY: [16, 0],
        delay: stagger(90),
        duration: 400,
        ease: 'out(2)',
      })

      // Bars are sized by an inline width (their resting state) and grown with
      // scaleX, not by animating `width` — no layout work per frame, and the
      // final width survives if the animation never runs. transform-origin is
      // in CSS on purpose: anime interpolates that property rather than
      // setting it, so passing it here would leave the origin drifting.
      animate('.stat__bar', {
        scaleX: [0, 1],
        duration: 900,
        ease: 'out(3)',
        delay: stagger(90),
      })

      // Count-up. Scoped via self.root rather than a bare selector so it can
      // only ever match this section's numbers.
      self.root.querySelectorAll('.stat__num').forEach((el, i) => {
        const end = +el.dataset.value
        animate(
          { v: 0 },
          {
            v: end,
            duration: 900,
            ease: 'out(3)',
            delay: i * 90,
            onUpdate: (a) => {
              el.textContent = Math.round(a.targets[0].v).toLocaleString()
            },
          },
        )
      })

      animate('.hobby__note', {
        opacity: [0, 1],
        duration: 500,
        delay: 300,
        ease: 'out(2)',
      })
    },
    [active],
  )

  return (
    <section ref={root} className="hobbies" aria-labelledby="hobbies-heading">
      <div className="container">
        <div className="section-head hobbies__heading">
          <p className="eyebrow">Off the clock</p>
          <h2 id="hobbies-heading">What I do otherwise</h2>
          <p>Same instinct to measure things. Flip through.</p>
        </div>

        <div className="hobbies__stage">
          {/* LEFT: media. Keyed by hobby id so React remounts rather than
              swapping src on a live element — that is what stops frame and
              audio state bleeding between hobbies. */}
          <div className="hobby__media" key={`media-${hobby.id}`}>
            {hobby.media.type === 'video' ? (
              <video
                src={hobby.media.src}
                poster={hobby.media.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <img src={hobby.media.src} alt="" />
            )}
          </div>

          {/* RIGHT: dashboard. --accent is overridden locally, so every widget
              inside picks up this hobby's color without prop drilling. */}
          <div className="hobby__dash" style={{ '--accent': hobby.accent }}>
            <h3 className="hobby__dash-title">{hobby.label}</h3>

            <dl className="hobby__stats">
              {hobby.stats.map((s) => (
                <div className="stat" key={s.label}>
                  <dt className="stat__label">{s.label}</dt>
                  <dd className="stat__value">
                    {/* The final value is rendered here, not "0". anime counts
                        up FROM 0 to this. Under reduced motion no animation
                        runs at all, so the correct number is already on screen
                        instead of a permanent zero. */}
                    <span className="stat__num" data-value={s.value}>
                      {s.value.toLocaleString()}
                    </span>
                    {s.unit}
                  </dd>
                  {s.max ? (
                    <div
                      className="stat__track"
                      role="meter"
                      aria-valuenow={s.value}
                      aria-valuemin={0}
                      aria-valuemax={s.max}
                      aria-label={s.label}
                    >
                      <div className="stat__bar" style={{ width: `${pct(s)}%` }} />
                    </div>
                  ) : null}
                </div>
              ))}
            </dl>

            <p className="hobby__note">{hobby.note}</p>
          </div>
        </div>

        {/* Rolodex controls */}
        <div className="hobbies__controls">
          <button
            type="button"
            className="hobbies__arrow"
            onClick={() => go(-1)}
            aria-label="Previous hobby"
          >
            <LuChevronLeft size={20} />
          </button>

          <div className="hobbies__labels">
            {hobbies.map((h, i) => (
              <button
                type="button"
                key={h.id}
                className={`hobbies__label${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-current={i === active ? 'true' : undefined}
              >
                {h.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="hobbies__arrow"
            onClick={() => go(1)}
            aria-label="Next hobby"
          >
            <LuChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
