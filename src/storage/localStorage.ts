import type { PoemEntry } from '../types'

const STORAGE_KEY = 'noa-souci-poems'

export function loadPoems(): PoemEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)

    return Array.isArray(parsed)
      ? (parsed as PoemEntry[])
      : []
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
      'Impossible d’enregistrer les poèmes localement.',
    )
  }
}

export function clearPoems(): void {
  localStorage.removeItem(STORAGE_KEY)
}
