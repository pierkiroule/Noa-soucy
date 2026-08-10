import assert from 'node:assert/strict'
import test from 'node:test'
import { NarrationAudioPlayer } from './NarrationAudioPlayer.ts'

class FakeAudio {
  src = ''
  preload = ''
  volume = 1
  paused = true
  ended = false
  duration = 120
  currentTime = 10
  play() { this.paused = false; return Promise.resolve() }
  pause() { this.paused = true }
  load() {}
  removeAttribute() {}
  addEventListener() {}
}

test('a stale fade cannot clear the source owned by a newer request', async () => {
  const originalAudio = globalThis.Audio
  const originalRaf = globalThis.requestAnimationFrame
  const frames: FrameRequestCallback[] = []
  globalThis.Audio = FakeAudio as unknown as typeof Audio
  globalThis.requestAnimationFrame = callback => { frames.push(callback); return frames.length }

  try {
    const player = new NarrationAudioPlayer()
    await player.play('first.mp3')
    const stalePlay = player.play('stale.mp3')
    player.setMuted(true)
    await player.play('current.mp3')

    let now = performance.now()
    while (frames.length) {
      frames.shift()!(now += 100)
      await Promise.resolve()
    }
    await stalePlay

    assert.equal(player.getProgress('current.mp3')?.currentTime, 10)
    assert.equal(player.getProgress('stale.mp3'), undefined)
  } finally {
    globalThis.Audio = originalAudio
    globalThis.requestAnimationFrame = originalRaf
  }
})
