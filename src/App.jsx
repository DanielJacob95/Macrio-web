import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.jsx'
import Spinner from './components/Spinner.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AppShell from './components/AppShell.jsx'
import AuthPage from './pages/auth/AuthPage.jsx'
import LegalLayout from './pages/legal/LegalLayout.jsx'
import PrivacyPage from './pages/legal/PrivacyPage.jsx'
import TermsPage from './pages/legal/TermsPage.jsx'
import SupportPage from './pages/legal/SupportPage.jsx'
import DashboardPage from './pages/dashboard/DashboardPage.jsx'
import SearchPage from './pages/search/SearchPage.jsx'
import InsightsPage from './pages/insights/InsightsPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'

function RootRedirect() {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />
  return <Navigate to={user ? '/dashboard' : '/login'} replace />
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />

        <Route path="/privacy" element={<LegalLayout><PrivacyPage /></LegalLayout>} />
        <Route path="/terms" element={<LegalLayout><TermsPage /></LegalLayout>} />
        <Route path="/support" element={<LegalLayout><SupportPage /></LegalLayout>} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}

export default App
