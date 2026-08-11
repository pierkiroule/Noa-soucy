import type { AddNaoPasserInput, NaoPassagesResponse, NaoPasser } from '../types/naoPassages.ts'

const endpoint = '/api/nao-passages'

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Nao passages request failed (${response.status})`)
  }

  return response.json() as Promise<T>
}

export async function getNaoPassers(nutId: string): Promise<NaoPassagesResponse> {
  const response = await fetch(`${endpoint}?nutId=${encodeURIComponent(nutId)}`)
  return readJson<NaoPassagesResponse>(response)
}

export async function addNaoPasser(input: AddNaoPasserInput): Promise<NaoPasser> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  const result = await readJson<{ passer: NaoPasser }>(response)
  return result.passer
}

function storageKey(nutId: string): string {
  return `nao-passer:${nutId}`
}

export function hasRegisteredNaoPassage(nutId: string): boolean {
  return typeof localStorage !== 'undefined' && localStorage.getItem(storageKey(nutId)) !== null
}

export function saveRegisteredNaoPassage(nutId: string, passerId: number): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(storageKey(nutId), String(passerId))
  }
}

