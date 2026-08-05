import { useEffect, useRef, useState } from 'react'
import type { MetaphoricalResonance } from '../../data/metaphoricalResonances'

export function ResonancePanel({ petal, value, onSave, onClose }: { petal:MetaphoricalResonance; value:string; onSave:(text:string)=>void; onClose:()=>void }) {
  const [text, setText] = useState(value)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => { setText(value) }, [value, petal.id])
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { onSave(text); onClose() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onSave, text])

  return <div className="resonance-panel-backdrop" onClick={() => { onSave(text); onClose() }}>
    <aside className="resonance-panel" role="dialog" aria-modal="true" aria-labelledby="resonance-panel-title" onClick={event => event.stopPropagation()}>
      <i className="resonance-panel__handle" aria-hidden="true" />
      <span className="resonance-panel__glyph" aria-hidden="true">{petal.glyph}</span>
      <h2 id="resonance-panel-title">{petal.title}</h2>
      <blockquote>« {petal.quote} »</blockquote>
      <p className="resonance-panel__question">{petal.question}</p>
      {petal.helperText && <p className="resonance-panel__helper">{petal.helperText}</p>}
      <label><span>Quelques mots, si vous souhaitez les déposer</span><textarea rows={3} value={text} placeholder={petal.placeholder} onChange={event => setText(event.target.value)} onBlur={() => onSave(text)} /></label>
      <div className="resonance-panel__actions"><button className="primary" onClick={() => onSave(text)}>Garder ces mots</button><button ref={closeRef} className="quiet" onClick={() => { onSave(text); onClose() }}>Refermer le pétale</button></div>
    </aside>
  </div>
}
