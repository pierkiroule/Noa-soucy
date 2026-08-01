import {
  AnimatePresence,
  motion,
} from 'framer-motion'
import type { TransformationStage } from '../types'

interface TransformationOverlayProps {
  stage: TransformationStage
  tags: string[]
}

export function TransformationOverlay({
  stage,
  tags,
}: TransformationOverlayProps) {
  return (
    <AnimatePresence>
      {stage !== 'idle' && (
        <motion.div
          className={`transformation-overlay stage-${stage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bloom-resonances">
            {tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ x: (index - 1) * 80, opacity: 0.5 }}
                animate={{ x: 0, opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
              >
                {tag.split(' ')[0]}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="bloom-form"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />

          <motion.p
            key={stage}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            De votre souci fleurit•°.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
