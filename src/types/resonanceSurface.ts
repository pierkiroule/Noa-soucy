import type { ResonanceBubbleId } from '../data/resonanceBubbles.ts'

export interface Vec2 { x: number; y: number }
export interface BubbleState { id: ResonanceBubbleId; position: Vec2; velocity: Vec2; radius: number; rotation: number; rotationSpeed: number; isColliding: boolean; cooldownUntil: number }
export interface RippleState { id: string; origin: Vec2; radius: number; opacity: number; createdAt: number }
export interface CollisionEvent { firstId: ResonanceBubbleId; secondId: ResonanceBubbleId; position: Vec2; createdAt: number }
export interface ResonanceSurfaceStorage { discoveredPairs: string[]; discoveredTexts: string[]; visitCount: number; completedAt?: string }
