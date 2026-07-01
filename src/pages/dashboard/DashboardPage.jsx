import { Link } from 'react-router-dom'
import { useDashboardData } from '../../hooks/useDashboardData'
import { useTheme } from '../../hooks/useTheme.jsx'
import CalorieGauge from '../../components/CalorieGauge.jsx'
import MealBreakdownBar from '../../components/MealBreakdownBar.jsx'
import MacroGrid from '../../components/MacroGrid.jsx'
import './DashboardPage.css'

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

function greetingForHour(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function DashboardSkeleton() {
  return (
    <div className="dashboard">
      <div className="dashboard__skeleton dashboard__skeleton--header" />

      <div className="glass-card dashboard__gauge-card">
        <div className="dashboard__skeleton dashboard__skeleton--gauge" />
        <div className="dashboard__skeleton dashboard__skeleton--bar" />
      </div>

      <div className="dashboard__skeleton dashboard__skeleton--label" />
      <div className="dashboard__skeleton-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="dashboard__skeleton dashboard__skeleton--cell" />
        ))}
      </div>

      <div className="dashboard__actions">
        <div className="dashboard__skeleton dashboard__skeleton--action" />
        <div className="dashboard__skeleton dashboard__skeleton--action" />
      </div>
    </div>
  )
}

function DashboardPage() {
  const { profile, logs, loading, error, totals } = useDashboardData()
  const { gaugeColour } = useTheme()

  if (loading) {
    return <DashboardSkeleton />
  }

  const greeting = greetingForHour(new Date().getHours())

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <p className="dashboard__date">{DATE_FORMAT.format(new Date())}</p>
        <h1 className="dashboard__greeting">
          {greeting}, {profile?.name ?? 'there'}
        </h1>
      </header>

      {error && (
        <p className="dashboard__error">Couldn't load today's data. {error.message}</p>
      )}

      <div className="glass-card dashboard__gauge-card">
        <CalorieGauge
          consumed={totals.kcal}
          goal={profile?.dailyCalorieGoal ?? 2000}
          gaugeColour={gaugeColour}
        />
        <MealBreakdownBar logs={logs} />
      </div>

      <p className="section-label dashboard__section-label">Nutrients Today</p>
      <MacroGrid
        totals={totals}
        goals={{
          protein: profile?.proteinGoalG,
          carbs: profile?.carbsGoalG,
          fat: profile?.fatGoalG,
          fibre: profile?.fibreGoalG,
          sugar: profile?.sugarGoalG,
          salt: profile?.saltGoalG,
        }}
      />

      <div className="dashboard__actions">
        <Link to="/search" className="glass-card-small dashboard__action">
          Search Food
        </Link>
        <Link to="/insights" className="glass-card-small dashboard__action">
          View Insights
        </Link>
      </div>
    </div>
  )
}

export default DashboardPage
