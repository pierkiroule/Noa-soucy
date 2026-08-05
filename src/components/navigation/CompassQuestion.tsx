import type { NavigationScore } from '../../types/navigationCompass'
import { navigationScoreLabels, navigationScoreValues } from './compassUtils'

export function CompassQuestion({ icon, label, statement, selected, canGoBack, onSelect, onPrevious, onNext }: { icon:string; label:string; statement:string; selected?:NavigationScore; canGoBack:boolean; onSelect:(score:NavigationScore)=>void; onPrevious:()=>void; onNext:()=>void }) {
  return <section className="compass-panel compass-question"><h1><span aria-hidden="true">{icon}</span> {label}</h1><p>{statement}</p><div className="compass-scale" role="radiogroup" aria-label={`Évaluer la compétence ${label}`}>
    {navigationScoreValues.map(value => <button key={value} type="button" aria-pressed={selected === value} aria-label={`${value} — ${navigationScoreLabels[value]}`} className={selected === value ? 'is-selected' : ''} onClick={() => onSelect(value)}><strong>{value}</strong><span>{navigationScoreLabels[value]}</span></button>)}
  </div><div className="compass-actions"><button className="quiet" disabled={!canGoBack} onClick={onPrevious}>Précédent</button><button className="primary" disabled={!selected} onClick={onNext}>Suivant</button></div></section>
}
