export interface ResonanceSceneStyle { color: string; accent: string; form: 'point' | 'leaf' | 'line' | 'halo' | 'drops' | 'curves' | 'horizon' | 'flower' | 'waves' }
export const resonanceSceneRegistry: Record<string, ResonanceSceneStyle> = {
  seed: { color: '#4f4939', accent: '#80916d', form: 'point' },
  leaf: { color: '#899875', accent: '#b7a67c', form: 'leaf' },
  twig: { color: '#765b42', accent: '#b9a58b', form: 'line' },
  light: { color: '#e4a64c', accent: '#fff1c8', form: 'halo' },
  rain: { color: '#668ba0', accent: '#b9d5dc', form: 'drops' },
  wind: { color: '#849aa2', accent: '#d6dedc', form: 'curves' },
  horizon: { color: '#597789', accent: '#efc58d', form: 'horizon' },
  flower: { color: '#c8753b', accent: '#f0b45f', form: 'flower' },
  ocean: { color: '#385f79', accent: '#8eb2bf', form: 'waves' },
}
export const getResonanceScene = (sceneId?: string) => resonanceSceneRegistry[sceneId ?? ''] ?? resonanceSceneRegistry.ocean

export function supportsWebGL(canvas: HTMLCanvasElement): boolean {
  try { return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')) } catch { return false }
}
