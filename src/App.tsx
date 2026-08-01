import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ContactOverlay } from './components/ContactOverlay'
import { Garden } from './components/Garden'
import { IntroOverlay } from './components/IntroOverlay'
import { PollenStudio, type PollenSuggestion } from './components/PollenStudio'
import { TagGraph } from './components/TagGraph'
import { tagLibrary } from './data/tagLibrary'
import { generatePollenSuggestions } from './engine/poetryEngine'
import { loadPoems, savePoems } from './storage/localStorage'
import type { PoemEntry } from './types'

const MAX_SELECTION = 3
type ExperienceStep = 'welcome' | 'contact' | 'resonances'
type CreationStage = 'selection' | 'synthesis' | 'studio'

function App() {
  const [step, setStep] = useState<ExperienceStep>('welcome')
  const [creationStage, setCreationStage] = useState<CreationStage>('selection')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<PollenSuggestion[]>([])
  const [universe, setUniverse] = useState('graine')
  const [studioCycle, setStudioCycle] = useState(0)
  const [creations, setCreations] = useState<PoemEntry[]>(loadPoems)
  const [gardenOpen, setGardenOpen] = useState(false)
  const [gardenSelection, setGardenSelection] = useState<PoemEntry | null>(null)

  const selectedTags = useMemo(
    () => tagLibrary.filter((tag) => selectedIds.includes(tag.id)),
    [selectedIds],
  )

  function toggleTag(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id)
      return current.length >= MAX_SELECTION ? current : [...current, id]
    })
  }

  async function beginBloom() {
    if (selectedTags.length === 0) return
    setCreationStage('synthesis')
    await new Promise<void>((resolve) => window.setTimeout(resolve, 1700))
    const pollen = generatePollenSuggestions(selectedTags)
    setSuggestions(pollen.suggestions)
    setUniverse(pollen.universe)
    setStudioCycle((cycle) => cycle + 1)
    setCreationStage('studio')
  }

  function creationEntry(text: string): PoemEntry {
    return {
      id: crypto.randomUUID(),
      tagIds: selectedTags.map((tag) => tag.id),
      tags: selectedTags.map((tag) => `${tag.symbol} ${tag.label}`),
      poem: text,
      createdAt: new Date().toISOString(),
      universe,
      visualSeed: Math.random(),
    }
  }

  function keepComposition(text: string) {
    const next = [...creations, creationEntry(text)]
    setCreations(next)
    savePoems(next)
    setGardenOpen(true)
  }

  function startNewFlower() {
    const pollen = generatePollenSuggestions(selectedTags)
    setSuggestions(pollen.suggestions)
    setUniverse(pollen.universe)
    setStudioCycle((cycle) => cycle + 1)
  }

  function returnToResonances() {
    setCreationStage('selection')
    setSuggestions([])
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div><strong>NOA souci</strong><span>De mon souci fleurissent...•°</span></div>
        <button type="button" className="garden-link" onClick={() => setGardenOpen(true)}>Mon jardin{creations.length > 0 ? ` · ${creations.length}` : ''}</button>
      </header>

      <section className="graph-area">
        <div className="graph-instruction">
          <p>Noa t’invite à écouter les résonances de ton souci.</p>
          <h2>Choisis jusqu’à trois résonances.</h2>
          <span>Touche celles qui te semblent les plus justes.</span>
        </div>
        <TagGraph selectedIds={selectedIds} onToggle={toggleTag} hidden={creationStage !== 'selection'} />
        {selectedIds.length > 0 && creationStage === 'selection' && (
          <div className="action-zone">
            <span>{selectedIds.length} / {MAX_SELECTION}</span>
            <button type="button" className="bloom-button" onClick={() => void beginBloom()}>Faire émerger</button>
          </div>
        )}
      </section>

      <AnimatePresence mode="wait">
        {step === 'welcome' && <IntroOverlay key="welcome" onEnter={() => setStep('contact')} />}
        {step === 'contact' && <ContactOverlay key="contact" onContinue={() => setStep('resonances')} />}
      </AnimatePresence>

      <AnimatePresence>
        {creationStage === 'synthesis' && (
          <motion.section className="synthesis-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="synthesis-ferment" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
            <p>Aujourd’hui, ton souci résonne avec ces sensations…</p>
            <div>{selectedTags.map((tag) => <span key={tag.id}>{tag.symbol} {tag.label}</span>)}</div>
          </motion.section>
        )}
        {creationStage === 'studio' && (
          <PollenStudio
            key={studioCycle}
            suggestions={suggestions}
            onKeep={keepComposition}
            onCycle={startNewFlower}
            onBack={returnToResonances}
          />
        )}
        {gardenOpen && (
          <Garden creations={creations} selected={gardenSelection} onSelect={setGardenSelection} onClose={() => { setGardenSelection(null); setGardenOpen(false) }} />
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
