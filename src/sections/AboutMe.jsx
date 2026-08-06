import { animate, stagger, splitText } from 'animejs'
import { useAnimeScope } from '../hooks/useAnimeScope.js'
import './AboutMe.css'

// TODO(xander): replace with your real copy.
const TITLE_LINE = 'CS @ Indiana University — builder'
const BIO = `TODO: two to four sentences in your own voice. What you build, what
you are into right now, and what you want someone reading this to walk away
knowing. Keep it concrete — specific projects beat adjectives.`

// TODO(xander): your actual quick facts.
const FACTS = [
  { label: 'Role', value: 'TODO — e.g. Software Engineer' },
  { label: 'Focus', value: 'TODO — e.g. Full-stack, systems' },
  { label: 'Location', value: 'TODO — e.g. Bloomington, IN' },
]

export default function AboutMe() {
  const { root } = useAnimeScope(() => {
    // accessible:true makes anime.js insert a visually-hidden (clip-path) copy
    // of the full text and mark every char span aria-hidden, so screen readers
    // announce "Xander Minch" rather than spelling out 11 separate spans.
    // Note this means h1.textContent reads doubled — expected, not a bug.
    const splitter = splitText('.about__title', { chars: true, accessible: true })

    animate(splitter.chars, {
      opacity: [0, 1],
      translateY: [40, 0],
      delay: stagger(28),
      ease: 'out(3)',
      duration: 700,
    })

    // The h1 itself is opacity:0 in CSS so the unsplit text never flashes on
    // first paint. The chars above already hold their own opacity:0, so the
    // container can be revealed instantly now that the split has happened.
    animate('.about__title', { opacity: 1, duration: 1 })

    animate('.about__eyebrow', {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 600,
      ease: 'out(2)',
    })

    animate('.about__body', {
      opacity: [0, 1],
      translateY: [20, 0],
      delay: 500,
      duration: 700,
      ease: 'out(2)',
    })

    animate('.about__fact', {
      opacity: [0, 1],
      translateY: [16, 0],
      delay: stagger(90, { start: 700 }),
      duration: 600,
      ease: 'out(2)',
    })

    // Slow, looping drift on the background blob: life without distraction.
    animate('.about__blob', {
      translateX: [-20, 20],
      translateY: [10, -14],
      scale: [1, 1.08],
      duration: 9000,
      ease: 'inOut(2)',
      loop: true,
      alternate: true,
    })

    // splitText rewrites the heading's DOM, and the scope does not own that —
    // revert it so remounts do not re-split already-split markup.
    return () => splitter.revert()
  })

  return (
    <section ref={root} className="about" aria-labelledby="about-title">
      <div className="about__blob" aria-hidden="true" />

      <div className="container about__inner">
        <p className="about__eyebrow">{TITLE_LINE}</p>
        <h1 id="about-title" className="about__title">
          Xander Minch
        </h1>
        <p className="about__body">{BIO}</p>

        <dl className="about__facts">
          {FACTS.map(({ label, value }) => (
            <div className="about__fact" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
