import { Link } from 'react-router-dom'
import { ResponsiveContainer, AreaChart, Area } from 'recharts'
import { useDashboardData } from '../../hooks/useDashboardData'
import { useInsightsData } from '../../hooks/useInsightsData'
import { useTheme } from '../../hooks/useTheme.jsx'
import { gaugeThemeName } from '../../lib/gaugeTheme'
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

      <div className="dashboard__body">
        <div className="dashboard__left">
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

        <div className="dashboard__right">
          <div className="glass-card dashboard__skeleton" style={{ height: 140 }} />
          <div className="glass-card dashboard__skeleton" style={{ height: 180 }} />
        </div>
      </div>
    </div>
  )
}

function CalorieTrendWidget({ dailyCalories, lineColour }) {
  return (
    <div className="glass-card dashboard__widget">
      <div className="dashboard__widget-header">
        <p className="section-label">Last 7 Days</p>
        <Link to="/insights" className="dashboard__widget-link">
          See all →
        </Link>
      </div>
      <ResponsiveContainer width="100%" height={64}>
        <AreaChart data={dailyCalories} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="dashboard-sparkline-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColour} stopOpacity={0.35} />
              <stop offset="100%" stopColor={lineColour} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="kcal"
            stroke={lineColour}
            strokeWidth={2}
            fill="url(#dashboard-sparkline-fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function TopFoodsWidget({ topFoods }) {
  return (
    <div className="glass-card dashboard__widget">
      <div className="dashboard__widget-header">
        <p className="section-label">Most Logged This Week</p>
        <Link to="/insights" className="dashboard__widget-link">
          See all →
        </Link>
      </div>
      {topFoods.length > 0 ? (
        <div className="dashboard__top-foods">
          {topFoods.slice(0, 3).map(({ foodName, count }) => (
            <div key={foodName} className="dashboard__top-food glass-card-small">
              <span className="dashboard__top-food-name">{foodName}</span>
              <span className="dashboard__top-food-count">×{count}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="dashboard__widget-empty">Nothing logged yet this week.</p>
      )}
    </div>
  )
}

function DashboardPage() {
  const { profile, logs, loading, error, totals } = useDashboardData()
  const { dailyCalories, topFoods, loading: insightsLoading } = useInsightsData(7)
  const { gaugeColour } = useTheme()
  const theme = gaugeThemeName(gaugeColour)
  const lineColour = `var(--gauge-${theme}-main)`

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

      <div className="dashboard__body">
        <div className="dashboard__left">
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

        <div className="dashboard__right">
          {!insightsLoading && (
            <>
              <CalorieTrendWidget dailyCalories={dailyCalories} lineColour={lineColour} />
              <TopFoodsWidget topFoods={topFoods} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
