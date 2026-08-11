import { createContext, useContext, type ReactNode } from 'react'

interface NaoTravelValue {
  nutId?: string
  isNfcJourney: boolean
  showPassers: () => void
}

const NaoTravelContext = createContext<NaoTravelValue>({ isNfcJourney: false, showPassers: () => undefined })

export function NaoTravelProvider({ nutId, onShowPassers, children }: { nutId?: string; onShowPassers: () => void; children: ReactNode }) {
  return <NaoTravelContext value={{ nutId, isNfcJourney: Boolean(nutId), showPassers: onShowPassers }}>{children}</NaoTravelContext>
}

// Context hooks intentionally live beside their small provider.
// oxlint-disable-next-line react/only-export-components
export function useNaoTravel(): NaoTravelValue {
  return useContext(NaoTravelContext)
}
