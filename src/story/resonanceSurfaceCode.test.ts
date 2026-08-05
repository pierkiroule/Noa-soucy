import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('resonance surface bubbles do not render video elements', async () => {
  const bubbleComponent = await readFile(new URL('../components/resonance-surface/VideoBubble.tsx', import.meta.url), 'utf8')
  const resonanceStyles = await readFile(new URL('../index.css', import.meta.url), 'utf8')
  assert.equal(bubbleComponent.includes('<video'), false)
  assert.equal(resonanceStyles.includes('resonance-bubble video'), false)
})
