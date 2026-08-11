import { useEffect, useState } from 'react'
import { getNaoPassers } from '../../services/naoPassages'
import type { NaoPasser } from '../../types/naoPassages'

const dateFormatter = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export function NaoPassers({ nutId, onBack }: { nutId: string; onBack: () => void }) {
  const [passers, setPassers] = useState<NaoPasser[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    let active = true
    setStatus('loading')
    void getNaoPassers(nutId).then(result => { if (active) { setPassers(result.passers); setStatus('ready') } }).catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [nutId, attempt])

  return <main className="travel-screen"><section className="travel-card passers-card"><button className="travel-back" onClick={onBack}>← Revenir à Nao</button><p className="eyebrow">Carnet de voyage</p><h1>Les passeurs de Nao</h1><p>Nao voyage de main en main.</p>
    {status === 'loading' && <p aria-live="polite">Le carnet s’ouvre doucement…</p>}
    {status === 'error' && <div aria-live="assertive"><p>Le carnet de voyage de Nao est momentanément inaccessible.</p><button className="primary" onClick={() => setAttempt(value => value + 1)}>Réessayer</button></div>}
    {status === 'ready' && <><strong className="passers-count">{passers.length} {passers.length === 1 ? 'passeur' : 'passeurs'}</strong><ol className="passers-list">{passers.map(passer => <li key={passer.id}><strong>{passer.displayName}</strong>{passer.locationLabel && <span>{passer.locationLabel}</span>}<time dateTime={passer.createdAt}>{dateFormatter.format(new Date(passer.createdAt))}</time></li>)}</ol></>}
  </section></main>
}
