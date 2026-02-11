import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import type { BiometricSnapshot, TimeRange } from '../types'

interface ChartsProps {
  series: BiometricSnapshot[]
  timeRange: TimeRange
}

function formatTime(ts: number, range: TimeRange): string {
  const d = new Date(ts)
  if (range === '7d') return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit' })
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

const CHART_COLORS = ['#3182ce', '#38a169', '#d69e2e', '#805ad5', '#e53e3e', '#00b5d8']

export function Charts({ series, timeRange }: ChartsProps) {
  const chartData = series.map((s) => ({
    time: formatTime(s.timestamp, timeRange),
    full: s.timestamp,
    nervousSystem: s.nervousSystemScore,
    stress: s.stressLevel,
    relaxation: s.relaxationIndex,
    hrv: s.hrvProxy,
    coherence: Math.round(s.coherence * 100),
    breathing: s.breathingRate,
  }))

  const latest = series[series.length - 1]
  const pieData = latest
    ? [
        { name: 'Calm', value: latest.nervousSystemScore, color: CHART_COLORS[0] },
        { name: 'Stress', value: latest.stressLevel, color: CHART_COLORS[4] },
        { name: 'Neutral', value: Math.max(0, 100 - latest.nervousSystemScore - latest.stressLevel), color: CHART_COLORS[2] },
      ].filter((d) => d.value > 0)
    : []

  return (
    <div className="charts-grid">
      <div className="chart-card full-width">
        <h3>Nervous system score over time (from Arduino sound)</h3>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="fillNervous" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#718096" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#718096" width={32} />
              <Tooltip
                labelFormatter={(_, payload) => payload[0]?.payload?.time}
                formatter={(value: number) => [value.toFixed(1), 'Score']}
                contentStyle={{ fontSize: 12, borderRadius: 6 }}
              />
              <Area
                type="monotone"
                dataKey="nervousSystem"
                stroke={CHART_COLORS[0]}
                strokeWidth={2}
                fill="url(#fillNervous)"
                name="Nervous system score"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Stress vs relaxation</h3>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="fillStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[4]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS[4]} stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="fillRelax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[1]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS[1]} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#718096" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#718096" width={28} />
              <Tooltip
                labelFormatter={(_, payload) => payload[0]?.payload?.time}
                formatter={(value: number, name: string) => [value.toFixed(1), name]}
                contentStyle={{ fontSize: 11, borderRadius: 6 }}
              />
              <Area type="monotone" dataKey="stress" stroke={CHART_COLORS[4]} strokeWidth={1.5} fill="url(#fillStress)" name="Stress" />
              <Area type="monotone" dataKey="relaxation" stroke={CHART_COLORS[1]} strokeWidth={1.5} fill="url(#fillRelax)" name="Relaxation" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>HRV proxy &amp; coherence (sound-derived)</h3>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="fillHrv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[5]} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={CHART_COLORS[5]} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#718096" />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="#718096" width={28} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10 }} stroke="#718096" width={28} />
              <Tooltip
                labelFormatter={(_, payload) => payload[0]?.payload?.time}
                formatter={(value: number, name: string) => [typeof value === 'number' ? value.toFixed(1) : value, name]}
                contentStyle={{ fontSize: 11, borderRadius: 6 }}
              />
              <Area yAxisId="left" type="monotone" dataKey="hrv" stroke={CHART_COLORS[5]} strokeWidth={1.5} fill="url(#fillHrv)" name="HRV (ms)" />
              <Area yAxisId="right" type="monotone" dataKey="coherence" stroke={CHART_COLORS[3]} strokeWidth={1.5} fill="transparent" name="Coherence %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Current state (calm / stress / neutral)</h3>
        <div className="chart-wrap">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name} ${value.toFixed(0)}`}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value: number) => value.toFixed(1)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="gauge-wrap">No data yet</div>
          )}
        </div>
      </div>

      <div className="chart-card full-width">
        <h3>Breathing rate (breaths/min from sound pattern)</h3>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="fillBreathing" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[2]} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CHART_COLORS[2]} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#718096" />
              <YAxis domain={[6, 24]} tick={{ fontSize: 11 }} stroke="#718096" width={32} />
              <Tooltip
                labelFormatter={(_, payload) => payload[0]?.payload?.time}
                formatter={(value: number) => [value.toFixed(1), 'breaths/min']}
                contentStyle={{ fontSize: 12, borderRadius: 6 }}
              />
              <Area
                type="monotone"
                dataKey="breathing"
                stroke={CHART_COLORS[2]}
                strokeWidth={2}
                fill="url(#fillBreathing)"
                name="Breathing rate"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
