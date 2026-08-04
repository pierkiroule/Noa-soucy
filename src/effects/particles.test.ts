import assert from 'node:assert/strict'
import test from 'node:test'
import { AUDIO_FALLBACK, analyseFrequencyData } from '../audio/useAudioReactiveValues.ts'
import { detectParticleMode, normalizeParticleText } from './keywordContext.ts'
import { getParticlePreset } from './particlePresets.ts'
import { clamp, MAX_PARTICLES, particleLimit } from './particleTypes.ts'
import { interpolateParticleContext, makeParticleContext } from './useParticleContext.ts'

test('detects contextual French words as complete normalized words',()=>{
  assert.equal(detectParticleMode('Le vent passait doucement'),'wind')
  assert.equal(detectParticleMode("La graine s'était entrouverte"),'seed')
  assert.equal(detectParticleMode("Une lumière venait d'apparaître"),'light')
  assert.equal(detectParticleMode('La mer et les vagues'),'water')
  assert.equal(detectParticleMode('Amer ne contient pas le mot recherché'),'none')
  assert.equal(normalizeParticleText('ÉCUME et pétale'),'ecume et petale')
})
test('explicit silence vocabulary has priority',()=>assert.equal(detectParticleMode('Je regardais longtemps dans le silence, face au vent'),'silence'))
test('selects presets and clamps values',()=>{
  assert.equal(getParticlePreset('water').family,'droplets')
  assert.equal(clamp(2),1); assert.equal(clamp(-1),0)
  assert.ok(particleLimit(1)<=MAX_PARTICLES); assert.equal(particleLimit(1,false,false,true),2)
})
test('context interpolation remains bounded and changes family once',()=>{
  const a=makeParticleContext('vent',AUDIO_FALLBACK,{maxIntensity:.2}), b=makeParticleContext('mer',AUDIO_FALLBACK,{maxIntensity:.4})
  const middle=interpolateParticleContext(a,b,.5)
  assert.equal(middle.family,'droplets'); assert.ok(middle.intensity>=a.intensity&&middle.intensity<=b.intensity)
})
test('audio analysis has a stable silent fallback and normalized output',()=>{
  assert.deepEqual(AUDIO_FALLBACK,{level:.25,low:.2,mid:.2,high:.15})
  const values=analyseFrequencyData(new Uint8Array(128).fill(255),48000)
  for(const value of Object.values(values)) assert.ok(value>=0&&value<=1)
})
