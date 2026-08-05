import { useState } from 'react'
import { FloatingWordsIntro } from './FloatingWordsIntro'
import { FloatingWordsSurface } from './FloatingWordsSurface'
export function FloatingWordsFlow({ onExit, onRestartStory }: { onExit: () => void; onRestartStory: () => void }) { const [entered, setEntered] = useState(false); return entered ? <FloatingWordsSurface onExit={onExit} onRestartStory={onRestartStory}/> : <FloatingWordsIntro onEnter={() => setEntered(true)} onExit={onExit}/> }
