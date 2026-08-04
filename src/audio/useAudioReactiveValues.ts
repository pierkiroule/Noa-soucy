import { useEffect, useState } from 'react'
import { clamp, type AudioReactiveValues } from '../effects/particleTypes.ts'

export const AUDIO_FALLBACK:AudioReactiveValues = { level:.25, low:.2, mid:.2, high:.15 }
const average = (data:Uint8Array<ArrayBuffer>, from:number, to:number) => {
  let total=0, count=0
  for(let i=Math.max(0,from);i<Math.min(data.length,to);i++){ total+=data[i]; count++ }
  return count ? clamp(total/count/255) : 0
}
export function analyseFrequencyData(data:Uint8Array<ArrayBuffer>, sampleRate:number):AudioReactiveValues {
  const hz = sampleRate / 2 / data.length
  return { level:average(data,0,data.length), low:average(data,Math.floor(20/hz),Math.ceil(250/hz)), mid:average(data,Math.floor(250/hz),Math.ceil(2000/hz)), high:average(data,Math.floor(2000/hz),Math.ceil(10000/hz)) }
}
export function useAudioReactiveValues(media:HTMLAudioElement|null, enabled=true):AudioReactiveValues {
  const [values,setValues]=useState(AUDIO_FALLBACK)
  useEffect(()=>{
    if(!media || !enabled || matchMedia('(prefers-reduced-motion: reduce)').matches){ setValues(AUDIO_FALLBACK); return }
    let frame=0, context:AudioContext|undefined
    try {
      context=new AudioContext(); const analyser=context.createAnalyser(); analyser.fftSize=256; analyser.smoothingTimeConstant=.85
      const source=context.createMediaElementSource(media); source.connect(analyser); analyser.connect(context.destination)
      const data=new Uint8Array(analyser.frequencyBinCount)
      const tick=()=>{ analyser.getByteFrequencyData(data); setValues(analyseFrequencyData(data,context!.sampleRate)); frame=requestAnimationFrame(tick) }
      frame=requestAnimationFrame(tick)
    } catch { // A procedural breath keeps the decoration alive when Web Audio is unavailable.
      const started=performance.now(); const tick=(now:number)=>{const breath=.92+Math.sin((now-started)/2400)*.08;setValues({level:.25*breath,low:.2*breath,mid:.2*breath,high:.15*breath});frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)
    }
    return()=>{cancelAnimationFrame(frame); if(context) void context.close()}
  },[media,enabled])
  return values
}
