import { useEffect, useRef } from 'react'
import type { AudioReactiveValues } from '../engine/ResonanceAudioAnalyzer'
import type { ResonanceThreeConfig } from '../types/story'
import { getResonanceScene, type ResonanceSceneStyle } from './resonanceSceneRegistry'

interface Point { x: number; y: number }
const TAU = Math.PI * 2

function watercolorCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, alpha = .08) {
  context.fillStyle = color
  for (let layer = 0; layer < 5; layer++) {
    context.globalAlpha = alpha
    context.beginPath()
    context.arc(x + Math.sin(layer * 2.7) * 3, y + Math.cos(layer * 1.9) * 2, radius * (1 + layer * .035), 0, TAU)
    context.fill()
  }
}

function organicPath(context: CanvasRenderingContext2D, points: Point[], color: string, alpha: number, width: number) {
  context.strokeStyle = color; context.globalAlpha = alpha; context.lineWidth = width; context.lineCap = 'round'; context.lineJoin = 'round'
  context.beginPath(); context.moveTo(points[0].x, points[0].y)
  for (let i = 1; i < points.length - 1; i++) { const midX = (points[i].x + points[i + 1].x) / 2, midY = (points[i].y + points[i + 1].y) / 2; context.quadraticCurveTo(points[i].x, points[i].y, midX, midY) }
  context.stroke()
}

function drawScene(context: CanvasRenderingContext2D, style: ResonanceSceneStyle, width: number, height: number, time: number, values: AudioReactiveValues) {
  const breath = Math.sin(time * .0008), pulse = 1 + values.level * .5 + breath * .04, cx = width / 2, cy = height / 2
  context.clearRect(0, 0, width, height)
  if (style.form === 'point') {
    watercolorCircle(context, cx, cy, (18 + values.low * 35) * pulse, style.color, .1)
    organicPath(context, [{ x: cx, y: cy + 14 }, { x: cx - 5, y: cy + 38 }, { x: cx + 9, y: cy + 64 }], style.accent, .35, 1.2 + values.mid * 2)
  } else if (style.form === 'leaf') {
    context.save(); context.translate(cx, cy); context.rotate(-.35 + breath * .08); context.scale(pulse, pulse)
    context.fillStyle = style.color; context.globalAlpha = .13; context.beginPath(); context.moveTo(0, -70); context.bezierCurveTo(75, -30, 65, 50, 0, 74); context.bezierCurveTo(-52, 38, -70, -30, 0, -70); context.fill()
    organicPath(context, [{ x: 0, y: -62 }, { x: -2, y: -10 }, { x: 0, y: 68 }], style.accent, .45, 1); context.restore()
  } else if (style.form === 'line') {
    organicPath(context, [{ x: width * .2, y: cy + 26 }, { x: width * .4, y: cy - 12 + breath * 6 }, { x: width * .62, y: cy + 8 }, { x: width * .82, y: cy - 30 }], style.color, .55, 2 + values.low * 3)
    for (let i = 0; i < 4; i++) watercolorCircle(context, width * (.34 + i * .1), cy + 32 + Math.sin(i + time * .001) * 5, 7, style.accent, .04)
  } else if (style.form === 'halo') {
    const gradient = context.createRadialGradient(cx, cy, 2, cx, cy, Math.min(width, height) * .42); gradient.addColorStop(0, `${style.accent}bb`); gradient.addColorStop(1, `${style.color}00`); context.fillStyle = gradient; context.globalAlpha = .5 + values.high * .3; context.fillRect(0, 0, width, height)
    watercolorCircle(context, cx, cy, 28 * pulse, style.color, .06)
  } else if (style.form === 'drops') {
    for (let i = 0; i < 18; i++) { const x = ((i * 79) % 101) / 101 * width, progress = (time * (.00005 + i % 3 * .000012) + i * .073) % 1, y = progress * height; organicPath(context, [{ x, y: y - 14 }, { x: x - 2, y }, { x: x + 1, y: y + 8 }], i % 2 ? style.color : style.accent, .18 + values.high * .35, .7 + values.level) }
  } else if (style.form === 'curves') {
    for (let i = 0; i < 8; i++) { const y = height * (.2 + i * .085), offset = Math.sin(time * .0006 + i) * 16; organicPath(context, [{ x: width * .08, y }, { x: width * .32, y: y - 25 + offset }, { x: width * .62, y: y + 18 - offset }, { x: width * .92, y: y - 4 }], i % 2 ? style.color : style.accent, .12 + values.mid * .3, .8 + values.level * 2) }
  } else if (style.form === 'horizon') {
    const y = cy + breath * 10; organicPath(context, [{ x: width * .06, y }, { x: width * .35, y: y + 2 }, { x: width * .65, y: y - 2 }, { x: width * .94, y }], style.color, .55, 1 + values.mid * 2)
    watercolorCircle(context, width * .72, y - 55, 24 + values.high * 18, style.accent, .05)
  } else if (style.form === 'flower') {
    context.save(); context.translate(cx, cy); context.rotate(time * .00004)
    for (let i = 0; i < 12; i++) { context.rotate(TAU / 12); context.fillStyle = i % 2 ? style.color : style.accent; context.globalAlpha = .11 + values.high * .15; context.beginPath(); context.ellipse(0, -42 * pulse, 15 + values.mid * 9, 38 * pulse, 0, 0, TAU); context.fill() }
    watercolorCircle(context, 0, 0, 22 + values.low * 18, '#6f5138', .08); context.restore()
  } else {
    for (let i = 0; i < 9; i++) { const y = height * (.24 + i * .065), wave = 18 + values.low * 40; organicPath(context, [{ x: 0, y }, { x: width * .28, y: y - wave + Math.sin(time * .0005 + i) * 8 }, { x: width * .62, y: y + wave }, { x: width, y: y - 4 }], i % 2 ? style.color : style.accent, .09 + values.level * .25, 1 + values.mid * 2) }
  }
  context.globalAlpha = 1
}

export function ResonanceStage({ config, values }: { config?: ResonanceThreeConfig; values: AudioReactiveValues }) {
  const canvasRef = useRef<HTMLCanvasElement>(null), valuesRef = useRef(values)
  valuesRef.current = values
  useEffect(() => {
    const canvas = canvasRef.current, context = canvas?.getContext('2d')
    if (!canvas || !context) return
    let animation = 0
    const style = getResonanceScene(config?.sceneId)
    const draw = (time: number) => {
      const width = canvas.clientWidth, height = canvas.clientHeight, ratio = Math.min(window.devicePixelRatio || 1, 2)
      if (canvas.width !== Math.floor(width * ratio) || canvas.height !== Math.floor(height * ratio)) { canvas.width = Math.floor(width * ratio); canvas.height = Math.floor(height * ratio); context.setTransform(ratio, 0, 0, ratio, 0, 0) }
      drawScene(context, style, width, height, time, valuesRef.current)
      animation = requestAnimationFrame(draw)
    }
    animation = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(animation)
  }, [config?.sceneId])
  return <div className="resonance-stage" data-scene={config?.sceneId ?? 'fallback'}><canvas ref={canvasRef} aria-hidden="true" /><div className="resonance-fallback" aria-hidden="true" /></div>
}
