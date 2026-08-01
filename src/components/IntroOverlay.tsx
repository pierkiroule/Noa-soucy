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
      <div className="intro-orb intro-orb-one" />
      <div className="intro-orb intro-orb-two" />
      <div className="intro-content">
        <div className="noa-mark" aria-hidden="true"><span>N</span></div>
        <p className="eyebrow">Expérience poétique · NOA SOUCI</p>
        <h1>Et si ton souci<br />devenait <em>poésie&nbsp;?</em></h1>
        <p className="intro-copy">
          Une parenthèse sensible pour déposer ce qui te traverse,<br />
          sans avoir besoin de le raconter.
        </p>
        <button type="button" className="primary-button" onClick={onEnter}>
          Commencer l’expérience <span aria-hidden="true">→</span>
        </button>
        <p className="intro-note">Quelques instants · Anonyme · Rien n’est envoyé</p>
      </div>
    </motion.section>
  )
}
