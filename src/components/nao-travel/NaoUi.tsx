import { useEffect, useId, useRef, useState, type ButtonHTMLAttributes, type PropsWithChildren } from 'react'

export function Brand() {
  const [creditsOpen, setCreditsOpen] = useState(false)
  const titleId = useId()
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!creditsOpen) return
    closeButton.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCreditsOpen(false)
    }
    addEventListener('keydown', closeOnEscape)
    return () => removeEventListener('keydown', closeOnEscape)
  }, [creditsOpen])

  return <>
    <button className="story__brand" type="button" aria-label="Ouvrir les crédits" aria-haspopup="dialog" onClick={() => setCreditsOpen(true)}>•°○</button>
    {creditsOpen && <div className="credits-backdrop" onPointerDown={() => setCreditsOpen(false)}>
      <section className="credits-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} onPointerDown={event => event.stopPropagation()}>
        <button ref={closeButton} className="credits-modal__close" type="button" aria-label="Fermer les crédits" onClick={() => setCreditsOpen(false)}>×</button>
        <span className="credits-modal__mark" aria-hidden="true">•°○</span>
        <p className="eyebrow">NAO SOUCI</p>
        <h2 id={titleId}>Crédits</h2>
        <p><cite>La petite noix sur l’Océan des soucis</cite><br/>Une expérience narrative originale.</p>
        <p className="credits-modal__author"><span>Auteur</span>Pierre-Henri Garnier</p>
        <a className="credits-modal__contact" href="https://www.linkedin.com/in/pierrehenrigarnier?utm_source=share_via&amp;utm_content=profile&amp;utm_medium=member_android" target="_blank" rel="noreferrer">Me contacter sur LinkedIn <span aria-hidden="true">↗</span></a>
        <p className="credits-modal__copyright">© 2026 NAO SOUCI<br/>Tous droits réservés.</p>
      </section>
    </div>}
  </>
}

export function NaoScreen({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <main className={`nao-screen ${className}`}><div className="nao-screen__inner"><div className="nao-screen__content">{children}</div></div></main>
}

export function NaoGrainTag({ selected = false, disabled = false, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return <button type="button" className={`nao-grain${selected ? ' is-selected' : ''}`} aria-pressed={selected} disabled={disabled} {...props}/>
}
