import { useEffect, useRef } from 'react'
import { particleLimit, MAX_SIZE, MIN_SIZE, isInsideTextExclusionZone, type AudioReactiveValues, type ParticleFamily, type ParticleFxConfig } from './particleTypes'
import { useParticleContext } from './useParticleContext'

interface Particle { x:number;y:number;size:number;phase:number;life:number }
const colors:Record<ParticleFamily,string[]>={pollen:['#c28a4e','#b8c58a','#d99a58'],droplets:['#c9e8ef','#d9f0f3'], 'light-dust':['#fff4cf','#ffe7ac','#fffaf0'],'wind-lines':['#c5d8df','#aebfc8']}
export function ParticleOverlay({visibleText,audioValues,config,sceneId,textRef}:{visibleText:string;audioValues:AudioReactiveValues;config:ParticleFxConfig;sceneId:string;textRef:React.RefObject<HTMLElement|null>}){
  const canvasRef=useRef<HTMLCanvasElement>(null), valuesRef=useRef(audioValues); valuesRef.current=audioValues
  const context=useParticleContext({visibleText,audioValues,sceneId,config})
  const contextRef=useRef(context); contextRef.current=context
  useEffect(()=>{
    const canvas=canvasRef.current, ctx=canvas?.getContext('2d'); if(!canvas||!ctx) return
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches
    let lowPower=reduced||(navigator.hardwareConcurrency||4)<=4||innerWidth<480, frame=0,last=0,slowFrames=0
    let particles:Particle[]=[]; const resize=()=>{const dpr=Math.min(devicePixelRatio||1,1.5);const rect=canvas.getBoundingClientRect();canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};resize();addEventListener('resize',resize)
    const spawn=(w:number,h:number):Particle=>({x:Math.random()<.7?(Math.random()<.5?Math.random()*w*.25:w*(.75+Math.random()*.25)):Math.random()*w,y:Math.random()*h,size:MIN_SIZE+Math.random()*(MAX_SIZE-MIN_SIZE),phase:Math.random()*6.28,life:.65+Math.random()*.35})
    const draw=(p:Particle,family:ParticleFamily,alpha:number,w:number,h:number,time:number)=>{const active=contextRef.current,audio=valuesRef.current[active.audioBand],size=p.size*(1.05+audio*.25),inside=textRef.current&&isInsideTextExclusionZone(p.x,p.y,textRef.current.getBoundingClientRect()),pulse=.9+Math.sin(time/1500+p.phase)*.1;ctx.globalAlpha=Math.min(.12,alpha*(1.05+audio*.45))*pulse*(inside?1/3:1)*p.life;ctx.strokeStyle=ctx.fillStyle=colors[family][Math.floor(p.phase)%colors[family].length];ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=family==='wind-lines'?2:size*2
      if(family==='wind-lines'){ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.bezierCurveTo(p.x+16,p.y-4,p.x+32,p.y+5,p.x+48,p.y);ctx.stroke()}
      else if(family==='light-dust'){const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,size*3);g.addColorStop(0,ctx.fillStyle);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,size*3,0,6.28);ctx.fill()}
      else {ctx.beginPath();ctx.ellipse(p.x,p.y,size,family==='droplets'?size*1.4:size*.75,0,0,6.28);if(family==='droplets'){ctx.lineWidth=.7;ctx.stroke();ctx.globalAlpha*=.35;ctx.fill()}else ctx.fill()}
      const speed=(reduced ? .15 : 1)*active.speed*(.85+audio*.25)*16;p.x+=(family==='wind-lines'?1:Math.sin(time/1800+p.phase)*.12)*speed;p.y+=(family==='pollen'?-1:family==='droplets'?.7:.03)*speed;if(p.x>w+45||p.y>h+10||p.y< -10){Object.assign(p,spawn(w,h));if(family==='pollen')p.y=h+5;if(family==='wind-lines')p.x=-40}}
    const tick=(time:number)=>{frame=requestAnimationFrame(tick);const targetFps=lowPower?30:60;if(time-last<1000/targetFps)return;if(last&&time-last>42&&++slowFrames>20)lowPower=true;last=time;const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);const active=contextRef.current,family=active.family;if(!family)return;const count=particleLimit(active.density+active.intensity*.25,lowPower,reduced,active.mode==='silence');while(particles.length<count)particles.push(spawn(w,h));particles.length=count;for(const p of particles)draw(p,family,active.opacity,w,h,time)}
    frame=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize)}
  },[sceneId,textRef])
  return <canvas ref={canvasRef} className="particle-overlay" aria-hidden="true"/>
}
