import type { ParticleContext, ParticleMode } from './particleTypes.ts'

type Preset = Omit<ParticleContext, 'mode'|'intensity'>
export const particlePresets:Record<Exclude<ParticleMode, 'none'>, Preset> = {
  seed: { family:'pollen', density:.3, speed:.15, opacity:.08, audioBand:'mid', direction:'up' },
  water: { family:'droplets', density:.22, speed:.12, opacity:.07, audioBand:'low', direction:'down' },
  light: { family:'light-dust', density:.18, speed:.08, opacity:.09, audioBand:'high', direction:'drift' },
  wind: { family:'wind-lines', density:.12, speed:.2, opacity:.06, audioBand:'mid', direction:'right' },
  silence: { family:null, density:.03, speed:.03, opacity:.03, audioBand:'level', direction:'drift' },
}
export function getParticlePreset(mode:ParticleMode):Preset {
  return mode === 'none' ? { ...particlePresets.silence, density:0, opacity:.02 } : particlePresets[mode]
}
