import { useEffect, useRef, useState } from 'react'
import { ActAudioEngine } from '../engine/ActAudioEngine'
import type { ActModule } from '../types/story'
import { StoryControls } from './StoryControls'

const mediaUrl = (file?: string | null) => file ? `/story/${file}` : undefined
export function CinematicActPlayer({ act, onComplete, onPrevious }: { act: ActModule; onComplete: () => void; onPrevious?: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null), audioRef = useRef<ActAudioEngine | null>(null)
  const [started, setStarted] = useState(false), [paused, setPaused] = useState(false), [videoAvailable, setVideoAvailable] = useState(Boolean(act.media?.video))
  useEffect(() => { const engine = new ActAudioEngine(); audioRef.current = engine; if (act.media) engine.load(act.media, onComplete); return () => engine.stop() }, [act, onComplete])
  const play = async () => { setStarted(true); setPaused(false); await videoRef.current?.play().catch(() => setVideoAvailable(false)); await audioRef.current?.play() }
  const pause = () => { videoRef.current?.pause(); audioRef.current?.pause(); setPaused(true) }
  const restart = () => { if (videoRef.current) videoRef.current.currentTime = 0; audioRef.current?.restart(); void videoRef.current?.play(); setStarted(true); setPaused(false) }
  return <article className="screen cinematic"><p className="eyebrow">Le vieux marin raconte</p><h2>{act.title}</h2>{videoAvailable && <video ref={videoRef} className="act-video" src={mediaUrl(act.media?.video)} poster={mediaUrl(act.media?.poster)} playsInline preload="metadata" muted onError={() => { console.warn(`Vidéo indisponible : ${act.media?.video}`); setVideoAvailable(false) }} />}{(!videoAvailable || !started) && <div className="story-text">{act.text}</div>}<div className="media-controls">{!started || paused ? <button className="button" onClick={play}>{paused ? 'Reprendre' : 'Écouter et regarder'}</button> : <button className="button secondary" onClick={pause}>Pause</button>}<button className="text-button" onClick={restart}>Recommencer l’acte</button></div><StoryControls onNext={onComplete} onPrevious={onPrevious} /></article>
}
