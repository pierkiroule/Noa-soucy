import type { FloatingWordId } from '../data/floatingWords.ts'

export interface Vec2 { x: number; y: number }
export interface WordPetalState { id: FloatingWordId; label: string; position: Vec2; velocity: Vec2; rotation: number; rotationSpeed: number; width: number; height: number; cooldownUntil: number; isInCollision: boolean }
