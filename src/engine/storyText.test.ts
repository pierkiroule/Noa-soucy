import test from 'node:test'
import assert from 'node:assert/strict'
import { getBreathCycleDuration, getBreathHoldDuration, splitTextIntoBreaths } from './storyText.ts'

test('splitTextIntoBreaths separates lines, paragraphs and future pipe separators', () => {
  assert.deepEqual(splitTextIntoBreaths('La nuit.\n\nLe ciel.\nL’eau. | Le silence.'), ['La nuit.', 'Le ciel.', 'L’eau.', 'Le silence.'])
})

test('breath hold duration follows word count and clamps its bounds', () => {
  assert.equal(getBreathHoldDuration('Un mot'), 2840)
  assert.equal(getBreathHoldDuration('mot'), 2600)
  assert.equal(getBreathHoldDuration(Array(30).fill('mot').join(' ')), 7000)
  assert.equal(getBreathCycleDuration('mot'), 4250)
})
