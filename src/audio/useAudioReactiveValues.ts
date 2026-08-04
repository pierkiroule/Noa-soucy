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

interface AnalysisSession {
  context:AudioContext; analyser:AnalyserNode; data:Uint8Array<ArrayBuffer>; users:number
  closeTimer?:ReturnType<typeof setTimeout>
}
const sessions = new WeakMap<HTMLAudioElement,AnalysisSession>()

function acquireSession(media:HTMLAudioElement) {
  let session=sessions.get(media)
  if(!session){
    const context=new AudioContext(), analyser=context.createAnalyser()
    analyser.fftSize=256; analyser.smoothingTimeConstant=.85
    context.createMediaElementSource(media).connect(analyser); analyser.connect(context.destination)
    session={context,analyser,data:new Uint8Array(analyser.frequencyBinCount),users:0};sessions.set(media,session)
  }
  if(session.closeTimer)clearTimeout(session.closeTimer)
  session.users++
  return session
}

function releaseSession(media:HTMLAudioElement,session:AnalysisSession){
  session.users=Math.max(0,session.users-1)
  if(session.users)return
  // React StrictMode immediately mounts effects a second time. The grace period
  // prevents closing a MediaElementSource that is about to be reused.
  session.closeTimer=setTimeout(()=>{if(!session.users){sessions.delete(media);void session.context.close()}},1000)
}

export function useAudioReactiveValues(media:HTMLAudioElement|null, enabled=true):AudioReactiveValues {
  const [values,setValues]=useState(AUDIO_FALLBACK)
  useEffect(()=>{
    if(!media || !enabled || matchMedia('(prefers-reduced-motion: reduce)').matches){setValues(AUDIO_FALLBACK);return}
    let frame=0,lastEmission=0,session:AnalysisSession|undefined
    const resume=()=>{if(session?.context.state==='suspended')void session.context.resume()}
    try { session=acquireSession(media); resume(); media.addEventListener('play',resume); window.addEventListener('pointerdown',resume);window.addEventListener('keydown',resume) }
    catch { session=undefined }
    const started=performance.now()
    const tick=(now:number)=>{
      if(now-lastEmission>=100){
        if(session&&session.context.state==='running'){session.analyser.getByteFrequencyData(session.data);setValues(analyseFrequencyData(session.data,session.context.sampleRate))}
        else {const breath=.92+Math.sin((now-started)/2400)*.08;setValues({level:.25*breath,low:.2*breath,mid:.2*breath,high:.15*breath})}
        lastEmission=now
      }
      frame=requestAnimationFrame(tick)
    }
    frame=requestAnimationFrame(tick)
    return()=>{cancelAnimationFrame(frame);media.removeEventListener('play',resume);window.removeEventListener('pointerdown',resume);window.removeEventListener('keydown',resume);if(session)releaseSession(media,session)}
  },[media,enabled])
  return values
}
