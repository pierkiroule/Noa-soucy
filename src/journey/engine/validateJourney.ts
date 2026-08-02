import type { ComposedJourney, JourneyPartition } from '../types'
export function validateJourney(journey: ComposedJourney, partition: JourneyPartition): boolean {
  return partition.movements.every(({movement,required}) => !required || journey.scenes.some((scene) => scene.movement === movement))
}
