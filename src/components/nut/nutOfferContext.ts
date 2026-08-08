import { createContext, useContext } from 'react'

export const NutOfferContext = createContext<(() => void) | null>(null)
export function useNutOffer() { return useContext(NutOfferContext) }
