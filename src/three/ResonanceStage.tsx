import { useEffect, useRef } from 'react'
import type { AudioReactiveValues } from '../engine/ResonanceAudioAnalyzer'
import type { ResonanceThreeConfig } from '../types/story'
import { getResonanceScene } from './resonanceSceneRegistry'


export function ResonanceStage({ config, values }: { config?: ResonanceThreeConfig; values: AudioReactiveValues }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    let frame = 0, animation = 0
    const style = getResonanceScene(config?.sceneId)
    const draw = () => {
      const width = canvas.clientWidth, height = canvas.clientHeight, ratio = Math.min(devicePixelRatio, 2)
      if (canvas.width !== width * ratio || canvas.height !== height * ratio) { canvas.width = width * ratio; canvas.height = height * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0) }
      context.clearRect(0, 0, width, height); context.globalAlpha = 0.16 + values.level * 0.35
      const breath = Math.sin(frame / 65) * 8, spread = 34 + values.low * 45
      context.strokeStyle = style.color; context.fillStyle = style.accent; context.lineWidth = 1.2 + values.mid * 2
      for (let i = 0; i < 7; i++) { context.beginPath(); const y = height / 2 + (i - 3) * 14 + breath; context.moveTo(width * .12, y); context.bezierCurveTo(width * .35, y - spread, width * .65, y + spread, width * .88, y); context.stroke() }
      context.beginPath(); context.arc(width / 2, height / 2 + breath, 16 + values.high * 38, 0, Math.PI * 2); context.fill()
      frame++; animation = requestAnimationFrame(draw)
    }
    draw(); return () => cancelAnimationFrame(animation)
  }, [config, values])
  return <div className="resonance-stage" data-scene={config?.sceneId ?? 'fallback'}><canvas ref={canvasRef} aria-hidden="true" /><div className="resonance-fallback" aria-hidden="true" /></div>
}
