import { useState } from 'react'
import { FlyingBubblesIntro } from './FlyingBubblesIntro'
import { FlyingBubblesSurface } from './FlyingBubblesSurface'
export function FlyingBubblesFlow({ onExit, onRestartStory }: { onExit: () => void; onRestartStory: () => void }) { const [entered, setEntered] = useState(false); return entered ? <FlyingBubblesSurface onExit={onExit} onRestartStory={onRestartStory}/> : <FlyingBubblesIntro onEnter={() => setEntered(true)} onExit={onExit}/> }
