import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const { user } = useAuth()
  const { darkMode, setDarkMode } = useTheme()
  const [query, setQuery] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

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

      <form className="top-bar__search glass-card-small" onSubmit={handleSubmit}>
        <span className="top-bar__search-icon">🔍</span>
        <input
          className="top-bar__search-input"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search foods…"
        />
      </form>

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
