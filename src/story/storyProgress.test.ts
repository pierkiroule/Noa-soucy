import assert from 'node:assert/strict'
import test from 'node:test'
import { initialStoryProgress, parseStoryProgress } from './storyProgress.ts'

test('rejects obsolete and malformed story progress', () => {
  assert.deepEqual(parseStoryProgress('{bad json'), initialStoryProgress)
  assert.deepEqual(parseStoryProgress(JSON.stringify({ version: 3, currentBlockIndex: 8 })), initialStoryProgress)
})

test('sanitizes every value restored from story progress', () => {
  const progress = parseStoryProgress(JSON.stringify({
    version: 4,
    currentBlockIndex: -2,
    currentBreathIndex: '12',
    isMuted: 'yes',
    selectedChoices: { question: 'choice', malformed: 42 },
    activeResonanceId: false,
    completed: 1,
  }))

  assert.deepEqual(progress, { ...initialStoryProgress, selectedChoices: { question: 'choice' } })
})
