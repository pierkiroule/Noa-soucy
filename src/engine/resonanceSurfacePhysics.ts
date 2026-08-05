import { RESONANCE_SURFACE_MAX_VISIBLE_BUBBLES, resonanceBubbles, type ResonanceBubbleDefinition } from '../data/resonanceBubbles.ts'
import { buildPairKey } from '../data/resonancePairs.ts'
import type { BubbleState, CollisionEvent, ResonanceSurfaceStorage, Vec2 } from '../types/resonanceSurface.ts'

export const RESONANCE_SURFACE_STORAGE_KEY = 'nao-souci-resonance-surface-v1'
const maxSpeed = 0.24
const minCollisionDelay = 2200

const hash = (value: string) => [...value].reduce((total, char) => total + char.charCodeAt(0), 0)
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const length = (vector: Vec2) => Math.hypot(vector.x, vector.y) || 1

export function selectVisibleBubbles(seed = 'nao-souci', max = RESONANCE_SURFACE_MAX_VISIBLE_BUBBLES): ResonanceBubbleDefinition[] {
  const offset = hash(seed) % resonanceBubbles.length
  return Array.from({ length: Math.min(max, resonanceBubbles.length) }, (_, index) => resonanceBubbles[(offset + index) % resonanceBubbles.length])
}

export function limitVelocity(bubble: BubbleState, limit = maxSpeed): BubbleState {
  const speed = length(bubble.velocity)
  return speed <= limit ? bubble : { ...bubble, velocity: { x: bubble.velocity.x / speed * limit, y: bubble.velocity.y / speed * limit } }
}

export function initializeBubbles(width: number, height: number, reducedMotion = false, seed = 'nao-souci'): BubbleState[] {
  return selectVisibleBubbles(seed).map((definition, index) => {
    const radius = reducedMotion ? 54 : 45 + (hash(definition.id) % 26)
    const column = (index % 3) + 1
    const row = Math.floor(index / 3) + 1
    return {
      id: definition.id,
      position: { x: column * width / 4 - radius, y: row * height / 3 - radius },
      velocity: reducedMotion ? { x: 0, y: 0 } : { x: ((hash(definition.id) % 17) - 8) / 100, y: ((hash(definition.label) % 13) - 6) / 100 },
      radius,
      rotation: index * 0.18,
      rotationSpeed: reducedMotion ? 0 : (((hash(definition.videoSrc) % 9) - 4) / 10000),
      isColliding: false,
      cooldownUntil: 0,
    }
  })
}

export function stepBubbles(bubbles: BubbleState[], deltaTime: number, width: number, height: number, now: number, reducedMotion = false, interactionDamping = 1): BubbleState[] {
  const drift = reducedMotion ? 0 : interactionDamping
  return bubbles.map(bubble => {
    const floatOffset = reducedMotion ? 0 : Math.sin(now * 0.00024 + hash(bubble.id)) * 0.018 * deltaTime * interactionDamping
    let next = { ...bubble, position: { x: bubble.position.x + bubble.velocity.x * deltaTime * drift, y: bubble.position.y + bubble.velocity.y * deltaTime * drift + floatOffset }, rotation: bubble.rotation + bubble.rotationSpeed * deltaTime * interactionDamping }
    if (next.position.x < 0 || next.position.x > width - next.radius * 2) next = { ...next, velocity: { ...next.velocity, x: next.velocity.x * -0.75 }, position: { ...next.position, x: clamp(next.position.x, 0, width - next.radius * 2) } }
    if (next.position.y < 0 || next.position.y > height - next.radius * 2) next = { ...next, velocity: { ...next.velocity, y: next.velocity.y * -0.75 }, position: { ...next.position, y: clamp(next.position.y, 0, height - next.radius * 2) } }
    return limitVelocity({ ...next, isColliding: next.cooldownUntil > now && next.isColliding })
  })
}

export function applyRippleImpulse(bubbles: BubbleState[], tap: Vec2, reducedMotion = false, maxRadius = 360, impulse = 0.16): BubbleState[] {
  return bubbles.map(bubble => {
    const center = { x: bubble.position.x + bubble.radius, y: bubble.position.y + bubble.radius }
    const dx = center.x - tap.x
    const dy = center.y - tap.y
    const rawDistance = Math.hypot(dx, dy)
    const distance = Math.max(rawDistance, 1)
    const fallbackAngle = hash(bubble.id)
    const unit = rawDistance < 1 ? { x: Math.cos(fallbackAngle), y: Math.sin(fallbackAngle) } : { x: dx / distance, y: dy / distance }
    const strength = Math.max(0, 1 - distance / maxRadius) * (reducedMotion ? 0.25 : 1)
    return limitVelocity({ ...bubble, velocity: { x: bubble.velocity.x + unit.x * strength * impulse, y: bubble.velocity.y + unit.y * strength * impulse } })
  })
}

export function detectCollision(bubbles: BubbleState[], now: number, phraseVisible: boolean, recentPairs: string[] = [], previousCollisionAt = 0): CollisionEvent | null {
  if (phraseVisible || now - previousCollisionAt < minCollisionDelay) return null
  for (let i = 0; i < bubbles.length; i += 1) for (let j = i + 1; j < bubbles.length; j += 1) {
    const a = bubbles[i], b = bubbles[j], key = buildPairKey(a.id, b.id)
    if (a.cooldownUntil > now || b.cooldownUntil > now || a.isColliding || b.isColliding || recentPairs.includes(key)) continue
    const ax = a.position.x + a.radius, ay = a.position.y + a.radius, bx = b.position.x + b.radius, by = b.position.y + b.radius
    if (Math.hypot(ax - bx, ay - by) < a.radius + b.radius + 8) return { firstId: a.id, secondId: b.id, position: { x: (ax + bx) / 2, y: (ay + by) / 2 }, createdAt: now }
  }
  return null
}

export function separateCollidingPair(bubbles: BubbleState[], event: CollisionEvent, now: number): BubbleState[] {
  return bubbles.map(bubble => event.firstId === bubble.id || event.secondId === bubble.id ? limitVelocity({ ...bubble, velocity: { x: bubble.velocity.x * -0.45 + (bubble.id === event.firstId ? -0.06 : 0.06), y: bubble.velocity.y * -0.45 }, isColliding: false, cooldownUntil: now + 10000 }) : bubble)
}

export function readResonanceSurfaceStorage(storage: Storage = localStorage): ResonanceSurfaceStorage {
  try {
    const parsed = JSON.parse(storage.getItem(RESONANCE_SURFACE_STORAGE_KEY) ?? 'null') as Partial<ResonanceSurfaceStorage> | null
    return { discoveredPairs: Array.isArray(parsed?.discoveredPairs) ? parsed.discoveredPairs : [], discoveredTexts: Array.isArray(parsed?.discoveredTexts) ? parsed.discoveredTexts : [], visitCount: Number(parsed?.visitCount) || 0, completedAt: parsed?.completedAt }
  } catch { return { discoveredPairs: [], discoveredTexts: [], visitCount: 0 } }
}

export function writeResonanceSurfaceStorage(value: ResonanceSurfaceStorage, storage: Storage = localStorage) { storage.setItem(RESONANCE_SURFACE_STORAGE_KEY, JSON.stringify(value)) }
