import { useEffect, useRef, useState } from 'react'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { isStoryRoute } from './routing/storyRoute'
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

  return <AppErrorBoundary>{isStoryRoute(pathname) ? <StoryPlayer /> : <PublicHome />}</AppErrorBoundary>
}
