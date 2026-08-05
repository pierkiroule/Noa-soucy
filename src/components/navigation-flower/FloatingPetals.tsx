import type { NavigationStopOption } from '../../data/navigationStops'
export function FloatingPetals({ options, disabled, selected, onChoose }: { options: readonly NavigationStopOption[]; disabled: boolean; selected?: string; onChoose: (option: NavigationStopOption) => void }) {
  return <div className="floating-petals" role="group" aria-label="Pétales de choix">{options.map((option, index) => <button key={`${option.skillId}-${option.label}`} className={`floating-petal floating-petal--${index}${selected === option.skillId ? ' is-selected' : ''}`} disabled={disabled && selected !== option.skillId} aria-label={`Choisir ${option.label}`} onClick={() => onChoose(option)}><span>{option.label}</span></button>)}</div>
}
