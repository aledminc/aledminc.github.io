import { projects } from '../data/projects.js'
import './RecentBuildsPanel.css'

const RECENT_BUILDS = projects.slice(0, 3)

export default function RecentBuildsPanel() {
  return (
    <section className="recent-builds" aria-labelledby="recent-builds-heading">
      <header className="recent-builds__head">
        <div>
          <h2 id="recent-builds-heading">Recent builds</h2>
          <p>Newest repositories</p>
        </div>
        <strong>{RECENT_BUILDS.length.toString().padStart(2, '0')}</strong>
      </header>

      <div className="recent-builds__well">
        {RECENT_BUILDS.map((project, index) => (
          <article className="recent-builds__row" key={project.id}>
            <span>{(index + 1).toString().padStart(2, '0')}</span>
            <div>
              <h3>{project.title.split(' — ')[0]}</h3>
              <p>{project.tags.join(' · ')}</p>
            </div>
            <time dateTime={project.date}>{project.date}</time>
          </article>
        ))}
      </div>
    </section>
  )
}
