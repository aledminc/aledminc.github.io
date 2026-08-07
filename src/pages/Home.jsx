import Hero from '../sections/Hero.jsx'
import Trajectory from '../sections/Trajectory.jsx'
import Pursuits from '../sections/Pursuits.jsx'
import SignatureWall from '../sections/SignatureWall.jsx'

/**
 * Four scenes on one continuous field.
 *
 * Each enters however it likes but leaves sideways or in place — never
 * upward — so the background never appears to move and the page reads as a
 * sequence of stagings rather than a scroll through stacked boxes. The
 * mechanism lives in useSceneExit.js and the `.layer` rules in index.css.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Trajectory />
      <Pursuits />
      <SignatureWall />
    </>
  )
}
