import { useEffect, useRef, useState } from 'react'
import { EffectScheduler } from './EffectScheduler'
import type { SceneConfig, VisualMood } from './types'

export function SceneStage({scene,mood}:{scene:SceneConfig;mood:VisualMood}){
 const canvas=useRef<HTMLCanvasElement>(null);const [videoReady,setVideoReady]=useState(false)
 useEffect(()=>{const el=canvas.current;if(!el)return;const ctx=el.getContext('2d');if(!ctx)return;const scheduler=new EffectScheduler(scene.id);let frame=0;const render=(t:number)=>{const d=devicePixelRatio||1;const w=el.clientWidth*d,h=el.clientHeight*d;if(el.width!==w||el.height!==h){el.width=w;el.height=h}scheduler.draw(ctx,w,h,t,mood);frame=requestAnimationFrame(render)};frame=requestAnimationFrame(render);return()=>cancelAnimationFrame(frame)},[scene.id,mood])
 return <div className="scene__stage" aria-hidden="true"><canvas ref={canvas}/><video src={scene.media} autoPlay muted loop playsInline onCanPlay={()=>setVideoReady(true)} style={{display:videoReady?'block':'none'}}/><div className="scene__wash"/></div>
}
