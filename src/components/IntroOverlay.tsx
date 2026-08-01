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
      <p className="eyebrow brand-title">
        NOA souci
      </p>

      <h1>
        De mon souci fleurissent...•°
      </h1>

      <p className="opening-poem">
        Coquille remplie de terre.
        <br />
        J’y dépose mon souci.
        <br />
        Le printemps répond.
      </p>

      <button
        type="button"
        className="primary-button"
        onClick={onEnter}
      >
        Entrer
      </button>
    </motion.section>
  )
}
