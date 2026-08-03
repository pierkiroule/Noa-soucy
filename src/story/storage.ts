import type { StoryResponses } from './types'
// The final narrative has a different step order from the beta. A new key avoids
// restoring readers into the wrong act with an obsolete step index.
const KEY='nao-souci:story-progress:v3'
export interface StoredStoryProgress{currentStepIndex:number;responses:StoryResponses;date:string;completed:boolean}
export function saveStoryProgress(value:StoredStoryProgress){try{localStorage.setItem(KEY,JSON.stringify(value))}catch{console.warn('La progression locale n’a pas pu être enregistrée.')}}
export function loadStoryProgress():StoredStoryProgress|undefined{try{const raw=localStorage.getItem(KEY);return raw?JSON.parse(raw) as StoredStoryProgress:undefined}catch{return undefined}}
export function clearStoryProgress(){try{localStorage.removeItem(KEY)}catch{console.warn('La progression locale n’a pas pu être effacée.')}}
