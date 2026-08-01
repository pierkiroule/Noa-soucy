import { tagLibrary } from '../data/tagLibrary'

interface TagGraphProps {
  selectedIds: string[]
  onToggle: (id: string) => void
  hidden?: boolean
}

const positions = tagLibrary.map((_, index) => {
  const angle = (index / tagLibrary.length) * Math.PI * 2 - Math.PI / 2
  return {
    x: 50 + Math.cos(angle) * 37,
    y: 50 + Math.sin(angle) * 37,
  }
})

export function TagGraph({ selectedIds, onToggle, hidden = false }: TagGraphProps) {
  const selectedIndexes = selectedIds
    .map((id) => tagLibrary.findIndex((tag) => tag.id === id))
    .filter((index) => index >= 0)

  return (
    <div className={`resonance-circle${hidden ? ' is-hidden' : ''}${selectedIds.length > 0 ? ' has-selection' : ''}`}>
      <svg className="resonance-lines" viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="37" />
        {selectedIndexes.slice(0, selectedIndexes.length === 2 ? 1 : selectedIndexes.length).map((fromIndex, index) => {
          const toIndex = selectedIndexes[(index + 1) % selectedIndexes.length]
          if (selectedIndexes.length < 2) return null
          return (
            <line
              key={`${fromIndex}-${toIndex}`}
              x1={positions[fromIndex].x}
              y1={positions[fromIndex].y}
              x2={positions[toIndex].x}
              y2={positions[toIndex].y}
            />
          )
        })}
      </svg>

      {tagLibrary.map((tag, index) => (
        <button
          type="button"
          key={tag.id}
          className={`circle-tag${selectedIds.includes(tag.id) ? ' is-selected' : ''}`}
          style={{ left: `${positions[index].x}%`, top: `${positions[index].y}%` }}
          onClick={() => onToggle(tag.id)}
          aria-pressed={selectedIds.includes(tag.id)}
          aria-label={`${tag.symbol} ${tag.label}`}
        >
          <span>{tag.symbol}</span>
          <small>{tag.label}</small>
        </button>
      ))}

      <div className="fermentation" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
      </div>
    </div>
  )
}
