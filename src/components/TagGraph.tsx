import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
} from 'd3-force'
import { tagLibrary } from '../data/tagLibrary'
import type {
  GraphLink,
  GraphNode,
  TagCategory,
} from '../types'
import { TagBubble } from './TagBubble'

interface TagGraphProps {
  selectedIds: string[]
  onToggle: (id: string) => void
}

function createNodes(): GraphNode[] {
  return tagLibrary.map((tag, index) => ({
    ...tag,
    selected: false,
    x: 80 + (index % 4) * 80,
    y: 70 + Math.floor(index / 4) * 70,
  }))
}

function createLinks(nodes: GraphNode[]): GraphLink[] {
  const links: GraphLink[] = []

  const categories: TagCategory[] = [
    'impact',
    'mental',
    'movement',
  ]

  categories.forEach((category) => {
    const group = nodes.filter(
      (node) => node.category === category,
    )

    group.forEach((node, index) => {
      const next = group[index + 1]

      if (next) {
        links.push({
          source: node.id,
          target: next.id,
          strength: 0.08,
        })
      }
    })
  })

  nodes.forEach((node, index) => {
    const nextGroupNode = nodes[index + 6]

    if (nextGroupNode) {
      links.push({
        source: node.id,
        target: nextGroupNode.id,
        strength: 0.025,
      })
    }
  })

  return links
}

function isGraphNode(
  value: string | GraphNode,
): value is GraphNode {
  return typeof value !== 'string'
}

export function TagGraph({
  selectedIds,
  onToggle,
}: TagGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const simulationRef =
    useRef<Simulation<GraphNode, GraphLink> | null>(null)

  const initialNodes = useMemo(createNodes, [])

  const initialLinks = useMemo(
    () => createLinks(initialNodes),
    [initialNodes],
  )

  const nodesRef = useRef<GraphNode[]>(initialNodes)
  const linksRef = useRef<GraphLink[]>(initialLinks)

  const [, forceRender] = useState(0)

  useEffect(() => {
    const element = containerRef.current

    if (!element) {
      return
    }

    function startSimulation(
      container: HTMLDivElement,
    ) {
      const width = Math.max(
        container.clientWidth,
        320,
      )

      const height = Math.max(
        container.clientHeight,
        430,
      )

      const categoryX: Record<TagCategory, number> = {
        impact: width * 0.28,
        mental: width * 0.72,
        movement: width * 0.5,
      }

      const categoryY: Record<TagCategory, number> = {
        impact: height * 0.38,
        mental: height * 0.38,
        movement: height * 0.74,
      }

      simulationRef.current?.stop()

      const simulation = forceSimulation<
        GraphNode,
        GraphLink
      >(nodesRef.current)
        .force(
          'links',
          forceLink<GraphNode, GraphLink>(
            linksRef.current,
          )
            .id((node) => node.id)
            .distance(105)
            .strength(
              (link) => link.strength ?? 0.04,
            ),
        )
        .force(
          'charge',
          forceManyBody<GraphNode>()
            .strength(-145),
        )
        .force(
          'collision',
          forceCollide<GraphNode>()
            .radius(60),
        )
        .force(
          'x',
          forceX<GraphNode>(
            (node) => categoryX[node.category],
          ).strength(0.12),
        )
        .force(
          'y',
          forceY<GraphNode>(
            (node) => categoryY[node.category],
          ).strength(0.12),
        )
        .alpha(1)
        .alphaDecay(0.04)
        .velocityDecay(0.52)
        .on('tick', () => {
          const horizontalPadding = 65
          const verticalPadding = 38

          nodesRef.current.forEach((node) => {
            node.x = Math.max(
              horizontalPadding,
              Math.min(
                width - horizontalPadding,
                node.x ?? width / 2,
              ),
            )

            node.y = Math.max(
              verticalPadding,
              Math.min(
                height - verticalPadding,
                node.y ?? height / 2,
              ),
            )
          })

          forceRender((value) => value + 1)
        })

      simulationRef.current = simulation
    }

    startSimulation(element)

    const observer = new ResizeObserver(() => {
      startSimulation(element)
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
      simulationRef.current?.stop()
      simulationRef.current = null
    }
  }, [])

  useEffect(() => {
    nodesRef.current.forEach((node) => {
      node.selected = selectedIds.includes(node.id)
    })

    forceRender((value) => value + 1)
  }, [selectedIds])

  return (
    <div
      ref={containerRef}
      className="graph-stage"
    >
      <svg
        className="graph-links"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        {linksRef.current.map((link, index) => {
          if (
            !isGraphNode(link.source) ||
            !isGraphNode(link.target)
          ) {
            return null
          }

          const active =
            link.source.selected &&
            link.target.selected

          return (
            <line
              key={`${link.source.id}-${link.target.id}-${index}`}
              x1={link.source.x ?? 0}
              y1={link.source.y ?? 0}
              x2={link.target.x ?? 0}
              y2={link.target.y ?? 0}
              className={
                active ? 'active-link' : ''
              }
            />
          )
        })}
      </svg>

      <div className="graph-nodes">
        {nodesRef.current.map((node) => (
          <TagBubble
            key={node.id}
            node={node}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}
