import { getPlantGrowthStage } from '../../utils/resonanceGardenLayout'

export function ResonancePlant({ nodeCount, x=100 }:{ nodeCount:number; x?:number }) {
  const stage=getPlantGrowthStage(nodeCount), grown=stage!=='seed', tall=['stem','leaves','bud','flower'].includes(stage), leafy=['leaves','bud','flower'].includes(stage)
  return <svg className="resonance-plant" viewBox="0 0 200 180" aria-label={`Plante, état ${stage}`}><g transform={`translate(${x-100} 0)`}>
    {grown&&<path className="plant-stem" d={tall?'M100 170 Q96 112 103 45':'M100 170 Q94 150 103 134'}/>} 
    {leafy&&<><path className="plant-leaf" d="M99 116 Q60 91 55 126 Q77 137 99 122"/><path className="plant-leaf" d="M101 91 Q135 67 146 99 Q126 113 102 99"/></>}
    {(stage==='bud'||stage==='flower')&&<circle className={`plant-bloom ${stage}`} cx="103" cy="42" r={stage==='flower'?24:11}/>}<ellipse className="plant-seed" cx="100" cy="169" rx="8" ry="5"/>
  </g></svg>
}
