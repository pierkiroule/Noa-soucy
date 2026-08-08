import assert from 'node:assert/strict'
import test from 'node:test'
import { isStoryRoute } from './storyRoute.ts'

test('le conte est ouvert directement par la route NFC', () => {
  assert.equal(isStoryRoute('/n'), true)
  assert.equal(isStoryRoute('/n/'), true)
})

test('les autres routes ne sont pas des routes du conte', () => {
  assert.equal(isStoryRoute('/'), false)
  assert.equal(isStoryRoute('/n/ancienne-noix'), false)
  assert.equal(isStoryRoute('/ailleurs'), false)
})
