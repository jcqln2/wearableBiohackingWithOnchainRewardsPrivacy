import type { BiometricSnapshot } from '../types'

const now = Date.now()

function randomWalk(base: number, range: number, step: number): number {
  return Math.max(0, Math.min(100, base + (Math.random() - 0.5) * range * step))
}

/** Generates mock biometric time series as if from Arduino sound analysis */
export function generateMockBiometricSeries(
  points: number = 120,
  intervalMs: number = 30 * 1000
): BiometricSnapshot[] {
  const series: BiometricSnapshot[] = []
  let nScore = 65
  let hrv = 45
  let coherence = 0.6
  let stress = 35
  let relaxation = 60
  let breathing = 14
  let audio = 0.3

  for (let i = points - 1; i >= 0; i--) {
    const t = now - i * intervalMs
    nScore = randomWalk(nScore, 8, 1)
    hrv = randomWalk(hrv, 6, 1)
    coherence = Math.max(0, Math.min(1, coherence + (Math.random() - 0.48) * 0.08))
    stress = randomWalk(stress, 6, 1)
    relaxation = randomWalk(relaxation, 6, 1)
    breathing = Math.max(8, Math.min(22, breathing + (Math.random() - 0.5) * 1.5))
    audio = Math.max(0.1, Math.min(0.9, audio + (Math.random() - 0.5) * 0.15))

    series.push({
      timestamp: t,
      nervousSystemScore: Math.round(nScore * 10) / 10,
      hrvProxy: Math.round(hrv * 10) / 10,
      coherence: Math.round(coherence * 100) / 100,
      stressLevel: Math.round(stress * 10) / 10,
      relaxationIndex: Math.round(relaxation * 10) / 10,
      breathingRate: Math.round(breathing * 10) / 10,
      audioLevel: Math.round(audio * 100) / 100,
    })
  }

  return series
}

/** Single latest reading (for KPI cards) */
export function getLatestSnapshot(series: BiometricSnapshot[]): BiometricSnapshot | null {
  return series.length ? series[series.length - 1] : null
}
