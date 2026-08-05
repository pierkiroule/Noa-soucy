import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('final module only renders decorative moving petals', async () => {
  const surface = await readFile(new URL('../components/floating-words/FloatingWordsSurface.tsx', import.meta.url), 'utf8')
  assert.equal(surface.includes('<video'), false)
  assert.equal(surface.includes('ResourcePhrase'), false)
  assert.equal(surface.includes('detectWordCollision'), false)
  assert.equal(surface.includes('onPointerDown'), false)
})
