import type { WordPetalState } from '../../types/floatingWords'

export function WordPetal({ petal }: { petal: WordPetalState }) {
  return <span className={`word-petal word-petal--${petal.id.length % 4}`} style={{ width: petal.width, height: petal.height, transform: `translate3d(${petal.position.x}px, ${petal.position.y}px, 0) rotate(${petal.rotation}rad)` }} aria-hidden="true" />
}
