import type { ComposedScene, SceneMedium } from '../types'
import { AudioSceneRenderer } from './AudioSceneRenderer'; import { TextSceneRenderer } from './TextSceneRenderer'; import { ThreeSceneRenderer } from './ThreeSceneRenderer'; import { VideoSceneRenderer } from './VideoSceneRenderer'
import { resolveMedium } from './resolveMedium'
export function SceneRenderer({scene,medium='text'}:{scene:ComposedScene;medium?:SceneMedium}) { const resolved=resolveMedium(scene,medium); if(resolved==='audio')return <AudioSceneRenderer scene={scene}/>; if(resolved==='video')return <VideoSceneRenderer scene={scene}/>; if(resolved==='three')return <ThreeSceneRenderer scene={scene}/>; return <TextSceneRenderer scene={scene}/> }
