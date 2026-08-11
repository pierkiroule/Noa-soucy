export interface NaoPasser {
  id: number
  displayName: string
  locationLabel: string | null
  createdAt: string
  grains: string[]
}

export interface NaoPassagesResponse {
  nutId: string
  passers: NaoPasser[]
}

export interface AddNaoPasserInput {
  nutId: string
  displayName: string
  locationLabel?: string
  grains: string[]
}
