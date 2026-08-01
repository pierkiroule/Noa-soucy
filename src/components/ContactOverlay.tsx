import { motion } from 'framer-motion'

interface ContactOverlayProps {
  onContinue: () => void
}

export function ContactOverlay({ onContinue }: ContactOverlayProps) {
  return (
    <motion.section
      className="contact-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="contact-content">
        <div className="shell-mark" aria-hidden="true" />
        <h1>Prenez un instant pour entrer en contact avec votre souci.</h1>
        <p>
          Il n’est pas nécessaire de le raconter.
          <br />
          Laissez-le simplement être présent.
        </p>
        <button type="button" className="primary-button" onClick={onContinue}>
          Continuer
        </button>
      </div>
    </motion.section>
  )
}
