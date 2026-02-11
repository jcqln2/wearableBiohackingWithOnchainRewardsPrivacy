import type { TimeRange } from '../types'

interface FilterBarProps {
  timeRange: TimeRange
  onTimeRangeChange: (r: TimeRange) => void
}

export function FilterBar({ timeRange, onTimeRangeChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <label htmlFor="time-range">Time range</label>
      <select
        id="time-range"
        value={timeRange}
        onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
      >
        <option value="1h">Last 1 hour</option>
        <option value="6h">Last 6 hours</option>
        <option value="24h">Last 24 hours</option>
        <option value="7d">Last 7 days</option>
      </select>
    </div>
  )
}
