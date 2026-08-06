export type StoryMediaVariant = 'prologue' | 'act' | 'resonance' | 'epilogue'
export interface MetaphoricalResonancesStoryboardBlock { id:string; type:'metaphorical-resonances'; module:'metaphorical-resonances-main'; title:string; enabled:boolean; optional:boolean }
export interface StoryMedia { video:string; music:string }
export interface StoryMediaBlock { id:string; type:StoryMediaVariant; title:string; text:string; media:StoryMedia }
export interface StoryChoice { id:string; label:string; resonance:StoryMediaBlock }
export interface StoryQuestion { id:string; type:'question'; title:string; text:string; choices:StoryChoice[] }
export type StoryBlock = StoryMediaBlock | StoryQuestion | MetaphoricalResonancesStoryboardBlock
export interface StoryDocument { version:number; id:string; title:string; subtitle:string; blocks:StoryBlock[]; metaphoricalResonances?:Record<string,{ id:string; title:string; enabled:boolean; optional:boolean }> }

export const storyMediaUrl = (file: string) => `/story/${file}`

export async function loadStory(): Promise<StoryDocument> {
  const response = await fetch('/story/story.json')
  if (!response.ok) throw new Error(`Impossible de charger story.json (${response.status})`)
  return response.json() as Promise<StoryDocument>
}

export function preloadNextStoryMedia(media?: StoryMedia) {
  if (!media || typeof document === 'undefined') return () => undefined
  const connection = (navigator as Navigator & { connection?: { saveData?:boolean; effectiveType?:string } }).connection
  if (connection?.saveData || connection?.effectiveType === '2g' || connection?.effectiveType === 'slow-2g') return () => undefined
  const video = document.createElement('link')
  video.rel = 'preload'; video.as = 'video'; video.href = storyMediaUrl(media.video)
  document.head.append(video)
  return () => { video.remove() }
}

export function getNextMedia(blocks: StoryBlock[], index: number): StoryMedia | undefined {
  const next = blocks[index + 1]
  return !next || next.type === 'question' || next.type === 'metaphorical-resonances' ? undefined : next.media
}
