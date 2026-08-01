import { landscapes } from '../data/landscapes'
import { navigationStyles } from '../data/navigationStyles'
import { resources } from '../data/resources'
import { sceneLibrary } from '../data/sceneLibrary'
import { oceanJourneyPartition } from '../partitions/oceanJourney'
import type { ComposedJourney, JourneyChoices } from '../types'
import { pick } from './random'
import { resolveScene } from './resolveScene'
import { validateJourney } from './validateJourney'

export function composeJourney(choices: JourneyChoices, random = Math.random): ComposedJourney {
  const landscape = landscapes.find((item) => item.id === choices.landscape)!
  const selected = choices.resources.map((id) => resources.find((item) => item.id === id)!).filter(Boolean)
  const navigation = navigationStyles.find((item) => item.id === choices.navigationStyle)!
  const replacements: Record<string,string> = {
    resources: selected.map((item) => item.title.toLocaleLowerCase('fr-FR')).join(', ').replace(/, ([^,]*)$/, ' et $1'), landscape:landscape.title.toLocaleLowerCase('fr-FR'), landscapeDescription:landscape.description,
    resourceOne: pick(selected[0]?.formulations ?? ['un repère discret'], random), resourceTwo: pick((selected[1] ?? selected[0])?.formulations ?? ['un souffle léger'], random), navigation:navigation.narrative,
  }
  const usedIds: string[] = []
  const scenes = oceanJourneyPartition.movements.map((part) => {
    const scene = resolveScene(part.movement, choices, sceneLibrary, usedIds, random)
    if (!scene) throw new Error(`Aucune scène pour ${part.movement}`)
    usedIds.push(scene.id)
    const template = pick(scene.text.variants, random)
    const renderedText = template.replace(/\{(\w+)\}/g, (_, key:string) => replacements[key] ?? '')
    return {...scene,durationMs:part.durationMs,renderedText}
  })
  const journey = {id:crypto.randomUUID(),partitionId:oceanJourneyPartition.id,choices,scenes}
  if (!validateJourney(journey,oceanJourneyPartition)) throw new Error('Traversée incomplète')
  return journey
}
