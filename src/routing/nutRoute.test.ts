import assert from 'node:assert/strict'
import test from 'node:test'
import { readNutToken } from './nutRoute.ts'

test('la route NFC extrait son token et tolère le retour arrière', () => {
  assert.equal(readNutToken('/n/7fK9mQ2xP8vR4z'), '7fK9mQ2xP8vR4z')
  assert.equal(readNutToken('/n/7fK9mQ2xP8vR4z/'), '7fK9mQ2xP8vR4z')
})

test('un token absent ou invalide ne donne pas accès', () => {
  assert.equal(readNutToken('/'), null)
  assert.equal(readNutToken('/n/'), null)
  assert.equal(readNutToken('/n/a'), null)
  assert.equal(readNutToken('/n/token%2Fparasite'), null)
  assert.equal(readNutToken('/n/token-valide/ailleurs'), null)
})
