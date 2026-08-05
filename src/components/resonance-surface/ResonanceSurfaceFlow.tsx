import { useState } from 'react'
import { ResonanceSurface } from './ResonanceSurface'
import { ResonanceSurfaceIntro } from './ResonanceSurfaceIntro'
export function ResonanceSurfaceFlow(props: { muted: boolean; onToggleMuted: () => void; onExit: () => void; onRestartStory: () => void }) { const [entered, setEntered] = useState(false); return entered ? <ResonanceSurface {...props}/> : <ResonanceSurfaceIntro onEnter={() => setEntered(true)} onExit={props.onExit}/> }
