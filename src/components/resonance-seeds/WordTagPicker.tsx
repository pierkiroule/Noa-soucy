import { resonanceWordTags } from '../../data/resonanceSeeds'

export function WordTagPicker({ selected, unavailable=[], limit=3, onToggle, label='Choisir des mots' }:{ selected:string[]; unavailable?:string[]; limit?:number; onToggle:(word:string)=>void; label?:string }) {
  return <div className="word-tags" role="group" aria-label={label}>
    {resonanceWordTags.map(word => {
      const active=selected.includes(word), disabled=!active&&(selected.length>=limit||unavailable.includes(word))
      return <button type="button" key={word} className={active?'is-selected':''} disabled={disabled} aria-pressed={active} onClick={()=>onToggle(word)}>{word}</button>
    })}
  </div>
}
