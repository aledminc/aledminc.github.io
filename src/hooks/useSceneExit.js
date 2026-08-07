import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './useAnimeScope.js'

/**
 * Scene exits.
 *
 * The site has ONE continuous background; the content is staged on top of it.
 * So a section may not leave by sliding up — that reads as nothing more than
 * scrolling. Instead every `.layer` inside a scene reports how far it has
 * travelled off the top of the stage, and CSS turns that into a sideways
 * drift + dissolve (see the `.layer` rules in index.css).
 *
 * All the JS does is write one number, `--p` (0 -> 1), onto each layer.
 * Everything visual stays in the stylesheet, which means the same hook can
 * drive a horizontal exit, an in-place shrink, or a blur without changing
 * a line here.
 *
 * One shared listener and one rAF for the whole document, no matter how many
 * layers register — per-element scroll handlers are what make this pattern
 * janky.
 */

// A layer begins leaving once its top edge has risen to this fraction of the
// viewport height, and is gone by the time its bottom clears the top of the
// screen. `data-exit-start` overrides it per layer: a long list wants a small
// value, or nine rows are all mid-dissolve at once and it never looks settled.
const EXIT_START = 0.3

/** @type {Map<HTMLElement, number>} element -> its start fraction */
const layers = new Map()
let frame = 0
let bound = false

function measure() {
  frame = 0
  const vh = window.innerHeight || 1
  const scrolled = window.scrollY || window.pageYOffset || 0

  for (const [el, frac] of layers) {
    const rect = el.getBoundingClientRect()

    // Progress is measured in SCROLL, not in screen position. Position alone
    // is wrong for anything near the top of a page: the first heading already
    // sits above the exit line at scroll 0, so a position-based formula opens
    // the page with its own title half dissolved.
    //
    // beganAt is the scroll offset at which this layer starts leaving, floored
    // at 0 so nothing can be mid-exit before the visitor has scrolled at all.
    const docTop = rect.top + scrolled
    const beganAt = Math.max(0, docTop - vh * frac)
    // Fully gone once the bottom edge passes the top of the viewport.
    const span = Math.max(1, docTop + rect.height - beganAt)

    const p = Math.min(1, Math.max(0, (scrolled - beganAt) / span))
    el.style.setProperty('--p', p.toFixed(4))
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(measure)
}

function bind() {
  if (bound) return
  bound = true
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule, { passive: true })
}

function unbind() {
  if (!bound || layers.size > 0) return
  bound = false
  window.removeEventListener('scroll', schedule)
  window.removeEventListener('resize', schedule)
  if (frame) {
    cancelAnimationFrame(frame)
    frame = 0
  }
}

/**
 * Attach the returned ref to a scene root. Every `.layer` inside it gets an
 * exit. Pass deps when the set of layers changes (e.g. a filtered list).
 *
 * @param {Array<unknown>} [deps]
 */
export function useSceneExit(deps = []) {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return undefined

    const found = [...el.querySelectorAll('.layer')]
    found.forEach((node) => {
      const override = Number(node.dataset.exitStart)
      layers.set(node, override > 0 ? override : EXIT_START)
    })
    bind()
    // Measure immediately: a layer mounted while already scrolled past must
    // not sit at its resting state until the next scroll event.
    measure()

    return () => {
      found.forEach((node) => {
        layers.delete(node)
        node.style.removeProperty('--p')
      })
      unbind()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return root
}
