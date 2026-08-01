import { AnimatePresence, motion } from 'framer-motion'
import type { PoemEntry } from '../types'

interface GardenProps {
  creations: PoemEntry[]
  selected: PoemEntry | null
  onSelect: (creation: PoemEntry | null) => void
  onClose: () => void
}

export function Garden({ creations, selected, onSelect, onClose }: GardenProps) {
  return (
    <motion.section className="garden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <header className="garden-header">
        <div>
          <p className="eyebrow">NOA SOUCI</p>
          <h1>Mon jardin</h1>
          <p>Ici demeurent les créations qui ont fleuri.</p>
        </div>
        <button type="button" className="close-button" onClick={onClose} aria-label="Fermer le jardin">×</button>
      </header>

      <div className="garden-bed">
        {creations.length === 0 && <div className="empty-garden" aria-hidden="true"><span /></div>}
        {creations.map((creation, index) => (
          <button
            type="button"
            className={`garden-flower flower-${index % 4}`}
            key={creation.id}
            onClick={() => onSelect(creation)}
            aria-label={`Création du ${new Date(creation.createdAt).toLocaleDateString('fr-FR')}`}
            style={{ '--seed': creation.visualSeed } as React.CSSProperties}
          >
            <span className="stem" />
            <span className="petals"><i /><i /><i /><i /><i /></span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.article className="garden-creation" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <button type="button" className="close-button" onClick={() => onSelect(null)} aria-label="Fermer la création">×</button>
            <p className="eyebrow">Création</p>
            <p className="garden-date">{new Date(selected.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="poem-text">{selected.poem}</p>
            <div className="poem-tags">{selected.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </motion.article>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
