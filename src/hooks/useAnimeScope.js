import { useEffect, useRef } from 'react'
import { createScope } from 'animejs'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/** True when the visitor has asked the OS to minimize animation. */
export function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia(REDUCED_MOTION).matches
  )
}

/**
 * The one correct way to run anime.js v4 inside React.
 *
 * Everything declared inside `register` is scoped to the returned `root` ref,
 * so selectors resolve within the section and class names can stay local. The
 * scope is reverted on unmount, which is what stops animations leaking across
 * route changes and StrictMode's double-mount.
 *
 * `register` may return a cleanup function; anime.js runs it on revert. Use
 * that for anything the scope does not own itself, such as reverting a
 * splitText() instance so the original markup comes back.
 *
 * Reduced motion is handled here rather than in every section: the scope is
 * never created, so no animation runs. That is safe because every animation in
 * this app animates *toward* the element's resting CSS state — skipping it
 * leaves the finished state on screen, which is the accessible behavior.
 *
 * @param {(self: import('animejs').Scope) => (void | (() => void))} register
 * @param {Array<unknown>} [deps]
 */
export function useAnimeScope(register, deps = []) {
  const root = useRef(null)
  const scope = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    scope.current = createScope({ root }).add((self) => register(self))

    return () => {
      if (scope.current) {
        scope.current.revert()
        scope.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { root, scope }
}
