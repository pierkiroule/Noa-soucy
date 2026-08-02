import { useEffect, useRef, useState } from 'react'
import { RESTING_AUDIO_VALUES, ResonanceAudioAnalyzer, type AudioReactiveValues } from '../engine/ResonanceAudioAnalyzer'
import { ResonanceStage } from '../three/ResonanceStage'
import type { ResonanceModule } from '../types/story'

export function ResonancePlayer({ resonance, onComplete }: { resonance: ResonanceModule; onComplete: () => void }) {
  const audioRef = useRef<HTMLAudioElement>(null), analyzerRef = useRef<ResonanceAudioAnalyzer | null>(null)
  const [playing, setPlaying] = useState(false), [voiceAvailable, setVoiceAvailable] = useState(Boolean(resonance.media?.voice)), [values, setValues] = useState<AudioReactiveValues>(RESTING_AUDIO_VALUES)
  useEffect(() => { let frame = 0; const analyzer = new ResonanceAudioAnalyzer(); analyzerRef.current = analyzer; if (audioRef.current && resonance.media?.voice && voiceAvailable) analyzer.connect(audioRef.current); const update = () => { const breath = (Math.sin(Date.now() / 1300) + 1) * .04; setValues(voiceAvailable ? analyzer.read() : { ...RESTING_AUDIO_VALUES, level: .1 + breath }); frame = requestAnimationFrame(update) }; update(); return () => { cancelAnimationFrame(frame); analyzer.close() } }, [resonance, voiceAvailable])
  const toggle = async () => { const audio = audioRef.current; if (!audio || !voiceAvailable) { setPlaying((value) => !value); return } if (audio.paused) { await analyzerRef.current?.resume(); await audio.play().catch(() => setVoiceAvailable(false)); setPlaying(true) } else { audio.pause(); setPlaying(false) } }
  return <section className="screen resonance-screen"><p className="eyebrow">La voix intérieure déplie une résonance</p><h2>{resonance.title}</h2><ResonanceStage config={resonance.three} values={values} />{resonance.media?.voice && <audio ref={audioRef} src={`/story/${resonance.media.voice}`} preload="metadata" onEnded={onComplete} onError={() => { console.warn(`Voix indisponible : ${resonance.media?.voice}`); setVoiceAvailable(false) }} />}<div className="story-text resonance-text">{resonance.text}</div><div className="controls"><button className="button secondary" onClick={toggle}>{playing ? 'Pause' : 'Écouter la résonance'}</button><button className="button" onClick={onComplete}>Reprendre la traversée</button></div></section>
}
