import { useAuth } from '../../hooks/useAuth.jsx'

function ProfilePage() {
  const { user, signOut } = useAuth()

  return (
    <div className="glass-card" style={{ padding: 24 }}>
      <p className="section-label">Account</p>
      <h1>Profile</h1>
      {user?.email && <p>{user.email}</p>}
      <button className="cta-button" style={{ padding: '12px 20px' }} onClick={signOut}>
        Sign out
      </button>
    </div>
  )
}

export default ProfilePage
