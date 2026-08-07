const DEVICE_ID_KEY = 'nao-device-id'

export function getOrCreateDeviceId(): string {
  const existing = localStorage.getItem(DEVICE_ID_KEY)
  if (existing) return existing
  const next = crypto.randomUUID()
  localStorage.setItem(DEVICE_ID_KEY, next)
  return next
}
