import { createTimeline, animate, stagger, onScroll } from 'animejs'
import { useAnimeScope } from '../hooks/useAnimeScope.js'
import { timeline as data } from '../data/timeline.js'
import './CareerTimeline.css'

export default function CareerTimeline() {
  const { root } = useAnimeScope((self) => {
    // One timeline for the whole sequence, gated on the section coming into
    // view (see the IntersectionObserver at the bottom of this function).
    //
    // Deliberately NOT anime's onScroll here. This section is taller than the
    // viewport, so a single instantaneous scroll — a deep link, the End key,
    // browser scroll restoration — can land past the enter threshold without
    // ever crossing it. The observer then never fires and the whole section
    // stays invisible, which is the worst possible failure. The plain
    // IntersectionObserver below also treats "already scrolled past" as a
    // reason to play.
    const tl = createTimeline({ autoplay: false })

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

    // Scroll-linked progress fill on the spine. This one IS an anime
    // ScrollObserver, and correctly so: `sync` tracks scroll position
    // continuously rather than firing once, so a jump cannot skip it.
    animate('.tl__progress', {
      scaleY: [0, 1],
      ease: 'linear',
      autoplay: onScroll({
        enter: 'bottom top',
        leave: 'top bottom',
        sync: 0.35, // smoothing factor: eases toward scroll position
      }),
    })

    // Play once, the first time the section is in view OR already above the
    // fold line. A plain scroll check rather than IntersectionObserver: IO only
    // fires on threshold crossings, so an element that goes from below the
    // viewport straight to above it — one instant jump — never reports at all
    // and the section would stay invisible permanently.
    let played = false
    const maybePlay = () => {
      if (played) return
      // Negative top means the section is already behind us; either way it
      // has been reached and should not be sitting at opacity 0.
      if (self.root.getBoundingClientRect().top < window.innerHeight * 0.88) {
        played = true
        tl.play()
        stopWatching()
      }
    }
    const stopWatching = () => {
      window.removeEventListener('scroll', maybePlay)
      window.removeEventListener('resize', maybePlay)
    }

    maybePlay() // covers loading already scrolled down
    window.addEventListener('scroll', maybePlay, { passive: true })
    window.addEventListener('resize', maybePlay, { passive: true })

    return stopWatching
  })

  return (
    <section ref={root} className="tl" aria-labelledby="career-heading">
      <div className="container tl__layout">
        <div className="section-head tl__heading">
          <p className="eyebrow">Trajectory · 2023—2027</p>
          <h2 id="career-heading">Building toward<br /><em>what's next.</em></h2>
          <p>
            Coursework, the lab, the internship, and the rover—in the order
            they happened.
          </p>
          <span className="tl__scroll-hint">Scroll to trace the path ↓</span>
        </div>

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
                  <div className="tl__meta">
                    <span className="tl__tag">{entry.tag}</span>
                    <span className="tl__index">0{i + 1}</span>
                  </div>
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
