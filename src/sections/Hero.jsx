import { Link } from 'react-router-dom'
import { animate, stagger, splitText } from 'animejs'
import { LuArrowRight } from 'react-icons/lu'
import { useAnimeScope } from '../hooks/useAnimeScope.js'
import { useSceneExit } from '../hooks/useSceneExit.js'
import SensorDisc from './SensorDisc.jsx'
import './Hero.css'

// Copy is drawn from the 2026 resume and is accurate. One statement, one
// sentence of support, one action — nothing else belongs in a hero.
const TITLE = 'Systems that sense and decide.'
const LEDE = `Computer science and an accelerated master's in intelligent systems at
Indiana University. Single-cell RNA pipelines, LLM summarization for clinical
review, and an autonomous rover I lead the build on.`

export default function Hero() {
  const scene = useSceneExit()

  const { root } = useAnimeScope(() => {
    // Split to words, not chars: at this size a per-character stagger reads as
    // a novelty effect, whereas words landing in sequence reads as a sentence
    // being stated.
    const split = splitText('.hero__title', { words: true, accessible: true })

    // Nothing on this site enters on the vertical axis. The words sweep in
    // from the left in reading order, resolving out of blur as they arrive —
    // a line being scanned in rather than a page scrolling up.
    animate(split.words, {
      opacity: [0, 1],
      translateX: [-56, 0],
      filter: ['blur(11px)', 'blur(0px)'],
      delay: stagger(52, { start: 110 }),
      duration: 880,
      ease: 'out(3)',
    })
    animate('.hero__title', { opacity: 1, duration: 1 })

    animate('.hero__eyebrow', {
      opacity: [0, 1],
      translateX: [-18, 0],
      duration: 620,
      ease: 'out(2)',
    })

    animate(['.hero__lede', '.hero__cta'], {
      opacity: [0, 1],
      translateX: [-34, 0],
      delay: stagger(110, { start: 500 }),
      duration: 700,
      ease: 'out(2)',
    })

    // The module arrives like an instrument powering up: it settles into
    // position, then the beam is already running.
    //
    // Targets `.disc` INSIDE the layer, never the layer itself. anime leaves
    // an inline `opacity: 1` on whatever it animates, and inline style beats
    // the stylesheet — so animating the layer here would permanently pin its
    // exit fade at fully-opaque.
    animate('.disc', {
      opacity: [0, 1],
      scale: [0.94, 1],
      translateX: [42, 0],
      duration: 1050,
      delay: 180,
      ease: 'out(4)',
    })

    return () => split.revert()
  })

  return (
    <section ref={scene} className="scene hero" data-scene data-scene-label="Signal" aria-labelledby="hero-title">
      <div className="container split hero__grid" ref={root}>
        {/* Exits to the left; the module exits to the right. The stage parts
            down the middle as you leave, which is why the two layers move
            in opposite directions rather than together. */}
        <div className="layer layer--left layer--soft split__aside hero__copy">
          <p className="eyebrow hero__eyebrow">Xander Minch · Indiana University</p>

          <h1 id="hero-title" className="hero__title">
            {TITLE}
          </h1>

          <p className="lede hero__lede">{LEDE}</p>

          <Link className="btn hero__cta" to="/projects">
            See the work <LuArrowRight size={16} />
          </Link>
        </div>

        <div className="layer layer--right split__main hero__disc">
          <SensorDisc />
        </div>
      </div>
    </section>
  )
}
