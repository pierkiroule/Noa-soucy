import {
  AnimatePresence,
  motion,
} from 'framer-motion'
import type { TransformationStage } from '../types'

interface TransformationOverlayProps {
  stage: TransformationStage
}

const labels: Record<
  Exclude<TransformationStage, 'idle'>,
  string
> = {
  scrountch: 'SCROUNTCH !',
  bloup: 'BLOUP… BLOUP…',
  pchiiit: 'PCHIIIIT !',
}

export function TransformationOverlay({
  stage,
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
          <motion.div
            className="transformation-bubble"
            initial={{ scale: 0.3 }}
            animate={{
              scale:
                stage === 'scrountch'
                  ? [0.4, 1.1, 0.65]
                  : stage === 'bloup'
                    ? [0.75, 1.05, 0.9, 1.1]
                    : [0.7, 1.7],
            }}
            transition={{ duration: 1 }}
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
            {labels[stage]}
          </motion.p>
          <span className="transformation-caption">Ton ressenti change doucement de forme</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
