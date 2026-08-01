import type { JourneyPartition } from '../types'
export const oceanJourneyPartition: JourneyPartition = { id:'ocean-journey', title:'La traversée de Nao', durationMs:120000, movements:[
  ['opening',8000],['embarkation',10000],['departure',10000],['landscape',12000],['first-resource',10000],['deepening',10000],['passage',12000],['second-resource',10000],['navigation',10000],['shift',10000],['horizon',10000],['provisional-shore',8000]
].map(([movement,durationMs]) => ({movement:movement as JourneyPartition['movements'][number]['movement'],durationMs:durationMs as number,required:true})) }
