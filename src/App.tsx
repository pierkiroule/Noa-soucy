import { useEffect, useRef, useState } from 'react'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { NaoPassers } from './components/nao-travel/NaoPassers'
import { NaoTravelProvider } from './components/nao-travel/NaoTravelContext'
import { isStoryRoute, parseNaoTravelRoute } from './routing/storyRoute'
import { StoryPlayer } from './story/StoryPlayer'

function PublicHome() {
  const [blooms, setBlooms] = useState<Array<{ id: number, x: number, y: number }>>([])
  const nextBloom = useRef(0)
  const resonate = (x: number, y: number) => {
    const bloom = { id: nextBloom.current++, x, y }
    setBlooms(current => [...current.slice(-4), bloom])
    window.setTimeout(() => setBlooms(current => current.filter(item => item.id !== bloom.id)), 1900)
  }

  return <main className="public-home" onPointerDown={event => resonate(event.clientX, event.clientY)}>
    <div className="public-home__aurora" aria-hidden="true"><i/><i/><i/></div>
    <div className="public-home__petals" aria-hidden="true">{Array.from({ length: 14 }, (_, index) => <i key={index}><span/></i>)}</div>
    <div className="public-home__resonances" aria-hidden="true">{blooms.map(bloom => <i key={bloom.id} style={{ left: bloom.x, top: bloom.y }}><span/><span/><span/><span/><span/></i>)}</div>
    <div className="public-home__content">
      <span className="public-home__mark">◌</span>
      <p className="eyebrow">NAO SOUCI</p>
      <h1>La petite noix sur l’Océan des soucis.</h1>
      <p>Scannez la petite noix pour ouvrir directement le conte.</p>
      <a className="primary public-home__open-story" href="/n">Découvrir le conte sans NFC <span aria-hidden="true">→</span></a>
    </div>
  </main>
}

export default function App() {
  const [pathname, setPathname] = useState(() => location.pathname)
  useEffect(() => {
    const update = () => setPathname(location.pathname)
    addEventListener('popstate', update)
    return () => removeEventListener('popstate', update)
  }, [])

  const navigate = (nextPath: string) => {
    history.pushState({}, '', nextPath)
    setPathname(nextPath)
  }
  const travelRoute = parseNaoTravelRoute(pathname)

  let content
  if (travelRoute.kind === 'invalid') content = <InvalidNao onHome={() => navigate('/')} />
  else if (travelRoute.kind === 'passers') content = <NaoPassers nutId={travelRoute.nutId} onBack={() => navigate(`/n/${travelRoute.nutId}`)} />
  else if (travelRoute.kind === 'journey') content = <StoryPlayer />
  else content = isStoryRoute(pathname) ? <StoryPlayer /> : <PublicHome />

  const nutId = travelRoute.kind === 'journey' || travelRoute.kind === 'passers' ? travelRoute.nutId : undefined
  return <AppErrorBoundary><NaoTravelProvider nutId={nutId} onShowPassers={() => nutId && navigate(`/n/${nutId}/passers`)}>{content}</NaoTravelProvider></AppErrorBoundary>
}

function InvalidNao({ onHome }: { onHome: () => void }) {
  return <main className="travel-screen travel-confirmation"><span aria-hidden="true">◌</span><h1>Cette Nao semble avoir perdu son chemin.</h1><button className="primary" onClick={onHome}>Revenir à l’accueil</button></main>
}
