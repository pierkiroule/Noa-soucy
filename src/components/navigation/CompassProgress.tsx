export function CompassProgress({ current, total }: { current:number; total:number }) {
  return <p className="compass-progress" aria-live="polite">{current} / {total}</p>
}
