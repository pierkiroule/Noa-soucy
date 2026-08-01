import type { ComposedScene } from '../types'
import { TextSceneRenderer } from './TextSceneRenderer'
export function VideoSceneRenderer({scene}:{scene:ComposedScene}) { return <TextSceneRenderer scene={scene} /> }
