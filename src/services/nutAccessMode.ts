export const DEMO_NUT_TOKEN = 'nao-demo-token'

export function shouldUseMockNutAccess(configuredMode: string | undefined, isDevelopment: boolean): boolean {
  if (configuredMode === 'true') return true
  if (configuredMode === 'false') return false
  return isDevelopment
}

export function isDemoNutToken(nutToken: string): boolean {
  return nutToken === DEMO_NUT_TOKEN
}
