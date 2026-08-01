import type { ComposedScene } from '../types'
import { TextSceneRenderer } from './TextSceneRenderer'
export function ThreeSceneRenderer({scene}:{scene:ComposedScene}) { return <TextSceneRenderer scene={scene} /> }
