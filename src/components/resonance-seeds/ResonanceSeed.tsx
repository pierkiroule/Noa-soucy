import type { ResonanceSeedDefinition } from '../../types/resonanceSeeds'

export function ResonanceSeed({ seed, planted, subdued, onSelect }:{ seed:ResonanceSeedDefinition; planted:boolean; subdued:boolean; onSelect:()=>void }) {
  return <button className={`floating-seed floating-seed--${seed.id}${planted?' is-planted':''}${subdued?' is-subdued':''}`} disabled={planted} onClick={onSelect} aria-label={planted ? `${seed.title}, déjà plantée` : `Attraper une graine`}>
    <span aria-hidden="true"/><small>{planted ? seed.title : ''}</small>
  </button>
}
