import type { GraphNode } from '../types'

interface TagBubbleProps {
  node: GraphNode
  onToggle: (id: string) => void
  disabled: boolean
}

export function TagBubble({
  node,
  onToggle,
  disabled,
}: TagBubbleProps) {
  const x = node.x ?? 0
  const y = node.y ?? 0

  return (
    <button
      type="button"
      className={[
        'tag-bubble',
        `tag-${node.category}`,
        node.selected ? 'is-selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onClick={() => onToggle(node.id)}
      aria-pressed={node.selected}
      aria-label={node.label}
      disabled={disabled}
    >
      <span className="tag-symbol">
        {node.symbol}
      </span>

      <span className="tag-label">
        {node.label}
      </span>
    </button>
  )
}
