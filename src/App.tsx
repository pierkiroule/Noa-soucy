import { useEffect, useState } from 'react'
import { AppErrorBoundary } from './components/AppErrorBoundary'
import { NutAccessGuard } from './components/nut/NutAccessGuard'
import { readNutToken } from './routing/nutRoute'
import { StoryPlayer } from './story/StoryPlayer'

type ScanState = 'idle' | 'scanning' | 'unlocked'

function WalnutMark() {
  return <svg className="nfc-gate__nut" viewBox="0 0 220 220" aria-hidden="true">
    <path d="M110 28C73 29 44 63 44 108c0 48 29 83 66 84 37-1 66-36 66-84 0-45-29-79-66-80Z" />
    <path d="M110 30c-5 18 11 28 2 45-8 15-25 17-24 36 1 18 19 23 18 42-1 14-10 24-10 35M111 75c15 8 22 20 18 34-4 16-20 23-18 42 1 13 9 23 7 37M75 58c12 8 15 20 9 31-7 13-21 17-21 35 0 13 8 22 17 27M146 58c-12 9-15 20-9 31 7 13 21 17 21 35 0 13-8 22-17 27" />
  </svg>
}

function NfcDemo({ onScan }: { onScan: () => void }) {
  const [scanState, setScanState] = useState<ScanState>('idle')
  useEffect(() => {
    if (scanState !== 'scanning') return
    const timer = window.setTimeout(() => setScanState('unlocked'), 1800)
    return () => window.clearTimeout(timer)
  }, [scanState])
  useEffect(() => {
    if (scanState !== 'unlocked') return
    const timer = window.setTimeout(onScan, 1000)
    return () => window.clearTimeout(timer)
  }, [onScan, scanState])

  return <main className={`nfc-gate nfc-gate--${scanState}`}>
    <header className="nfc-gate__header"><span className="nfc-gate__brand">NAO<span>•°</span></span><span className="nfc-gate__demo">mode démo</span></header>
    <section className="nfc-gate__content" aria-labelledby="nfc-title">
      <div className="nfc-gate__ritual" aria-live="polite"><span className="nfc-gate__orbit nfc-gate__orbit--one" /><span className="nfc-gate__orbit nfc-gate__orbit--two" /><div className="nfc-gate__nut-shell"><WalnutMark /></div><div className="nfc-gate__phone"><span className="nfc-gate__phone-speaker" /><span className="nfc-gate__nfc">)))</span></div></div>
      <p className="eyebrow">Le rituel d’entrée</p>
      <h1 id="nfc-title">{scanState === 'unlocked' ? 'Nao•° vous reconnaît.' : 'Approche ton téléphone de la petite noix.'}</h1>
      <p className="nfc-gate__lead">{scanState === 'unlocked' ? 'Le passage s’ouvre. Entre doucement…' : 'Active le NFC — le sans contact — de ton téléphone, puis scanne Nao•°, la petite noix.'}</p>
      <div className="nfc-gate__instructions"><span><b>1</b> Active le NFC</span><i aria-hidden="true">—</i><span><b>2</b> Approche le téléphone</span><i aria-hidden="true">—</i><span><b>3</b> Entre dans Nao•°</span></div>
      <button className="nfc-gate__scan" type="button" onClick={scanState === 'unlocked' ? onScan : () => setScanState('scanning')} disabled={scanState === 'scanning'}>
        {scanState === 'idle' && <><span aria-hidden="true">⌁</span> Simuler le scan de la noix</>}
        {scanState === 'scanning' && <><span className="nfc-gate__spinner" /> Scan en cours…</>}
        {scanState === 'unlocked' && <>✓ Entrer dans Nao•°</>}
      </button>
      <p className="nfc-gate__note"><strong>Une noix, une identité.</strong> Cette simulation ouvre le même passage que le tag NFC, avec une noix de démonstration.</p>
      <p className="nfc-gate__privacy">Aucun compte · aucune donnée envoyée · expérience locale</p>
    </section>
  </main>
}

function PublicHome({ invalid }: { invalid?: boolean }) {
  return <main className="public-home"><span className="public-home__mark">◌</span><p className="eyebrow">NAO SOUCI</p><h1>{invalid ? 'Cette noix reste silencieuse.' : 'La petite noix sur l’Océan des soucis.'}</h1><p>{invalid ? 'Approchez-la de nouveau pour ouvrir le bon passage.' : 'Approchez Nao de votre téléphone pour commencer.'}</p></main>
}

export default function App() {
  const [pathname, setPathname] = useState(() => location.pathname)
  useEffect(() => { const update = () => setPathname(location.pathname); addEventListener('popstate', update); return () => removeEventListener('popstate', update) }, [])
  const nutToken = readNutToken(pathname)
  const openDemoNut = () => { history.pushState({}, '', '/n/nao-demo-token'); setPathname(location.pathname) }
  return <AppErrorBoundary>{nutToken ? <NutAccessGuard nutToken={nutToken}><StoryPlayer /></NutAccessGuard> : pathname === '/' ? <NfcDemo onScan={openDemoNut} /> : <PublicHome invalid={pathname.startsWith('/n/')} />}</AppErrorBoundary>
}
