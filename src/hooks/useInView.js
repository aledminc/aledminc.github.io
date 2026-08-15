import { useEffect, useState } from 'react'
import { prefersReducedMotion } from './useAnimeScope.js'

/**
 * "Has this scene been reached yet?" — latches true and stays true.
 *
 * Deliberately a scroll listener rather than an IntersectionObserver. IO only
 * reports threshold CROSSINGS, so an element that goes from below the viewport
 * to above it in one jump — a deep link, the End key, browser scroll
 * restoration — never reports at all, and a section whose entrance is gated on
 * it would stay at opacity 0 forever. Reading the rect instead means "already
 * scrolled past" counts as reached, which is the only safe default.
 *
 * Under reduced motion it latches immediately: no scope is created in that
 * case, so the resting CSS must be what shows.
 */
export function useInView(ref, margin = 0.85) {
  const [reached, setReached] = useState(false)

  useEffect(() => {
    if (reached) return undefined
    const el = ref.current
    if (!el) return undefined
    if (prefersReducedMotion()) {
      setReached(true)
      return undefined
    }

    let done = false
    const stop = () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
    function check() {
      if (done) return
      if (el.dataset.sceneState === 'active' || el.closest('[data-scene-state="active"]')) {
        done = true
        stop()
        el.removeEventListener('scene:active', check)
        setReached(true)
        return
      }
      // A negative top is "already behind us" and satisfies this too.
      if (el.getBoundingClientRect().top < window.innerHeight * margin) {
        done = true
        stop()
        setReached(true)
      }
    }

    check() // covers loading already scrolled down
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check, { passive: true })
    el.addEventListener('scene:active', check)
    return () => {
      stop()
      el.removeEventListener('scene:active', check)
    }
  }, [ref, margin, reached])

  return reached
}
