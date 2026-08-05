import assert from 'node:assert/strict'
import test from 'node:test'
import { initializeFlyingBubbles, limitBubbleSpeed, stepFlyingBubbles } from './flyingBubblesMotion.ts'

test('initializes flying bubbles inside the viewport', () => { const bubbles = initializeFlyingBubbles(900, 700, 'a'); assert.equal(bubbles.length, 14); assert.ok(bubbles.every(bubble => bubble.position.x >= 0 && bubble.position.y >= 0 && bubble.radius > 0)) })
test('flying bubbles move every frame and stay speed-limited', () => { const bubbles = initializeFlyingBubbles(900, 700, 'move'); const next = stepFlyingBubbles(bubbles, 32, 900, 700, 1000); assert.ok(next.some((bubble, index) => bubble.position.x !== bubbles[index].position.x || bubble.position.y !== bubbles[index].position.y)); assert.ok(Math.hypot(limitBubbleSpeed({ ...bubbles[0], velocity: { x: 9, y: 9 } }).velocity.x, limitBubbleSpeed({ ...bubbles[0], velocity: { x: 9, y: 9 } }).velocity.y) <= 0.16001) })
test('flying bubbles rebound on screen edges', () => { const [bubble] = initializeFlyingBubbles(900, 700, 'edge'); const [next] = stepFlyingBubbles([{ ...bubble, position: { x: -20, y: -20 }, velocity: { x: -0.04, y: -0.04 } }], 32, 900, 700, 1000); assert.ok(next.position.x >= 10); assert.ok(next.position.y >= 18); assert.ok(next.velocity.x > 0); assert.ok(next.velocity.y > 0) })
