import { motion } from 'framer-motion'

interface PoemBubbleProps {
  poem: string
  tags: string[]
  onClose: () => void
}

export function PoemBubble({
  poem,
  tags,
  onClose,
}: PoemBubbleProps) {
  return (
    <motion.section
      className="poem-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="poem-bubble"
        initial={{
          scale: 0.6,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 15,
        }}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Fermer">×</button>
        <span className="poem-spark" aria-hidden="true">✦</span>
        <p className="eyebrow">
          Ta poésie a émergé
        </p>

        <div className="poem-tags">
          {tags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <p className="poem-text">
          {poem}
        </p>

        <button
          type="button"
          className="secondary-button"
          onClick={onClose}
        >
          Laisser flotter <span aria-hidden="true">→</span>
        </button>
      </motion.div>
    </motion.section>
  )
}
