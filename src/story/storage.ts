import type { StoryProgress } from './types'
const KEY='nao-souci:traversee'
export function loadProgress():StoryProgress { try { return JSON.parse(localStorage.getItem(KEY)??'{"step":0}') as StoryProgress } catch { return {step:0} } }
export function saveProgress(progress:StoryProgress){localStorage.setItem(KEY,JSON.stringify(progress))}
export function clearProgress(){localStorage.removeItem(KEY)}
