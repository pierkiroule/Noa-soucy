const DEFAULT_VOLUME = .22
const FADE_INTERVAL_MS = 50

export class LoopAudioPlayer {
  private audio?: HTMLAudioElement
  private fadeTimer?: ReturnType<typeof setInterval>
  private muted = false
  private paused = false
  private generation = 0
  private readonly targetVolume: number

  constructor(targetVolume = DEFAULT_VOLUME) { this.targetVolume = targetVolume }

  async load(source?: string) {
    await this.stop()
    if (!source) return false
    const generation = ++this.generation
    const audio = new Audio(source)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    audio.addEventListener('error', () => console.warn(`Musique indisponible : ${source}`), { once: true })
    this.audio = audio
    if (this.muted || this.paused) return true
    try {
      await audio.play()
      if (generation === this.generation) this.fadeTo(this.targetVolume, 1400)
      return true
    } catch {
      console.warn(`Lecture musicale en attente d’une interaction : ${source}`)
      return false
    }
  }

  pause() {
    this.paused = true
    this.fadeTo(0, 350, () => this.audio?.pause())
  }

  async resume() {
    this.paused = false
    if (!this.audio || this.muted) return
    try { await this.audio.play(); this.fadeTo(this.targetVolume, 500) }
    catch { console.warn('La reprise de la musique a été bloquée par le navigateur.') }
  }

  setMuted(muted: boolean) {
    this.muted = muted
    if (muted) this.fadeTo(0, 250, () => this.audio?.pause())
    else void this.resume()
  }

  async stop() {
    this.generation++
    const audio = this.audio
    this.audio = undefined
    this.clearFade()
    if (!audio) return
    const start = audio.volume
    await new Promise<void>(resolve => {
      const started = performance.now()
      const tick = () => {
        const progress = Math.min(1, (performance.now() - started) / 500)
        audio.volume = Math.max(0, start * (1 - progress))
        if (progress < 1) requestAnimationFrame(tick)
        else { audio.pause(); audio.removeAttribute('src'); audio.load(); resolve() }
      }
      requestAnimationFrame(tick)
    })
  }

  private fadeTo(target: number, duration: number, done?: () => void) {
    this.clearFade()
    const audio = this.audio
    if (!audio) return
    const start = audio.volume
    const steps = Math.max(1, Math.ceil(duration / FADE_INTERVAL_MS))
    let step = 0
    this.fadeTimer = setInterval(() => {
      step++
      audio.volume = Math.max(0, Math.min(1, start + (target - start) * (step / steps)))
      if (step >= steps) { this.clearFade(); done?.() }
    }, FADE_INTERVAL_MS)
  }

  private clearFade() {
    if (this.fadeTimer) clearInterval(this.fadeTimer)
    this.fadeTimer = undefined
  }
}

export const loopAudioPlayer = new LoopAudioPlayer()
