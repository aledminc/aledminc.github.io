import { Link } from 'react-router-dom'
import { animate, stagger, splitText } from 'animejs'
import { LuArrowRight, LuArrowUpRight } from 'react-icons/lu'
import { useAnimeScope } from '../hooks/useAnimeScope.js'
import WorkEmbedding from './WorkEmbedding.jsx'
import './AboutMe.css'

// Copy is drawn from the 2026 resume and is accurate. Edit freely — it lives
// here and nowhere else.
const ROLE = 'I build systems that sense and decide.'
const BIO = `Computer science at Indiana University, specializing in AI, on an
accelerated master's in intelligent systems engineering. Lately: single-cell RNA
pipelines in a bioinformatics lab, LLM summarization for clinical review at
Saama, and an autonomous rover I lead the build on.`

// A readout strip, not a stats row — these are facts with units, the way an
// instrument reports state.
const READOUT = [
  { k: 'B.S. Computer Science', v: 'May 2027', note: 'AI specialization' },
  { k: 'M.S. Intelligent Systems', v: 'Dec 2027', note: 'Cyber-physical systems' },
  { k: 'Based in', v: 'Bloomington, IN', note: 'Open to 2027 roles' },
]

export default function AboutMe() {
  const { root } = useAnimeScope(() => {
    const splitter = splitText('.hero__name', { chars: true, accessible: true })

    animate(splitter.chars, {
      opacity: [0, 1],
      translateY: [52, 0],
      rotate: [-6, 0],
      delay: stagger(26),
      ease: 'out(3)',
      duration: 760,
    })
    animate('.hero__name', { opacity: 1, duration: 1 })

    animate('.hero__eyebrow', {
      opacity: [0, 1],
      translateX: [-14, 0],
      duration: 560,
      ease: 'out(2)',
    })

    animate('.hero__role', {
      opacity: [0, 1],
      translateY: [16, 0],
      delay: 380,
      duration: 640,
      ease: 'out(2)',
    })

    animate('.hero__bio', {
      opacity: [0, 1],
      translateY: [16, 0],
      delay: 520,
      duration: 640,
      ease: 'out(2)',
    })

    animate('.hero__actions', {
      opacity: [0, 1],
      translateY: [14, 0],
      delay: 640,
      duration: 560,
      ease: 'out(2)',
    })

    animate('.hero__cell', {
      opacity: [0, 1],
      translateY: [18, 0],
      delay: stagger(90, { start: 720 }),
      duration: 560,
      ease: 'out(2)',
    })

    animate('.hero__plot', {
      opacity: [0, 1],
      scale: [0.97, 1],
      delay: 200,
      duration: 900,
      ease: 'out(2)',
    })

    return () => splitter.revert()
  })

  return (
    <section ref={root} className="hero" aria-labelledby="hero-name">
      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="eyebrow hero__eyebrow">Indiana University · Bloomington</p>

          <h1 id="hero-name" className="hero__name">
            Xander Minch
          </h1>

          <p className="hero__role">{ROLE}</p>
          <p className="hero__bio">{BIO}</p>

          <div className="hero__actions">
            <Link className="btn" to="/projects">
              See the work <LuArrowRight size={16} />
            </Link>
            <Link className="btn btn--ghost" to="/schedule">
              Request a meeting
            </Link>
            <a
              className="hero__gh"
              href="https://github.com/aledminc"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/aledminc <LuArrowUpRight size={14} />
            </a>
          </div>
        </div>

        {/* The signature. See WorkEmbedding.jsx — it is a real chart of the
            site's content, not a background effect. */}
        <div className="hero__plot">
          <WorkEmbedding />
        </div>
      </div>

      <dl className="hero__readout container">
        {READOUT.map((r) => (
          <div className="hero__cell" key={r.k}>
            <dt>{r.k}</dt>
            <dd>{r.v}</dd>
            <span>{r.note}</span>
          </div>
        ))}
      </dl>
    </section>
  )
}
