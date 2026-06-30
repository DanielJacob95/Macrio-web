import { NavLink, Outlet } from 'react-router-dom'
import { DashboardIcon, SearchIcon, InsightsIcon, ProfileIcon } from './navIcons.jsx'
import './AppShell.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/search', label: 'Search', Icon: SearchIcon },
  { to: '/insights', label: 'Insights', Icon: InsightsIcon },
  { to: '/profile', label: 'Profile', Icon: ProfileIcon },
]

function AppShell() {
  return (
    <div className="app-shell">
      <div className="app-shell__background" />

      <nav className="app-shell__nav glass-card">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              'app-shell__nav-item' + (isActive ? ' app-shell__nav-item--active' : '')
            }
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell
