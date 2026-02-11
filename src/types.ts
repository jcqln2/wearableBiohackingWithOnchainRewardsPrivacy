/** Biometric / nervous-system metrics derived from Arduino sound input */
export interface BiometricSnapshot {
  timestamp: number
  /** 0–100, higher = calmer nervous system */
  nervousSystemScore: number
  /** Heart-rate variability proxy from sound (ms) */
  hrvProxy: number
  /** Coherence 0–1 (heart-brain alignment) */
  coherence: number
  /** Stress index 0–100, lower = better */
  stressLevel: number
  /** Relaxation index 0–100 */
  relaxationIndex: number
  /** Breathing rate proxy (breaths/min) from sound pattern */
  breathingRate: number
  /** Raw audio level used for derivation (dB proxy) */
  audioLevel: number
}

export type TimeRange = '1h' | '6h' | '24h' | '7d'
