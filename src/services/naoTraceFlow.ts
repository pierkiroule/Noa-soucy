import type { AddNaoPasserInput, NaoPasser } from '../types/naoPassages.ts'
import { addNaoPasser } from './naoPassages.ts'

export function leaveNaoTrace(input: AddNaoPasserInput): Promise<NaoPasser> {
  return addNaoPasser(input)
}

export function continueWithoutNaoTrace(onContinue: () => void): void {
  onContinue()
}
