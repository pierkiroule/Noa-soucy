import type { FloatingWordId } from '../data/floatingWords.ts'

export interface Vec2 { x: number; y: number }
export interface WordPetalState { id: FloatingWordId; label: string; position: Vec2; velocity: Vec2; rotation: number; rotationSpeed: number; width: number; height: number; cooldownUntil: number; isInCollision: boolean }
export interface RippleState { id: string; origin: Vec2; createdAt: number }
export interface WordCollisionEvent { firstId: FloatingWordId; secondId: FloatingWordId; position: Vec2; phrase: string; createdAt: number }
export interface FloatingWordsStorage { discoveredPairs: string[]; discoveredPhrases: string[]; visitCount: number; completedAt?: string }
