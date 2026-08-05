import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { metaphoricResonances, resonanceAssociations, type MetaphoricResonance } from '../../data/metaphoricResonances'

type WordBody = { id: string; x: number; y: number; vx: number; vy: number }
type Link = { a: string; b: string; phrase: string }
type Ripple = { id: number; x: number; y: number }

const WORD_RADIUS = 50
const COLLISION_DISTANCE = 96
const PUSH_RADIUS = 190
const PUSH_FORCE = 6.8
const DRAG = .965

export function MetaphoricResonances({ onBackToEnding, onFinish }: { onBackToEnding:()=>void; onFinish:()=>void }) {
  const [bodies, setBodies] = useState<WordBody[]>(() => initialBodies())
  const [links, setLinks] = useState<Link[]>([])
  const [activeLink, setActiveLink] = useState<Link>()
  const [ripples, setRipples] = useState<Ripple[]>([])
  const bodiesRef = useRef<WordBody[]>(bodies)
  const linksRef = useRef<Link[]>(links)
  const fieldRef = useRef<HTMLDivElement>(null)
  const rippleIdRef = useRef(0)
  const hasInteractedRef = useRef(false)
  const hasSizedFieldRef = useRef(false)

  const wordsById = useMemo(() => new Map(metaphoricResonances.map(item => [item.id, item])), [])

  useEffect(() => { bodiesRef.current = bodies }, [bodies])
  useEffect(() => { linksRef.current = links }, [links])

  useEffect(() => {
    let frame = 0
    const tick = () => {
      const rect = fieldRef.current?.getBoundingClientRect()
      if (!rect) {
        frame = requestAnimationFrame(tick)
        return
      }

      if (!hasSizedFieldRef.current) {
        hasSizedFieldRef.current = true
        const sizedBodies = initialBodies(rect.width, rect.height)
        bodiesRef.current = sizedBodies
        setBodies(sizedBodies)
      }

      const next = bodiesRef.current.map(body => ({ ...body }))
      for (const body of next) {
        body.vx *= DRAG
        body.vy *= DRAG
        body.x += body.vx
        body.y += body.vy

        if (body.x < WORD_RADIUS) { body.x = WORD_RADIUS; body.vx = Math.abs(body.vx) * .6 }
        if (body.x > rect.width - WORD_RADIUS) { body.x = rect.width - WORD_RADIUS; body.vx = -Math.abs(body.vx) * .6 }
        if (body.y < WORD_RADIUS) { body.y = WORD_RADIUS; body.vy = Math.abs(body.vy) * .6 }
        if (body.y > rect.height - WORD_RADIUS) { body.y = rect.height - WORD_RADIUS; body.vy = -Math.abs(body.vy) * .6 }
      }

      const discovered = new Map(linksRef.current.map(link => [linkKey(link.a, link.b), link]))
      let newest: Link | undefined
      for (let i = 0; i < next.length; i += 1) {
        for (let j = i + 1; j < next.length; j += 1) {
          const a = next[i]
          const b = next[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const distance = Math.hypot(dx, dy) || 1
          if (distance < COLLISION_DISTANCE) {
            const overlap = (COLLISION_DISTANCE - distance) / 2
            const nx = dx / distance
            const ny = dy / distance
            a.x -= nx * overlap
            a.y -= ny * overlap
            b.x += nx * overlap
            b.y += ny * overlap
            a.vx -= nx * .12
            a.vy -= ny * .12
            b.vx += nx * .12
            b.vy += ny * .12

            const phrase = hasInteractedRef.current ? associationPhrase(a.id, b.id) : undefined
            if (phrase) {
              const key = linkKey(a.id, b.id)
              if (!discovered.has(key)) {
                newest = { a: a.id, b: b.id, phrase }
                discovered.set(key, newest)
              }
            }
          }
        }
      }

      setBodies(next)
      if (newest) {
        const updatedLinks = Array.from(discovered.values())
        setLinks(updatedLinks)
        setActiveLink(newest)
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  const pushWords = (event: PointerEvent<HTMLDivElement>) => {
    if (event.target instanceof HTMLElement && event.target.closest('button')) return
    hasInteractedRef.current = true
    const rect = fieldRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const ripple = { id: rippleIdRef.current += 1, x, y }
    setRipples(items => [...items.slice(-5), ripple])
    window.setTimeout(() => setRipples(items => items.filter(item => item.id !== ripple.id)), 950)

    setBodies(current => current.map(body => {
      const dx = body.x - x
      const dy = body.y - y
      const distance = Math.hypot(dx, dy) || 1
      if (distance > PUSH_RADIUS) return body
      const strength = (1 - distance / PUSH_RADIUS) * PUSH_FORCE
      return { ...body, vx: body.vx + (dx / distance) * strength, vy: body.vy + (dy / distance) * strength }
    }))
  }

  return <main className="story resonance-flow">
    <div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div>
    <button className="resonance-back quiet" onClick={onBackToEnding}>Retour à la fin du conte</button>
    <section className="resonance-cloud" aria-labelledby="resonance-title">
      <div className="resonance-intro">
        <span className="eyebrow">Après le conte</span>
        <h1 id="resonance-title">◌ Résonances métaphoriques</h1>
        <p>Touchez l’espace autour des mots : une onde naît et les pousse sans les saisir.</p>
        <p>Quand certains mots associés se frôlent, un fil se tisse et une phrase ressource apparaît.</p>
      </div>
      <div ref={fieldRef} className="resonance-words" aria-label="Champ de mots à déplacer par ondes" onPointerDown={pushWords}>
        <svg className="resonance-network" aria-hidden="true">
          {links.map(link => <NetworkLine key={linkKey(link.a, link.b)} link={link} bodies={bodies} />)}
        </svg>
        {ripples.map(ripple => <i key={ripple.id} className="resonance-ripple" style={{ left: ripple.x, top: ripple.y }} />)}
        {metaphoricResonances.map(item => {
          const body = bodies.find(position => position.id === item.id)
          return <span key={item.id} className="resonance-word-shell" style={bodyStyle(body, item)}>
            <button className="resonance-word" type="button" aria-label={`Mot ${item.word}`}>{item.word}</button>
          </span>
        })}
      </div>
      {activeLink && <aside className="resonance-resource" aria-live="polite">
        <span>{wordsById.get(activeLink.a)?.word} × {wordsById.get(activeLink.b)?.word}</span>
        <p>{activeLink.phrase}</p>
      </aside>}
    </section>
    <button className="resonance-finish quiet" onClick={onFinish}>Terminer ici</button>
  </main>
}

function NetworkLine({ link, bodies }: { link: Link; bodies: WordBody[] }) {
  const a = bodies.find(body => body.id === link.a)
  const b = bodies.find(body => body.id === link.b)
  if (!a || !b) return null
  return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
}

function initialBodies(width = 1000, height = 520): WordBody[] {
  return metaphoricResonances.map((item, index) => ({
    id: item.id,
    x: clamp(item.position.x / 100 * width, WORD_RADIUS, width - WORD_RADIUS),
    y: clamp(item.position.y / 100 * height, WORD_RADIUS, height - WORD_RADIUS),
    vx: item.drift.x / 45,
    vy: item.drift.y / 45 + (index % 2 ? .12 : -.12)
  }))
}

function bodyStyle(body: WordBody | undefined, fallback: MetaphoricResonance): CSSProperties {
  return { left: body?.x ?? `${fallback.position.x}%`, top: body?.y ?? `${fallback.position.y}%` }
}

function linkKey(a: string, b: string): string {
  return [a, b].sort().join('__')
}

function associationPhrase(a: string, b: string): string | undefined {
  return resonanceAssociations[linkKey(a, b)]
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
