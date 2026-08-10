import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../index.css', import.meta.url), 'utf8')

test('long-form viewport layouts keep an explicit vertical scroll owner', () => {
  assert.match(css, /\.media-player__text-scroll\{[^}]*overflow-y:auto/)
  assert.match(css, /\.chapter-menu ol\{[^}]*overflow-y:auto/)
  assert.match(css, /\.compass-summary\{[^}]*overflow-x:hidden;overflow-y:auto/)
  assert.match(css, /\.public-home\{[^}]*height:100dvh;overflow-x:hidden;overflow-y:auto/)
  assert.match(css, /\.intro,\.completion,\.question-screen\{overflow-x:hidden;overflow-y:auto\}/)
})

test('compass direction content scrolls inside a fixed-height sheet', () => {
  assert.match(css, /\.resonance-panel\{position:fixed;top:[^}]*bottom:0;[^}]*display:flex;[^}]*overflow:hidden/)
  assert.match(css, /\.resonance-panel__content\{min-height:0;overflow-x:hidden;overflow-y:auto;[^}]*touch-action:pan-y/)
  assert.match(css, /\.compass-petal-fx:not\(\.resonance-panel\)\{position:relative\}/)
})
