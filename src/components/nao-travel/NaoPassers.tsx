import { useEffect, useState } from 'react'
import { getNaoPassers } from '../../services/naoPassages'
import type { NaoPasser } from '../../types/naoPassages'
import { Brand, NaoScreen } from './NaoUi'

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

  const frequencies = new Map<string, { text: string; count: number }>()
  for (const passer of passers) for (const grain of passer.grains) {
    const key = grain.trim().replace(/\s+/g, ' ').toLocaleLowerCase('fr')
    const current = frequencies.get(key)
    frequencies.set(key, { text: current?.text ?? grain, count: (current?.count ?? 0) + 1 })
  }
  const collective = [...frequencies.values()].sort((a, b) => b.count - a.count || a.text.localeCompare(b.text, 'fr'))

  return <NaoScreen className="passers-screen"><Brand/><nav className="journey-switch journey-switch--book" aria-label="Navigation de Nao"><button onClick={onBack}>Le conte</button><span aria-current="page">Livre d’Or•°</span></nav><p className="eyebrow">NAO SOUCI</p><h1 className="nao-title">Livre d’Or•°</h1><p className="nao-subtitle">Ce que Nao a recueilli sur son passage.</p>
    {status === 'loading' && <p aria-live="polite">Le carnet s’ouvre doucement…</p>}
    {status === 'error' && <div aria-live="assertive"><p>Le Livre d’Or•° de Nao est momentanément inaccessible.</p><button className="primary" onClick={() => setAttempt(value => value + 1)}>Réessayer</button></div>}
    {status === 'ready' && <><section className="golden-grains"><h2>Les grains qui résonnent</h2>{collective.length ? <div className="collective-grains">{collective.map(grain => <span className="nao-grain" key={grain.text} style={{ '--frequency': Math.min(grain.count, 4) } as React.CSSProperties}>{grain.text}</span>)}</div> : <p>Le premier grain attend encore d’être déposé.</p>}</section><section className="golden-passers"><h2>Les passeurs de Nao</h2><strong className="passers-count">{passers.length} {passers.length === 1 ? 'passeur' : 'passeurs'}</strong><ol className="passers-list">{passers.map(passer => <li key={passer.id}><span className="passer-dot" aria-hidden="true"/><strong>{passer.displayName}{passer.locationLabel && <> · {passer.locationLabel}</>}</strong>{passer.grains.length > 0 && <span className="passer-grains">{passer.grains.join(' · ')}</span>}<time dateTime={passer.createdAt}>{dateFormatter.format(new Date(passer.createdAt))}</time></li>)}</ol></section></>}
  </NaoScreen>
}
