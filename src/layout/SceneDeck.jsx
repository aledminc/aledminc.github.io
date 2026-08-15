import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { LuArrowLeft, LuArrowRight } from 'react-icons/lu'

const TRANSITION_MS = 760
const WHEEL_THRESHOLD = 54

const isTyping = (target) =>
  target instanceof Element &&
  Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))

export default function SceneDeck({ children, routeKey }) {
  const root = useRef(null)
  const scenes = useRef([])
  const active = useRef(0)
  const locked = useRef(false)
  const wheelTotal = useRef(0)
  const wheelTimer = useRef(0)
  const pointerStart = useRef(null)
  const [index, setIndex] = useState(0)
  const [count, setCount] = useState(0)
  const [label, setLabel] = useState('Scene')

  const announce = useCallback((next) => {
    const scene = scenes.current[next]
    if (!scene) return
    scene.dispatchEvent(new CustomEvent('scene:active'))
    window.dispatchEvent(
      new CustomEvent('scenechange', {
        detail: { index: next, count: scenes.current.length, label: scene.dataset.sceneLabel },
      }),
    )
  }, [])

  const show = useCallback(
    (next, { instant = false } = {}) => {
      const all = scenes.current
      const current = active.current
      if (!all[next] || next === current || locked.current) return

      const outgoing = all[current]
      const incoming = all[next]
      const direction = next > current ? 1 : -1
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      locked.current = !instant && !reduced
      root.current?.classList.toggle('is-transitioning', locked.current)

      incoming.hidden = false
      incoming.inert = false
      incoming.setAttribute('aria-hidden', 'false')
      incoming.dataset.sceneState = 'entering'
      outgoing.dataset.sceneState = 'leaving'

      const finish = () => {
        outgoing.hidden = true
        outgoing.inert = true
        outgoing.setAttribute('aria-hidden', 'true')
        outgoing.dataset.sceneState = 'idle'
        incoming.dataset.sceneState = 'active'
        incoming.style.removeProperty('opacity')
        incoming.style.removeProperty('transform')
        incoming.style.removeProperty('filter')
        incoming.style.removeProperty('clip-path')
        active.current = next
        setIndex(next)
        setLabel(incoming.dataset.sceneLabel || `Scene ${next + 1}`)
        announce(next)
        locked.current = false
        root.current?.classList.remove('is-transitioning')
      }

      if (instant || reduced || !Element.prototype.animate) {
        finish()
        return
      }

      outgoing.animate(
        [
          { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)', clipPath: 'inset(-5% -5% -5% -5%)' },
          { opacity: 0.35, offset: 0.55 },
          {
            opacity: 0,
            transform: `translateX(${-direction * 11}vw) scale(.91)`,
            filter: 'blur(15px)',
            clipPath: direction > 0 ? 'inset(-5% 58% -5% -5%)' : 'inset(-5% -5% -5% 58%)',
          },
        ],
        { duration: TRANSITION_MS, easing: 'cubic-bezier(.65,0,.2,1)', fill: 'forwards' },
      )

      incoming
        .animate(
          [
            {
              opacity: 0,
              transform: `translateX(${direction * 8}vw) scale(1.055)`,
              filter: 'blur(18px)',
              clipPath: 'inset(-5% 50% -5% 50%)',
            },
            { opacity: 0.15, offset: 0.22 },
            { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)', clipPath: 'inset(-5% -5% -5% -5%)' },
          ],
          { duration: TRANSITION_MS, delay: 90, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' },
        )
        .finished.then(finish)
        .catch(finish)
    },
    [announce],
  )

  const go = useCallback(
    (next) => show(Math.max(0, Math.min(scenes.current.length - 1, next))),
    [show],
  )

  useLayoutEffect(() => {
    const host = root.current
    if (!host) return undefined
    const all = [...host.querySelectorAll('[data-scene]')]
    scenes.current = all
    active.current = 0
    setIndex(0)
    setCount(all.length)
    setLabel(all[0]?.dataset.sceneLabel || 'Scene 1')
    all.forEach((scene, i) => {
      const on = i === 0
      scene.hidden = !on
      scene.inert = !on
      scene.setAttribute('aria-hidden', String(!on))
      scene.dataset.sceneState = on ? 'active' : 'idle'
    })
    requestAnimationFrame(() => announce(0))
    return () => {
      scenes.current = []
      window.clearTimeout(wheelTimer.current)
    }
  }, [routeKey, announce])

  useEffect(() => {
    const host = root.current
    if (!host) return undefined

    const onWheel = (event) => {
      if (locked.current || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return
      wheelTotal.current += event.deltaY
      window.clearTimeout(wheelTimer.current)
      wheelTimer.current = window.setTimeout(() => (wheelTotal.current = 0), 180)
      if (Math.abs(wheelTotal.current) < WHEEL_THRESHOLD) return
      const direction = wheelTotal.current > 0 ? 1 : -1
      wheelTotal.current = 0
      go(active.current + direction)
    }

    const onKey = (event) => {
      if (isTyping(event.target)) return
      const nextKeys = ['ArrowRight', 'ArrowDown', 'PageDown', ' ']
      const prevKeys = ['ArrowLeft', 'ArrowUp', 'PageUp']
      if (nextKeys.includes(event.key)) {
        event.preventDefault()
        go(active.current + 1)
      } else if (prevKeys.includes(event.key)) {
        event.preventDefault()
        go(active.current - 1)
      } else if (event.key === 'Home') {
        event.preventDefault()
        go(0)
      } else if (event.key === 'End') {
        event.preventDefault()
        go(scenes.current.length - 1)
      }
    }

    const onPointerDown = (event) => {
      if (event.pointerType !== 'mouse') pointerStart.current = { x: event.clientX, y: event.clientY }
    }
    const onPointerUp = (event) => {
      const start = pointerStart.current
      pointerStart.current = null
      if (!start || isTyping(event.target)) return
      const dx = event.clientX - start.x
      const dy = event.clientY - start.y
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 48) return
      const delta = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : dy < 0 ? 1 : -1
      go(active.current + delta)
    }

    const onClick = (event) => {
      const link = event.target.closest?.('a[href^="#"]')
      if (!link) return
      const target = host.querySelector(link.getAttribute('href'))
      const scene = target?.closest('[data-scene]')
      const targetIndex = scenes.current.indexOf(scene)
      if (targetIndex < 0) return
      event.preventDefault()
      go(targetIndex)
    }

    const onCommand = (event) => {
      const next = event.detail === 'first' ? 0 : Number(event.detail)
      if (Number.isFinite(next)) go(next)
    }

    host.addEventListener('wheel', onWheel, { passive: true })
    host.addEventListener('pointerdown', onPointerDown, { passive: true })
    host.addEventListener('pointerup', onPointerUp, { passive: true })
    host.addEventListener('click', onClick)
    window.addEventListener('keydown', onKey)
    window.addEventListener('scene:go', onCommand)
    return () => {
      host.removeEventListener('wheel', onWheel)
      host.removeEventListener('pointerdown', onPointerDown)
      host.removeEventListener('pointerup', onPointerUp)
      host.removeEventListener('click', onClick)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scene:go', onCommand)
    }
  }, [go])

  return (
    <main className="scene-deck" ref={root}>
      <div className="scene-deck__content">{children}</div>

      {count > 1 && (
        <nav className="scene-nav" aria-label="Page scenes">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous scene">
            <LuArrowLeft size={16} />
          </button>
          <div className="scene-nav__readout" aria-live="polite">
            <span>{String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
            <strong>{label}</strong>
          </div>
          <div className="scene-nav__track" aria-hidden="true">
            {Array.from({ length: count }, (_, i) => <i key={i} className={i === index ? 'is-active' : ''} />)}
          </div>
          <button type="button" onClick={() => go(index + 1)} disabled={index === count - 1} aria-label="Next scene">
            <LuArrowRight size={16} />
          </button>
        </nav>
      )}
      <div className="scene-deck__scan" aria-hidden="true" />
    </main>
  )
}
