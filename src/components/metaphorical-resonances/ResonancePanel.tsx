import { useEffect, useRef } from 'react'
import type { MetaphoricalResonance } from '../../data/metaphoricalResonances'

export function ResonancePanel({ direction, onClose }: { direction:MetaphoricalResonance; onClose:()=>void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return <div className="resonance-panel-backdrop" onClick={onClose}>
    <aside className="resonance-panel compass-petal-fx" role="dialog" aria-modal="true" aria-labelledby="resonance-panel-title" onClick={event => event.stopPropagation()}>
      <i className="resonance-panel__handle" aria-hidden="true" />
      <span className="resonance-panel__glyph" aria-hidden="true">{direction.glyph}</span>
      <h2 id="resonance-panel-title">{direction.title}</h2>
      <blockquote>« {direction.quote} »</blockquote>
      <div className="resonance-panel__meaning">
        <p>{direction.meaning}</p>
        <p>{direction.invitation}</p>
      </div>
      <span className="resonance-panel__prompt-label">Une question pour vous</span>
      <p className="resonance-panel__question">{direction.question}</p>
      {direction.helperText && <p className="resonance-panel__helper">{direction.helperText}</p>}
      <div className="resonance-panel__actions"><button ref={closeRef} className="primary" onClick={onClose}>Refermer la direction</button></div>
    </aside>
  </div>
}
