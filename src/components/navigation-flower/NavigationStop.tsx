import type { NavigationStop as Stop, NavigationStopOption } from '../../data/navigationStops'
import { FloatingPetals } from './FloatingPetals'
export function NavigationStop({ stop, index, total, selected, locked, onChoose, onBack }: { stop: Stop; index: number; total: number; selected?: string; locked: boolean; onChoose: (option: NavigationStopOption) => void; onBack: () => void }) {
  return <section className="flower-stop"><p className="flower-progress">Escale {index + 1} sur {total}</p><span className="eyebrow">{stop.title}</span><h1>{stop.prompt}</h1><FloatingPetals options={stop.options} disabled={locked} selected={selected} onChoose={onChoose}/><button className="quiet flower-back" disabled={locked || index === 0} onClick={onBack}>Retour</button><small>Vos choix restent uniquement sur cet appareil.</small></section>
}
