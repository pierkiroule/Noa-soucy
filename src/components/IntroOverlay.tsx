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
      <p className="eyebrow">
        NOA SOUCI
      </p>

      <h1>
        De nos soucis fleurissent•°.
      </h1>

      <p className="intro-copy">
        Prenez un instant pour entrer en contact avec votre souci.
        <br />
        Il n&apos;est pas nécessaire de le raconter.
        <br />
        Laissez-le simplement être présent.
      </p>

      <button
        type="button"
        className="primary-button"
        onClick={onEnter}
      >
        Commencer
      </button>
    </motion.section>
  )
}
