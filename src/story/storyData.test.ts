import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { getNextMedia, loadStory, storyVoiceUrl, type StoryDocument } from './storyData.ts'

const story = JSON.parse(await readFile(new URL('../../public/story/story.json', import.meta.url), 'utf8')) as StoryDocument

test('story.json is the single complete narrative source', () => {
  assert.equal(story.version, 4)
  assert.equal(story.blocks.filter(block => block.type === 'act').length, 5)
  assert.equal(story.blocks.filter(block => block.type === 'question').length, 3)
  assert.equal(story.blocks.filter(block => block.type === 'question').flatMap(block => block.choices).length, 9)
})

test('story video follows the fixed 1 to 14 mapping with one continuous soundtrack', () => {
  const media = story.blocks.flatMap(block => block.type === 'question' ? block.choices.map(choice => choice.resonance.media) : block.type === 'metaphorical-resonances' ? [] : [block.media])
  const numbers = new Set(media.map(item => Number(item.video.replace('.mp4', ''))))
  assert.deepEqual([...numbers].sort((a, b) => a - b), Array.from({ length: 14 }, (_, index) => index + 1))
  assert.ok(media.every(item => item.music === 'Fond2.mp3'))
})

test('prologue and epilogue reuse the requested act media', () => {
  const prologue = story.blocks.find(block => block.type === 'prologue')
  const epilogue = story.blocks.find(block => block.type === 'epilogue')
  assert.ok(prologue?.type === 'prologue')
  assert.ok(epilogue?.type === 'epilogue')
  assert.deepEqual(prologue.media, { video: '1.mp4', music: 'Fond2.mp3', voice: 'Voc1.mp3' })
  assert.deepEqual(epilogue.media, { video: '14.mp4', music: 'Fond2.mp3', voice: 'Voc7.mp3' })
})

test('available voices are assigned only to their narrated chapters', () => {
  const voicedBlocks = story.blocks.flatMap(block => block.type === 'question' || block.type === 'metaphorical-resonances' || !block.media.voice ? [] : [{ id: block.id, voice: block.media.voice }])
  assert.deepEqual(voicedBlocks, [
    { id: 'prologue', voice: 'Voc1.mp3' },
    { id: 'act-01', voice: 'Voc2.mp3' },
    { id: 'act-02', voice: 'Voc3.mp3' },
    { id: 'act-03', voice: 'Voc4.mp3' },
    { id: 'act-04', voice: 'Voc5.mp3' },
    { id: 'act-05', voice: 'Voc6.mp3' },
    { id: 'epilogue', voice: 'Voc7.mp3' },
  ])
  assert.ok(story.blocks.filter(block => block.type === 'question').flatMap(block => block.choices).every(choice => !choice.resonance.media.voice))
})

test('story loading bypasses stale cached voice mappings', async () => {
  const originalFetch = globalThis.fetch
  let requestedUrl: string | URL | Request | undefined
  let requestedOptions: RequestInit | undefined
  globalThis.fetch = async (url, options) => {
    requestedUrl = url
    requestedOptions = options
    return new Response(JSON.stringify(story), { status: 200 })
  }

  try {
    await loadStory()
    assert.equal(requestedUrl, '/story/story.json?audio=Voc7')
    assert.equal(requestedOptions?.cache, 'no-store')
  } finally {
    globalThis.fetch = originalFetch
  }
})

test('voice URLs bypass cached missing audio responses', () => {
  assert.equal(storyVoiceUrl('Voc7.mp3'), '/story/Voc7.mp3?audio=Voc7')
})


test('story keeps metaphorical resonances optional after the epilogue', () => {
  const epilogueIndex = story.blocks.findIndex(block => block.type === 'epilogue')
  assert.ok(epilogueIndex >= 0)
  assert.deepEqual(story.blocks[epilogueIndex + 1], {
    id: 'metaphorical-resonances-main',
    type: 'metaphorical-resonances',
    module: 'metaphorical-resonances-main',
    title: 'Boussole métaphorique',
    enabled: true,
    optional: true
  })
  assert.equal(story.metaphoricalResonances?.['metaphorical-resonances-main']?.optional, true)
})


test('metaphorical resonances block is optional and ignored for media preloading', () => {
  const epilogueIndex = story.blocks.findIndex(block => block.type === 'epilogue')
  assert.equal(getNextMedia(story.blocks, epilogueIndex), undefined)
})
