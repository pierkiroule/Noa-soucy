export type NutAccessStatus = 'free' | 'mine' | 'locked' | 'loading' | 'error'

export interface NutAccessState {
  status: NutAccessStatus
  nutToken: string | null
  isAssociated: boolean
}

export interface NutSession {
  nutToken: string
  deviceId: string
  sessionToken: string
}
