import { useState } from 'react'
import { LuFlagTriangleRight, LuGamepad2, LuMapPin } from 'react-icons/lu'
import { hobbies } from '../data/hobbies.js'
import './Pursuits.css'

function GolfPanel({ hobby }) {
  return (
    <div className="pursuit-layout pursuit-layout--golf">
      <div className="swing-bay">
        {hobby.media.src ? (
          <img src={hobby.media.src} alt={hobby.media.alt} loading="lazy" />
        ) : (
          <div className="swing-bay__empty">
            <span className="swing-bay__arc" aria-hidden="true" />
            <LuFlagTriangleRight size={25} aria-hidden="true" />
            <strong>Swing study</strong>
            <small>GIF coming soon</small>
          </div>
        )}
      </div>

      <div className="golf-board">
        <header className="pursuit-panel__head">
          <div>
            <span>Player card</span>
            <h3>Golf</h3>
          </div>
          <div className="handicap" aria-label={`Handicap ${hobby.handicap}`}>
            <strong>{hobby.handicap}</strong>
            <span>HCP</span>
          </div>
        </header>

        <section className="score-strip" aria-labelledby="recent-rounds">
          <div className="pursuit-label" id="recent-rounds">Recent rounds</div>
          <ol>
            {hobby.recentScores.map((score, index) => (
              <li key={`${score}-${index}`}><strong>{score}</strong></li>
            ))}
          </ol>
        </section>

        <section className="course-list" aria-labelledby="most-played-courses">
          <div className="pursuit-label" id="most-played-courses">Most played courses</div>
          <ul>
            {hobby.courses.map((course) => (
              <li key={course}><LuMapPin size={13} aria-hidden="true" />{course}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}

function RankVisual({ rank }) {
  if (rank.visual.type === 'premier') {
    return (
      <span className="premier-mark" style={{ '--rank-color': rank.visual.color }} aria-hidden="true">
        <i />
        <b>{rank.rank}</b>
      </span>
    )
  }

  return <img src={rank.visual.src} alt="" loading="lazy" decoding="async" />
}

function GamingPanel({ hobby }) {
  return (
    <div className="gaming-board">
      <header className="pursuit-panel__head gaming-board__head">
        <div>
          <span>Competitive profile</span>
          <h3>Video games</h3>
        </div>
        <LuGamepad2 size={25} aria-hidden="true" />
      </header>

      <div className="rank-grid">
        {hobby.ranks.map((rank) => (
          <article className={`rank-card rank-card--${rank.visual.type}`} key={`${rank.game}-${rank.mode}`}>
            <div className="rank-card__visual">
              <RankVisual rank={rank} />
            </div>
            <div className="rank-card__copy">
              <span>{rank.game}</span>
              <small>{rank.mode}</small>
              <strong>{rank.rank}</strong>
              {rank.division && <em>{rank.division}</em>}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function ClassicPanel({ hobby }) {
  return (
    <div className="pursuit-layout pursuit-layout--classic">
      <div className="classic-art">
        <img src={hobby.media.src} alt={hobby.media.alt} loading="lazy" decoding="async" />
      </div>
      <div className="classic-board">
        <header className="pursuit-panel__head">
          <div>
            <span>Player card</span>
            <h3>{hobby.label}</h3>
          </div>
        </header>
        <dl className="classic-stats">
          {hobby.stats.map((stat) => (
            <div key={stat.label}>
              <dt>{stat.label}</dt>
              <dd>{stat.value.toLocaleString()}{stat.unit}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

export default function Pursuits() {
  const [active, setActive] = useState(0)
  const hobby = hobbies[active]

  return (
    <section className="scene pursuits" aria-labelledby="pursuits-heading">
      <div className="container split pursuits__grid">
        <header className="split__aside pursuits__head section-copy">
          <h2 id="pursuits-heading">My passions outside of tech.</h2>
          <div className="switch" role="tablist" aria-label="Pursuits">
            {hobbies.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`pursuit-tab-${item.id}`}
                aria-selected={index === active}
                aria-controls="pursuit-panel"
                tabIndex={index === active ? 0 : -1}
                className={`switch__opt${index === active ? ' is-active' : ''}`}
                onClick={() => setActive(index)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <div className="split__main pursuits__stage">
          <div
            className={`pursuit glass pursuit--${hobby.kind}`}
            id="pursuit-panel"
            role="tabpanel"
            aria-labelledby={`pursuit-tab-${hobby.id}`}
            style={{ '--pursuit-accent': hobby.accent }}
          >
            {hobby.kind === 'golf' && <GolfPanel hobby={hobby} />}
            {hobby.kind === 'gaming' && <GamingPanel hobby={hobby} />}
            {hobby.kind === 'classic' && <ClassicPanel hobby={hobby} />}
          </div>
        </div>
      </div>
    </section>
  )
}
