import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ContactOverlay } from './components/ContactOverlay'
import { Garden } from './components/Garden'
import { IntroOverlay } from './components/IntroOverlay'
import { PoemBubble } from './components/PoemBubble'
import { TagGraph } from './components/TagGraph'
import { TransformationOverlay } from './components/TransformationOverlay'
import { tagLibrary } from './data/tagLibrary'
import { generateCreation } from './engine/poetryEngine'
import { loadPoems, savePoems } from './storage/localStorage'
import type { PoemEntry, TransformationStage } from './types'

const MAX_SELECTION = 3
type ExperienceStep = 'welcome' | 'contact' | 'resonances'

function App() {
  const [step, setStep] = useState<ExperienceStep>('welcome')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [stage, setStage] = useState<TransformationStage>('idle')
  const [creations, setCreations] = useState<PoemEntry[]>(loadPoems)
  const [currentCreation, setCurrentCreation] = useState<PoemEntry | null>(null)
  const [gardenOpen, setGardenOpen] = useState(false)
  const [gardenSelection, setGardenSelection] = useState<PoemEntry | null>(null)

  const selectedTags = useMemo(
    () => tagLibrary.filter((tag) => selectedIds.includes(tag.id)),
    [selectedIds],
  )

  function toggleTag(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id)
      }
      return current.length >= MAX_SELECTION ? current : [...current, id]
    })
  }

  function createEntry() {
    const result = generateCreation(selectedTags)
    return {
      id: crypto.randomUUID(),
      tagIds: selectedTags.map((tag) => tag.id),
      tags: selectedTags.map((tag) => `${tag.symbol} ${tag.label}`),
      poem: result.text,
      createdAt: new Date().toISOString(),
      universe: result.universe,
      visualSeed: Math.random(),
    }
  }

  async function letBloom() {
    if (selectedTags.length === 0 || stage !== 'idle') {
      return
    }

    setStage('blooming')
    await new Promise<void>((resolve) => window.setTimeout(resolve, 1800))
    setCurrentCreation(createEntry())
    setStage('idle')
  }

  function leaveCreation() {
    setCurrentCreation(null)
    setSelectedIds([])
  }

  function keepCreation() {
    if (!currentCreation) return
    const nextCreations = [...creations, currentCreation]
    setCreations(nextCreations)
    savePoems(nextCreations)
    leaveCreation()
    setGardenOpen(true)
  }

  async function makeAnotherCreation() {
    setCurrentCreation(null)
    window.setTimeout(() => void letBloom(), 180)
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <strong>NOA SOUCI</strong>
          <span>De mon souci fleurit•°.</span>
        </div>
        <button type="button" className="garden-link" onClick={() => setGardenOpen(true)}>
          Mon jardin{creations.length > 0 ? ` · ${creations.length}` : ''}
        </button>
      </header>

      <section className="graph-area">
        <div className="graph-instruction">
          <p>Noa vous invite à écouter les résonances de votre souci.</p>
          <h2>Choisissez jusqu’à trois résonances.</h2>
          <span>Touchez celles qui vous semblent les plus justes.</span>
        </div>

        <TagGraph selectedIds={selectedIds} onToggle={toggleTag} />

        {selectedIds.length > 0 && (
          <div className="action-zone">
            <span>{selectedIds.length} / {MAX_SELECTION}</span>
            <button type="button" className="bloom-button" onClick={() => void letBloom()} disabled={stage !== 'idle'}>
              Laisser fleurir
            </button>
          </div>
        )}
      </section>

      <AnimatePresence mode="wait">
        {step === 'welcome' && <IntroOverlay key="welcome" onEnter={() => setStep('contact')} />}
        {step === 'contact' && <ContactOverlay key="contact" onContinue={() => setStep('resonances')} />}
      </AnimatePresence>

      <TransformationOverlay stage={stage} tags={selectedTags.map((tag) => `${tag.symbol} ${tag.label}`)} />

      <AnimatePresence>
        {currentCreation && (
          <PoemBubble
            poem={currentCreation.poem}
            tags={currentCreation.tags}
            onKeep={keepCreation}
            onLeave={leaveCreation}
            onNew={() => void makeAnotherCreation()}
          />
        )}
        {gardenOpen && (
          <Garden
            creations={creations}
            selected={gardenSelection}
            onSelect={setGardenSelection}
            onClose={() => { setGardenSelection(null); setGardenOpen(false) }}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
