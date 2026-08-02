import test from 'node:test';import assert from 'node:assert/strict';import { browserMediaProbe,resolveSceneMedia } from './MediaResolver.ts';import { naoSouciStory } from './naoSouciStory.ts';import type { StoryScene } from './types.ts'
const scene=naoSouciStory.steps[0] as StoryScene
test('uses placeholder when MP4 is absent',async()=>assert.equal((await resolveSceneMedia(scene,async()=>false)).kind,'placeholder'))
test('uses video when probe succeeds',async()=>assert.equal((await resolveSceneMedia(scene,async()=>true)).kind,'video'))
test('survives a rejected media probe',async()=>assert.equal((await resolveSceneMedia(scene,async()=>{throw new Error('offline')})).kind,'placeholder'))
test('browser probe checks headers without downloading the MP4 body',async()=>{const original=globalThis.fetch;let method='';globalThis.fetch=async(_input,init)=>{method=init?.method??'';return new Response(null,{status:200,headers:{'content-type':'video/mp4','content-length':'12000'}})};try{assert.equal(await browserMediaProbe('/story/drift.mp4'),true);assert.equal(method,'HEAD')}finally{globalThis.fetch=original}})
