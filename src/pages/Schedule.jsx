import { useMemo, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import { animate, stagger } from 'animejs'
import { useMediaQuery } from '../hooks/useMediaQuery.js'
import { useAnimeScope } from '../hooks/useAnimeScope.js'
import { events, days, kindLabels, semester } from '../data/schedule.js'
import { contactEmail } from '../data/socials.js'
import './Schedule.css'

// ---------- EmailJS config ----------
// Vite inlines these at BUILD time, so they end up in the client bundle. That is
// expected and fine for EmailJS's public key, which is designed to be exposed.
// Never put a genuinely secret key in a VITE_ variable.
const EMAILJS = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}
const isConfigured = Boolean(EMAILJS.serviceId && EMAILJS.templateId && EMAILJS.publicKey)

// 5-minute grid granularity, not 15. A 50-minute class (ENGR-E 500) spans
// 3.33 fifteen-minute slots, and a fractional `grid-row: span` is invalid CSS —
// the browser falls back to span 1 and the block collapses to a sliver.
// Everything divides cleanly by 5.
const SLOT_MINUTES = 5

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

const label12h = (minutes) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  const suffix = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`
}

/** 'YYYY-MM-DDTHH:mm' in LOCAL time, for the datetime-local `min` attribute. */
function localNowForInput() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function Schedule() {
  const isNarrow = useMediaQuery('(max-width: 820px)')
  const { root } = useAnimeScope(() => {
    animate('.sched__reveal', {
      opacity: [0, 1],
      translateY: [28, 0],
      delay: stagger(110),
      duration: 780,
      ease: 'out(3)',
    })
  })

  // Grid bounds come from the data, so adding an evening club meeting extends
  // the timetable rather than overflowing it.
  const { dayStart, dayEnd, hourMarks } = useMemo(() => {
    if (events.length === 0) return { dayStart: 480, dayEnd: 1080, hourMarks: [] }
    const starts = events.map((e) => toMinutes(e.start))
    const ends = events.map((e) => toMinutes(e.end))
    const start = Math.floor(Math.min(...starts) / 60) * 60
    const end = Math.ceil(Math.max(...ends) / 60) * 60
    const marks = []
    for (let m = start; m <= end; m += 60) marks.push(m)
    return { dayStart: start, dayEnd: end, hourMarks: marks }
  }, [])

  const totalSlots = (dayEnd - dayStart) / SLOT_MINUTES
  const weeklyHours = useMemo(
    () => events.reduce((sum, event) => sum + toMinutes(event.end) - toMinutes(event.start), 0) / 60,
    [],
  )
  const busiestDay = useMemo(() => {
    const counts = days.map((day) => ({ day, count: events.filter((event) => event.day === day).length }))
    return counts.sort((a, b) => b.count - a.count)[0]?.day ?? '—'
  }, [])

  // Colour by COURSE, not by kind. Every entry this semester is a class, so a
  // class/club legend would be one grey swatch telling you nothing — whereas
  // per-course colour lets you read the whole week at a glance and turns the
  // legend into the actual course list.
  const courses = useMemo(() => {
    const seen = new Map()
    for (const e of events) {
      if (!seen.has(e.code)) {
        seen.set(e.code, { code: e.code, title: e.title, kind: e.kind, i: seen.size })
      }
    }
    return [...seen.values()]
  }, [])

  const courseIndex = useMemo(
    () => Object.fromEntries(courses.map((c) => [c.code, c.i])),
    [courses],
  )

  // Only worth labelling the kind once there is more than one. Right now every
  // entry is a class, so five "CLASS" tags would be pure noise.
  const showKind = useMemo(
    () => new Set(courses.map((c) => c.kind)).size > 1,
    [courses],
  )

  const byDay = useMemo(
    () =>
      days.map((d) => ({
        day: d,
        items: events
          .filter((e) => e.day === d)
          .sort((a, b) => toMinutes(a.start) - toMinutes(b.start)),
      })),
    [],
  )

  // ---------- meeting request form ----------
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [when, setWhen] = useState('')
  const [dateError, setDateError] = useState('')
  const minDateTime = useMemo(() => localNowForInput(), [])

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = formRef.current

    // Honeypot: bots fill hidden inputs. Pretend it worked and drop it.
    if (form.elements._gotcha?.value) {
      setStatus('sent')
      form.reset()
      return
    }

    if (when && new Date(when).getTime() <= Date.now()) {
      setDateError('Pick a date and time in the future.')
      return
    }
    setDateError('')

    if (!isConfigured) {
      setStatus('error')
      return
    }

    setStatus('sending')
    try {
      await emailjs.sendForm(EMAILJS.serviceId, EMAILJS.templateId, form, {
        publicKey: EMAILJS.publicKey,
      })
      setStatus('sent')
      form.reset()
      setWhen('')
    } catch (err) {
      console.error('EmailJS send failed:', err)
      setStatus('error')
    }
  }

  return (
    <div ref={root} className="sched container page">
      <header className="sched__head sched__reveal">
        <p className="eyebrow">{semester} · Live weekly system</p>
        <h1>My week,<br /><em>mapped.</em></h1>
        <p className="sched__sub">
          Fixed commitments at Indiana University. The dark space is where new
          conversations, ambitious builds, and recruiter calls fit.
        </p>

        <dl className="sched__metrics">
          <div><dt>Weekly load</dt><dd>{weeklyHours.toFixed(1)}h</dd></div>
          <div><dt>Busiest day</dt><dd>{busiestDay}</dd></div>
          <div><dt>Open to</dt><dd>2027 roles</dd></div>
        </dl>

        <ul className="sched__legend">
          {courses.map((c) => (
            <li key={c.code} className="sched__legend-item" data-course={c.i}>
              <span className="sched__swatch" aria-hidden="true" />
              <b>{c.code}</b>
              {showKind && (
                <span className="sched__legend-kind">
                  {kindLabels[c.kind] ?? c.kind}
                </span>
              )}
            </li>
          ))}
        </ul>
      </header>

      <section className="sched__board sched__reveal" aria-label="Weekly commitments">
        <div className="sched__board-top">
          <div><span className="sched__pulse" /> Live semester view</div>
          <span>Eastern time · Bloomington, IN</span>
        </div>
      {/* ---------- weekly view ---------- */}
      {isNarrow ? (
        // A timetable is unreadable on a phone, so narrow screens get the
        // stacked per-day list the plan offers as the simpler alternative.
        <div className="sched__list">
          {byDay.map(({ day, items }) => (
            <section className="sched__day" key={day}>
              <h2 className="sched__day-name">{day}</h2>
              {items.length === 0 ? (
                <p className="sched__free">Nothing scheduled.</p>
              ) : (
                <ul className="sched__day-items">
                  {items.map((e, i) => (
                    <li
                      key={`${e.code}-${i}`}
                      className="sched__row"
                      data-course={courseIndex[e.code]}
                    >
                      <span className="sched__row-time">
                        {label12h(toMinutes(e.start))} – {label12h(toMinutes(e.end))}
                      </span>
                      <span className="sched__row-code">{e.code}</span>
                      <span className="sched__row-title">{e.title}</span>
                      {e.where && <span className="sched__row-where">{e.where}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      ) : (
        <div
          className="tt"
          style={{ '--tt-slots': totalSlots }}
          role="table"
          aria-label={`Weekly schedule for ${semester}`}
        >
          {/* Header row. The column is set explicitly: .tt__dayhead carries
              `grid-row: 1` in CSS, which makes it row-explicit and therefore
              auto-placed BEFORE any fully-automatic sibling. With an auto
              column, Mon would claim column 1 — the hour gutter — and every
              day label would sit one column left of its events. */}
          {days.map((d, di) => (
            <div
              className="tt__dayhead"
              key={d}
              role="columnheader"
              style={{ gridColumn: di + 2 }}
            >
              {d}
            </div>
          ))}

          {/* hour gutter + gridlines */}
          {hourMarks.slice(0, -1).map((m) => (
            <div
              className="tt__hour"
              key={m}
              style={{ gridRow: `${(m - dayStart) / SLOT_MINUTES + 2} / span ${60 / SLOT_MINUTES}` }}
            >
              <span className="tt__hour-label">{label12h(m)}</span>
            </div>
          ))}
          {hourMarks.slice(0, -1).map((m) =>
            days.map((d, di) => (
              <div
                className="tt__cell"
                key={`${m}-${d}`}
                style={{
                  gridColumn: di + 2,
                  gridRow: `${(m - dayStart) / SLOT_MINUTES + 2} / span ${60 / SLOT_MINUTES}`,
                }}
                role="presentation"
              />
            )),
          )}

          {/* events */}
          {events.map((e, i) => {
            const col = days.indexOf(e.day)
            if (col === -1) return null
            // Rounded so a stray off-grid time (e.g. 10:07) still yields an
            // integer span rather than silently collapsing the block.
            const startSlot = Math.round((toMinutes(e.start) - dayStart) / SLOT_MINUTES)
            const span = Math.max(
              1,
              Math.round((toMinutes(e.end) - toMinutes(e.start)) / SLOT_MINUTES),
            )
            // Blocks shorter than an hour cannot fit four lines of text at
            // 60px/hour, so they drop the room line and clamp the title.
            const isShort = toMinutes(e.end) - toMinutes(e.start) < 60
            return (
              <article
                className={`tt__event${isShort ? ' tt__event--short' : ''}`}
                data-course={courseIndex[e.code]}
                key={`${e.code}-${e.day}-${i}`}
                style={{
                  gridColumn: col + 2,
                  gridRow: `${startSlot + 2} / span ${span}`,
                }}
              >
                <span className="tt__event-code">{e.code}</span>
                <span className="tt__event-title">{e.title}</span>
                <span className="tt__event-time">
                  {label12h(toMinutes(e.start))} – {label12h(toMinutes(e.end))}
                </span>
                {e.where && <span className="tt__event-where">{e.where}</span>}
              </article>
            )
          })}
        </div>
      )}
      </section>

      {/* ---------- meeting request ---------- */}
      <section className="meet sched__reveal" aria-labelledby="meet-heading">
        <div className="meet__intro">
          <h2 id="meet-heading">Request a meeting</h2>
          <p>
            Tell me who you are and when works — it goes straight to my inbox.
            You can also just email{' '}
            <a className="meet__mailto" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            .
          </p>
        </div>

        {!isConfigured && (
          <p className="meet__notice" role="status">
            <strong>Form not connected yet.</strong> The EmailJS service,
            template, and public key are not set for this build, so requests
            cannot send. Email{' '}
            <a className="meet__mailto" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>{' '}
            in the meantime.
          </p>
        )}

        <form ref={formRef} className="meet-form" onSubmit={onSubmit} noValidate={false}>
          <div className="meet-form__row">
            <label className="field">
              <span className="field__label">Your name</span>
              <input name="from_name" type="text" required autoComplete="name" />
            </label>

            <label className="field">
              <span className="field__label">Company or school</span>
              <input name="org" type="text" required autoComplete="organization" />
            </label>
          </div>

          <div className="meet-form__row">
            <label className="field">
              <span className="field__label">Your email</span>
              <input name="reply_to" type="email" required autoComplete="email" />
            </label>

            <label className="field">
              <span className="field__label">Preferred date &amp; time</span>
              <input
                name="meeting_datetime"
                type="datetime-local"
                required
                min={minDateTime}
                value={when}
                onChange={(e) => {
                  setWhen(e.target.value)
                  setDateError('')
                }}
              />
              {dateError && <span className="field__error">{dateError}</span>}
            </label>
          </div>

          <label className="field">
            <span className="field__label">Meeting details</span>
            <textarea name="details" rows={5} required />
          </label>

          {/* Honeypot — hidden from people, irresistible to bots. */}
          <input
            className="meet-form__trap"
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="meet-form__actions">
            <button
              className="meet-form__submit"
              type="submit"
              disabled={status === 'sending' || !isConfigured}
            >
              {status === 'sending' ? 'Sending…' : 'Request meeting'}
            </button>

            {status === 'sent' && (
              <p className="meet-form__ok" role="status">
                Request sent — I'll be in touch.
              </p>
            )}
            {status === 'error' && (
              <p className="meet-form__err" role="alert">
                Something went wrong. Email{' '}
                <a className="meet__mailto" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>{' '}
                directly.
              </p>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}
