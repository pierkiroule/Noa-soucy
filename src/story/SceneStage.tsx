import type { ActiveEffect,ResolvedSceneMedia,StoryScene,StoryVisualParameters } from './types'
import { sceneRegistry } from './placeholders'
interface Props{scene:StoryScene;media?:ResolvedSceneMedia;parameters:StoryVisualParameters;effects:ActiveEffect[];time:number;onMediaError:()=>void}
export function SceneStage({scene,media,parameters,effects,time,onMediaError}:Props){const Placeholder=sceneRegistry[scene.media.fallbackSceneId];return <div className="stage" data-scene={scene.id}>
 <div className="stage__media"><Placeholder time={time} parameters={parameters} effects={effects}/>{media?.kind==='video'&&<video className="stage__video" src={media.source} autoPlay muted playsInline onError={onMediaError}/>}</div>
 <div className="stage__watercolor"/><div className="stage__lines"/><div className="stage__particles"/><div className="stage__light"/><div className="stage__text"/><div className={`stage__transition stage__transition--${scene.transitionIn}`}/>
 </div>}
