export class AudioEngine {
  private context?:AudioContext; private gain?:GainNode; private filter?:BiquadFilterNode; private analyser?:AnalyserNode; private sources:HTMLAudioElement[]=[]
  async start(){if(!this.context){this.context=new AudioContext();this.gain=this.context.createGain();this.filter=this.context.createBiquadFilter();this.analyser=this.context.createAnalyser();this.filter.type='lowpass';this.filter.frequency.value=9000;this.gain.connect(this.filter).connect(this.analyser).connect(this.context.destination)}await this.context.resume()}
  setVolume(value:number){if(this.gain&&this.context)this.gain.gain.setTargetAtTime(value,this.context.currentTime,.15)}
  setLowPass(frequency:number){if(this.filter&&this.context)this.filter.frequency.setTargetAtTime(frequency,this.context.currentTime,.25)}
  frequencies(){const data=new Uint8Array(this.analyser?.frequencyBinCount??0);this.analyser?.getByteFrequencyData(data);return data}
  async play(urls:string[]){this.stop();await this.start();urls.filter(Boolean).forEach(url=>{const audio=new Audio(url);audio.loop=true;audio.volume=0;audio.play().then(()=>{let v=0;const fade=window.setInterval(()=>{v=Math.min(.3,v+.025);audio.volume=v;if(v>=.3)clearInterval(fade)},80)}).catch(()=>undefined);this.sources.push(audio)})}
  stop(){this.sources.forEach(a=>{a.pause();a.src=''});this.sources=[]}
}
export const audioEngine=new AudioEngine()
