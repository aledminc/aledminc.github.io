import { createTimeline, animate, stagger, onScroll } from 'animejs'
import { useAnimeScope } from '../hooks/useAnimeScope.js'
import { timeline as data } from '../data/timeline.js'
import './CareerTimeline.css'

export default function CareerTimeline() {
  const { root } = useAnimeScope(() => {
    // One timeline for the whole sequence, played by a ScrollObserver.
    //
    // Threshold strings are "container target" — verified against anime.js
    // v4 source (events/scroll.js splits on ' ' and assigns [0] to the
    // container, [1] to the target). So 'bottom-=15% top' means: fire when the
    // container's bottom minus 15% meets the target's top, i.e. just after the
    // section starts entering the viewport.
    //
    // repeat:false makes the observer detach once the timeline completes, so
    // the sequence plays exactly once instead of re-firing on every scroll.
    const tl = createTimeline({
      autoplay: onScroll({
        enter: 'bottom-=15% top',
        repeat: false,
      }),
    })

    // Below the breakpoint every card sits in one column, so a horizontal slide
    // both looks wrong and briefly pushes the card past the viewport edge,
    // flashing a horizontal scrollbar. Rise vertically instead.
    const narrow = window.matchMedia('(max-width: 768px)').matches

    const cardEntrance = narrow
      ? { translateY: [18, 0] }
      : {
          // Cards slide in from whichever side of the spine they sit on.
          translateX: (el) =>
            el.closest('.tl__row').classList.contains('right') ? [40, 0] : [-40, 0],
        }

    // Position strings, verified against anime.js v4 timeline/position.js:
    //   '<'  -> prevOffset + prevAnimation.duration = AFTER the previous ends
    //   '<<' -> prevOffset                          = WITH the previous start
    // The overlapping phases below therefore need '<<'. Using '<' here queues
    // them strictly end-to-end and stretches the sequence past 3s.
    tl.add('.tl__heading', {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 450,
      ease: 'out(2)',
    })
      .add(
        '.tl__spine',
        {
          // transform-origin lives in CSS — anime would animate it, not set it.
          scaleY: [0, 1],
          duration: 550,
          ease: 'out(2)',
        },
        '-=200',
      )
      .add(
        '.tl__node',
        {
          scale: [0, 1],
          opacity: [0, 1],
          duration: 350,
          delay: stagger(80),
          ease: 'out(3)',
        },
        '-=200',
      )
      .add(
        '.tl__card',
        {
          opacity: [0, 1],
          ...cardEntrance,
          duration: 450,
          delay: stagger(80),
          ease: 'out(2)',
        },
        '<<',
      )
      .add(
        '.tl__date',
        {
          opacity: [0, 1],
          duration: 350,
          delay: stagger(80),
          ease: 'out(2)',
        },
        '<<',
      )

    // Scroll-linked progress fill on the spine (sync mode, not a played
    // animation) — tracks position rather than firing once.
    animate('.tl__progress', {
      scaleY: [0, 1],
      ease: 'linear',
      autoplay: onScroll({
        enter: 'bottom top',
        leave: 'top bottom',
        sync: 0.35, // smoothing factor: eases toward scroll position
      }),
    })
  })

  return (
    <section ref={root} className="tl" aria-labelledby="career-heading">
      <div className="container">
        <h2 id="career-heading" className="tl__heading">
          Career
        </h2>

        <div className="tl__track">
          {/* Decorative: the spine and its scroll-linked fill. */}
          <span className="tl__spine" aria-hidden="true">
            <span className="tl__progress" />
          </span>

          <ol className="tl__list">
            {data.map((entry, i) => (
              <li
                key={entry.id}
                className={`tl__row ${i % 2 ? 'right' : 'left'}`}
                data-index={i}
              >
                <span
                  className={`tl__node${entry.upcoming ? ' tl__node--upcoming' : ''}`}
                  data-tag={entry.tag}
                  aria-hidden="true"
                />

                <time className="tl__date">
                  {entry.date}
                  {entry.upcoming && <span className="tl__expected">Expected</span>}
                </time>

                <article className="tl__card" data-tag={entry.tag}>
                  <h3>{entry.title}</h3>
                  <p className="tl__org">{entry.org}</p>
                  <p className="tl__blurb">{entry.blurb}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
