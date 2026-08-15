import { useMemo, useState } from 'react'
import { animate, stagger } from 'animejs'
import { useAnimeScope } from '../hooks/useAnimeScope.js'
import { useSceneExit } from '../hooks/useSceneExit.js'
import { useInView } from '../hooks/useInView.js'
import { hobbies } from '../data/hobbies.js'
import './Pursuits.css'

/**
 * Scene 03.
 *
 * One pursuit on screen at a time. The old rolodex showed a plate, three
 * animated bars, a note, two arrows and four labels simultaneously; this
 * keeps the same data but gives it one plate, one sentence, and one meter.
 */
export default function Pursuits() {
  const scene = useSceneExit()
  const reached = useInView(scene)
  const [active, setActive] = useState(0)
  const hobby = hobbies[active]

  // The one stat with a ceiling becomes the meter; the rest are plain
  // figures. Splitting on the data's own shape means adding a stat never
  // needs a change here.
  const { meter, figures } = useMemo(() => {
    const m = hobby.stats.find((s) => s.max)
    return { meter: m, figures: hobby.stats.filter((s) => s !== m) }
  }, [hobby])

  const { root } = useAnimeScope(
    (self) => {
      if (!reached) return

      // Horizontal wipe on the plate — it slides into the frame it will
      // eventually slide back out of.
      animate('.pursuit__plate', {
        opacity: [0, 1],
        translateX: [-34, 0],
        duration: 620,
        ease: 'out(3)',
      })

      animate('.pursuit__line', {
        opacity: [0, 1],
        translateX: [24, 0],
        delay: stagger(80, { start: 90 }),
        duration: 520,
        ease: 'out(2)',
      })

      // Bars grow with scaleX against a width set inline, so no layout runs
      // per frame and the resting width survives if the animation never does.
      // transform-origin stays in CSS: anime treats it as animatable.
      animate('.meter__bar', {
        scaleX: [0, 1],
        duration: 980,
        delay: 260,
        ease: 'out(3)',
      })

      // Count up to the value already rendered in the markup. Animating a
      // plain object and writing textContent in onUpdate, rather than
      // animating a DOM property: it is the only form that is guaranteed to
      // format the number (thousands separators) on the way.
      self.root.querySelectorAll('.figure__num').forEach((el, i) => {
        animate(
          { v: 0 },
          {
            v: +el.dataset.value,
            duration: 900,
            delay: 200 + i * 90,
            ease: 'out(3)',
            onUpdate: (a) => {
              el.textContent = Math.round(a.targets[0].v).toLocaleString()
            },
          },
        )
      })
    },
    [active, reached],
  )

  return (
    <section
      ref={scene}
      className={`scene pursuits${reached ? ' is-in' : ''}`}
      data-scene
      data-scene-label="Pursuits"
      aria-labelledby="pursuits-heading"
    >
      {/* Back to text-left, mirroring the trajectory above it. */}
      <div className="container split pursuits__grid" ref={root}>
        <header className="layer layer--left layer--soft split__aside pursuits__head">
          <p className="eyebrow">Off the clock</p>
          <h2 id="pursuits-heading">What I do otherwise.</h2>
          <p className="lede">Same instinct to measure things. Pick one.</p>

          {/* Selector: a pressed track, same idiom as the nav, so the site
              only ever teaches you one control. It belongs beside the heading,
              not above the card — that keeps the card a single clean object. */}
          <div className="switch" role="tablist" aria-label="Pursuits">
            {hobbies.map((h, i) => (
              <button
                key={h.id}
                type="button"
                role="tab"
                id={`pursuit-tab-${h.id}`}
                aria-selected={i === active}
                aria-controls="pursuit-panel"
                tabIndex={i === active ? 0 : -1}
                className={`switch__opt${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                {h.label}
              </button>
            ))}
          </div>
        </header>

        {/* Leans and slides out to the right — a third distinct exit, after
            the hero's split and the trajectory's shutter. */}
        <div className="layer layer--shear split__main pursuits__stage">
          <div
            className="pursuit glass"
            id="pursuit-panel"
            role="tabpanel"
            aria-labelledby={`pursuit-tab-${hobby.id}`}
          >
            <div className="pursuit__frame">
              {/* Keyed so React remounts instead of swapping src on a live
                  element — that is what stops one plate flashing inside the
                  next one's entrance. */}
              <img
                key={hobby.id}
                className="pursuit__plate"
                src={hobby.media.src}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="pursuit__body">
              <h3 className="pursuit__line pursuit__title">{hobby.label}</h3>
              <p className="pursuit__line pursuit__note">{hobby.note}</p>

              <dl className="pursuit__line pursuit__figures">
                {figures.map((s) => (
                  <div className="figure" key={s.label}>
                    <dt>{s.label}</dt>
                    <dd>
                      {/* The real number is in the markup, not "0": under
                          reduced motion nothing counts up, and a permanent
                          zero would be a lie rather than a missing effect. */}
                      <span className="figure__num" data-value={s.value}>
                        {s.value.toLocaleString()}
                      </span>
                      {s.unit}
                    </dd>
                  </div>
                ))}
              </dl>

              {meter && (
                <div className="pursuit__line meter">
                  <div className="meter__head">
                    <span>{meter.label}</span>
                    <b>
                      {meter.value}
                      {meter.unit}
                    </b>
                  </div>
                  <div
                    className="meter__track"
                    role="meter"
                    aria-valuenow={meter.value}
                    aria-valuemin={0}
                    aria-valuemax={meter.max}
                    aria-label={meter.label}
                  >
                    <div
                      className="meter__bar"
                      style={{ width: `${Math.round((100 * meter.value) / meter.max)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
