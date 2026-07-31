import { motion } from 'framer-motion'

interface IntroOverlayProps {
  onEnter: () => void
}

export function IntroOverlay({
  onEnter,
}: IntroOverlayProps) {
  return (
    <motion.section
      className="intro-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="noa-mark">
        🌰
      </div>

      <p className="eyebrow">
        NOA SOUCI
      </p>

      <h1>
        La petite noix qui transforme
        <br />
        nos soucis en poésie.
      </h1>

      <p className="intro-copy">
        Entre en contact avec ton souci.
        <br />
        Pas besoin de l’écrire.
      </p>

      <button
        type="button"
        className="primary-button"
        onClick={onEnter}
      >
        Confier ses traces
      </button>
    </motion.section>
  )
}
