import type { WordPetalState } from '../../types/floatingWords'

export function WordPetal({ petal, reducedMotion, onSelect }: { petal: WordPetalState; reducedMotion: boolean; onSelect: (id: WordPetalState['id']) => void }) {
  return <button className={`word-petal word-petal--${petal.id.length % 4}`} style={{ width: petal.width, minHeight: petal.height, transform: `translate3d(${petal.position.x}px, ${petal.position.y}px, 0) rotate(${petal.rotation}rad)` }} aria-label={`Choisir ${petal.label}`} onClick={event => { if (!reducedMotion) return; event.stopPropagation(); onSelect(petal.id) }}>{petal.label}</button>
}
