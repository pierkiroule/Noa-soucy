import { useEffect, useRef, useState } from 'react'
import type { MetaphoricalResonance } from '../../data/metaphoricalResonances'

export function ResonancePanel({ direction, note, onSave, onDelete, onClose }: { direction:MetaphoricalResonance; note:string; onSave:(text:string)=>void; onDelete:()=>void; onClose:()=>void }) {
  const panelRef = useRef<HTMLElement>(null)
  const notebookRef = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLTextAreaElement>(null)
  const [draft, setDraft] = useState(note)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 })
    panelRef.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [direction.id, onClose])

  const save = () => {
    onSave(draft)
    setDraft(draft.trim())
    setSaved(true)
  }
  const remove = () => {
    onDelete()
    setDraft('')
    setSaved(false)
  }
  const openNotebook = () => {
    notebookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => noteRef.current?.focus({ preventScroll: true }), 350)
  }

  return <div className="resonance-panel-backdrop" onClick={onClose}>
    <aside ref={panelRef} className="resonance-panel compass-petal-fx" role="dialog" aria-modal="true" aria-labelledby="resonance-panel-title" tabIndex={-1} onClick={event => event.stopPropagation()}>
      <i className="resonance-panel__handle" aria-hidden="true" />
      <span className="resonance-panel__glyph" aria-hidden="true">{direction.glyph}</span>
      <h2 id="resonance-panel-title">{direction.title}</h2>
      <button type="button" className="resonance-panel__notebook-link" onClick={openNotebook}>Écrire dans mon carnet <span aria-hidden="true">↓</span></button>
      <blockquote>« {direction.quote} »</blockquote>
      <div className="resonance-panel__meaning">
        <p>{direction.meaning}</p>
        <p>{direction.invitation}</p>
      </div>
      <span className="resonance-panel__prompt-label">Une question pour vous</span>
      <p className="resonance-panel__question">{direction.question}</p>
      {direction.helperText && <p className="resonance-panel__helper">{direction.helperText}</p>}
      <div ref={notebookRef} className="resonance-notebook">
        <label htmlFor={`resonance-note-${direction.id}`}>Mon carnet de résonances</label>
        <textarea ref={noteRef} id={`resonance-note-${direction.id}`} value={draft} onChange={event => { setDraft(event.target.value); setSaved(false) }} placeholder="Notez ici les mots, images ou sensations qui résonnent…" rows={5} />
        <div className="resonance-notebook__actions">
          <button type="button" className="primary" onClick={save} disabled={!draft.trim() || draft.trim() === note}>Enregistrer ma note</button>
          {note && <button type="button" className="quiet" onClick={remove}>Effacer ma note</button>}
        </div>
        <p className="resonance-notebook__status" aria-live="polite">{saved ? 'Votre note est enregistrée dans ce navigateur.' : note ? 'Votre note enregistrée peut être modifiée ou effacée.' : 'Cette note restera privée sur cet appareil.'}</p>
      </div>
      <div className="resonance-panel__actions"><button className="quiet" onClick={onClose}>Refermer la direction</button></div>
    </aside>
  </div>
}
