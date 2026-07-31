import type { TagDefinition } from '../types'
import { pierre } from './univers/pierre'
import { brume } from './univers/brume'
import type { PoetryUniverse } from './univers'

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function detectUniverse(tags: TagDefinition[]): PoetryUniverse {
  const ids = tags.map(t => t.id)

  const pierreScore = ids.filter(id =>
    ['heavy','block','freeze','last'].includes(id)
  ).length

  const brumeScore = ids.filter(id =>
    ['blur','loop','doubt','trap'].includes(id)
  ).length

  if (brumeScore > pierreScore) {
    return brume
  }

  return pierre
}

export function generatePoem(
  tags: TagDefinition[]
): string {

  const u = detectUniverse(tags)

  return [
    pick(u.intros),
    "",
    pick(u.images),
    pick(u.developments),
    "",
    pick(u.openings),
    "",
    pick(u.endings)
  ].join("\n")
}
