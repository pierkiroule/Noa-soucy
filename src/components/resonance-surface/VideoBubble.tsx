import { resonanceBubbles } from '../../data/resonanceBubbles'
import type { BubbleState } from '../../types/resonanceSurface'

export function VideoBubble({ bubble, reducedMotion, onSelect }: { bubble: BubbleState; reducedMotion: boolean; onSelect?: (id: BubbleState['id']) => void }) {
  const definition = resonanceBubbles.find(item => item.id === bubble.id)!
  return <button
    className="resonance-bubble"
    data-bubble-id={bubble.id}
    style={{ width: bubble.radius * 2, height: bubble.radius * 2, transform: `translate3d(${bubble.position.x}px, ${bubble.position.y}px, 0) rotate(${bubble.rotation}rad)` }}
    aria-label={`Image de ${definition.label.toLowerCase().replace(/^l[ae] |^les /, '')}`}
    onClick={event => { if (!reducedMotion) return; event.stopPropagation(); onSelect?.(bubble.id) }}
  >
    <span className="sr-only">{definition.label}</span>
  </button>
}
