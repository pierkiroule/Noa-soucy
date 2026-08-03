import { useState } from 'react'
import { useStoryState } from './StoryState'
import type { StoryPause } from './types'

export function PausePlayer({ pause }: { pause: StoryPause }) {
  const { state, respond, next } = useStoryState()
  const [selected, setSelected] = useState<string[]>(state.responses[pause.id] ?? [])

  const toggle = (id: string) => {
    if (id === 'none') return setSelected(['none'])
    setSelected(current => current.includes(id)
      ? current.filter(value => value !== id)
      : [...current.filter(value => value !== 'none'), id].slice(-pause.maxChoices))
  }
  const submit = () => { respond(pause.id, selected); next() }
  const selectionLabel = selected.length
    ? `${selected.length} choix sur ${pause.maxChoices}`
    : pause.allowSkip ? 'Vous pouvez aussi continuer sans choisir' : 'Sélectionnez une réponse'
  const selectedOption = pause.options.find(option => selected.includes(option.id))

  return <section className="pause">
    <div className="pause__content">
      <span className="eyebrow">{pause.title}</span>
      <h1>{pause.question}</h1>
      {pause.helperText && <p>{pause.helperText}</p>}
      <div className="choices" role="group" aria-label={pause.question}>
        {pause.options.map(option => <button key={option.id} className={`choice ${selected.includes(option.id) ? 'choice--selected' : ''}`} aria-pressed={selected.includes(option.id)} onClick={() => toggle(option.id)}>
          <span>{option.label}</span><i aria-hidden="true">✓</i>
        </button>)}
      </div>
      {selectedOption?.resonance && <article className="resonance" aria-live="polite">
        <span className="eyebrow">{selectedOption.resonance.title}</span>
        <div>{selectedOption.resonance.text.split('\n').map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div>
      </article>}
      <div className="pause__footer">
        <span aria-live="polite">{selectionLabel}</span>
        <button className="primary" disabled={!pause.allowSkip && !selected.length} onClick={submit}>{selected.length ? 'Continuer avec ce choix' : 'Continuer sans choisir'} <span aria-hidden="true">→</span></button>
      </div>
    </div>
  </section>
}
