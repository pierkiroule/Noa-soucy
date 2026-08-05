import type { FlyingBubbleState } from '../../types/flyingBubbles'

export function FlyingBubble({ bubble }: { bubble: FlyingBubbleState }) {
  return <span className="flying-bubble" style={{ width: bubble.radius * 2, height: bubble.radius * 2, opacity: bubble.opacity, transform: `translate3d(${bubble.position.x}px, ${bubble.position.y}px, 0) rotate(${bubble.rotation}rad)` }} aria-hidden="true" />
}
