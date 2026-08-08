export function shouldUseMockNutAccess(configuredMode: string | undefined, isDevelopment: boolean): boolean {
  if (configuredMode === 'true') return true
  if (configuredMode === 'false') return false
  return isDevelopment
}
