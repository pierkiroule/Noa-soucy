import { useEffect, useMemo, useState } from 'react'
import { cleanGrain, suggestedGrains } from '../../services/naoGrains'
import { saveRegisteredNaoPassage } from '../../services/naoPassages'
import { continueWithoutNaoTrace, leaveNaoTrace } from '../../services/naoTraceFlow'
import { Brand, NaoGrainTag, NaoScreen } from './NaoUi'

export function NaoGrains({ nutId, onShowBook, onRestart }: { nutId: string; onShowBook: () => void; onRestart: () => void }) {
  const words = useMemo(() => [...suggestedGrains].sort(() => Math.random() - .5), [])
  const draftKey = `nao-grains-draft:${nutId}`
  const [selected, setSelected] = useState<string[]>(() => readGrainDraft(draftKey))
  const [customWords, setCustomWords] = useState<string[]>(() => readGrainDraft(draftKey).filter(word => !suggestedGrains.includes(word)))
  const [customOpen, setCustomOpen] = useState(false)
  const [custom, setCustom] = useState('')
  const [customError, setCustomError] = useState('')
  const [step, setStep] = useState<'choose'|'signature'|'kept'|'deposited'>('choose')
  const [displayName, setDisplayName] = useState('')
  const [locationLabel, setLocationLabel] = useState('')
  const [status, setStatus] = useState<'idle'|'sending'|'error'>('idle')

  useEffect(() => {
    try { localStorage.setItem(draftKey, JSON.stringify(selected)) }
    catch { /* A storage restriction must not interrupt the experience. */ }
  }, [draftKey, selected])

  const leaveJustATrace = () => { setSelected([]); setStep('signature') }

  const toggle = (grain: string) => setSelected(current => current.includes(grain) ? current.filter(item => item !== grain) : current.length < 3 ? [...current, grain] : current)
  const addCustom = () => {
    const grain = cleanGrain(custom)
    if (!grain) return setCustomError('Écris un grain avant de l’ajouter.')
    if (grain.length > 80) return setCustomError('Ton grain peut contenir 80 caractères au maximum.')
    if (selected.length >= 3) return setCustomError('Trois grains flottent déjà avec toi.')
    if (!selected.some(item => item.toLocaleLowerCase('fr') === grain.toLocaleLowerCase('fr'))) {
      setSelected(current => [...current, grain])
      if (!suggestedGrains.includes(grain)) setCustomWords(current => [...current, grain])
    }
    setCustom(''); setCustomError(''); setCustomOpen(false)
  }
  const deposit = async (event: React.FormEvent) => {
    event.preventDefault()
    const name = displayName.trim()
    if (!name || name.length > 60) return setStatus('error')
    setStatus('sending')
    try {
      const passer = await leaveNaoTrace({ nutId, displayName: name, ...(locationLabel.trim() ? { locationLabel: locationLabel.trim() } : {}), grains: selected })
      saveRegisteredNaoPassage(nutId, passer.id)
      try { localStorage.removeItem(draftKey) } catch { /* The server-side deposit succeeded. */ }
      setStep('deposited'); setStatus('idle')
    } catch { setStatus('error') }
  }

  if (step === 'kept' || step === 'deposited') return <NaoScreen className="grains-finale"><Brand/><div className="finale-mark" aria-hidden="true">◌</div><span className="eyebrow">Fin de traversée</span>{step === 'deposited' && <><h1>{selected.length ? 'Tes grains ont rejoint ceux des autres.' : 'Ta trace a rejoint celles des autres.'}</h1><p>Nao emporte désormais un peu de ta traversée.</p></>}<div className="transmission"><strong>Referme sa coquille.<br/>Confie-la à quelqu’un.</strong><p>Et laisse le voyage continuer.</p></div>{step === 'deposited' && <button className="primary" onClick={onShowBook}>Voir le Livre d’Or•°</button>}<button className="quiet" onClick={onRestart}>Recommencer le conte</button></NaoScreen>
  if (step === 'signature') return <NaoScreen className="grains-experience signature"><Brand/><span className="eyebrow">Les 3 grains de sel•°</span><h1>{selected.length ? 'Laisse une petite trace avec eux.' : 'Laisse juste une trace.'}</h1>{selected.length > 0 && <p className="selected-grains">{selected.join(' · ')}</p>}<form onSubmit={deposit}><label htmlFor="nao-name">Prénom, nom ou pseudo</label><input id="nao-name" className="nao-input" autoFocus maxLength={60} value={displayName} onChange={event => { setDisplayName(event.target.value); setStatus('idle') }} required/><label htmlFor="nao-location">Un coin du monde <small>facultatif</small></label><input id="nao-location" className="nao-input" maxLength={100} placeholder="Nantes, Rezé, Pays de Retz…" value={locationLabel} onChange={event => setLocationLabel(event.target.value)}/>{status === 'error' && <p className="travel-error" role="alert">Impossible de laisser cette trace pour le moment. Vérifie ta signature ou réessaie plus tard.</p>}<button className="primary" disabled={status === 'sending'} aria-busy={status === 'sending'}>{status === 'sending' ? 'La trace voyage…' : selected.length ? 'Déposer mes grains' : 'Signer le Livre d’Or•°'}</button><button type="button" className="quiet" onClick={() => setStep('choose')}>Retour</button></form></NaoScreen>
  const displayedWords = [...customWords, ...words]
  return <NaoScreen className="grains-experience"><Brand/><span className="eyebrow">Après l’épilogue</span><h1>Les 3 grains de sel•°</h1><div className="grains-narrative"><p>La traversée s’achève.</p><p>Et pourtant, certaines choses restent.</p><p>Un détail.<br/>Une sensation.<br/>Un son.<br/>Une image.<br/>Une présence…</p><p>Quels sont les trois grains de sel qui te restent de cette traversée&nbsp;?</p></div><h2>Choisis jusqu’à trois mots qui résonnent encore.</h2><div className="grain-field">{displayedWords.map(word => <NaoGrainTag key={word} selected={selected.includes(word)} disabled={selected.length >= 3 && !selected.includes(word)} onClick={() => toggle(word)}>{word}</NaoGrainTag>)}</div><button className="add-grain" onClick={() => setCustomOpen(open => !open)} aria-expanded={customOpen} aria-controls="custom-grain-editor">+ Ajouter mon grain de sel sensoriel</button>{customOpen && <div id="custom-grain-editor" className="custom-grain"><input className="nao-input" maxLength={80} value={custom} placeholder="lumière sur l’eau" aria-label="Mon grain de sel sensoriel" onChange={event => { setCustom(event.target.value); setCustomError('') }} onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); addCustom() } }}/><button type="button" className="quiet" onClick={addCustom}>Ajouter</button>{customError && <small role="alert">{customError}</small>}</div>}{selected.length > 0 && <section className="grain-choice"><span>Tes grains de sel</span><strong>{selected.join(' · ')}</strong><p>Voilà ce que la traversée a laissé en toi.</p><p>Tu peux garder ces grains pour toi,<br/>ou les déposer dans le Livre d’Or•° de Nao.</p><button className="primary" onClick={() => setStep('signature')}>Déposer mes grains</button><button className="quiet" onClick={() => setStep('kept')}>Les garder pour moi</button></section>}<section className="grain-choice trace-choice"><button className="primary" onClick={leaveJustATrace}>Laisser juste une trace</button><button className="quiet" onClick={() => continueWithoutNaoTrace(() => setStep('kept'))}>Continuer sans laisser de trace</button></section></NaoScreen>
}

function readGrainDraft(key: string): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value.filter((grain): grain is string => typeof grain === 'string').map(cleanGrain).filter(grain => grain.length > 0 && grain.length <= 80).slice(0, 3) : []
  } catch { return [] }
}
