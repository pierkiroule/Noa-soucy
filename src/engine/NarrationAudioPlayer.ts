const SILENT_WAV = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQQAAAAAAACA'

export class NarrationAudioPlayer {
  private audio?: HTMLAudioElement
  private source?: string
  private muted = false
  private request = 0
  private endedListeners = new Set<() => void>()

  async unlock() {
    const audio = this.getAudio()
    if (this.source) return true
    audio.src = SILENT_WAV
    audio.volume = 0
    try { await audio.play(); audio.pause(); audio.removeAttribute('src'); audio.load(); return true }
    catch { return false }
  }

  async play(source?: string) {
    if (source === this.source) return
    const request = ++this.request
    await this.fadeOut(650, request)
    // A superseded request must never clear or pause the newer narration.
    if (request !== this.request) return
    if (!source) { this.source = undefined; return }

    const audio = this.getAudio()
    this.source = source
    audio.src = source
    audio.preload = 'auto'
    audio.volume = .82
    if (this.muted) return
    try { await audio.play() }
    catch { console.warn(`Lecture de la voix en attente : ${source}`) }
  }

  setMuted(muted: boolean) {
    this.muted = muted
    const audio = this.audio
    if (!audio) return
    if (muted) audio.pause()
    else if (this.source && !audio.ended) void audio.play().catch(() => console.warn(`Lecture de la voix en attente : ${this.source}`))
  }

  getProgress(expectedSource?: string) {
    const audio = this.audio
    if (!audio || (expectedSource && expectedSource !== this.source)) return undefined
    return { currentTime: audio.currentTime, playing: !audio.paused && !audio.ended }
  }

  onEnded(listener: () => void) {
    this.endedListeners.add(listener)
    return () => { this.endedListeners.delete(listener) }
  }

  stop() { const request = ++this.request; this.source = undefined; return this.fadeOut(650, request) }

  private getAudio() {
    if (!this.audio) {
      this.audio = new Audio()
      this.audio.addEventListener('ended', () => this.endedListeners.forEach(listener => listener()))
      this.audio.addEventListener('error', () => console.warn(`Voix indisponible : ${this.source ?? 'source inconnue'}`))
    }
    return this.audio
  }

  private async fadeOut(duration: number, request = this.request) {
    const audio = this.audio
    if (!audio || audio.paused) return
    const initialVolume = audio.volume
    const startedAt = performance.now()
    await new Promise<void>(resolve => {
      const fade = (now: number) => {
        // A newer play/stop owns the shared audio element now. Stale animation
        // frames must not alter its volume or pause it.
        if (request !== this.request) { resolve(); return }
        const progress = Math.min(1, (now - startedAt) / duration)
        audio.volume = Math.max(0, initialVolume * (1 - progress))
        if (progress < 1) requestAnimationFrame(fade)
        else { audio.pause(); resolve() }
      }
      requestAnimationFrame(fade)
    })
  }
}

export const narrationAudioPlayer = new NarrationAudioPlayer()
