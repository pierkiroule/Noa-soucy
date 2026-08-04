import { useEffect, useRef, useState } from 'react'
import { detectParticleMode } from './keywordContext.ts'
import { getParticlePreset } from './particlePresets.ts'
import { clamp, MAX_OPACITY, MIN_OPACITY, type AudioReactiveValues, type ParticleContext, type ParticleFxConfig } from './particleTypes.ts'

export function interpolateParticleContext(from:ParticleContext, to:ParticleContext, amount:number):ParticleContext {
  const t = clamp(amount)
  const mix = (a:number,b:number) => a + (b-a)*t
  return { ...(t < .5 ? from : to), intensity:mix(from.intensity,to.intensity), density:mix(from.density,to.density), speed:mix(from.speed,to.speed), opacity:mix(from.opacity,to.opacity) }
}
export function makeParticleContext(visibleText:string, audio:AudioReactiveValues, config:ParticleFxConfig={}):ParticleContext {
  let mode = detectParticleMode(visibleText)
  if (mode === 'none' && config.preferredMode) mode = config.preferredMode
  if (config.enabled === false) mode = 'none'
  const preset = getParticlePreset(mode)
  const max = clamp(config.maxIntensity ?? .22)
  const sound = clamp(audio[preset.audioBand])
  const intensity = mode === 'none' ? 0 : max * (.75 + sound*.25)
  return { mode, ...preset, intensity, density:preset.density*intensity, speed:preset.speed*(.85+sound*.25), opacity:clamp(preset.opacity*(.75+sound*.35),MIN_OPACITY,MAX_OPACITY) }
}
export function useParticleContext({ visibleText, audioValues, sceneId, config={} }:{visibleText:string;audioValues:AudioReactiveValues;sceneId:string;config?:ParticleFxConfig}) {
  const target = makeParticleContext(visibleText,audioValues,config)
  const targetRef = useRef(target); targetRef.current=target
  const [context,setContext] = useState(target)
  useEffect(() => {
    const from=context, started=performance.now(); let frame=0
    const tick=(now:number)=>{ const t=(now-started)/2000; setContext(interpolateParticleContext(from,targetRef.current,t)); if(t<1) frame=requestAnimationFrame(tick) }
    frame=requestAnimationFrame(tick); return()=>cancelAnimationFrame(frame)
    // The textual mode/scene starts a cross-fade; audio is sampled by subsequent renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[visibleText,sceneId,config.enabled,config.maxIntensity,config.preferredMode])
  return context
}
