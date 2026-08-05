import { DEFAULT_VISIBLE_WORD_COUNT, floatingWords, type FloatingWordDefinition } from '../data/floatingWords.ts'
import type { Vec2, WordPetalState } from '../types/floatingWords.ts'

export const MAX_SPEED = 0.12
const BOTTOM_MARGIN = 96

const hash = (value: string) => [...value].reduce((total, char) => total + char.charCodeAt(0), 0)
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const vectorLength = (vector: Vec2) => Math.hypot(vector.x, vector.y) || 1

export function selectFloatingWords(seed = String(Date.now()), count = DEFAULT_VISIBLE_WORD_COUNT): FloatingWordDefinition[] {
  const ranked = [...floatingWords].sort((a, b) => hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`))
  return ranked.slice(0, clamp(count, 8, 10))
}

export function limitWordSpeed(petal: WordPetalState, max = MAX_SPEED): WordPetalState {
  const speed = vectorLength(petal.velocity)
  return speed <= max ? petal : { ...petal, velocity: { x: petal.velocity.x / speed * max, y: petal.velocity.y / speed * max } }
}

export function initializeWordPetals(width: number, height: number, reducedMotion = false, seed = String(Date.now())): WordPetalState[] {
  return selectFloatingWords(seed).map((word, index) => {
    const petalWidth = 32 + (hash(word.id) % 24)
    const petalHeight = 48 + (hash(word.label) % 20)
    const column = (index % 3) + 1
    const row = Math.floor(index / 3) + 1
    return {
      id: word.id,
      label: word.label,
      position: { x: column * width / 4 - petalWidth / 2, y: row * height / 4 - petalHeight / 2 },
      velocity: reducedMotion ? { x: 0, y: 0 } : { x: ((hash(word.id) % 37) - 18) / 520, y: ((hash(word.label) % 29) - 14) / 560 },
      rotation: ((hash(word.id) % 19) - 9) / 20,
      rotationSpeed: reducedMotion ? 0 : (((hash(word.label) % 17) - 8) / 12000),
      width: petalWidth,
      height: petalHeight,
      cooldownUntil: 0,
      isInCollision: false,
    }
  })
}

export function stepWordPetals(petals: WordPetalState[], deltaTime: number, width: number, height: number, now: number, reducedMotion = false): WordPetalState[] {
  return petals.map(petal => {
    const oscillation = reducedMotion ? 0 : Math.sin(now * 0.00042 + hash(petal.id)) * 0.01 * deltaTime
    let next = {
      ...petal,
      position: { x: petal.position.x + petal.velocity.x * deltaTime, y: petal.position.y + petal.velocity.y * deltaTime + oscillation },
      rotation: petal.rotation + petal.rotationSpeed * deltaTime,
    }
    if (next.position.x < 12 || next.position.x > width - next.width - 12) next = { ...next, velocity: { ...next.velocity, x: next.velocity.x * -0.72 }, position: { ...next.position, x: clamp(next.position.x, 12, width - next.width - 12) } }
    if (next.position.y < 24 || next.position.y > height - next.height - BOTTOM_MARGIN) next = { ...next, velocity: { ...next.velocity, y: next.velocity.y * -0.72 }, position: { ...next.position, y: clamp(next.position.y, 24, height - next.height - BOTTOM_MARGIN) } }
    return limitWordSpeed(next)
  })
}
