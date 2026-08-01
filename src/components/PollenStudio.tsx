import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

export interface PollenSuggestion {
  id: string
  text: string
}

interface PollenStudioProps {
  suggestions: PollenSuggestion[]
  onKeep: (text: string) => void
  onCycle: (text: string) => void
  onBack: () => void
}

type StudioStage = 'flower' | 'pollen' | 'compose'

export function PollenStudio({ suggestions, onKeep, onCycle, onBack }: PollenStudioProps) {
  const [stage, setStage] = useState<StudioStage>('flower')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [grains, setGrains] = useState<PollenSuggestion[]>([])
  const [shareStatus, setShareStatus] = useState('')

  const creation = useMemo(() => grains.map((grain) => grain.text.trim()).filter(Boolean).join('\n\n'), [grains])

  function toggleSuggestion(id: string) {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  function beginComposition() {
    setGrains(suggestions.filter((suggestion) => selectedIds.includes(suggestion.id)))
    setStage('compose')
  }

  function moveGrain(index: number, direction: -1 | 1) {
    setGrains((current) => {
      const target = index + direction
      if (target < 0 || target >= current.length) return current
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  async function shareCreation() {
    if (!creation) return
    if (navigator.share) {
      await navigator.share({ title: 'NOA souci', text: creation })
      setShareStatus('Création offerte•°')
      return
    }
    await navigator.clipboard.writeText(creation)
    setShareStatus('Création copiée•°')
  }

  if (stage === 'flower') {
    return (
      <motion.section className="pollen-studio flower-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p className="studio-kicker">Une fleur de souci émerge.</p>
        <button type="button" className="marigold-flower" onClick={() => setStage('pollen')} aria-label="Libérer les grains de pollen">
          {Array.from({ length: 12 }, (_, index) => <i key={index} />)}
          <span />
        </button>
        <p className="flower-instruction">Tape sur la fleur pour libérer les grains de pollen•°</p>
        <button type="button" className="text-button" onClick={onBack}>Revenir aux résonances</button>
      </motion.section>
    )
  }

  if (stage === 'pollen') {
    return (
      <motion.section className="pollen-studio pollen-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <header className="studio-header">
          <p className="eyebrow">Pollen•° vivant</p>
          <h1>Douze images ont émergé.</h1>
          <p>Choisis les grains que tu souhaites garder dans ton rézo•° de pollen.</p>
        </header>

        <div className="living-bubbles" aria-hidden="true">
          {suggestions.map((suggestion, index) => (
            <motion.i
              key={suggestion.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 80 }}
              animate={{ opacity: [.2, .7, .35], scale: 1, x: Math.cos(index) * (70 + index * 5), y: Math.sin(index * 1.7) * 90 }}
              transition={{ duration: 2.4, delay: index * .07, ease: 'easeOut' }}
            />
          ))}
        </div>

        <div className="pollen-list">
          {suggestions.map((suggestion, index) => (
            <label className={selectedIds.includes(suggestion.id) ? 'is-selected' : ''} key={suggestion.id}>
              <input type="checkbox" checked={selectedIds.includes(suggestion.id)} onChange={() => toggleSuggestion(suggestion.id)} />
              <span className="grain-number">{String(index + 1).padStart(2, '0')}</span>
              <span>{suggestion.text}</span>
            </label>
          ))}
        </div>

        {selectedIds.length > 0 && (
          <div className="studio-action"><button type="button" className="primary-button" onClick={beginComposition}>Composer avec {selectedIds.length} grain{selectedIds.length > 1 ? 's' : ''}</button></div>
        )}
      </motion.section>
    )
  }

  return (
    <motion.section className="pollen-studio compose-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="studio-header">
        <p className="eyebrow">Compo•°</p>
        <h1>Assemble ton texte.</h1>
        <p>Déplace, transforme ou retire chaque grain de pollen.</p>
      </header>

      <div className="composition-board">
        {grains.map((grain, index) => (
          <article key={grain.id}>
            <textarea
              value={grain.text}
              aria-label={`Grain ${index + 1}`}
              onChange={(event) => setGrains((current) => current.map((item) => item.id === grain.id ? { ...item, text: event.target.value } : item))}
            />
            <div>
              <button type="button" onClick={() => moveGrain(index, -1)} disabled={index === 0} aria-label="Monter">↑</button>
              <button type="button" onClick={() => moveGrain(index, 1)} disabled={index === grains.length - 1} aria-label="Descendre">↓</button>
              <button type="button" onClick={() => setGrains((current) => current.filter((item) => item.id !== grain.id))}>Supprimer</button>
            </div>
          </article>
        ))}
      </div>

      <div className="composition-actions">
        <button type="button" className="primary-button" disabled={!creation} onClick={() => onKeep(creation)}>Conserver dans mon jardin</button>
        <button type="button" className="secondary-button" disabled={!creation} onClick={() => onCycle(creation)}>Faire naître une nouvelle fleur</button>
        <button type="button" className="text-button" disabled={!creation} onClick={() => void shareCreation()}>Offrir ou partager</button>
      </div>
      {shareStatus && <p className="share-status">{shareStatus}</p>}
    </motion.section>
  )
}
