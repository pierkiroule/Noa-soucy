import { useMemo, useState } from 'react'
import { cleanGrain, suggestedGrains } from '../../services/naoGrains'
import { addNaoPasser, saveRegisteredNaoPassage } from '../../services/naoPassages'

export function NaoGrains({ nutId, onShowBook, onRestart }: { nutId: string; onShowBook: () => void; onRestart: () => void }) {
  const words = useMemo(() => [...suggestedGrains].sort(() => Math.random() - .5), [])
  const [selected, setSelected] = useState<string[]>([])
  const [customOpen, setCustomOpen] = useState(false)
  const [custom, setCustom] = useState('')
  const [customError, setCustomError] = useState('')
  const [step, setStep] = useState<'choose'|'signature'|'kept'|'deposited'>('choose')
  const [displayName, setDisplayName] = useState('')
  const [locationLabel, setLocationLabel] = useState('')
  const [status, setStatus] = useState<'idle'|'sending'|'error'>('idle')

  const toggle = (grain: string) => setSelected(current => current.includes(grain) ? current.filter(item => item !== grain) : current.length < 3 ? [...current, grain] : current)
  const addCustom = () => {
    const grain = cleanGrain(custom)
    if (!grain) return setCustomError('Écris un grain avant de l’ajouter.')
    if (grain.length > 80) return setCustomError('Ton grain peut contenir 80 caractères au maximum.')
    if (selected.length >= 3) return setCustomError('Trois grains flottent déjà avec toi.')
    if (!selected.some(item => item.toLocaleLowerCase('fr') === grain.toLocaleLowerCase('fr'))) setSelected(current => [...current, grain])
    setCustom(''); setCustomError(''); setCustomOpen(false)
  }
  const deposit = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = displayName.trim()
    if (!name || name.length > 60) return setStatus('error')
    setStatus('sending')
    try {
      const passer = await addNaoPasser({ nutId, displayName: name, ...(locationLabel.trim() ? { locationLabel: locationLabel.trim() } : {}), grains: selected })
      saveRegisteredNaoPassage(nutId, passer.id)
      setStep('deposited'); setStatus('idle')
    } catch { setStatus('error') }
  }

  if (step === 'kept' || step === 'deposited') return <main className="story grains-finale"><span className="eyebrow">Fin de traversée</span>{step === 'deposited' && <><h1>Tes grains ont rejoint ceux des autres.</h1><p>Nao emporte désormais un peu de ta traversée.</p></>}<div className="transmission"><strong>Referme sa coquille.<br/>Confie-la à quelqu’un.</strong><p>Et laisse le voyage continuer.</p></div>{step === 'deposited' && <button className="primary" onClick={onShowBook}>Voir le Livre d’Or•°</button>}<button className="quiet" onClick={onRestart}>Recommencer le conte</button></main>
  if (step === 'signature') return <main className="story grains-experience signature"><span className="eyebrow">Les 3 grains de sel•°</span><h1>Laisse une petite trace avec eux.</h1><p className="selected-grains">{selected.join(' · ')}</p><form onSubmit={deposit}><label>Prénom, nom ou pseudo<input autoFocus maxLength={60} value={displayName} onChange={event => { setDisplayName(event.target.value); setStatus('idle') }} required/></label><label>Un coin du monde <small>facultatif</small><input maxLength={100} placeholder="Nantes, Rezé, Pays de Retz…" value={locationLabel} onChange={event => setLocationLabel(event.target.value)}/></label>{status === 'error' && <p className="travel-error" role="alert">Impossible de déposer les grains pour le moment. Vérifie ta signature ou réessaie plus tard.</p>}<button className="primary" disabled={status === 'sending'}>{status === 'sending' ? 'Les grains voyagent…' : 'Déposer mes grains'}</button><button type="button" className="quiet" onClick={() => setStep('choose')}>Retour</button></form></main>
  return <main className="story grains-experience"><span className="eyebrow">Après l’épilogue</span><h1>Les 3 grains de sel•°</h1><div className="grains-narrative"><p>La traversée s’achève.</p><p>Et pourtant, certaines choses restent.</p><p>Un détail.<br/>Une sensation.<br/>Un son.<br/>Une image.<br/>Une présence…</p><p>Quels sont les trois grains de sel qui te restent de cette traversée&nbsp;?</p></div><h2>Choisis jusqu’à trois mots qui résonnent encore.</h2><div className="grain-field">{words.map(word => <button type="button" key={word} className={selected.includes(word) ? 'is-selected' : ''} aria-pressed={selected.includes(word)} onClick={() => toggle(word)}>{word}</button>)}</div><button className="add-grain" onClick={() => setCustomOpen(open => !open)}>+ Ajouter mon grain de sel sensoriel</button>{customOpen && <div className="custom-grain"><input maxLength={80} value={custom} placeholder="lumière sur l’eau" aria-label="Mon grain de sel sensoriel" onChange={event => { setCustom(event.target.value); setCustomError('') }} onKeyDown={event => { if (event.key === 'Enter') addCustom() }}/><button onClick={addCustom}>Ajouter</button>{customError && <small role="alert">{customError}</small>}</div>}{selected.length > 0 && <section className="grain-choice"><span>Tes grains de sel</span><strong>{selected.join(' · ')}</strong><p>Voilà ce que la traversée a laissé en toi.</p><p>Tu peux garder ces grains pour toi,<br/>ou les déposer dans le Livre d’Or•° de Nao.</p><button className="primary" onClick={() => setStep('signature')}>Déposer mes grains</button><button className="quiet" onClick={() => setStep('kept')}>Les garder pour moi</button></section>}</main>
}
