import HeroRotator from '../components/HeroRotator.jsx'
import ContributionGraph from '../components/ContributionGraph.jsx'
import ResumePanel from '../components/ResumePanel.jsx'
import OmegLolAd from '../components/OmegLolAd.jsx'
import './Hero.css'

const TITLE = 'Systems that sense and decide.'
const LEDE = `Computer science and an accelerated master's in intelligent systems at
Indiana University. Single-cell RNA pipelines, LLM summarization for clinical
review, and an autonomous rover I lead the build on.`

const HERO_SLIDES = [
  {
    id: 'github-activity',
    label: 'GitHub activity',
    render: () => <ContributionGraph />,
  },
  {
    id: 'resume',
    label: 'Resume',
    render: () => <ResumePanel />,
  },
  {
    id: 'omeglol',
    label: 'omegLOL',
    render: () => <OmegLolAd />,
  },
]

export default function Hero() {
  return (
    <section className="scene hero" aria-labelledby="hero-title">
      <div className="container split hero__grid">
        <div className="split__aside hero__copy">
          <h1 id="hero-title" className="hero__title">{TITLE}</h1>
          <p className="lede hero__lede">{LEDE}</p>
        </div>

        <div className="split__main hero__rotator">
          <HeroRotator slides={HERO_SLIDES} durationMs={8000} />
        </div>
      </div>
    </section>
  )
}
