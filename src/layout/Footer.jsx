import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from 'react-icons/fa6'
import { LuArrowUp, LuArrowUpRight } from 'react-icons/lu'
import { socials, contactEmail } from '../data/socials.js'

const SOCIAL_META = {
  github: { icon: FaGithub, handle: '@aledminc' },
  linkedin: { icon: FaLinkedinIn, handle: '/in/xander-minch' },
  instagram: { icon: FaInstagram, handle: '@xandererr' },
  x: { icon: FaXTwitter, handle: '@XanderMinch' },
}

const socialById = Object.fromEntries(socials.map((social) => [social.id, social]))
const LINKS = [
  { id: 'github', label: 'GitHub', url: 'https://github.com/aledminc' },
  socialById.linkedin,
  socialById.instagram,
  socialById.x,
].filter(Boolean)

export default function Footer() {
  return (
    <footer className="footer" data-scene data-scene-label="Contact">
      <div className="container">
        <div className="footer__panel">
          <div className="footer__signal">
            <span className="footer__signal-dot" aria-hidden="true" />
            Open to 2027 engineering roles
          </div>

          <div className="footer__hero">
            <div>
              <p className="footer__kicker">Have a hard problem?</p>
              <h2>Let’s build what’s<br />not obvious yet.</h2>
            </div>

            <a className="footer__contact" href={`mailto:${contactEmail}`}>
              <span className="footer__contact-copy">
                <small>Start a conversation</small>
                <strong>{contactEmail}</strong>
              </span>
              <span className="footer__contact-arrow" aria-hidden="true">
                <LuArrowUpRight size={25} />
              </span>
            </a>
          </div>

          <nav className="footer__socials" aria-label="Social profiles">
            {LINKS.map(({ id, label, url }) => {
              const { icon: Icon, handle } = SOCIAL_META[id]
              return (
                <a key={id} href={url} target="_blank" rel="noopener noreferrer">
                  <span className="footer__social-icon"><Icon size={18} /></span>
                  <span className="footer__social-copy">
                    <strong>{label}</strong>
                    <small>{handle}</small>
                  </span>
                  <LuArrowUpRight className="footer__social-arrow" size={17} />
                </a>
              )
            })}
          </nav>

          <div className="footer__base">
            <small>© {new Date().getFullYear()} Xander Minch</small>
            <span>Built in Bloomington, Indiana</span>
            <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('scene:go', { detail: 'first' }))}>
              Back to start <LuArrowUp size={15} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
