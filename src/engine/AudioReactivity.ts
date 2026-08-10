export type AudioChannel = 'music' | 'voice'

export interface AudioLevels { music:number; voice:number; energy:number }

/** A shared, deliberately gentle Web Audio meter for decorative motion. */
class AudioReactivity {
  private context?: AudioContext
  private analysers: Partial<Record<AudioChannel, AnalyserNode>> = {}
  private data: Partial<Record<AudioChannel, Uint8Array<ArrayBuffer>>> = {}
  private connected = new WeakSet<HTMLMediaElement>()
  private smoothed: AudioLevels = { music: 0, voice: 0, energy: 0 }

  attach(media: HTMLMediaElement, channel: AudioChannel) {
    if (this.connected.has(media) || typeof AudioContext === 'undefined') return
    try {
      const context = this.context ??= new AudioContext()
      const analyser = context.createAnalyser()
      analyser.fftSize = 128
      analyser.smoothingTimeConstant = .88
      const source = context.createMediaElementSource(media)
      source.connect(analyser)
      analyser.connect(context.destination)
      this.analysers[channel] = analyser
      this.data[channel] = new Uint8Array(analyser.frequencyBinCount)
      this.connected.add(media)
    } catch (error) {
      console.warn('Réactivité audio indisponible', error)
    }
  }

  async resume() {
    if (this.context?.state === 'suspended') await this.context.resume()
  }

  sample(): AudioLevels {
    const music = this.read('music')
    const voice = this.read('voice')
    const target = Math.min(1, music * .7 + voice * 1.15)
    // Slow attack and an even softer release prevent nervous, mechanical motion.
    const ease = target > this.smoothed.energy ? .12 : .045
    this.smoothed = {
      music: this.smoothed.music + (music - this.smoothed.music) * .08,
      voice: this.smoothed.voice + (voice - this.smoothed.voice) * .1,
      energy: this.smoothed.energy + (target - this.smoothed.energy) * ease,
    }
    return this.smoothed
  }

  private read(channel: AudioChannel) {
    const analyser = this.analysers[channel]
    const values = this.data[channel]
    if (!analyser || !values) return 0
    analyser.getByteFrequencyData(values)
    let weighted = 0
    const end = Math.max(1, Math.floor(values.length * .72))
    for (let index = 1; index < end; index++) weighted += values[index] * (1 - index / values.length * .35)
    return Math.min(1, weighted / end / 150)
  }
}

export const audioReactivity = new AudioReactivity()
