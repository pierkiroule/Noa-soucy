import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('floating words final guide has no video or previous guide code path', async () => {
  const surface = await readFile(new URL('../components/floating-words/FloatingWordsSurface.tsx', import.meta.url), 'utf8')
  const player = await readFile(new URL('./StoryPlayer.tsx', import.meta.url), 'utf8')
  assert.equal(surface.includes('<video'), false)
  assert.equal(player.includes('resonance' + '-surface'), false)
})
