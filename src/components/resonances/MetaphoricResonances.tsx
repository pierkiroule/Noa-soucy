import { useEffect, useRef, useState } from 'react'
import { metaphoricResonances, type MetaphoricResonance } from '../../data/metaphoricResonances'

interface FloatingWordState {
  element: HTMLButtonElement
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  angle: number
  spin: number
}

const WORD_PADDING = 16
const MAX_FRAME_DELTA = 32

export function MetaphoricResonances({ onBackToEnding, onFinish }: { onBackToEnding:()=>void; onFinish:()=>void }) {
  const [selected, setSelected] = useState<MetaphoricResonance>()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const wordsAreaRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    if (!selected) return undefined
    closeButtonRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(undefined)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selected])

  useEffect(() => {
    const wordsArea = wordsAreaRef.current
    if (!wordsArea) return undefined

    let frame = 0
    let previous = performance.now()
    let words: FloatingWordState[] = []

    const placeWords = () => {
      const bounds = wordsArea.getBoundingClientRect()
      words = metaphoricResonances.flatMap((item, index) => {
        const element = wordRefs.current[item.id]
        if (!element) return []
        const wordBounds = element.getBoundingClientRect()
        const radius = Math.max(wordBounds.width, wordBounds.height) / 2 + WORD_PADDING
        const x = clamp((item.position.x / 100) * bounds.width, radius, bounds.width - radius)
        const y = clamp((item.position.y / 100) * bounds.height, radius, bounds.height - radius)
        const direction = index % 2 === 0 ? 1 : -1
        return [{
          element,
          x,
          y,
          vx: direction * (0.04 + Math.abs(item.drift.x) / 230),
          vy: -direction * (0.035 + Math.abs(item.drift.y) / 260),
          radius,
          angle: direction * 1.5,
          spin: direction * 0.0025
        }]
      })
      words.forEach(applyWordTransform)
    }

    const drift = (now: number) => {
      const delta = Math.min(MAX_FRAME_DELTA, now - previous)
      previous = now
      const bounds = wordsArea.getBoundingClientRect()

      for (const word of words) {
        word.x += word.vx * delta
        word.y += word.vy * delta
        word.angle += word.spin * delta

        if (word.x < word.radius || word.x > bounds.width - word.radius) {
          word.x = clamp(word.x, word.radius, bounds.width - word.radius)
          word.vx *= -0.92
        }
        if (word.y < word.radius || word.y > bounds.height - word.radius) {
          word.y = clamp(word.y, word.radius, bounds.height - word.radius)
          word.vy *= -0.92
        }
      }

      for (let firstIndex = 0; firstIndex < words.length; firstIndex += 1) {
        for (let secondIndex = firstIndex + 1; secondIndex < words.length; secondIndex += 1) {
          softenCollision(words[firstIndex], words[secondIndex])
        }
      }

      words.forEach(applyWordTransform)
      frame = requestAnimationFrame(drift)
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    placeWords()
    window.addEventListener('resize', placeWords)

    if (!reducedMotion.matches) frame = requestAnimationFrame(drift)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', placeWords)
    }
  }, [])

  return <main className="story resonance-flow">
    <div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div>
    <button className="resonance-back quiet" onClick={onBackToEnding}>Retour à la fin du conte</button>
    <section className={`resonance-cloud${selected ? ' has-selection' : ''}`} aria-labelledby="resonance-title">
      <div className="resonance-intro">
        <span className="eyebrow">Après le conte</span>
        <h1 id="resonance-title">◌ Résonances métaphoriques</h1>
        <p>Le conte est terminé.</p>
        <p>Ou peut-être commence-t-il seulement maintenant.</p>
        <p>Les histoires ouvrent parfois un espace où quelque chose de notre vie peut résonner.</p>
        <p>Laissez les mots dériver.</p>
        <p>Effleurez simplement celui qui vous appelle aujourd’hui.</p>
        <p>Aucun mot n’est à choisir.<br/>Aucune réponse n’est attendue.</p>
      </div>
      <div ref={wordsAreaRef} className="resonance-words" aria-label="Nuage de mots métaphoriques">
        {metaphoricResonances.map(item => <button key={item.id} ref={element => { wordRefs.current[item.id] = element }} className={`resonance-word${selected?.id === item.id ? ' is-selected' : ''}`} onClick={() => setSelected(item)} aria-label={`Lire la résonance du mot ${item.word}`} disabled={Boolean(selected && selected.id !== item.id)}>{item.word}</button>)}
      </div>
    </section>
    {selected && <div className="resonance-modal" role="dialog" aria-modal="true" aria-labelledby="selected-resonance-title" onClick={() => setSelected(undefined)}>
      <article className="resonance-card" onClick={event => event.stopPropagation()}>
        <h2 id="selected-resonance-title">{selected.word}</h2>
        <p>{selected.text}</p>
        <button ref={closeButtonRef} className="quiet" onClick={() => setSelected(undefined)}>Revenir aux mots</button>
      </article>
    </div>}
    <button className="resonance-finish quiet" onClick={onFinish}>Terminer ici</button>
  </main>
}

function applyWordTransform(word: FloatingWordState) {
  const scale = word.element.classList.contains('is-selected') ? ' scale(1.09)' : ''
  word.element.style.transform = `translate3d(${word.x}px, ${word.y}px, 0) rotate(${word.angle}deg)${scale}`
}

function softenCollision(first: FloatingWordState, second: FloatingWordState) {
  const dx = second.x - first.x
  const dy = second.y - first.y
  const distance = Math.hypot(dx, dy) || 1
  const minimumDistance = first.radius + second.radius
  if (distance >= minimumDistance) return

  const overlap = (minimumDistance - distance) / 2
  const nx = dx / distance
  const ny = dy / distance
  first.x -= nx * overlap
  first.y -= ny * overlap
  second.x += nx * overlap
  second.y += ny * overlap

  const firstProjection = first.vx * nx + first.vy * ny
  const secondProjection = second.vx * nx + second.vy * ny
  const exchange = (secondProjection - firstProjection) * 0.82
  first.vx += exchange * nx
  first.vy += exchange * ny
  second.vx -= exchange * nx
  second.vy -= exchange * ny
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
