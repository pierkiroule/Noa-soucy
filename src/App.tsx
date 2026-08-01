import {
  useMemo,
  useState,
} from 'react'
import { AnimatePresence } from 'framer-motion'
import { IntroOverlay } from './components/IntroOverlay'
import { PoemBubble } from './components/PoemBubble'
import { TagGraph } from './components/TagGraph'
import { TransformationOverlay } from './components/TransformationOverlay'
import { tagLibrary } from './data/tagLibrary'
import { generatePoem } from './engine/poetryEngine'
import {
  loadPoems,
  savePoems,
} from './storage/localStorage'
import type {
  PoemEntry,
  TransformationStage,
} from './types'

const MAX_SELECTION = 3

function App() {
  const [started, setStarted] =
    useState(false)

  const [selectedIds, setSelectedIds] =
    useState<string[]>([])

  const [stage, setStage] =
    useState<TransformationStage>('idle')

  const [poems, setPoems] =
    useState<PoemEntry[]>(loadPoems)

  const [currentPoem, setCurrentPoem] =
    useState<PoemEntry | null>(null)

  const selectedTags = useMemo(
    () =>
      tagLibrary.filter((tag) =>
        selectedIds.includes(tag.id),
      ),
    [selectedIds],
  )

  function toggleTag(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter(
          (item) => item !== id,
        )
      }

      if (current.length >= MAX_SELECTION) {
        return current
      }

      return [...current, id]
    })
  }

  function wait(duration: number) {
    return new Promise<void>((resolve) => {
      window.setTimeout(resolve, duration)
    })
  }

  async function runTransformation() {
    if (
      selectedTags.length === 0 ||
      stage !== 'idle'
    ) {
      return
    }

    setStage('resonance')
    await wait(850)

    setStage('bloom')
    await wait(1300)

    setStage('reveal')
    await wait(850)

    const entry: PoemEntry = {
      id: crypto.randomUUID(),
      tagIds: selectedTags.map(
        (tag) => tag.id,
      ),
      tags: selectedTags.map(
        (tag) => tag.label,
      ),
      poem: generatePoem(selectedTags),
      createdAt: new Date().toISOString(),
    }

    setCurrentPoem(entry)
    setStage('idle')
  }

  function startNewCreation() {
    setCurrentPoem(null)
    setSelectedIds([])
  }

  function keepCreation() {
    if (!currentPoem) {
      return
    }

    const nextPoems = [...poems, currentPoem]
    setPoems(nextPoems)
    savePoems(nextPoems)
    startNewCreation()
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <strong>
            NOA SOUCI
          </strong>

          <span>
            De mon souci fleurit•°.
          </span>
        </div>

        <div className="poem-count">
          {poems.length > 0
            ? `${poems.length} création${poems.length > 1 ? 's' : ''} dans mon jardin`
            : ''}
        </div>
      </header>

      <section className="graph-area">
        <div className="graph-instruction">
          <p>
            Noa vous invite à écouter les résonances de votre souci.
          </p>

          <h2>
            Choisissez jusqu&apos;à trois résonances.
          </h2>

          <span>
            Touchez les émojis qui vous semblent les plus justes.
          </span>
        </div>

        <TagGraph
          selectedIds={selectedIds}
          onToggle={toggleTag}
        />

        {selectedIds.length > 0 && (
          <div className="action-zone">
            <span>
              {selectedIds.length}
              {' / '}
              {MAX_SELECTION}
            </span>

            <button
              type="button"
              className="bloom-button"
              onClick={runTransformation}
              disabled={stage !== 'idle'}
            >
              Laisser fleurir
            </button>
          </div>
        )}
      </section>

      <AnimatePresence>
        {!started && (
          <IntroOverlay
            onEnter={() => setStarted(true)}
          />
        )}
      </AnimatePresence>

      <TransformationOverlay
        stage={stage}
      />

      <AnimatePresence>
        {currentPoem && (
          <PoemBubble
            poem={currentPoem.poem}
            tags={currentPoem.tags}
            onKeep={keepCreation}
            onNew={startNewCreation}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
