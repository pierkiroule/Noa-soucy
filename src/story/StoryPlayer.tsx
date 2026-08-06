import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StoryMediaPlayer } from '../components/StoryMediaPlayer'
import { MetaphoricalResonanceFlow } from '../components/metaphorical-resonances/MetaphoricalResonanceFlow'
import { ParticleOverlay } from '../effects/ParticleOverlay'
import { loopAudioPlayer } from '../engine/LoopAudioPlayer'
import { getNextMedia, loadStory, preloadNextStoryMedia, storyMediaUrl, type StoryChoice, type StoryDocument, type StoryMediaBlock } from './storyData'

const STORAGE_KEY = 'nao-souci:audiovisual-progress:v4'
const BACKGROUND_MUSIC = storyMediaUrl('Fond2.mp3')
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
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [state, setState] = useState<SavedState>(readSaved)
  const [isPlaying, setIsPlaying] = useState(true)
  const completedOnLoad = useRef(state.completed)

  useEffect(() => { void loadStory().then(setStory).catch(error => { console.error(error); setLoadError(true) }) }, [])
  useEffect(() => { if (story) localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, version: story.version })) }, [state, story])
  useEffect(() => { loopAudioPlayer.setMuted(state.isMuted) }, [state.isMuted])
  useEffect(() => {
    if (!story || completedOnLoad.current) return
    void loopAudioPlayer.load(BACKGROUND_MUSIC)
    return () => { void loopAudioPlayer.stop() }
  }, [story])
  useEffect(() => {
    if (state.completed) void loopAudioPlayer.stop(1600)
  }, [state.completed])

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
    else if (block.type === 'epilogue') setState(current => story.blocks[current.currentBlockIndex + 1]?.type === 'metaphorical-resonances' ? ({ ...current, currentBlockIndex: current.currentBlockIndex + 1, currentBreathIndex: 0 }) : ({ ...current, completed: true }))
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
  const start = () => { void loopAudioPlayer.unlock().then(() => loopAudioPlayer.resume()); setStarted(true) }
  const restart = () => { setState(initialSaved); setStarted(false); setIsPlaying(true); void loopAudioPlayer.load(BACKGROUND_MUSIC) }
  const goToPart = (index: number) => {
    if (!story || index < 0 || index >= story.blocks.length) return
    setState(current => ({ ...current, currentBlockIndex: index, currentBreathIndex: 0, activeResonanceId: undefined, completed: false }))
    setIsPlaying(true)
    setNavigationOpen(false)
  }
  const restartStory = () => {
    setState(initialSaved)
    setIsPlaying(true)
    setNavigationOpen(false)
  }

  if (loadError) return <main className="loading"><h1>NAO SOUCI</h1><p>Le conte n’a pas pu être chargé.</p><button onClick={() => location.reload()}>Réessayer</button></main>
  if (!story) return <main className="loading" aria-live="polite">La mer retrouve son souffle…</main>
  if (!started) return <main className="story intro-screen"><WelcomePetals/><Brand/><section className="intro"><div className="intro__halo" aria-hidden="true"/><div className="intro__content"><span className="eyebrow">Un conte audiovisuel</span><h1>NAO<span aria-hidden="true">•°</span> Souci</h1><p>La petite noix sur l’Océan des soucis.</p><div className="intro__flourish" aria-hidden="true"><i/><span>✦</span><i/></div><button className="primary" onClick={start}>{state.currentBlockIndex ? 'Reprendre la traversée' : 'Commencer le conte'} <span aria-hidden="true">→</span></button><small>Vidéo, musique et texte · Son réglable à tout moment</small></div></section></main>
  if (state.completed) return <main className="story completion"><Brand/><span className="eyebrow">Fin de traversée</span><h1>Votre traversée s’arrête ici pour aujourd’hui.</h1><p>Les mots peuvent continuer de flotter.<br/>Sans réponse attendue.<br/>Sans chemin imposé.</p><div className="completion__actions"><button className="quiet" onClick={() => { setState(current => ({ ...current, completed: false, currentBlockIndex: story.blocks.findIndex(part => part.type === 'metaphorical-resonances') })); setStarted(true) }}>Boussole métaphorique</button><button className="primary" onClick={restart}>Recommencer le conte</button><button className="quiet" onClick={() => setStarted(false)}>Revenir à l’accueil</button></div></main>

  if (block?.type === 'metaphorical-resonances') return <MetaphoricalResonanceFlow onFinish={() => setState(current => ({ ...current, completed: true }))} onRestartStory={restartStory} />

  const mediaBlock: StoryMediaBlock | undefined = activeResonance ?? (block && block.type !== 'question' ? block : undefined)
  return <main className="story">
    <Brand />
    <button className="sound-toggle" aria-pressed={state.isMuted} onClick={toggleMuted}>{state.isMuted ? 'Son coupé' : 'Son activé'}</button>
    <div className="journey-progress" role="progressbar" aria-label="Progression" aria-valuenow={state.currentBlockIndex + 1} aria-valuemin={1} aria-valuemax={story.blocks.length}><i style={{ width: `${((state.currentBlockIndex + 1) / story.blocks.length) * 100}%` }}/></div>
    <JourneyNavigation story={story} currentIndex={state.currentBlockIndex} isOpen={navigationOpen} onToggle={() => setNavigationOpen(open => !open)} onGoTo={goToPart} onRestart={restartStory} />
    {mediaBlock && <StoryMediaPlayer key={mediaBlock.id} title={mediaBlock.title} text={mediaBlock.text} videoSrc={storyMediaUrl(mediaBlock.media.video)} variant={mediaBlock.type} breathIndex={state.currentBreathIndex} isPlaying={isPlaying} onBreathChange={setBreath} onPlayingChange={setIsPlaying} onComplete={completeMedia}/>}
    {block?.type === 'question' && !activeResonance && <QuestionScreen title={block.title} text={block.text} choices={block.choices} selected={state.selectedChoices[block.id]} onSelect={selectChoice}/>}
  </main>
}

function JourneyNavigation({ story, currentIndex, isOpen, onToggle, onGoTo, onRestart }: { story:StoryDocument; currentIndex:number; isOpen:boolean; onToggle:()=>void; onGoTo:(index:number)=>void; onRestart:()=>void }) {
  const current = story.blocks[currentIndex]
  return <>
    <nav className="chapter-nav" aria-label="Navigation entre les parties du conte">
      <button onClick={() => onGoTo(currentIndex - 1)} disabled={currentIndex === 0} aria-label="Partie précédente"><span aria-hidden="true">←</span><span>Précédent</span></button>
      <button className="chapter-nav__index" onClick={onToggle} aria-expanded={isOpen} aria-controls="story-contents"><small>Partie {currentIndex + 1} sur {story.blocks.length}</small><strong>{current?.title}</strong></button>
      <button onClick={() => onGoTo(currentIndex + 1)} disabled={currentIndex === story.blocks.length - 1} aria-label="Partie suivante"><span>Suivant</span><span aria-hidden="true">→</span></button>
    </nav>
    {isOpen && <div className="chapter-menu__backdrop" onClick={onToggle}>
      <aside id="story-contents" className="chapter-menu" role="dialog" aria-modal="true" aria-label="Sommaire du conte" onClick={event => event.stopPropagation()}>
        <header><div><span className="eyebrow">Le fil du conte</span><h2>Choisir une partie</h2></div><button className="chapter-menu__close" onClick={onToggle} aria-label="Fermer le sommaire">×</button></header>
        <ol>{story.blocks.map((part, index) => <li key={part.id}><button className={index === currentIndex ? 'is-current' : ''} aria-current={index === currentIndex ? 'step' : undefined} onClick={() => onGoTo(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{part.title}</strong>{index === currentIndex && <i>En cours</i>}</button></li>)}</ol>
        <button className="chapter-menu__restart" onClick={onRestart}><span aria-hidden="true">↺</span> Recommencer au début</button>
      </aside>
    </div>}
  </>
}

function QuestionScreen({ title, text, choices, selected, onSelect }: { title:string; text:string; choices:StoryChoice[]; selected?:string; onSelect:(choice:StoryChoice)=>void }) {
  return <section className="question-screen"><ParticleOverlay/><div className="question-screen__content"><span className="eyebrow">{title}</span><h1>{text}</h1><div className="question-screen__choices">{choices.map(choice => <button key={choice.id} className={selected === choice.id ? 'is-selected' : ''} onClick={() => onSelect(choice)}>{choice.label}<span aria-hidden="true">→</span></button>)}</div><small>Votre choix ouvre une résonance, sans interprétation.</small></div></section>
}

function Brand() { return <div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div> }

const welcomePetals = Array.from({ length: 22 }, (_, index) => ({
  left: `${(index * 37 + 7) % 101}%`,
  delay: `${-(index * 1.73) % 18}s`,
  duration: `${14 + (index % 6) * 1.7}s`,
  size: `${9 + (index % 5) * 3}px`,
  drift: `${-70 + (index * 43) % 140}px`,
  turn: `${120 + (index % 7) * 63}deg`,
}))

function WelcomePetals() {
  return <div className="welcome-petals" aria-hidden="true">{welcomePetals.map((petal, index) => <i key={index} style={{ '--left':petal.left, '--delay':petal.delay, '--duration':petal.duration, '--size':petal.size, '--drift':petal.drift, '--turn':petal.turn } as React.CSSProperties}><span/></i>)}</div>
}
