import { DEFAULT_VISIBLE_WORD_COUNT, floatingWords, type FloatingWordDefinition } from '../data/floatingWords.ts'
import { buildWordPairKey, resolveResourcePhrase } from '../data/resourcePhrases.ts'
import type { FloatingWordsStorage, Vec2, WordCollisionEvent, WordPetalState } from '../types/floatingWords.ts'

export const FLOATING_WORDS_STORAGE_KEY = 'nao-souci-floating-words-v1'
export const MAX_RIPPLE_INFLUENCE = 280
export const TAP_FORCE = 0.018
export const MAX_SPEED = 0.08
const MIN_PHRASE_DELAY = 2200

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
    const petalWidth = word.label.length > 11 ? 132 : 94 + (hash(word.id) % 24)
    const petalHeight = 48 + (hash(word.label) % 10)
    const column = (index % 3) + 1
    const row = Math.floor(index / 3) + 1
    return {
      id: word.id,
      label: word.label,
      position: { x: column * width / 4 - petalWidth / 2, y: row * height / 4 - petalHeight / 2 },
      velocity: reducedMotion ? { x: 0, y: 0 } : { x: ((hash(word.id) % 37) - 18) / 1000, y: ((hash(word.label) % 29) - 14) / 1000 },
      rotation: ((hash(word.id) % 19) - 9) / 20,
      rotationSpeed: reducedMotion ? 0 : (((hash(word.label) % 17) - 8) / 12000),
      width: petalWidth,
      height: petalHeight,
      cooldownUntil: 0,
      isInCollision: false,
    }
  })
}

export function stepWordPetals(petals: WordPetalState[], deltaTime: number, width: number, height: number, now: number, reducedMotion = false, damping = 1): WordPetalState[] {
  const bottomMargin = 96
  return petals.map(petal => {
    const oscillation = reducedMotion ? 0 : Math.sin(now * 0.00032 + hash(petal.id)) * 0.006 * deltaTime * damping
    let next = {
      ...petal,
      position: { x: petal.position.x + petal.velocity.x * deltaTime * damping, y: petal.position.y + petal.velocity.y * deltaTime * damping + oscillation },
      rotation: petal.rotation + petal.rotationSpeed * deltaTime * damping,
    }
    if (next.position.x < 12 || next.position.x > width - next.width - 12) next = { ...next, velocity: { ...next.velocity, x: next.velocity.x * -0.72 }, position: { ...next.position, x: clamp(next.position.x, 12, width - next.width - 12) } }
    if (next.position.y < 24 || next.position.y > height - next.height - bottomMargin) next = { ...next, velocity: { ...next.velocity, y: next.velocity.y * -0.72 }, position: { ...next.position, y: clamp(next.position.y, 24, height - next.height - bottomMargin) } }
    return limitWordSpeed({ ...next, isInCollision: next.cooldownUntil > now && next.isInCollision })
  })
}

export function applyTapImpulse(petals: WordPetalState[], tap: Vec2, reducedMotion = false): WordPetalState[] {
  if (reducedMotion) return petals
  return petals.map(petal => {
    const center = { x: petal.position.x + petal.width / 2, y: petal.position.y + petal.height / 2 }
    const dx = center.x - tap.x
    const dy = center.y - tap.y
    const distance = Math.max(Math.hypot(dx, dy), 1)
    const influence = Math.max(0, 1 - distance / MAX_RIPPLE_INFLUENCE)
    return limitWordSpeed({ ...petal, velocity: { x: petal.velocity.x + (dx / distance) * influence * TAP_FORCE, y: petal.velocity.y + (dy / distance) * influence * TAP_FORCE } })
  })
}

export function detectWordCollision(petals: WordPetalState[], now: number, phraseVisible: boolean, recentPairs: string[] = [], lastPhraseAt = 0): WordCollisionEvent | null {
  if (phraseVisible || now - lastPhraseAt < MIN_PHRASE_DELAY) return null
  for (let i = 0; i < petals.length; i += 1) for (let j = i + 1; j < petals.length; j += 1) {
    const a = petals[i], b = petals[j], key = buildWordPairKey(a.id, b.id)
    if (a.cooldownUntil > now || b.cooldownUntil > now || a.isInCollision || b.isInCollision || recentPairs.includes(key)) continue
    const ax = a.position.x + a.width / 2, ay = a.position.y + a.height / 2, bx = b.position.x + b.width / 2, by = b.position.y + b.height / 2
    if (Math.hypot(ax - bx, ay - by) < (Math.max(a.width, a.height) + Math.max(b.width, b.height)) * 0.38) return { firstId: a.id, secondId: b.id, position: { x: (ax + bx) / 2, y: (ay + by) / 2 }, phrase: resolveResourcePhrase(a.id, b.id), createdAt: now }
  }
  return null
}

export function separateWordPair(petals: WordPetalState[], event: WordCollisionEvent, now: number): WordPetalState[] {
  return petals.map(petal => event.firstId === petal.id || event.secondId === petal.id ? limitWordSpeed({ ...petal, velocity: { x: petal.velocity.x * -0.35 + (petal.id === event.firstId ? -0.026 : 0.026), y: petal.velocity.y * -0.35 }, cooldownUntil: now + 9000, isInCollision: false }) : petal)
}

export function readFloatingWordsStorage(storage: Storage = localStorage): FloatingWordsStorage {
  try {
    const parsed = JSON.parse(storage.getItem(FLOATING_WORDS_STORAGE_KEY) ?? 'null') as Partial<FloatingWordsStorage> | null
    return { discoveredPairs: Array.isArray(parsed?.discoveredPairs) ? parsed.discoveredPairs : [], discoveredPhrases: Array.isArray(parsed?.discoveredPhrases) ? parsed.discoveredPhrases : [], visitCount: Number(parsed?.visitCount) || 0, completedAt: parsed?.completedAt }
  } catch { return { discoveredPairs: [], discoveredPhrases: [], visitCount: 0 } }
}

export function writeFloatingWordsStorage(value: FloatingWordsStorage, storage: Storage = localStorage) { storage.setItem(FLOATING_WORDS_STORAGE_KEY, JSON.stringify(value)) }
