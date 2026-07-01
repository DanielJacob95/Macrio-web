import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { DashboardIcon, DiaryIcon, ProfileIcon, ChevronIcon } from './navIcons.jsx'
import TopBar from './TopBar.jsx'
import Footer from './Footer.jsx'
import './AppShell.css'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { to: '/diary', label: 'Diary', Icon: DiaryIcon },
  { to: '/profile', label: 'Profile', Icon: ProfileIcon },
]

const LEGAL_LINKS = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/support', label: 'Support' },
]

const SIDEBAR_EXPANDED_KEY = 'macrio_sidebarExpanded'

function AppShell() {
  const [expanded, setExpanded] = useState(
    () => localStorage.getItem(SIDEBAR_EXPANDED_KEY) === 'true',
  )

  useEffect(() => {
    localStorage.setItem(SIDEBAR_EXPANDED_KEY, String(expanded))
  }, [expanded])

  return (
    <div className={`app-shell ${expanded ? 'app-shell--sidebar-expanded' : ''}`}>
      <div className="app-shell__background" />

      <TopBar />

      <nav className="app-shell__nav glass-card">
        <button
          type="button"
          className="app-shell__nav-toggle"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <ChevronIcon />
        </button>

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

        <div className="app-shell__nav-legal">
          <div className="app-shell__nav-divider" />
          {expanded ? (
            LEGAL_LINKS.map(({ to, label }) => (
              <Link key={to} to={to} className="app-shell__legal-link">
                {label}
              </Link>
            ))
          ) : (
            <button
              type="button"
              className="app-shell__legal-toggle"
              onClick={() => setExpanded(true)}
              aria-label="Legal and support links"
            >
              ℹ️
            </button>
          )}
        </div>
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
