import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import Spinner from './Spinner.jsx'

function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}

export default ProtectedRoute
