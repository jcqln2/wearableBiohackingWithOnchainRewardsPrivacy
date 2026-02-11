export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Nervous System</h1>
        <p>Biometric from Arduino sound</p>
      </div>
      <ul className="sidebar-nav">
        <li>
          <a href="#" className="active">
            <span className="icon" aria-hidden>📊</span>
            Dashboard
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon" aria-hidden>🔊</span>
            Sound input
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon" aria-hidden>📈</span>
            History
          </a>
        </li>
        <li>
          <a href="#">
            <span className="icon" aria-hidden>⚙️</span>
            Settings
          </a>
        </li>
      </ul>
    </aside>
  )
}
