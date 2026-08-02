import test from 'node:test'; import assert from 'node:assert/strict'
import { goToNextBlock, goToPreviousBlock, recordChoice, resolveActContent, restartStory } from './storyEngine.ts'; import type { StoryDefinition, TextActModule } from '../types/story.ts'
const act:TextActModule={id:'a',title:'A',text:'base'}
const story={storyboard:[{type:'act',module:'a'},{type:'pause',module:'p'},{type:'ending',module:'e'}]} as StoryDefinition
test('acte sans variante',()=>assert.equal(resolveActContent(act,{}).text,'base'))
test('variante correspondante, défaut et absence de réponse',()=>{const varied:TextActModule={id:'a',title:'A',variants:[{id:'match',text:'oui',when:{choiceId:'c',includes:['x']}},{id:'default',text:'défaut',isDefault:true}]};assert.equal(resolveActContent(varied,{c:['x']}).variantId,'match');assert.equal(resolveActContent(varied,{}).variantId,'default')})
test('choix unique et choix ignoré',()=>{assert.deepEqual(recordChoice(restartStory(),'c',['x','y']).responses.c,['x']);assert.deepEqual(recordChoice(restartStory(),'c',[]).responses.c,[])})
test('navigation suit tout storyboard intermédiaire',()=>{let state=goToNextBlock(story,restartStory());assert.equal(state.currentBlockIndex,1);state=goToNextBlock(story,state);assert.equal(state.currentBlockIndex,2);assert.equal(state.completed,true);assert.equal(goToPreviousBlock(state).currentBlockIndex,1)})
test('redémarrage',()=>assert.deepEqual(restartStory(),{currentBlockIndex:0,responses:{},completed:false}))
