export type StoryMediaVariant = 'prologue' | 'act' | 'resonance' | 'epilogue'
export interface FloatingWordsStoryboardBlock { id:string; type:'floating-words'; module:'floating-words-main'; title:string; enabled:boolean; optional:boolean; visibleWordCount?:number }
export interface StoryMedia { video:string; music:string }
export interface StoryMediaBlock { id:string; type:StoryMediaVariant; title:string; text:string; media:StoryMedia }
export interface StoryChoice { id:string; label:string; resonance:StoryMediaBlock }
export interface StoryQuestion { id:string; type:'question'; title:string; text:string; choices:StoryChoice[] }
export type StoryBlock = StoryMediaBlock | StoryQuestion | FloatingWordsStoryboardBlock
export interface StoryDocument { version:number; id:string; title:string; subtitle:string; blocks:StoryBlock[]; floatingWords?:Record<string,{ id:string; title:string; enabled:boolean; optional:boolean; visibleWordCount:number }> }

export const storyMediaUrl = (file: string) => `/story/${file}`

export async function loadStory(): Promise<StoryDocument> {
  const response = await fetch('/story/story.json')
  if (!response.ok) throw new Error(`Impossible de charger story.json (${response.status})`)
  return response.json() as Promise<StoryDocument>
}

export function preloadNextStoryMedia(media?: StoryMedia) {
  if (!media || typeof document === 'undefined') return () => undefined
  const video = document.createElement('link')
  video.rel = 'preload'; video.as = 'video'; video.href = storyMediaUrl(media.video)
  document.head.append(video)
  return () => { video.remove() }
}

export function getNextMedia(blocks: StoryBlock[], index: number): StoryMedia | undefined {
  const next = blocks[index + 1]
  return !next || next.type === 'question' || next.type === 'floating-words' ? undefined : next.media
}
