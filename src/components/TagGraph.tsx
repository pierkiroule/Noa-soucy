import type { CSSProperties } from 'react'
import { tagLibrary } from '../data/tagLibrary'
import type { TagCategory } from '../types'
import { TagBubble } from './TagBubble'

interface TagGraphProps {
  selectedIds: string[]
  onToggle: (id: string) => void
}

const PETAL_COUNT = 24

type FlowerStyle = CSSProperties & {
  '--impact-energy': number
  '--mental-energy': number
  '--movement-energy': number
}

function ResonanceFlower({
  selectedIds,
}: Pick<TagGraphProps, 'selectedIds'>) {
  const selectedTags = tagLibrary.filter((tag) =>
    selectedIds.includes(tag.id),
  )
  const energy = (category: TagCategory) =>
    selectedTags.filter((tag) => tag.category === category).length

  const style: FlowerStyle = {
    '--impact-energy': energy('impact'),
    '--mental-energy': energy('mental'),
    '--movement-energy': energy('movement'),
  }

  return (
    <div
      className={`resonance-flower resonance-${selectedIds.length}`}
      style={style}
      aria-hidden="true"
    >
      <div className="flower-aura" />

      <div className="petal-field">
        {Array.from({ length: PETAL_COUNT }, (_, index) => (
          <i
            key={index}
            className="flower-petal"
            style={{
              '--petal-index': index,
              '--petal-angle': `${index * (360 / PETAL_COUNT)}deg`,
            } as CSSProperties}
          />
        ))}
      </div>

      <div className="flower-heart">
        <span />
      </div>
    </div>
  )
}

export function TagGraph({
  selectedIds,
  onToggle,
}: TagGraphProps) {
  return (
    <div className="graph-stage">
      <div className="tag-orbit" aria-label="Ressentis disponibles">
        {tagLibrary.map((tag, index) => (
          <TagBubble
            key={tag.id}
            tag={tag}
            index={index}
            total={tagLibrary.length}
            selected={selectedIds.includes(tag.id)}
            onToggle={onToggle}
          />
        ))}
      </div>

      <ResonanceFlower selectedIds={selectedIds} />

      <p className="resonance-caption" aria-live="polite">
        {selectedIds.length === 0
          ? 'La fleur attend ta résonance'
          : selectedIds.length === 1
            ? 'Un pétale s’éveille'
            : `${selectedIds.length} résonances se rencontrent`}
      </p>
    </div>
  )
}
