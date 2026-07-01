import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import Footer from '../../components/Footer.jsx'
import './AuthPage.css'

function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signIn, signUp } = useAuth()

  const [mode, setMode] = useState(location.pathname === '/signup' ? 'signup' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setMode(location.pathname === '/signup' ? 'signup' : 'login')
  }, [location.pathname])

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  const toggleMode = () => {
    navigate(mode === 'login' ? '/signup' : '/login')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const action = mode === 'login' ? signIn : signUp
    const { error: authError } = await action(email, password)

    setSubmitting(false)
    if (authError) {
      setError(authError.message)
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div className="auth-page">
      <div className="glass-card auth-page__card">
        <p className="section-label">Macrio</p>
        <h1 className="auth-page__title">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>

        <form className="auth-page__form" onSubmit={handleSubmit}>
          <input
            className="auth-page__input"
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <input
            className="auth-page__input"
            type="password"
            placeholder="Password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
            required
          />

          {error && <p className="auth-page__error">{error}</p>}

          <button type="submit" className="cta-button auth-page__submit" disabled={submitting}>
            {submitting ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </form>

        <button type="button" className="auth-page__toggle" onClick={toggleMode}>
          {mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Log in'}
        </button>
      </div>

      <Footer />
    </div>
  )
}

export default AuthPage
