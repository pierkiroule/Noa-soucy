import type { MediaConfig } from '../types/story'

export interface ActAudioVolumes { voice: number; music: number; ambience: number }
const DEFAULT_VOLUMES: ActAudioVolumes = { voice: 1, music: 0.22, ambience: 0.28 }

export class ActAudioEngine {
  private volumes: ActAudioVolumes
  private tracks: Partial<Record<keyof ActAudioVolumes, HTMLAudioElement>> = {}
  constructor(volumes: ActAudioVolumes = DEFAULT_VOLUMES) { this.volumes = volumes }

  load(media: MediaConfig, onVoiceEnded?: () => void): void {
    this.stop()
    for (const kind of ['voice', 'music', 'ambience'] as const) {
      const source = media[kind]
      if (!source) continue
      const audio = new Audio(`/story/${source}`)
      audio.volume = this.volumes[kind]
      audio.preload = 'metadata'
      audio.loop = kind !== 'voice'
      audio.addEventListener('error', () => console.warn(`Média audio indisponible : ${source}`), { once: true })
      if (kind === 'voice' && onVoiceEnded) audio.addEventListener('ended', onVoiceEnded, { once: true })
      this.tracks[kind] = audio
    }
  }

  async play(): Promise<void> { await Promise.all(Object.values(this.tracks).map((track) => track.play().catch(() => undefined))) }
  pause(): void { Object.values(this.tracks).forEach((track) => track.pause()) }
  restart(): void { Object.values(this.tracks).forEach((track) => { track.currentTime = 0 }); void this.play() }
  stop(): void { Object.values(this.tracks).forEach((track) => { track.pause(); track.src = '' }); this.tracks = {} }
}

export type ActMediaMode = 'cinematic' | 'voice-text' | 'text'
export function resolveActMediaMode(media?: MediaConfig, unavailable: Array<keyof MediaConfig> = []): ActMediaMode {
  const has = (key: keyof MediaConfig) => Boolean(media?.[key]) && !unavailable.includes(key)
  if (has('video')) return 'cinematic'
  if (has('voice')) return 'voice-text'
  return 'text'
}
