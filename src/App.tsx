import { useEffect, useState } from 'react'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { isStoryRoute } from './routing/storyRoute'
import { StoryPlayer } from './story/StoryPlayer'

function PublicHome() {
  return <main className="public-home">
    <span className="public-home__mark">◌</span>
    <p className="eyebrow">NAO SOUCI</p>
    <h1>La petite noix sur l’Océan des soucis.</h1>
    <p>Scannez la petite noix pour ouvrir directement le conte.</p>
    <a className="primary public-home__open-story" href="/n">Découvrir le conte sans NFC <span aria-hidden="true">→</span></a>
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
