import test from 'node:test';import assert from 'node:assert/strict';import { resolveSceneMedia } from './MediaResolver.ts';import { naoSouciStory } from './naoSouciStory.ts';import type { StoryScene } from './types.ts'
const scene=naoSouciStory.steps[0] as StoryScene
test('uses placeholder when MP4 is absent',async()=>assert.equal((await resolveSceneMedia(scene,async()=>false)).kind,'placeholder'))
test('uses video when probe succeeds',async()=>assert.equal((await resolveSceneMedia(scene,async()=>true)).kind,'video'))
test('survives a rejected media probe',async()=>assert.equal((await resolveSceneMedia(scene,async()=>{throw new Error('offline')})).kind,'placeholder'))
