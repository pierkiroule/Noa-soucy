import type { RippleState } from '../../types/resonanceSurface'
export function RippleLayer({ ripples }: { ripples: RippleState[] }) { return <div className="ripple-layer" aria-hidden="true">{ripples.map(ripple => <span key={ripple.id} className="ripple" style={{ left: ripple.origin.x, top: ripple.origin.y }} />)}</div> }
