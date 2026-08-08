export type NutAccessStatus = 'free' | 'mine' | 'locked'
export type NutAccessViewStatus = NutAccessStatus | 'loading' | 'error'

export interface NutAccessResult {
  status: NutAccessStatus
}

export interface NutAccessState {
  status: NutAccessViewStatus
  nutToken: string | null
  isAssociated: boolean
}

export interface NutSession {
  nutToken: string
  deviceId: string
  sessionToken: string
}
