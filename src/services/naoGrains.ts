export const suggestedGrains = ['horizon', 'silence', 'frisson', 'brume', 'souffle', 'sillage', 'lueur', 'flottement', 'écume', 'vertige', 'murmure', 'immensité', 'reflet', 'balancement', 'profondeur', 'fleur', 'ressac', 'ouverture', 'lointain', 'enveloppement']

export function cleanGrain(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}
