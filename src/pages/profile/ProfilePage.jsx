import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useTheme } from '../../hooks/useTheme.jsx'
import { supabase } from '../../lib/supabaseClient'
import { localDateString } from '../../hooks/useDashboardData'
import { gaugeThemeName } from '../../lib/gaugeTheme'
import './ProfilePage.css'

const GAUGE_OPTIONS = [
  { key: 'green', label: 'Forest' },
  { key: 'blue', label: 'Ocean' },
  { key: 'coral', label: 'Sunset' },
  { key: 'purple', label: 'Aurora' },
]

const LBS_PER_KG = 2.20462

function initialsFor(name, email) {
  const source = name?.trim() || email || ''
  if (!source) return '?'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function UserTypeBadge({ userType }) {
  if (userType === 'Test Mode') {
    return <span className="profile-badge profile-badge--test">Test Mode</span>
  }
  if (userType === 'Pro User') {
    return <span className="profile-badge profile-badge--pro">Pro ✓</span>
  }
  if (userType === 'Founders Edition') {
    return <span className="profile-badge profile-badge--founders">Founders Edition ✓</span>
  }
  return <span className="profile-badge profile-badge--free">Free</span>
}

function EditableRow({ icon, label, value, unit, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    setDraft(value)
  }, [value])

  const confirm = async () => {
    const parsed = parseFloat(draft)
    if (Number.isNaN(parsed)) return
    setEditing(false)
    await onSave(parsed)
  }

  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  return (
    <div className="profile-row">
      <span className="profile-row__icon">{icon}</span>
      <span className="profile-row__label">{label}</span>
      {editing ? (
        <div className="profile-row__edit">
          <input
            className="profile-row__input"
            type="number"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            className="profile-row__confirm"
            onClick={confirm}
            aria-label="Save"
          >
            ✓
          </button>
          <button type="button" className="profile-row__cancel" onClick={cancel} aria-label="Cancel">
            ×
          </button>
        </div>
      ) : (
        <button type="button" className="profile-row__value" onClick={() => setEditing(true)}>
          {value}
          {unit}
        </button>
      )}
    </div>
  )
}

function ProfilePage() {
  const { user, signOut } = useAuth()
  const { darkMode, setDarkMode, gaugeColour, setGaugeColour } = useTheme()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!user) return
    let cancelled = false

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (!cancelled) {
          setProfile(data)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [user])

  if (loading || !profile) {
    return (
      <div className="profile">
        <div className="glass-card profile__skeleton" style={{ height: 140 }} />
        <div className="glass-card profile__skeleton" style={{ height: 220 }} />
      </div>
    )
  }

  const updateField = async (field, value) => {
    setProfile((p) => ({ ...p, [field]: value }))
    await supabase.from('profiles').update({ [field]: value }).eq('id', user.id)
  }

  const handleSaveWeight = async (inputValue) => {
    const weightKg = profile.useMetric ? inputValue : inputValue / LBS_PER_KG
    setProfile((p) => ({ ...p, weightKg }))

    // Mirrors the mobile apps' logWeight(): a dated log entry, not just a
    // silent profile overwrite, so the weight-trend chart on Insights
    // picks it up too.
    await supabase
      .from('weight_logs')
      .upsert({ userId: user.id, loggedDate: localDateString(), weightKg }, { onConflict: 'userId,loggedDate' })
    await supabase.from('profiles').update({ weightKg }).eq('id', user.id)
  }

  const handleGaugeColourSelect = async (key) => {
    setGaugeColour(key)
    await supabase.from('profiles').update({ gaugeColour: key }).eq('id', user.id)
  }

  const handleDarkModeToggle = async () => {
    const next = !darkMode
    setDarkMode(next)
    await supabase.from('profiles').update({ darkMode: next }).eq('id', user.id)
  }

  const handleExportCsv = async () => {
    const { data } = await supabase
      .from('food_logs')
      .select('*')
      .eq('userId', user.id)
      .order('loggedDate')

    const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
    const header =
      'Date,Meal,Food,Brand,Quantity(g),Calories,Protein(g),Carbs(g),Fat(g),Fibre(g),Sugar(g),Salt(g)'
    const rows = (data ?? []).map((log) =>
      [
        log.loggedDate,
        log.mealType,
        escape(log.foodName),
        escape(log.brand),
        log.quantityG,
        log.kcal,
        log.proteinG,
        log.carbsG,
        log.fatG,
        log.fibreG,
        log.sugarG,
        log.saltG,
      ].join(','),
    )

    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `macrio_export_${localDateString()}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleDeleteData = async () => {
    const confirmed = window.confirm(
      'This permanently deletes all your logged food, water, and weight data plus your profile settings. This cannot be undone. Continue?',
    )
    if (!confirmed) return

    setDeleting(true)
    await supabase.from('food_logs').delete().eq('userId', user.id)
    await supabase.from('water_logs').delete().eq('userId', user.id)
    await supabase.from('weight_logs').delete().eq('userId', user.id)
    await supabase.from('profiles').delete().eq('id', user.id)
    await signOut()
    navigate('/login')
  }

  const weightDisplay = profile.useMetric ? profile.weightKg : profile.weightKg * LBS_PER_KG

  return (
    <div className="profile">
      <div className="glass-card profile__avatar-card">
        <div className="profile__avatar">{initialsFor(profile.name, user?.email)}</div>
        <h1 className="profile__name">{profile.name || 'Macrio user'}</h1>
        {user?.email && <p className="profile__email">{user.email}</p>}
        <UserTypeBadge userType={profile.userType} />
      </div>

      <p className="section-label">Goals &amp; Targets</p>
      <div className="glass-card profile__section">
        <EditableRow
          icon="🎯"
          label="Daily Calorie Goal"
          value={profile.dailyCalorieGoal}
          unit=" kcal"
          onSave={(v) => updateField('dailyCalorieGoal', Math.round(v))}
        />
        <EditableRow
          icon="💪"
          label="Protein Target"
          value={profile.proteinGoalG}
          unit="g"
          onSave={(v) => updateField('proteinGoalG', Math.round(v))}
        />
        <div className="profile-row">
          <span className="profile-row__icon">📏</span>
          <span className="profile-row__label">Units</span>
          <div className="profile-row__units">
            <button
              type="button"
              className={`pill-button ${profile.useMetric ? 'pill-button--active' : ''}`}
              onClick={() => updateField('useMetric', true)}
            >
              Metric
            </button>
            <button
              type="button"
              className={`pill-button ${!profile.useMetric ? 'pill-button--active' : ''}`}
              onClick={() => updateField('useMetric', false)}
            >
              Imperial
            </button>
          </div>
        </div>
        <EditableRow
          icon="⚖️"
          label="Current Weight"
          value={Math.round(weightDisplay * 10) / 10}
          unit={profile.useMetric ? 'kg' : 'lbs'}
          onSave={handleSaveWeight}
        />
      </div>

      <p className="section-label">Gauge Colour</p>
      <div className="glass-card profile__section profile__gauge-row">
        {GAUGE_OPTIONS.map(({ key, label }) => {
          const theme = gaugeThemeName(key)
          return (
            <button
              key={key}
              type="button"
              className={`gauge-swatch ${gaugeColour === key ? 'gauge-swatch--selected' : ''}`}
              style={{
                '--swatch-main': `var(--gauge-${theme}-main)`,
                '--swatch-gradient': `linear-gradient(135deg, var(--gauge-${theme}-light), var(--gauge-${theme}-main), var(--gauge-${theme}-mid))`,
              }}
              onClick={() => handleGaugeColourSelect(key)}
              aria-label={label}
            >
              <span className="gauge-swatch__outer-ring" />
              <span className="gauge-swatch__white-ring" />
              <span className="gauge-swatch__fill" />
            </button>
          )
        })}
      </div>

      <p className="section-label">Appearance</p>
      <div className="glass-card profile__section profile__appearance-row">
        <span className="profile-row__label">Dark Mode</span>
        <button
          type="button"
          className={`dark-toggle ${darkMode ? 'dark-toggle--on' : ''}`}
          onClick={handleDarkModeToggle}
          aria-pressed={darkMode}
          aria-label="Toggle dark mode"
        >
          <span className="dark-toggle__thumb" />
        </button>
      </div>

      <p className="section-label">Account</p>
      <div className="glass-card profile__section">
        <button type="button" className="profile-row profile-row--action" onClick={handleExportCsv}>
          <span className="profile-row__icon">📤</span>
          <span className="profile-row__label">Export My Data (CSV)</span>
        </button>
        <button type="button" className="profile-row profile-row--action" onClick={handleSignOut}>
          <span className="profile-row__icon">🚪</span>
          <span className="profile-row__label">Sign Out</span>
        </button>
        <button
          type="button"
          className="profile-row profile-row--action profile-row--danger"
          onClick={handleDeleteData}
          disabled={deleting}
        >
          <span className="profile-row__icon">🗑️</span>
          <span className="profile-row__label">
            {deleting ? 'Deleting…' : 'Delete Account'}
          </span>
        </button>
        <p className="profile__delete-note">
          This deletes your logged data, but not your login itself. To fully delete your
          account, email{' '}
          <a href="mailto:daniel.jacob.95@outlook.com">daniel.jacob.95@outlook.com</a>.
        </p>
      </div>
    </div>
  )
}

export default ProfilePage
