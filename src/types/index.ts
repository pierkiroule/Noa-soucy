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

export interface PoemEntry {
  id: string
  tagIds: string[]
  tags: string[]
  poem: string
  createdAt: string
}

export type TransformationStage =
  | 'idle'
  | 'scrountch'
  | 'bloup'
  | 'pchiiit'
