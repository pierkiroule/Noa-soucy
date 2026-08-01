import {
  useMemo,
  useState,
} from 'react'
import { AnimatePresence } from 'framer-motion'
import { IntroOverlay } from './components/IntroOverlay'
import { CreationBubble } from './components/CreationBubble'
import { TagGraph } from './components/TagGraph'
import { TransformationOverlay } from './components/TransformationOverlay'
import { tagLibrary } from './data/tagLibrary'
import { generateCreation } from './engine/creationEngine'
import {
  loadCreations,
  saveCreations,
} from './storage/localStorage'
import type {
  CreationEntry,
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

  const [creations, setCreations] =
    useState<CreationEntry[]>(loadCreations)

  const [currentCreation, setCurrentCreation] =
    useState<CreationEntry | null>(null)

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
    await wait(1500)

    setStage('flowering')
    await wait(1500)

    const entry: CreationEntry = {
      id: crypto.randomUUID(),
      tagIds: selectedTags.map(
        (tag) => tag.id,
      ),
      tags: selectedTags.map(
        (tag) => tag.label,
      ),
      content: generateCreation(selectedTags),
      createdAt: new Date().toISOString(),
    }

    setCurrentCreation(entry)
    setStage('idle')
  }

  function keepCreation() {
    if (!currentCreation) {
      return
    }

    const alreadyKept = creations.some(
      (entry) => entry.id === currentCreation.id,
    )

    if (!alreadyKept) {
      const nextCreations = [...creations, currentCreation]
      setCreations(nextCreations)
      saveCreations(nextCreations)
    }
  }

  function startNewCreation() {
    setCurrentCreation(null)
    setSelectedIds([])
  }

  return (
    <main className="app-shell">
      <header className="top-bar">
        <div>
          <strong>
            NOA SOUCI
          </strong>

          <span>
            De nos soucis fleurissent•°.
          </span>
        </div>

        <div className="creation-count">
          {creations.length > 0
            ? `${creations.length} création${creations.length > 1 ? 's' : ''} dans le jardin`
            : ''}
        </div>
      </header>

      <section className="graph-area">
        <div className="graph-instruction">
          <h2>
            Noa vous invite à écouter les résonances de votre souci.
          </h2>

          <span>
            Choisissez jusqu&apos;à trois résonances.
            <br />
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
              className="flower-button"
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
        {currentCreation && (
          <CreationBubble
            content={currentCreation.content}
            tags={currentCreation.tags}
            kept={creations.some((entry) => entry.id === currentCreation.id)}
            onKeep={keepCreation}
            onNew={startNewCreation}
          />
        )}
      </AnimatePresence>
    </main>
  )
}

export default App
