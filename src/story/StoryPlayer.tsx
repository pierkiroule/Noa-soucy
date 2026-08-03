import { useCallback, useEffect, useMemo, useState } from 'react'
import { StoryMediaPlayer } from '../components/StoryMediaPlayer'
import { loopAudioPlayer } from '../engine/LoopAudioPlayer'
import { getNextMedia, loadStory, preloadNextStoryMedia, storyMediaUrl, type StoryChoice, type StoryDocument, type StoryMediaBlock } from './storyData'

const STORAGE_KEY = 'nao-souci:audiovisual-progress:v4'
interface SavedState { version:number; currentBlockIndex:number; currentBreathIndex:number; isMuted:boolean; selectedChoices:Record<string,string>; activeResonanceId?:string; completed:boolean }

const initialSaved: SavedState = { version: 4, currentBlockIndex: 0, currentBreathIndex: 0, isMuted: false, selectedChoices: {}, completed: false }
function readSaved(): SavedState {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as SavedState | null
    return saved?.version === 4 ? { ...initialSaved, ...saved } : initialSaved
  } catch { return initialSaved }
}

export function StoryPlayer() {
  const [story, setStory] = useState<StoryDocument>()
  const [loadError, setLoadError] = useState(false)
  const [started, setStarted] = useState(false)
  const [scoreMode, setScoreMode] = useState(false)
  const [state, setState] = useState<SavedState>(readSaved)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => { void loadStory().then(setStory).catch(error => { console.error(error); setLoadError(true) }) }, [])
  useEffect(() => { if (story) localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: story.version })) }, [state, story])

  const block = story?.blocks[state.currentBlockIndex]
  const activeResonance = useMemo(() => {
    if (block?.type !== 'question' || !state.activeResonanceId) return undefined
    return block.choices.find(choice => choice.resonance.id === state.activeResonanceId)?.resonance
  }, [block, state.activeResonanceId])
  useEffect(() => story ? preloadNextStoryMedia(getNextMedia(story.blocks, state.currentBlockIndex)) : undefined, [story, state.currentBlockIndex])

  const setBreath = useCallback((currentBreathIndex: number) => setState(current => ({ ...current, currentBreathIndex })), [])
  const completeMedia = () => {
    if (!story || !block) return
    if (activeResonance) setState(current => ({ ...current, activeResonanceId: undefined, currentBlockIndex: current.currentBlockIndex + 1, currentBreathIndex: 0 }))
    else if (block.type === 'epilogue') setState(current => ({ ...current, completed: true }))
    else setState(current => ({ ...current, currentBlockIndex: current.currentBlockIndex + 1, currentBreathIndex: 0 }))
    setIsPlaying(true)
  }
  const selectChoice = (choice: StoryChoice) => {
    if (block?.type !== 'question') return
    setState(current => ({ ...current, selectedChoices: { ...current.selectedChoices, [block.id]: choice.id }, activeResonanceId: choice.resonance.id, currentBreathIndex: 0 }))
    setIsPlaying(true)
  }
  const toggleMuted = () => {
    setState(current => { const isMuted = !current.isMuted; loopAudioPlayer.setMuted(isMuted); return { ...current, isMuted } })
  }
  const start = () => { void loopAudioPlayer.unlock(); setStarted(true) }
  const restart = () => { setState(initialSaved); setStarted(false); setIsPlaying(true); void loopAudioPlayer.stop() }

  if (loadError) return <main className="loading"><h1>NAO SOUCI</h1><p>Le conte n’a pas pu être chargé.</p><button onClick={() => location.reload()}>Réessayer</button></main>
  if (!story) return <main className="loading" aria-live="polite">La mer retrouve son souffle…</main>
  if (scoreMode) return <ScoreReader story={story} onClose={() => setScoreMode(false)} />
  if (!started) return <main className="story intro-screen"><Brand/><section className="intro"><span className="eyebrow">Un conte audiovisuel</span><h1>{story.title}</h1><p>{story.subtitle}</p><button className="primary" onClick={start}>{state.currentBlockIndex ? 'Reprendre la traversée' : 'Commencer le conte'} <span aria-hidden="true">→</span></button><button className="quiet intro__score" onClick={() => setScoreMode(true)}>Lecture de la partition</button><small>Vidéo, musique et texte · Son réglable à tout moment</small></section></main>
  if (state.completed) return <main className="story completion"><Brand/><span className="eyebrow">NAO SOUCI</span><h1>La traversée continue.</h1><button className="primary" onClick={restart}>Recommencer</button></main>

  const mediaBlock: StoryMediaBlock | undefined = activeResonance ?? (block?.type !== 'question' ? block : undefined)
  return <main className="story">
    <Brand />
    <button className="sound-toggle" aria-pressed={state.isMuted} onClick={toggleMuted}>{state.isMuted ? 'Son coupé' : 'Son activé'}</button>
    <div className="journey-progress" role="progressbar" aria-label="Progression" aria-valuenow={state.currentBlockIndex + 1} aria-valuemin={1} aria-valuemax={story.blocks.length}><i style={{ width: `${((state.currentBlockIndex + 1) / story.blocks.length) * 100}%` }}/></div>
    {mediaBlock && <StoryMediaPlayer key={mediaBlock.id} title={mediaBlock.title} text={mediaBlock.text} videoSrc={storyMediaUrl(mediaBlock.media.video)} audioSrc={storyMediaUrl(mediaBlock.media.music)} variant={mediaBlock.type} breathIndex={state.currentBreathIndex} isPlaying={isPlaying} isMuted={state.isMuted} onBreathChange={setBreath} onPlayingChange={setIsPlaying} onComplete={completeMedia}/>}
    {block?.type === 'question' && !activeResonance && <QuestionScreen title={block.title} text={block.text} choices={block.choices} selected={state.selectedChoices[block.id]} onSelect={selectChoice}/>}
  </main>
}

function QuestionScreen({ title, text, choices, selected, onSelect }: { title:string; text:string; choices:StoryChoice[]; selected?:string; onSelect:(choice:StoryChoice)=>void }) {
  useEffect(() => { void loopAudioPlayer.stop() }, [])
  return <section className="question-screen"><span className="eyebrow">{title}</span><h1>{text}</h1><div className="question-screen__choices">{choices.map(choice => <button key={choice.id} className={selected === choice.id ? 'is-selected' : ''} onClick={() => onSelect(choice)}>{choice.label}<span aria-hidden="true">→</span></button>)}</div><small>Votre choix ouvre une résonance, sans interprétation.</small></section>
}

function ScoreReader({ story, onClose }: { story:StoryDocument; onClose:()=>void }) {
  const entries = story.blocks.flatMap(block => block.type === 'question' ? [block, ...block.choices.map(choice => choice.resonance)] : [block])
  return <main className="score"><header><div><span className="eyebrow">Mode de vérification</span><h1>Lecture de la partition</h1></div><button className="quiet" onClick={onClose}>Fermer</button></header>{entries.map(entry => entry.type === 'question' ? <article key={entry.id} className="score__question"><span>{entry.title}</span><h2>{entry.text}</h2><p>{entry.choices.map(choice => choice.label).join(' · ')}</p></article> : <article key={entry.id}><span>{entry.title}</span><p>{entry.text}</p><code>{entry.media.video} · {entry.media.music}</code></article>)}</main>
}

function Brand() { return <div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div> }
