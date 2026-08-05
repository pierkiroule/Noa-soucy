import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import type { StoryDocument } from './storyData.ts'

const story = JSON.parse(await readFile(new URL('../../public/story/story.json', import.meta.url), 'utf8')) as StoryDocument

test('story.json is the single complete narrative source', () => {
  assert.equal(story.version, 4)
  assert.equal(story.blocks.filter(block => block.type === 'act').length, 5)
  assert.equal(story.blocks.filter(block => block.type === 'question').length, 3)
  assert.equal(story.blocks.filter(block => block.type === 'question').flatMap(block => block.choices).length, 9)
})

test('story video follows the fixed 1 to 14 mapping with one continuous soundtrack', () => {
  const media = story.blocks.flatMap(block => block.type === 'question' ? block.choices.map(choice => choice.resonance.media) : block.type === 'resonances' ? [] : [block.media])
  const numbers = new Set(media.map(item => Number(item.video.replace('.mp4', ''))))
  assert.deepEqual([...numbers].sort((a, b) => a - b), Array.from({ length: 14 }, (_, index) => index + 1))
  assert.ok(media.every(item => item.music === 'Fond2.mp3'))
})

test('prologue and epilogue reuse the requested act media', () => {
  const prologue = story.blocks.find(block => block.type === 'prologue')
  const epilogue = story.blocks.find(block => block.type === 'epilogue')
  assert.ok(prologue?.type === 'prologue')
  assert.ok(epilogue?.type === 'epilogue')
  assert.deepEqual(prologue.media, { video: '1.mp4', music: 'Fond2.mp3' })
  assert.deepEqual(epilogue.media, { video: '14.mp4', music: 'Fond2.mp3' })
})


test('story keeps metaphoric resonances optional after the epilogue', () => {
  const epilogueIndex = story.blocks.findIndex(block => block.type === 'epilogue')
  assert.ok(epilogueIndex >= 0)
  assert.deepEqual(story.blocks[epilogueIndex + 1], {
    id: 'metaphoric-resonances',
    type: 'resonances',
    module: 'metaphoric-resonances',
    title: 'Résonances métaphoriques',
    enabled: true,
    optional: true
  })
  assert.equal(story.resonances?.['metaphoric-resonances']?.optional, true)
})
