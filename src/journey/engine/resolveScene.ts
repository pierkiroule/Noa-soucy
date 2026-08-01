import type { JourneyChoices, JourneyScene, MovementId } from '../types'
import { weightedPick } from './random'
const intersects = <T,>(required: T[] | undefined, selected: T[]) => !required || required.some((item) => selected.includes(item))
export function resolveScene(movement: MovementId, choices: JourneyChoices, library: JourneyScene[], usedIds: string[], random = Math.random): JourneyScene | undefined {
  const compatible = library.filter((scene) => scene.movement === movement && (!scene.conditions?.landscapes || scene.conditions.landscapes.includes(choices.landscape)) && intersects(scene.conditions?.resources, choices.resources) && (!scene.conditions?.navigationStyles || scene.conditions.navigationStyles.includes(choices.navigationStyle)))
  return weightedPick(compatible.filter((scene) => !usedIds.includes(scene.id)).length ? compatible.filter((scene) => !usedIds.includes(scene.id)) : compatible, random)
}
