import type { StoryDefinition, StoryboardBlock } from '../types/story'

function validateStory(value: unknown): asserts value is StoryDefinition {
  if (!value || typeof value !== 'object') throw new Error('Le fichier du conte est invalide.')
  const story = value as Partial<StoryDefinition>
  if (!story.metadata?.id || !story.metadata.title || typeof story.metadata.version !== 'number' || !story.acts || !story.choices || !story.resonances || !story.endings || !Array.isArray(story.storyboard)) throw new Error('Le conte ne contient pas toutes les sections requises.')
  for (const block of story.storyboard as StoryboardBlock[]) {
    if (block.type === 'resonance') {
      if (!story.choices[block.fromChoice]) throw new Error(`La question « ${block.fromChoice} » est introuvable.`)
      continue
    }
    const library = block.type === 'act' ? story.acts : block.type === 'choice' ? story.choices : story.endings
    if (!library[block.module]) throw new Error(`Le module « ${block.module} » est introuvable.`)
  }
  for (const choice of Object.values(story.choices)) for (const option of choice.options) if (!story.resonances[option.resonanceId]) throw new Error(`La résonance « ${option.resonanceId} » est introuvable.`)
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
