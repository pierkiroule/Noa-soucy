import type { PlantGrowthStage, ResonanceNode } from '../types/resonanceSeeds'

export interface PositionedNode extends ResonanceNode { x:number; y:number; depth:number }

export function getPlantGrowthStage(nodeCount:number): PlantGrowthStage {
  if (nodeCount === 0) return 'seed'
  if (nodeCount <= 3) return 'sprout'
  if (nodeCount <= 6) return 'stem'
  if (nodeCount <= 10) return 'leaves'
  if (nodeCount <= 15) return 'bud'
  return 'flower'
}

export function layoutRootNetwork(nodes:ResonanceNode[], width=360): PositionedNode[] {
  const byParent = new Map<string|null, ResonanceNode[]>()
  nodes.forEach(node => byParent.set(node.parentId, [...(byParent.get(node.parentId) ?? []), node]))
  const result:PositionedNode[] = []
  const place = (node:ResonanceNode, depth:number, center:number, spread:number) => {
    result.push({ ...node, depth, x:center, y:50 + depth * 92 })
    const children = byParent.get(node.id) ?? []
    children.forEach((child, index) => place(child, depth + 1, center + (index - (children.length - 1) / 2) * spread, Math.max(42, spread * .62)))
  }
  const roots = byParent.get(null) ?? []
  roots.forEach((node, index) => place(node, 1, width/2 + (index - (roots.length - 1)/2) * Math.min(92, width/Math.max(roots.length, 3)), 74))
  return result.map(node => ({ ...node, x:Math.max(42, Math.min(width-42, node.x)) }))
}
