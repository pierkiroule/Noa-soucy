export function randomItem<T>(items: T[]): T {
  if (items.length === 0) {
    throw new Error('Impossible de choisir dans une liste vide.')
  }

  return items[Math.floor(Math.random() * items.length)]
}

export function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5)
}
