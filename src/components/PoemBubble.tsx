import { motion } from 'framer-motion'

interface PoemBubbleProps {
  poem: string
  tags: string[]
  onKeep: () => void
  onNew: () => void
}

export function PoemBubble({
  poem,
  tags,
  onKeep,
  onNew,
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
        <p className="eyebrow">
          Création
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

        <div className="creation-message">
          <p>Merci.</p>
          <p>Prenez le temps de laisser cette création résonner.</p>
        </div>

        <div className="creation-actions">
          <button
            type="button"
            className="primary-button"
            onClick={onKeep}
          >
            Conserver dans mon jardin
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={onNew}
          >
            Nouvelle création
          </button>
        </div>
      </motion.div>
    </motion.section>
  )
}
