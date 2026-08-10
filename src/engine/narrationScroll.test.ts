import assert from 'node:assert/strict'
import test from 'node:test'
import { narrationScrollProgress, nextAutoScrollTop } from './narrationScroll.ts'

test('keeps the opening still, then reaches the end before narration finishes', () => {
  assert.equal(narrationScrollProgress(3, 100), 0)
  assert.equal(narrationScrollProgress(92, 100), 1)
  assert.equal(narrationScrollProgress(100, 100), 1)
})

test('maps the useful narration window linearly', () => {
  assert.equal(narrationScrollProgress(48, 100), .5)
})

test('fails safely until usable audio metadata is available', () => {
  assert.equal(narrationScrollProgress(10, 0), 0)
  assert.equal(narrationScrollProgress(Number.NaN, 100), 0)
})

test('converges smoothly in both directions when measurements change', () => {
  const forward = nextAutoScrollTop(400, 600, 16)
  const backward = nextAutoScrollTop(600, 400, 16)
  assert.ok(forward > 400 && forward < 600)
  assert.ok(backward > 400 && backward < 600)
})

test('caps long frame gaps so returning to the tab cannot cause a jump', () => {
  assert.equal(nextAutoScrollTop(100, 500, 10_000), nextAutoScrollTop(100, 500, 64))
})
