import type { CreationEntry } from '../types'

const STORAGE_KEY = 'noa-souci-creations'

export function loadCreations(): CreationEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)

    return Array.isArray(parsed)
      ? (parsed as CreationEntry[])
      : []
  } catch {
    return []
  }
}

export function saveCreations(creations: CreationEntry[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(creations),
    )
  } catch {
    console.warn(
      'Impossible de conserver les créations dans le jardin.',
    )
  }
}

export function clearCreations(): void {
  localStorage.removeItem(STORAGE_KEY)
}
