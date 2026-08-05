import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('final module renders only flying bubbles', async () => {
  const surface = await readFile(new URL('../components/flying-bubbles/FlyingBubblesSurface.tsx', import.meta.url), 'utf8')
  const player = await readFile(new URL('./StoryPlayer.tsx', import.meta.url), 'utf8')
  assert.equal(surface.includes('<video'), false)
  assert.equal(surface.includes('WordPetal'), false)
  assert.equal(player.includes('floating-words'), false)
})
