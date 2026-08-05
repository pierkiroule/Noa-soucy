import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { StoryMediaPlayer } from '../components/StoryMediaPlayer'
import { NavigationFlowerExperience } from '../components/navigation-flower/NavigationFlowerExperience'
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
  const [scoreMode, setScoreMode] = useState(false)
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [flowerStarted, setFlowerStarted] = useState(false)
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
    else if (block.type === 'epilogue') setState(current => story.blocks[current.currentBlockIndex + 1]?.type === 'navigation-flower' ? ({ ...current, currentBlockIndex: current.currentBlockIndex + 1, currentBreathIndex: 0 }) : ({ ...current, completed: true }))
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
    setFlowerStarted(false)
  }
  const restartStory = () => {
    setState(initialSaved)
    setIsPlaying(true)
    setNavigationOpen(false)
    setFlowerStarted(false)
  }

  if (loadError) return <main className="loading"><h1>NAO SOUCI</h1><p>Le conte n’a pas pu être chargé.</p><button onClick={() => location.reload()}>Réessayer</button></main>
  if (!story) return <main className="loading" aria-live="polite">La mer retrouve son souffle…</main>
  if (scoreMode) return <ScoreReader story={story} onClose={() => setScoreMode(false)} />
  if (!started) return <main className="story intro-screen"><Brand/><section className="intro"><span className="eyebrow">Un conte audiovisuel</span><h1>{story.title}</h1><p>{story.subtitle}</p><button className="primary" onClick={start}>{state.currentBlockIndex ? 'Reprendre la traversée' : 'Commencer le conte'} <span aria-hidden="true">→</span></button><button className="quiet intro__score" onClick={() => setScoreMode(true)}>Lecture de la partition</button><small>Vidéo, musique et texte · Son réglable à tout moment</small></section></main>
  if (state.completed) return <main className="story completion"><Brand/><span className="eyebrow">Fin de traversée</span><h1>Votre traversée s’arrête ici pour aujourd’hui.</h1><p>Votre fleur pourra changer.<br/>Comme la mer.<br/>Comme le vent.<br/>Comme vous.</p><div className="completion__actions"><button className="quiet" onClick={() => { setState(current => ({ ...current, completed: false, currentBlockIndex: story.blocks.findIndex(part => part.type === 'navigation-flower') })); setStarted(true) }}>Revoir ma fleur</button><button className="primary" onClick={restart}>Recommencer le conte</button><button className="quiet" onClick={() => setStarted(false)}>Revenir à l’accueil</button></div></main>

  if (block?.type === 'navigation-flower') {
    if (flowerStarted) return <NavigationFlowerExperience onBackToEnding={() => { setFlowerStarted(false); setState(current => ({ ...current, currentBlockIndex: Math.max(0, current.currentBlockIndex - 1), completed: false })) }} onFinish={() => setState(current => ({ ...current, completed: true }))} />
    return <main className="story compass-flow flower-flow"><Brand/><section className="compass-panel compass-invitation"><span className="eyebrow">Invitation à poursuivre</span><h1>La Fleur-Boussole des navigateurs de l’incertitude</h1><p>La traversée choisit les pétales. Les pétales construisent la fleur. La fleur devient une voile.</p><div className="compass-actions"><button className="primary" onClick={() => setFlowerStarted(true)}>Découvrir ma fleur de navigation</button><button className="quiet" onClick={() => setState(current => ({ ...current, completed: true }))}>Terminer ici</button></div><small>Vos choix restent uniquement sur cet appareil.</small></section></main>
  }

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

function ScoreReader({ story, onClose }: { story:StoryDocument; onClose:()=>void }) {
  const entries = story.blocks.flatMap(block => block.type === 'question' ? [block, ...block.choices.map(choice => choice.resonance)] : block.type === 'navigation-flower' ? [] : [block])
  return <main className="score"><header><div><span className="eyebrow">Mode de vérification</span><h1>Lecture de la partition</h1></div><button className="quiet" onClick={onClose}>Fermer</button></header>{entries.map(entry => entry.type === 'question' ? <article key={entry.id} className="score__question"><span>{entry.title}</span><h2>{entry.text}</h2><p>{entry.choices.map(choice => choice.label).join(' · ')}</p></article> : <article key={entry.id}><span>{entry.title}</span><p>{entry.text}</p><code>{entry.media.video} · {entry.media.music}</code></article>)}</main>
}

function Brand() { return <div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div> }
