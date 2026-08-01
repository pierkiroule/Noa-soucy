import { motion } from 'framer-motion'

interface CreationBubbleProps {
  content: string
  tags: string[]
  kept: boolean
  onKeep: () => void
  onNew: () => void
}

export function CreationBubble({
  content,
  tags,
  kept,
  onKeep,
  onNew,
}: CreationBubbleProps) {
  return (
    <motion.section
      className="creation-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="creation-bubble"
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

        <div className="creation-tags">
          {tags.map((tag) => (
            <span key={tag}>
              {tag}
            </span>
          ))}
        </div>

        <p className="creation-text">
          {content}
        </p>

        <div className="creation-afterword">
          <strong>Merci.</strong>
          <span>Prenez le temps de laisser cette création résonner.</span>
        </div>

        <div className="creation-actions">
          <button
            type="button"
            className="primary-button"
            onClick={onKeep}
            disabled={kept}
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
