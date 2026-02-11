import type { BiometricSnapshot } from '../types'

interface KPICardsProps {
  snapshot: BiometricSnapshot | null
}

function valueClass(value: number, lowGood: boolean, thresholds: { good: number; warn: number }) {
  if (lowGood) {
    if (value <= thresholds.good) return 'good'
    if (value <= thresholds.warn) return 'warn'
    return 'bad'
  }
  if (value >= thresholds.good) return 'good'
  if (value >= thresholds.warn) return 'warn'
  return 'bad'
}

export function KPICards({ snapshot }: KPICardsProps) {
  if (!snapshot) {
    return (
      <div className="kpi-grid">
        <div className="kpi-card"><span className="label">Nervous system</span><span className="value">—</span><span className="sublabel">Waiting for Arduino…</span></div>
      </div>
    )
  }

  const nsClass = valueClass(snapshot.nervousSystemScore, false, { good: 70, warn: 50 })
  const stressClass = valueClass(snapshot.stressLevel, true, { good: 30, warn: 50 })
  const relaxClass = valueClass(snapshot.relaxationIndex, false, { good: 60, warn: 40 })

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <span className="label">Nervous system score</span>
        <span className={`value ${nsClass}`}>{snapshot.nervousSystemScore.toFixed(1)}</span>
        <span className="sublabel">0–100, higher = calmer</span>
      </div>
      <div className="kpi-card">
        <span className="label">HRV proxy</span>
        <span className="value">{snapshot.hrvProxy.toFixed(1)}</span>
        <span className="sublabel">ms (from sound)</span>
      </div>
      <div className="kpi-card">
        <span className="label">Coherence</span>
        <span className="value">{(snapshot.coherence * 100).toFixed(0)}%</span>
        <span className="sublabel">Heart–brain alignment</span>
      </div>
      <div className="kpi-card">
        <span className="label">Stress level</span>
        <span className={`value ${stressClass}`}>{snapshot.stressLevel.toFixed(1)}</span>
        <span className="sublabel">Lower is better</span>
      </div>
      <div className="kpi-card">
        <span className="label">Relaxation index</span>
        <span className={`value ${relaxClass}`}>{snapshot.relaxationIndex.toFixed(1)}</span>
        <span className="sublabel">0–100</span>
      </div>
      <div className="kpi-card">
        <span className="label">Breathing rate</span>
        <span className="value">{snapshot.breathingRate.toFixed(1)}</span>
        <span className="sublabel">breaths/min</span>
      </div>
    </div>
  )
}
