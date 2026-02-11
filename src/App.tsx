import { useMemo, useState } from 'react'
import { generateMockBiometricSeries, getLatestSnapshot } from './data/mockArduinoData'
import type { TimeRange } from './types'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { FilterBar } from './components/FilterBar'
import { KPICards } from './components/KPICards'
import { Charts } from './components/Charts'

function App() {
  const [timeRange, setTimeRange] = useState<TimeRange>('6h')

  const { series, latest } = useMemo(() => {
    const points = timeRange === '1h' ? 60 : timeRange === '6h' ? 120 : timeRange === '24h' ? 96 : 168
    const interval = timeRange === '1h' ? 60 * 1000 : timeRange === '6h' ? 30 * 1000 : timeRange === '24h' ? 15 * 60 * 1000 : 60 * 60 * 1000
    const s = generateMockBiometricSeries(points, interval)
    return { series: s, latest: getLatestSnapshot(s) }
  }, [timeRange])

  return (
    <div className="app">
      <Sidebar />
      <TopBar />
      <main className="main">
        <FilterBar timeRange={timeRange} onTimeRangeChange={setTimeRange} />
        <KPICards snapshot={latest} />
        <Charts series={series} timeRange={timeRange} />
      </main>
    </div>
  )
}

export default App
