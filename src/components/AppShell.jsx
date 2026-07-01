import { NavLink, Outlet } from 'react-router-dom'
import { DashboardIcon, DiaryIcon, SearchIcon, InsightsIcon, ProfileIcon } from './navIcons.jsx'
import TopBar from './TopBar.jsx'
import Footer from './Footer.jsx'
import './AppShell.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/diary', label: 'Diary', Icon: DiaryIcon },
  { to: '/search', label: 'Search', Icon: SearchIcon },
  { to: '/insights', label: 'Insights', Icon: InsightsIcon },
  { to: '/profile', label: 'Profile', Icon: ProfileIcon },
]

function AppShell() {
  return (
    <div className="app-shell">
      <div className="app-shell__background" />

      <TopBar />

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
        <div className="app-shell__content">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  )
}

export default AppShell
