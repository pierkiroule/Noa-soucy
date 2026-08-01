export type TagCategory =
  | 'impact'
  | 'mental'
  | 'movement'

export interface TagDefinition {
  id: string
  label: string
  symbol: string
  category: TagCategory
  meanings: string[]
}

export interface GraphNode extends TagDefinition {
  x?: number
  y?: number
  vx?: number
  vy?: number
  fx?: number | null
  fy?: number | null
  selected: boolean
}

export interface GraphLink {
  source: string | GraphNode
  target: string | GraphNode
  strength?: number
}

export interface PoemEntry {
  id: string
  tagIds: string[]
  tags: string[]
  poem: string
  createdAt: string
  universe: string
  visualSeed: number
}

export type TransformationStage =
  | 'idle'
  | 'blooming'
