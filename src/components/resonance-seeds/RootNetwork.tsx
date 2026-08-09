import { layoutRootNetwork } from '../../utils/resonanceGardenLayout'
import type { ResonanceNode as NodeType } from '../../types/resonanceSeeds'

export function RootNetwork({ nodes, selected, onSelect }:{ nodes:NodeType[]; selected:string|null; onSelect:(id:string)=>void }) {
  const positioned=layoutRootNetwork(nodes), byId=new Map(positioned.map(n=>[n.id,n])), height=Math.max(300,...positioned.map(n=>n.y+70))
  return <div className="root-network" style={{height}}><svg viewBox={`0 0 360 ${height}`} preserveAspectRatio="none" aria-hidden="true"><path d="M180 0 C180 20 180 25 180 40"/>{positioned.map(n=>{const p=n.parentId?byId.get(n.parentId):undefined; return <path key={n.id} d={`M${p?.x??180} ${p?.y??38} Q${(p?.x??180+n.x)/2} ${(p?.y??38+n.y)/2+15} ${n.x} ${n.y}`}/>})}</svg>
    <span className="root-seed" aria-hidden="true"/>{positioned.map(node=><button key={node.id} className={selected===node.id?'is-selected':''} style={{left:`${node.x/3.6}%`,top:node.y}} onClick={()=>onSelect(node.id)} aria-label={`${node.label}, ouvrir les options`}>{node.label}</button>)}
  </div>
}
