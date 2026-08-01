import type { JourneyScene, SceneMedium } from '../types'

export function resolveMedium(scene: JourneyScene, preferred: SceneMedium): SceneMedium {
  if (preferred === 'three' && scene.three?.sceneId) return 'three'
  if (preferred === 'video' && scene.video?.src) return 'video'
  if (preferred === 'audio' && scene.audio?.narration) return 'audio'
  return 'text'
}
