import type { RippleState } from '../../types/floatingWords'
export function RippleEffect({ ripples }: { ripples: RippleState[] }) { return <div className="floating-ripples" aria-hidden="true">{ripples.map(ripple => <span key={ripple.id} style={{ left: ripple.origin.x, top: ripple.origin.y }} />)}</div> }
