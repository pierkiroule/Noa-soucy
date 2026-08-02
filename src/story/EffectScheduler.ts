import type { SceneId, VisualMood } from './types'
export interface Particle { x:number;y:number;size:number;speed:number;phase:number }
export class EffectScheduler {
  particles:Particle[]=[]
  private scene:SceneId
  constructor(scene:SceneId){ this.scene=scene; this.resize(80) }
  resize(count:number){this.particles=Array.from({length:count},(_,i)=>({x:Math.random(),y:Math.random(),size:1+Math.random()*4,speed:.08+Math.random()*.18,phase:i*.7}))}
  draw(ctx:CanvasRenderingContext2D,w:number,h:number,t:number,m:VisualMood){
    ctx.clearRect(0,0,w,h); const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,`rgba(247,244,232,${1-m.darkness*.65})`);g.addColorStop(1,`rgba(84,119,119,${.18+m.darkness*.45})`);ctx.fillStyle=g;ctx.fillRect(0,0,w,h)
    const horizon=h*.57;ctx.lineWidth=1
    for(let n=0;n<9;n++){ctx.beginPath();for(let x=-20;x<w+20;x+=12){const y=horizon+n*13+Math.sin(x*.012+t*.00035*(1+m.current*2)+n)*10*m.waves;ctx.lineTo(x,y)}ctx.strokeStyle=`rgba(52,91,94,${.08+n*.012})`;ctx.stroke()}
    if(this.scene==='drift'){ctx.save();ctx.translate(w*.61+Math.sin(t*.0003)*18*m.current,h*.55);ctx.fillStyle='#92684f88';ctx.strokeStyle='#684b3d';ctx.beginPath();ctx.ellipse(0,0,42,16,0,0,Math.PI);ctx.fill();ctx.stroke();ctx.restore()}
    if(this.scene==='growth'||this.scene==='navigation'){ctx.strokeStyle=`rgba(72,91,56,${.45+m.roots*.3})`;ctx.lineWidth=2;for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(w*.58,h*.72);ctx.quadraticCurveTo(w*(.5+i*.025),h*.82,w*(.44+i*.045),h*.94);ctx.stroke()}ctx.strokeStyle='#58714f';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(w*.58,h*.72);ctx.quadraticCurveTo(w*.57,h*.47,w*.6,h*.28);ctx.stroke()}
    if(this.scene==='navigation'){ctx.fillStyle=`rgba(215,169,74,${.45+m.warmth*.4})`;for(let i=0;i<8;i++){ctx.beginPath();ctx.ellipse(w*.6+Math.cos(i*Math.PI/4)*25,h*.28+Math.sin(i*Math.PI/4)*18,25,9,i*Math.PI/4,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#f1e8cecc';ctx.beginPath();ctx.moveTo(w*.59,h*.31);ctx.lineTo(w*.42,h*.53);ctx.lineTo(w*.59,h*.53);ctx.fill()}
    ctx.fillStyle=`rgba(255,255,255,${m.mist*.055})`;this.particles.forEach(p=>{const x=(p.x*w+t*p.speed*.015)%w;ctx.beginPath();ctx.arc(x,p.y*h,p.size*(1+m.mist*2),0,Math.PI*2);ctx.fill()})
  }
}
