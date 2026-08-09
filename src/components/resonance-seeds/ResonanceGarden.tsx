import { useState } from 'react'
import { resonanceSeeds } from '../../data/resonanceSeeds'
import type { ResonanceGardenState, ResonanceSeedId } from '../../types/resonanceSeeds'
import { ResonancePlant } from './ResonancePlant'
import { RootNetwork } from './RootNetwork'

export function ResonanceGarden({ state, activeSeed, onActive, onAdd, onEdit, onRemove, onSeeds }:{ state:ResonanceGardenState; activeSeed:ResonanceSeedId; onActive:(id:ResonanceSeedId)=>void; onAdd:(id:ResonanceSeedId, words:string[], parent?:string|null)=>void; onEdit:(id:ResonanceSeedId,node:string,label:string)=>void; onRemove:(id:ResonanceSeedId,node:string)=>void; onSeeds:()=>void }) {
  const plantation=state.plantations[activeSeed]!, definition=resonanceSeeds.find(s=>s.id===activeSeed)!
  const [initial,setInitial]=useState(['','','']), [selected,setSelected]=useState<string|null>(null), [word,setWord]=useState('')
  const selectedNode=plantation.nodes.find(n=>n.id===selected), hasChildren=selected ? plantation.nodes.some(n=>n.parentId===selected):false
  const submitInitial=(e:React.FormEvent)=>{e.preventDefault(); onAdd(activeSeed,initial); setInitial(['','',''])}
  return <main className="garden"><header><span>Jardin des résonances</span><button className="quiet" onClick={onSeeds}>Attraper une autre graine</button></header>
    <section className="garden-sky" aria-label="Les plantations">{Object.values(state.plantations).map(p=><button key={p.seedId} className={p.seedId===activeSeed?'is-active':''} onClick={()=>onActive(p.seedId)} aria-label={`Voir ${resonanceSeeds.find(s=>s.id===p.seedId)?.title}`}><ResonancePlant nodeCount={p.nodes.length}/><small>{resonanceSeeds.find(s=>s.id===p.seedId)?.title}</small></button>)}</section>
    <div className="soil-line"/><section className="garden-earth"><h1>{definition.title}</h1>{plantation.nodes.length===0&&<form className="first-words" onSubmit={submitInitial}><p>Quelques mots pour l’aider à prendre racine…</p>{initial.map((value,index)=><input key={index} value={value} maxLength={40} placeholder={`Mot ou expression ${index+1}`} aria-label={`Premier mot ${index+1}`} onChange={e=>setInitial(values=>values.map((v,i)=>i===index?e.target.value:v))}/>)}<button className="primary" disabled={!initial.some(v=>v.trim())}>Déposer ces mots</button></form>}
      {plantation.nodes.length>0&&<RootNetwork nodes={plantation.nodes} selected={selected} onSelect={setSelected}/>} 
    </section>
    {selectedNode&&<div className="word-sheet" role="dialog" aria-label={`Options pour ${selectedNode.label}`}><p>Un mot en appelle parfois un autre…</p><input value={word} maxLength={40} onChange={e=>setWord(e.target.value)} placeholder="Ajouter un mot…" aria-label="Ajouter un mot"/><button className="primary" disabled={!word.trim()} onClick={()=>{onAdd(activeSeed,[word],selectedNode.id);setWord('');setSelected(null)}}>+ Ajouter un mot</button><button className="quiet" onClick={()=>{const label=prompt('Modifier le mot',selectedNode.label);if(label)onEdit(activeSeed,selectedNode.id,label);setSelected(null)}}>Modifier</button><button className="quiet" disabled={hasChildren} title={hasChildren?'Ce mot appelle déjà d’autres mots.':''} onClick={()=>{if(confirm(`Supprimer « ${selectedNode.label} » ?`))onRemove(activeSeed,selectedNode.id);setSelected(null)}}>Supprimer</button><button className="word-sheet__close" onClick={()=>setSelected(null)} aria-label="Fermer">×</button></div>}
  </main>
}
