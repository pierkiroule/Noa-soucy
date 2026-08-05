export type ResonanceBubbleId = 'seed' | 'leaf' | 'twig' | 'light' | 'rain' | 'wind' | 'horizon' | 'flower' | 'waves'

export interface ResonanceBubbleDefinition {
  id: ResonanceBubbleId
  label: string
  videoSrc: string
  posterSrc?: string | null
}

export const resonanceBubbles: ResonanceBubbleDefinition[] = [
  { id: 'seed', label: 'La graine', videoSrc: '/story/3.mp4' },
  { id: 'leaf', label: 'La feuille', videoSrc: '/story/4.mp4' },
  { id: 'twig', label: 'La brindille', videoSrc: '/story/5.mp4' },
  { id: 'light', label: 'La lumière', videoSrc: '/story/7.mp4' },
  { id: 'rain', label: 'La pluie', videoSrc: '/story/8.mp4' },
  { id: 'wind', label: 'Le vent', videoSrc: '/story/9.mp4' },
  { id: 'horizon', label: 'L’horizon', videoSrc: '/story/11.mp4' },
  { id: 'flower', label: 'La fleur', videoSrc: '/story/12.mp4' },
  { id: 'waves', label: 'Les vagues', videoSrc: '/story/13.mp4' },
]

export const RESONANCE_SURFACE_MAX_VISIBLE_BUBBLES = 6
