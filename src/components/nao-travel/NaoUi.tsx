import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'

export function Brand() {
  return <div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div>
}

export function NaoScreen({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <main className={`nao-screen ${className}`}><div className="nao-screen__inner"><div className="nao-screen__content">{children}</div></div></main>
}

export function NaoGrainTag({ selected = false, disabled = false, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { selected?: boolean }) {
  return <button type="button" className={`nao-grain${selected ? ' is-selected' : ''}`} aria-pressed={selected} disabled={disabled} {...props}/>
}
