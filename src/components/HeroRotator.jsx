import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'
import { prefersReducedMotion } from '../hooks/useAnimeScope.js'
import './HeroRotator.css'

export default function HeroRotator({ slides, durationMs = 8000 }) {
  const [active, setActive] = useState(0)
  const fillRefs = useRef([])
  const animationRef = useRef(null)
  const timeoutRef = useRef(0)
  const timerStartedAt = useRef(0)
  const remainingMs = useRef(durationMs)
  const pauseReasons = useRef(new Set())
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (active >= slides.length) setActive(0)
  }, [active, slides.length])

  useEffect(() => {
    if (slides.length <= 1) return undefined

    const advance = () => setActive((index) => (index + 1) % slides.length)
    const fill = fillRefs.current[active]
    remainingMs.current = durationMs
    timerStartedAt.current = performance.now()

    if (reduced) {
      if (pauseReasons.current.size === 0) {
        timeoutRef.current = window.setTimeout(advance, durationMs)
      }
    } else if (fill) {
      fill.style.width = '0%'
      animationRef.current = animate(fill, {
        width: ['0%', '100%'],
        duration: durationMs,
        ease: 'linear',
        onComplete: advance,
      })
      if (pauseReasons.current.size > 0) animationRef.current.pause()
    }

    return () => {
      window.clearTimeout(timeoutRef.current)
      animationRef.current?.cancel()
      animationRef.current = null
    }
  }, [active, durationMs, reduced, slides.length])

  const pause = (reason) => {
    if (slides.length <= 1 || pauseReasons.current.has(reason)) return
    const wasRunning = pauseReasons.current.size === 0
    pauseReasons.current.add(reason)
    if (!wasRunning) return

    if (reduced) {
      window.clearTimeout(timeoutRef.current)
      remainingMs.current = Math.max(
        0,
        remainingMs.current - (performance.now() - timerStartedAt.current),
      )
    } else {
      animationRef.current?.pause()
    }
  }

  const resume = (reason) => {
    if (slides.length <= 1 || !pauseReasons.current.has(reason)) return
    pauseReasons.current.delete(reason)
    if (pauseReasons.current.size > 0) return

    if (reduced) {
      timerStartedAt.current = performance.now()
      timeoutRef.current = window.setTimeout(
        () => setActive((index) => (index + 1) % slides.length),
        remainingMs.current,
      )
    } else {
      animationRef.current?.resume()
    }
  }

  const onBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) resume('focus')
  }

  return (
    <div
      className="hero-rotator"
      onMouseEnter={() => pause('hover')}
      onMouseLeave={() => resume('hover')}
      onFocusCapture={() => pause('focus')}
      onBlurCapture={onBlur}
    >
      <div className="rotator__stage">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="rotator__pane"
            hidden={index !== active}
            role="tabpanel"
            id={`hero-pane-${slide.id}`}
            aria-labelledby={slides.length > 1 ? `hero-tab-${slide.id}` : undefined}
          >
            {index === active && slide.render()}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="rotator__controls">
          <span className="rotator__count" aria-live="polite">
            {(active + 1).toString().padStart(2, '0')}
            <i aria-hidden="true" />
            {slides.length.toString().padStart(2, '0')}
          </span>

          <div className="rotator__timer" role="tablist" aria-label="Rotating highlights">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                role="tab"
                id={`hero-tab-${slide.id}`}
                aria-controls={`hero-pane-${slide.id}`}
                aria-label={slide.label}
                aria-selected={index === active}
                className={`rotator__seg${index === active ? ' is-active' : ''}`}
                onClick={() => setActive(index)}
              >
                <span className="rotator__track" aria-hidden="true">
                  <span
                    className="rotator__fill"
                    ref={(element) => { fillRefs.current[index] = element }}
                    style={{ width: index < active ? '100%' : '0%' }}
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
