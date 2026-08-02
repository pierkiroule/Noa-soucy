import type { ComponentType } from 'react'
import { PlaceholderStage } from './PlaceholderStage'
import type { ActiveEffect,SceneId,StoryVisualParameters } from '../types'
export interface PlaceholderProps{time:number;parameters:StoryVisualParameters;effects:ActiveEffect[]}
const createPlaceholder=(sceneId:SceneId):ComponentType<PlaceholderProps>=>props=><PlaceholderStage {...props} sceneId={sceneId}/>
export const DriftPlaceholder=createPlaceholder('drift')
export const GrowthPlaceholder=createPlaceholder('growth')
export const NavigationPlaceholder=createPlaceholder('navigation')
export const sceneRegistry:Record<SceneId,ComponentType<PlaceholderProps>>={drift:DriftPlaceholder,growth:GrowthPlaceholder,navigation:NavigationPlaceholder}
