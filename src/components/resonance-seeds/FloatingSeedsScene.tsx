import { resonanceSeeds } from '../../data/resonanceSeeds'
import type { ResonanceSeedId } from '../../types/resonanceSeeds'
import { ResonanceSeed } from './ResonanceSeed'

export function FloatingSeedsScene({ selected, planted, onSelect, onPlant, onRelease, onGarden }:{ selected:ResonanceSeedId|null; planted:Set<ResonanceSeedId>; onSelect:(id:ResonanceSeedId)=>void; onPlant:(id:ResonanceSeedId)=>void; onRelease:()=>void; onGarden:()=>void }) {
  const definition=resonanceSeeds.find(seed=>seed.id===selected)
  return <main className="seeds-scene">
    <div className="marigold" aria-hidden="true"><i/><i/><i/><i/><i/><b/></div>
    <section className="seeds-scene__words"><p>Avant de partir, Nao libéra cinq graines au vent.</p><p>Peut-être certaines trouveront-elles un endroit où pousser…</p><strong>Attrape une graine.</strong></section>
    <div className="floating-seeds">{resonanceSeeds.map(seed=><ResonanceSeed key={seed.id} seed={seed} planted={planted.has(seed.id)} subdued={Boolean(selected&&selected!==seed.id)} onSelect={()=>onSelect(seed.id)}/>)}</div>
    {definition&&<section className="seed-reveal" aria-live="polite"><h1>{definition.title}</h1><p>« {definition.subtitle} »</p><div><button className="primary" onClick={()=>onPlant(definition.id)}>Planter cette graine</button><button className="quiet" onClick={onRelease}>Laisser voler</button></div></section>}
    {!selected&&planted.size>0&&<button className="quiet seeds-scene__garden" onClick={onGarden}>Revenir au jardin</button>}
  </main>
}
