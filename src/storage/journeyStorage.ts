import type { ComposedJourney, SavedJourney } from '../journey/types'
const KEY = 'nao-souci:journeys:v1'
export function loadJourneys(): SavedJourney[] { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as SavedJourney[] } catch { return [] } }
export function saveJourney(journey: ComposedJourney): SavedJourney {
  const saved: SavedJourney = {id:journey.id,createdAt:new Date().toISOString(),partitionId:journey.partitionId,landscape:journey.choices.landscape,resources:journey.choices.resources,navigationStyle:journey.choices.navigationStyle,sceneIds:journey.scenes.map(({id})=>id),renderedTexts:journey.scenes.map(({renderedText})=>renderedText)}
  localStorage.setItem(KEY,JSON.stringify([...loadJourneys().filter(({id})=>id!==saved.id),saved])); return saved
}
