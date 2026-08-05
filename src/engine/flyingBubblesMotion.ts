import type { FlyingBubbleState, Vec2 } from '../types/flyingBubbles.ts'

export const FLYING_BUBBLE_COUNT = 14
export const MAX_BUBBLE_SPEED = 0.16
const BOTTOM_MARGIN = 88

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const hash = (value: string) => [...value].reduce((total, char) => total + char.charCodeAt(0), 0)
const length = (vector: Vec2) => Math.hypot(vector.x, vector.y) || 1

export function limitBubbleSpeed(bubble: FlyingBubbleState, max = MAX_BUBBLE_SPEED): FlyingBubbleState {
  const speed = length(bubble.velocity)
  return speed <= max ? bubble : { ...bubble, velocity: { x: bubble.velocity.x / speed * max, y: bubble.velocity.y / speed * max } }
}

export function initializeFlyingBubbles(width: number, height: number, seed = String(Date.now()), count = FLYING_BUBBLE_COUNT): FlyingBubbleState[] {
  return Array.from({ length: count }, (_, index) => {
    const id = `bubble-${index}`
    const radius = 18 + (hash(`${seed}:r:${index}`) % 28)
    const column = (index % 4) + 1
    const row = Math.floor(index / 4) + 1
    const vx = ((hash(`${seed}:x:${index}`) % 71) - 35) / 900
    const vy = ((hash(`${seed}:y:${index}`) % 61) - 30) / 980
    return {
      id,
      position: { x: column * width / 5 - radius, y: row * height / 5 - radius },
      velocity: { x: vx || 0.025, y: vy || -0.022 },
      radius,
      rotation: (hash(`${seed}:angle:${index}`) % 628) / 100,
      rotationSpeed: ((hash(`${seed}:spin:${index}`) % 31) - 15) / 8000,
      opacity: 0.42 + (hash(`${seed}:opacity:${index}`) % 28) / 100,
    }
  })
}

export function stepFlyingBubbles(bubbles: FlyingBubbleState[], deltaTime: number, width: number, height: number, now: number): FlyingBubbleState[] {
  return bubbles.map(bubble => {
    const lift = Math.sin(now * 0.0005 + hash(bubble.id)) * 0.006 * deltaTime
    let next = {
      ...bubble,
      position: { x: bubble.position.x + bubble.velocity.x * deltaTime, y: bubble.position.y + bubble.velocity.y * deltaTime + lift },
      rotation: bubble.rotation + bubble.rotationSpeed * deltaTime,
    }
    const diameter = next.radius * 2
    if (next.position.x < 10 || next.position.x > width - diameter - 10) next = { ...next, velocity: { ...next.velocity, x: next.velocity.x * -0.82 }, position: { ...next.position, x: clamp(next.position.x, 10, width - diameter - 10) } }
    if (next.position.y < 18 || next.position.y > height - diameter - BOTTOM_MARGIN) next = { ...next, velocity: { ...next.velocity, y: next.velocity.y * -0.82 }, position: { ...next.position, y: clamp(next.position.y, 18, height - diameter - BOTTOM_MARGIN) } }
    return limitBubbleSpeed(next)
  })
}
