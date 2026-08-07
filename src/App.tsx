import { useEffect, useState } from 'react'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { NutAccessGuard } from './components/nut/NutAccessGuard'
import { readNutToken } from './routing/nutRoute'
import { StoryPlayer } from './story/StoryPlayer'

function PublicHome({ invalid }: { invalid?: boolean }) {
  return <main className="public-home"><span className="public-home__mark">◌</span><p className="eyebrow">NAO SOUCI</p><h1>{invalid ? 'Cette noix reste silencieuse.' : 'La petite noix sur l’Océan des soucis.'}</h1><p>{invalid ? 'Approchez-la de nouveau pour ouvrir le bon passage.' : 'Approchez Nao de votre téléphone pour commencer.'}</p></main>
}

export default function App() {
  const [pathname, setPathname] = useState(() => location.pathname)
  useEffect(() => { const update = () => setPathname(location.pathname); addEventListener('popstate', update); return () => removeEventListener('popstate', update) }, [])
  const nutToken = readNutToken(pathname)
  return <AppErrorBoundary>{nutToken ? <NutAccessGuard nutToken={nutToken}><StoryPlayer /></NutAccessGuard> : <PublicHome invalid={pathname.startsWith('/n/')} />}</AppErrorBoundary>
}
