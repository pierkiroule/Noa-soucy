export interface AudioReactiveValues { level: number; low: number; mid: number; high: number }
export const RESTING_AUDIO_VALUES: AudioReactiveValues = { level: 0.12, low: 0.1, mid: 0.08, high: 0.05 }

export class ResonanceAudioAnalyzer {
  private context?: AudioContext
  private analyser?: AnalyserNode
  private data?: Uint8Array<ArrayBuffer>

  connect(audio: HTMLAudioElement): void {
    const AudioContextClass = window.AudioContext
    if (!AudioContextClass) return
    try {
      this.context = new AudioContextClass()
      this.analyser = this.context.createAnalyser()
      this.analyser.fftSize = 256
      this.data = new Uint8Array(this.analyser.frequencyBinCount)
      const source = this.context.createMediaElementSource(audio)
      source.connect(this.analyser); this.analyser.connect(this.context.destination)
    } catch (error) { console.warn('Analyse audio indisponible.', error) }
  }

  async resume(): Promise<void> { await this.context?.resume().catch(() => undefined) }
  read(): AudioReactiveValues {
    if (!this.analyser || !this.data) return RESTING_AUDIO_VALUES
    this.analyser.getByteFrequencyData(this.data)
    const average = (start: number, end: number) => this.data!.slice(start, end).reduce((sum, value) => sum + value, 0) / Math.max(1, end - start) / 255
    return { level: average(0, this.data.length), low: average(0, 12), mid: average(12, 48), high: average(48, this.data.length) }
  }
  close(): void { void this.context?.close(); this.context = undefined }
}
