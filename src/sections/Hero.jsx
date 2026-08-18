import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import HeroRotator from '../components/HeroRotator.jsx'
import ContributionGraph from '../components/ContributionGraph.jsx'
import ResumePanel from '../components/ResumePanel.jsx'
import OmegLolAd from '../components/OmegLolAd.jsx'
import { profileLinks } from '../data/socials.js'
import './Hero.css'

const TITLE = "Hey, I'm Xander!"
const LEDE = `As a computer science and accelerated master's in intelligent systems student at
Indiana University, I've picked up many different experiences. From single-cell RNA pipelines, to 
LLM summarization for clinical review, even to an autonomous rover I lead the software build on, I'm 
always interested in learning more. Scroll to find out more about me!`

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

const PROFILE_ICONS = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  x: FaXTwitter,
}

export default function Hero() {
  return (
    <section className="scene hero" aria-labelledby="hero-title">
      <div className="container split hero__grid">
        <div className="split__aside hero__copy section-copy">
          <nav className="hero__links" aria-label="Xander's profiles">
            {profileLinks.map(({ id, label, url }) => {
              const Icon = PROFILE_ICONS[id]
              return (
                <a
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                >
                  <Icon size={19} aria-hidden="true" />
                </a>
              )
            })}
          </nav>
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
