export type ParticleMode = 'none' | 'wind' | 'seed' | 'light' | 'water' | 'silence'
export type ParticleFamily = 'pollen' | 'droplets' | 'light-dust' | 'wind-lines'
export interface AudioReactiveValues { level:number; low:number; mid:number; high:number }
export interface ParticleContext {
  mode:ParticleMode; family:ParticleFamily|null; intensity:number; density:number; speed:number; opacity:number
  audioBand:keyof AudioReactiveValues; direction:'up'|'down'|'left'|'right'|'drift'
}
export interface ParticleFxConfig { enabled?:boolean; maxIntensity?:number; preferredMode?:ParticleMode }

export const MAX_PARTICLES = 18
export const MAX_PARTICLES_LOW_POWER = 8
export const MIN_OPACITY = .02
export const MAX_OPACITY = .12
export const MIN_SIZE = 1
export const MAX_SIZE = 4
export const clamp = (value:number, min=0, max=1) => Math.min(max, Math.max(min, value))
export const particleLimit = (density:number, lowPower=false, reducedMotion=false, silence=false) => {
  const limit = reducedMotion ? 3 : lowPower ? MAX_PARTICLES_LOW_POWER : MAX_PARTICLES
  return Math.min(silence ? 2 : limit, Math.max(0, Math.round(clamp(density) * limit)))
}
export function isInsideTextExclusionZone(x:number, y:number, rect:DOMRect) {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
}
