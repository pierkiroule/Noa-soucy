import type { CSSProperties } from 'react'
import type { TagDefinition } from '../types'

interface TagBubbleProps {
  tag: TagDefinition
  index: number
  total: number
  selected: boolean
  onToggle: (id: string) => void
}

type OrbitStyle = CSSProperties & {
  '--tag-angle': string
  '--tag-angle-inverse': string
  '--tag-index': number
}

export function TagBubble({
  tag,
  index,
  total,
  selected,
  onToggle,
}: TagBubbleProps) {
  const style: OrbitStyle = {
    '--tag-angle': `${index * (360 / total) - 90}deg`,
    '--tag-angle-inverse': `${90 - index * (360 / total)}deg`,
    '--tag-index': index,
  }

  return (
    <button
      type="button"
      className={[
        'tag-bubble',
        `tag-${tag.category}`,
        selected ? 'is-selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      onClick={() => onToggle(tag.id)}
      aria-pressed={selected}
      aria-label={tag.label}
    >
      <span className="tag-symbol">{tag.symbol}</span>
      <span className="tag-label">{tag.label}</span>
    </button>
  )
}
