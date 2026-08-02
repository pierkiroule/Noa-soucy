import type { ResolvedSceneMedia, StoryScene } from './types'
export type MediaProbe=(url:string)=>Promise<boolean>
export const browserMediaProbe:MediaProbe=async url=>{try{const response=await fetch(url,{method:'HEAD'});if(!response.ok)return false;const contentType=response.headers.get('content-type')??'';return contentType.startsWith('video/')||contentType.includes('octet-stream')}catch{return false}}
export async function resolveSceneMedia(scene:StoryScene,probe?:MediaProbe):Promise<ResolvedSceneMedia>{if(!scene.media.video)return{kind:'placeholder',fallbackSceneId:scene.media.fallbackSceneId};try{
 // The video element is the reliable browser-level probe. Some static hosts reject
 // HEAD requests or omit Content-Length even though the MP4 can be played.
 if(!probe||await probe(scene.media.video))return{kind:'video',source:scene.media.video,fallbackSceneId:scene.media.fallbackSceneId}
 }catch{/* A custom probe must never stop the story. */}const warning=`Média indisponible pour ${scene.id}; utilisation du placeholder.`;console.warn(warning);return{kind:'placeholder',fallbackSceneId:scene.media.fallbackSceneId,warning}}
