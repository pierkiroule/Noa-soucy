import test from 'node:test'; import assert from 'node:assert/strict'; import { loadStoryState, saveStoryState } from './storyStorage.ts'; import type { StoryDefinition } from '../types/story.ts'
const values=new Map<string,string>(); Object.defineProperty(globalThis,'localStorage',{value:{getItem:(k:string)=>values.get(k)??null,setItem:(k:string,v:string)=>values.set(k,v),removeItem:(k:string)=>values.delete(k)}})
const story={metadata:{id:'s',title:'S',subtitle:'',version:1},storyboard:[{type:'act',module:'a'}]} as StoryDefinition
test('reprise locale',()=>{saveStoryState(story,{currentBlockIndex:0,responses:{c:['x']},completed:false});assert.deepEqual(loadStoryState(story)?.responses,{c:['x']})})
test('version incompatible',()=>assert.equal(loadStoryState({...story,metadata:{...story.metadata,version:2}}),null))
