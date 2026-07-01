import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { useTheme } from '../hooks/useTheme.jsx'
import { supabase } from '../lib/supabaseClient'
import './TopBar.css'

function initialsForEmail(email) {
  const local = email?.split('@')[0] ?? ''
  if (!local) return '?'
  return local.slice(0, 2).toUpperCase()
}

function TopBar() {
  const { user } = useAuth()
  const { darkMode, setDarkMode } = useTheme()

  const toggleDarkMode = async () => {
    const next = !darkMode
    setDarkMode(next)
    if (user) {
      await supabase.from('profiles').update({ darkMode: next }).eq('id', user.id)
    }
  }

  return (
    <div className="top-bar glass-card">
      <Link to="/dashboard" className="top-bar__logo">
        Macrio
      </Link>

      <div className="top-bar__actions">
        <button
          type="button"
          className={`dark-toggle dark-toggle--compact ${darkMode ? 'dark-toggle--on' : ''}`}
          onClick={toggleDarkMode}
          aria-pressed={darkMode}
          aria-label="Toggle dark mode"
        >
          <span className="dark-toggle__thumb" />
        </button>

        <Link to="/profile" className="avatar-circle top-bar__avatar" aria-label="Profile">
          {initialsForEmail(user?.email)}
        </Link>
      </div>
    </div>
  )
}

export default TopBar
