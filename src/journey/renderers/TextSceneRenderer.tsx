import type { ComposedScene } from '../types'
export function TextSceneRenderer({scene}:{scene:ComposedScene}) { return <p className="scene-text">{scene.renderedText}</p> }
