import { StoryControls } from './StoryControls'
export function ActReader({ title, text, onNext, onPrevious }: { title: string; text: string; onNext: () => void; onPrevious?: () => void }) { return <article className="screen"><p className="eyebrow">La traversée</p><h2>{title}</h2><div className="story-text">{text}</div><StoryControls onNext={onNext} onPrevious={onPrevious} /></article> }
