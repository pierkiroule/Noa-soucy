import test from 'node:test'
import assert from 'node:assert/strict'
import { resonanceSeeds, resonanceWordTags } from '../data/resonanceSeeds.ts'
import { getPlantGrowthStage, layoutRootNetwork } from '../utils/resonanceGardenLayout.ts'
import { emptyGarden, readResonanceGarden, RESONANCE_GARDEN_STORAGE_KEY, writeResonanceGarden } from './useResonanceGarden.ts'
import type { ResonanceGardenState, ResonanceNode } from '../types/resonanceSeeds.ts'

test('the scene defines five distinct seeds', () => {
  assert.equal(resonanceSeeds.length, 5)
  assert.equal(new Set(resonanceSeeds.map(seed => seed.id)).size, 5)
})

test('the watering can offers a finite list of unique word tags', () => {
  assert.ok(resonanceWordTags.length >= 15)
  assert.equal(new Set(resonanceWordTags).size, resonanceWordTags.length)
})

test('garden state survives local storage serialization and page reload', () => {
  const state:ResonanceGardenState={plantations:{links:{seedId:'links',plantedAt:'2026-01-01',nodes:[{id:'mamie',seedId:'links',label:'Mamie',parentId:null,createdAt:'2026-01-01'}]}}}
  const memory=new Map<string,string>()
  const storage={getItem:(key:string)=>memory.get(key)??null,setItem:(key:string,value:string)=>void memory.set(key,value)}
  writeResonanceGarden(state,storage)
  assert.equal(memory.has(RESONANCE_GARDEN_STORAGE_KEY),true)
  assert.deepEqual(readResonanceGarden(storage),state)
  assert.deepEqual(readResonanceGarden({getItem:()=>'{broken'}),emptyGarden)
})

test('root layout preserves parent branches at increasing depths', () => {
  const nodes:ResonanceNode[]=[
    {id:'a',seedId:'links',label:'Mamie',parentId:null,createdAt:''},
    {id:'b',seedId:'links',label:'Calme',parentId:'a',createdAt:''},
  ]
  const layout=layoutRootNetwork(nodes)
  assert.equal(layout.length,2)
  assert.ok(layout[1].y>layout[0].y)
})

test('plant growth follows every invisible visual threshold', () => {
  assert.deepEqual([0,1,4,7,11,16].map(getPlantGrowthStage),['seed','sprout','stem','leaves','bud','flower'])
})
