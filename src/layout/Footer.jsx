import { Link } from 'react-router-dom'
import { FaXTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa6'
import { LuMail } from 'react-icons/lu'
import { socials, contactEmail } from '../data/socials.js'

const SOCIAL_ICONS = {
  x: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__lead">
            <h2>Let's build something.</h2>
            <p>
              I'm looking for 2027 roles in systems, ML, and robotics — and I
              read every message.
            </p>
            <a className="footer__mail" href={`mailto:${contactEmail}`}>
              <LuMail size={17} />
              {contactEmail}
            </a>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            <Link to="/">Home</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/schedule">Schedule</Link>
            <a
              href="https://github.com/aledminc"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="footer__base">
          <small className="footer__copy">
            © {new Date().getFullYear()} Xander Minch — built with React, Vite
            and anime.js
          </small>

          <div className="footer__links">
            {socials.map(({ id, label, url }) => {
              const Icon = SOCIAL_ICONS[id]
              return (
                <a
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="social"
                >
                  <Icon size={17} />
                </a>
              )
            })}
            <a
              href="https://github.com/aledminc"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="social"
            >
              <FaGithub size={17} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
