export function weightedPick<T extends { weight?: number }>(items: T[], random = Math.random): T | undefined {
  const total = items.reduce((sum, item) => sum + (item.weight ?? 1), 0)
  let cursor = random() * total
  return items.find((item) => (cursor -= item.weight ?? 1) <= 0) ?? items.at(-1)
}
export function pick<T>(items: T[], random = Math.random): T { return items[Math.floor(random() * items.length)] }
