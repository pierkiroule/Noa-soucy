import type { StoryDefinition, StoryboardBlock } from '../types/story'

function validateStory(value: unknown): asserts value is StoryDefinition {
  if (!value || typeof value !== 'object') throw new Error('Le fichier du conte est invalide.')
  const story = value as Partial<StoryDefinition>
  if (!story.metadata?.id || !story.metadata.title || typeof story.metadata.version !== 'number' || !story.acts || !story.choices || !story.endings || !Array.isArray(story.storyboard)) throw new Error('Le conte ne contient pas toutes les sections requises.')
  for (const block of story.storyboard as StoryboardBlock[]) {
    const library = block.type === 'act' ? story.acts : block.type === 'choice' ? story.choices : block.type === 'pause' ? story.pauses : story.endings
    if (!library?.[block.module]) throw new Error(`Le module « ${block.module} » est introuvable.`)
  }
}
export async function loadStory(): Promise<StoryDefinition> {
  let response: Response
  try { response = await fetch('/story/story.json') } catch { throw new Error('Impossible de joindre le fichier du conte.') }
  if (!response.ok) throw new Error(`Impossible de charger le conte (erreur ${response.status}).`)
  let data: unknown
  try { data = await response.json() } catch { throw new Error('Le fichier du conte ne contient pas un JSON valide.') }
  validateStory(data)
  return data
}
