import Hero from '../sections/Hero.jsx'
import Trajectory from '../sections/Trajectory.jsx'
import Pursuits from '../sections/Pursuits.jsx'
import SignatureWall from '../sections/SignatureWall.jsx'

/** Four homepage sections in ordinary document flow. */
export default function Home() {
  return (
    <div className="home">
      <Hero />
      <Trajectory />
      <Pursuits />
      <SignatureWall />
    </div>
  )
}
