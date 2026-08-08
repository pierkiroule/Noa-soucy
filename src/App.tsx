import { useEffect, useState } from 'react'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { isStoryRoute } from './routing/storyRoute'
import { StoryPlayer } from './story/StoryPlayer'

function PublicHome() {
  return <main className="public-home"><span className="public-home__mark">◌</span><p className="eyebrow">NAO SOUCI</p><h1>La petite noix sur l’Océan des soucis.</h1><p>Approchez Nao de votre téléphone pour commencer.</p></main>
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
