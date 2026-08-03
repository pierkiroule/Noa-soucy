import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolveActMediaMode } from './ActAudioEngine.ts'
import { RESTING_AUDIO_VALUES, ResonanceAudioAnalyzer } from './ResonanceAudioAnalyzer.ts'
import { goToNextBlock, goToPreviousBlock, recordChoice, resolveActContent, resolveResonance, restartStory } from './storyEngine.ts'
import { getResonanceScene, supportsWebGL } from '../three/resonanceSceneRegistry.ts'
import type { StoryDefinition } from '../types/story.ts'

const story = {
  metadata: { id: 's', title: 'S', subtitle: '', version: 1 },
  acts: { a: { id: 'a', title: 'A', text: 'commun', narrator: 'sailor' } },
  choices: { c: { id: 'c', question: '?', maxChoices: 1, options: [{ id: 'x', label: 'X', resonanceId: 'r' }] } },
  resonances: { r: { id: 'r', text: 'résonance', narrator: 'inner-voice', sourceChoiceId: 'c', sourceOptionId: 'x', three: { sceneId: 'seed', audioReactive: true } } },
  endings: { e: { id: 'e', title: 'E', text: 'fin', narrator: 'sailor' } },
  storyboard: [{ type: 'act', module: 'a' }, { type: 'choice', module: 'c' }, { type: 'resonance', fromChoice: 'c' }, { type: 'ending', module: 'e' }],
} as StoryDefinition

test('les actes sont communs et sans variante', () => assert.deepEqual(resolveActContent(story.acts.a), { title: 'A', text: 'commun' }))
test('résout une résonance sélectionnée', () => assert.equal(resolveResonance(story, { c: ['x'] }, 'c')?.id, 'r'))
test('ignore une résonance sans réponse', () => assert.equal(resolveResonance(story, {}, 'c'), null))
test('enregistre un choix unique et permet de le changer', () => { const first = recordChoice(restartStory(), 'c', ['x', 'y']); assert.deepEqual(first.responses.c, ['x']); assert.deepEqual(recordChoice(first, 'c', ['y']).responses.c, ['y']) })
test('saute une résonance ignorée et termine', () => { let state = goToNextBlock(story, restartStory()); assert.equal(state.currentBlockIndex, 1); state = goToNextBlock(story, state); assert.equal(state.currentBlockIndex, 3); assert.equal(state.completed, true) })
test('visite une résonance choisie', () => { const chosen = recordChoice({ ...restartStory(), currentBlockIndex: 1 }, 'c', ['x']); assert.equal(goToNextBlock(story, chosen).currentBlockIndex, 2) })
test('revient en arrière et redémarre', () => { assert.equal(goToPreviousBlock({ currentBlockIndex: 2, responses: {}, completed: true }).currentBlockIndex, 1); assert.deepEqual(restartStory(), { currentBlockIndex: 0, responses: {}, completed: false }) })
test('fallback média vidéo, voix puis texte', () => { const media = { video: 'v.mp4', voice: 'v.mp3' }; assert.equal(resolveActMediaMode(media), 'cinematic'); assert.equal(resolveActMediaMode(media, ['video']), 'voice-text'); assert.equal(resolveActMediaMode(media, ['video', 'voice']), 'text'); assert.equal(resolveActMediaMode(), 'text') })
test('fallback audio procédural sans contexte', () => { const analyzer = new ResonanceAudioAnalyzer(); assert.deepEqual(analyzer.read(), RESTING_AUDIO_VALUES) })
test('fallback WebGL ne lève pas erreur', () => { const canvas = { getContext: () => null } as unknown as HTMLCanvasElement; assert.equal(supportsWebGL(canvas), false) })


test('résout les neuf résonances de la partition', () => {
  const completeStory = JSON.parse(readFileSync('public/story/story.json', 'utf8')) as StoryDefinition
  let count = 0
  for (const [choiceId, choice] of Object.entries(completeStory.choices)) {
    for (const option of choice.options) {
      assert.equal(resolveResonance(completeStory, { [choiceId]: [option.id] }, choiceId)?.id, option.resonanceId)
      count++
    }
  }
  assert.equal(count, 9)
})

test('une résonance sans configuration de scène reçoit un fallback', () => assert.equal(getResonanceScene(undefined).form, 'waves'))

test('les trois vidéos bêta référencées existent', () => {
  const completeStory = JSON.parse(readFileSync('public/story/story.json', 'utf8')) as StoryDefinition
  const videos = Object.values(completeStory.acts).flatMap((act) => act.media?.video ? [act.media.video] : [])
  assert.deepEqual(videos, ['drift.mp4', 'growth.mp4', 'navigation.mp4'])
  for (const video of videos) assert.ok(readFileSync(`public/story/${video}`).byteLength > 1_000_000)
})
