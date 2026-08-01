import { motion } from 'framer-motion'

interface PoemBubbleProps {
  poem: string
  tags: string[]
  onKeep: () => void
  onLeave: () => void
  onNew: () => void
}

export function PoemBubble({
  poem,
  tags,
  onKeep,
  onLeave,
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
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
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
          <p>Prenez le temps de laisser cette création résonner.</p>
          <p>Souhaitez-vous la conserver dans votre jardin&nbsp;?</p>
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
            onClick={onLeave}
          >
            Laisser partir
          </button>

          <button
            type="button"
            className="text-button"
            onClick={onNew}
          >
            Nouvelle création
          </button>
        </div>
      </motion.div>
    </motion.section>
  )
}
