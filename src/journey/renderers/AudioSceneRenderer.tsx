import type { ComposedScene } from '../types'
import { TextSceneRenderer } from './TextSceneRenderer'
export function AudioSceneRenderer({scene}:{scene:ComposedScene}) { return <TextSceneRenderer scene={scene} /> }
