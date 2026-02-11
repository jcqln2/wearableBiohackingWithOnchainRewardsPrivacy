export function TopBar() {
  const now = new Date().toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  return (
    <header className="topbar">
      <span className="topbar-title">Nervous System Happiness — Live</span>
      <span className="topbar-meta">Arduino stream · {now}</span>
    </header>
  )
}
