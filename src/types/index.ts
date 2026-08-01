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

export interface CreationEntry {
  id: string
  tagIds: string[]
  tags: string[]
  content: string
  createdAt: string
}

export type TransformationStage =
  | 'idle'
  | 'resonance'
  | 'flowering'
