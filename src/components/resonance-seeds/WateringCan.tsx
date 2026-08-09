export function WateringCan({ pours, disabled, onPour }:{ pours:number; disabled:boolean; onPour:()=>void }) {
  return <div className="watering" aria-live="polite">
    <button type="button" className={pours>0?`watering-can is-pouring pour-${pours}`:'watering-can'} disabled={disabled||pours>=3} onClick={onPour} aria-label={`Arroser les mots, ${pours} arrosage${pours>1?'s':''} sur 3`}>
      <svg viewBox="0 0 150 100" aria-hidden="true"><path className="watering-can__body" d="M34 42h70v45H34z M104 51l35-18 5 10-40 28z"/><path className="watering-can__handle" d="M39 45C35 10 91 8 98 45"/><path className="watering-can__water" d="M141 47q-8 20-3 38 M132 50q-8 20-5 35 M123 54q-7 16-4 28"/></svg>
      <span>{pours<3?'Arroser':'Les mots prennent racine'}</span>
    </button>
    <div className="watering-count" aria-label={`${pours} arrosages sur 3`}>{[1,2,3].map(step=><i key={step} className={step<=pours?'is-full':''}/>)}</div>
  </div>
}
