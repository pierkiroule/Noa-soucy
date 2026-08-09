import { useState } from 'react'
import type { ResonanceSeedId } from '../../types/resonanceSeeds'
import { useResonanceGarden } from '../../hooks/useResonanceGarden'
import { FloatingSeedsScene } from './FloatingSeedsScene'
import { ResonanceGarden } from './ResonanceGarden'

export function ResonanceSeedsFlow() {
  const garden=useResonanceGarden(), planted=new Set(Object.keys(garden.state.plantations) as ResonanceSeedId[])
  const [view,setView]=useState<'seeds'|'garden'>(planted.size?'garden':'seeds'), [selected,setSelected]=useState<ResonanceSeedId|null>(null), [active,setActive]=useState<ResonanceSeedId|null>(()=>[...planted][0]??null)
  const plant=(id:ResonanceSeedId)=>{garden.plant(id);setActive(id);setSelected(null);setView('garden')}
  if(view==='seeds'||!active) return <FloatingSeedsScene selected={selected} planted={planted} onSelect={setSelected} onRelease={()=>setSelected(null)} onPlant={plant} onGarden={()=>{setActive(active??[...planted][0]);setView('garden')}}/>
  return <ResonanceGarden state={garden.state} activeSeed={active} onActive={setActive} onAdd={garden.addWords} onEdit={garden.editWord} onRemove={garden.removeWord} onSeeds={()=>setView('seeds')}/>
}
