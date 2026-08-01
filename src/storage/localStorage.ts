import type { PoemEntry } from '../types'

const STORAGE_KEY = 'noa-souci-poems'

export function loadPoems(): PoemEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return (parsed as Partial<PoemEntry>[])
      .filter((entry): entry is Partial<PoemEntry> & Pick<PoemEntry, 'id' | 'poem' | 'createdAt'> =>
        typeof entry.id === 'string' &&
        typeof entry.poem === 'string' &&
        typeof entry.createdAt === 'string',
      )
      .map((entry) => ({
        id: entry.id,
        poem: entry.poem,
        createdAt: entry.createdAt,
        tagIds: entry.tagIds ?? [],
        tags: entry.tags ?? [],
        universe: entry.universe ?? 'graine',
        visualSeed: entry.visualSeed ?? 0.5,
      }))
  } catch {
    return []
  }
}

export function savePoems(poems: PoemEntry[]): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(poems),
    )
  } catch {
    console.warn(
      'Impossible de conserver les créations dans le jardin.',
    )
  }
}

export function clearPoems(): void {
  localStorage.removeItem(STORAGE_KEY)
}
