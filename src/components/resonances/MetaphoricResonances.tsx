import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { metaphoricResonances, type MetaphoricResonance } from '../../data/metaphoricResonances'

export function MetaphoricResonances({ onBackToEnding, onFinish }: { onBackToEnding:()=>void; onFinish:()=>void }) {
  const [selected, setSelected] = useState<MetaphoricResonance>()
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!selected) return undefined
    closeButtonRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(undefined)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selected])

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
      <div className="resonance-words" aria-label="Nuage de mots métaphoriques">
        {metaphoricResonances.map((item, index) => <span key={item.id} className="resonance-word-shell" style={wordStyle(item, index)}>
          <button className={`resonance-word${selected?.id === item.id ? ' is-selected' : ''}`} onClick={() => setSelected(item)} aria-label={`Lire la résonance du mot ${item.word}`} disabled={Boolean(selected && selected.id !== item.id)}>{item.word}</button>
        </span>)}
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

function wordStyle(item: MetaphoricResonance, index: number): CSSProperties {
  const direction = index % 2 === 0 ? 1 : -1
  return {
    '--x': `${item.position.x}%`,
    '--y': `${item.position.y}%`,
    '--dx': `${item.drift.x * 2.6}px`,
    '--dy': `${item.drift.y * 2.4}px`,
    '--rx': `${direction * (10 + index % 5)}px`,
    '--duration': `${Math.max(18, item.drift.duration - 5)}s`,
    '--delay': `${item.drift.delay}s`,
    '--tilt': `${direction * (1.5 + (index % 4) * 0.5)}deg`
  } as CSSProperties
}
