import { useEffect, useState } from 'react'
import { resonanceSeeds } from '../../data/resonanceSeeds'
import type { ResonanceGardenState, ResonanceSeedId } from '../../types/resonanceSeeds'
import { ResonancePlant } from './ResonancePlant'
import { RootNetwork } from './RootNetwork'
import { WateringCan } from './WateringCan'
import { WordTagPicker } from './WordTagPicker'

export function ResonanceGarden({ state, activeSeed, onActive, onAdd, onEdit, onRemove, onSeeds }:{ state:ResonanceGardenState; activeSeed:ResonanceSeedId; onActive:(id:ResonanceSeedId)=>void; onAdd:(id:ResonanceSeedId, words:string[], parent?:string|null)=>void; onEdit:(id:ResonanceSeedId,node:string,label:string)=>void; onRemove:(id:ResonanceSeedId,node:string)=>void; onSeeds:()=>void }) {
  const plantation=state.plantations[activeSeed]!, definition=resonanceSeeds.find(s=>s.id===activeSeed)!
  const [initial,setInitial]=useState<string[]>([]), [pours,setPours]=useState(0), [selected,setSelected]=useState<string|null>(null), [sheetWord,setSheetWord]=useState<string[]>([]), [editing,setEditing]=useState(false)
  const selectedNode=plantation.nodes.find(n=>n.id===selected), hasChildren=selected ? plantation.nodes.some(n=>n.parentId===selected):false
  useEffect(()=>{setInitial([]);setPours(0);setSelected(null);setSheetWord([]);setEditing(false)},[activeSeed])
  const toggleInitial=(word:string)=>setInitial(words=>words.includes(word)?words.filter(item=>item!==word):[...words,word])
  const pour=()=>{
    if(initial.length!==3||pours>=3)return
    const next=pours+1;setPours(next)
    if(next===3) window.setTimeout(()=>{onAdd(activeSeed,initial);setInitial([]);setPours(0)},650)
  }
  const closeSheet=()=>{setSelected(null);setSheetWord([]);setEditing(false)}
  return <main className="garden"><header><span>Jardin des résonances</span><button className="quiet" onClick={onSeeds}>Attraper une autre graine</button></header>
    <section className="garden-sky" aria-label="Les plantations">{Object.values(state.plantations).map(p=><button key={p.seedId} className={p.seedId===activeSeed?'is-active':''} onClick={()=>onActive(p.seedId)} aria-label={`Voir ${resonanceSeeds.find(s=>s.id===p.seedId)?.title}`}><ResonancePlant nodeCount={p.nodes.length}/><small>{resonanceSeeds.find(s=>s.id===p.seedId)?.title}</small></button>)}</section>
    <div className="soil-line"/><section className="garden-earth"><h1>{definition.title}</h1>{plantation.nodes.length===0&&<section className="first-words"><p>Choisis trois mots pour l’aider à prendre racine…</p><small>{initial.length} sur 3</small><WordTagPicker selected={initial} onToggle={toggleInitial} label="Choisir trois premiers mots"/><WateringCan pours={pours} disabled={initial.length!==3} onPour={pour}/></section>}
      {plantation.nodes.length>0&&<RootNetwork nodes={plantation.nodes} selected={selected} onSelect={setSelected}/>} 
    </section>
    {selectedNode&&<div className="word-sheet" role="dialog" aria-label={`Options pour ${selectedNode.label}`}><p>{editing?'Choisis un mot pour le remplacer.':'Un mot en appelle parfois un autre…'}</p><WordTagPicker selected={sheetWord} unavailable={plantation.nodes.map(node=>node.label)} limit={1} onToggle={word=>setSheetWord(current=>current.includes(word)?[]:[word])} label={editing?'Choisir un mot de remplacement':'Choisir un mot à ajouter'}/><button className="primary" disabled={!sheetWord.length} onClick={()=>{if(editing)onEdit(activeSeed,selectedNode.id,sheetWord[0]);else onAdd(activeSeed,sheetWord,selectedNode.id);closeSheet()}}>{editing?'Remplacer':'+ Ajouter ce mot'}</button><button className="quiet" onClick={()=>{setEditing(value=>!value);setSheetWord([])}}>{editing?'Annuler la modification':'Modifier'}</button><button className="quiet" disabled={hasChildren} title={hasChildren?'Ce mot appelle déjà d’autres mots.':''} onClick={()=>{if(confirm(`Supprimer « ${selectedNode.label} » ?`))onRemove(activeSeed,selectedNode.id);closeSheet()}}>Supprimer</button><button className="word-sheet__close" onClick={closeSheet} aria-label="Fermer">×</button></div>}
  </main>
}
