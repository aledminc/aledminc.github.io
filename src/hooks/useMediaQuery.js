import { useEffect, useState } from 'react'

/**
 * Subscribes to a media query. Used to render EITHER the weekly timetable or
 * the stacked per-day list — never both. Rendering both and hiding one with CSS
 * would duplicate every event for screen readers.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = (e) => setMatches(e.matches)
    setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
