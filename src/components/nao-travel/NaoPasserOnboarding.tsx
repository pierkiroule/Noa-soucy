import { useState, type FormEvent } from 'react'
import { addNaoPasser, saveRegisteredNaoPassage } from '../../services/naoPassages'

export function NaoPasserOnboarding({ nutId, onContinue }: { nutId: string; onContinue: () => void }) {
  const [displayName, setDisplayName] = useState('')
  const [locationLabel, setLocationLabel] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)
  const [saved, setSaved] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const name = displayName.trim()
    if (!name || submitting) return
    setSubmitting(true)
    setError(false)
    try {
      const passer = await addNaoPasser({ nutId, displayName: name, ...(locationLabel.trim() && { locationLabel: locationLabel.trim() }) })
      saveRegisteredNaoPassage(nutId, passer.id)
      setSaved(true)
    } catch {
      setError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (saved) return <main className="travel-screen travel-confirmation" aria-live="polite"><span aria-hidden="true">◌</span><h1>Ton passage rejoint le voyage de Nao.</h1><button className="primary" onClick={onContinue}>Commencer la traversée</button></main>

  return <main className="travel-screen"><section className="travel-card"><p className="eyebrow">Le voyage de Nao</p><h1>Nao vient d’arriver chez toi.</h1><p>Cette petite noix voyage de main en main.<br/>Tu peux laisser une trace de ton passage avant de commencer.</p>
    <form onSubmit={submit}>
      <label htmlFor="nao-display-name">Comment veux-tu apparaître dans le voyage de Nao ?</label>
      <small>Prénom, nom ou pseudo — comme tu préfères.</small>
      <input id="nao-display-name" name="displayName" value={displayName} onChange={event => setDisplayName(event.target.value)} maxLength={60} required autoComplete="name"/>
      <label htmlFor="nao-location">Ville ou zone <small>(facultatif)</small></label>
      <input id="nao-location" name="locationLabel" value={locationLabel} onChange={event => setLocationLabel(event.target.value)} maxLength={100} placeholder="Nantes, Pays de Retz, près de Rennes…" autoComplete="address-level2"/>
      <small>Cette localisation approximative sera visible par les prochains passeurs.</small>
      {error && <div className="travel-error" aria-live="assertive"><p>Nao n’arrive pas à déposer ton passage pour le moment.</p></div>}
      <button className="primary" type="submit" disabled={submitting || !displayName.trim()}>{submitting ? 'Nao dépose ton passage…' : error ? 'Réessayer' : 'Ajouter mon passage'}</button>
      {error && <button className="quiet" type="button" onClick={onContinue}>Continuer sans laisser de trace</button>}
    </form>
  </section></main>
}
