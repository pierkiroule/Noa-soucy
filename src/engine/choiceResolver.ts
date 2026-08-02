import type { StoryResponses, TextActModule, TextActVariant } from '../types/story'

export function selectActVariant(act: TextActModule, responses: StoryResponses): TextActVariant | undefined {
  const variants = act.variants ?? []
  return variants.find(({ when }) => when?.includes.some((id) => responses[when.choiceId]?.includes(id)))
    ?? variants.find(({ isDefault }) => isDefault)
    ?? variants[0]
}
