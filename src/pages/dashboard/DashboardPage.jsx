import { Link } from 'react-router-dom'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts'
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

const AVERAGE_MACROS = [
  { key: 'protein', label: 'Protein', colour: 'protein' },
  { key: 'carbs', label: 'Carbs', colour: 'carbs' },
  { key: 'fat', label: 'Fat', colour: 'fat' },
  { key: 'fibre', label: 'Fibre', colour: 'fibre' },
]

function greetingForHour(hour) {
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function shortDateLabel(dateString) {
  const [, month, day] = dateString.split('-')
  return `${parseInt(day, 10)}/${parseInt(month, 10)}`
}

function tooltipStyle() {
  return {
    background: 'var(--glass-chip-fill)',
    border: '1px solid var(--glass-chip-border)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 12,
    color: 'var(--text-colour)',
  }
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

function AverageMacrosWidget({ averageMacros }) {
  return (
    <div className="glass-card dashboard__widget">
      <p className="section-label">Average Macros Per Day</p>
      <div className="macro-grid dashboard__average-macro-grid">
        {AVERAGE_MACROS.map(({ key, label, colour }) => (
          <div key={key} className="macro-grid__cell glass-card-small">
            <div className="macro-grid__row">
              <span className="macro-grid__name">{label}</span>
            </div>
            <span className="macro-grid__value" style={{ color: `var(--colour-${colour})` }}>
              {Math.round(averageMacros[key])}
              <span className="macro-grid__unit">g</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopFoodsWidget({ topFoods }) {
  return (
    <div className="glass-card dashboard__widget">
      <p className="section-label">Most Logged This Period</p>
      {topFoods.length > 0 ? (
        <div className="dashboard__top-foods">
          {topFoods.map(({ foodName, count }) => (
            <div key={foodName} className="dashboard__top-food glass-card-small">
              <span className="dashboard__top-food-name">{foodName}</span>
              <span className="dashboard__top-food-count">×{count}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="dashboard__widget-empty">Nothing logged in the last 30 days yet.</p>
      )}
    </div>
  )
}

function CalorieHistoryCard({ dailyCalories, goal, lineColour }) {
  return (
    <div className="glass-card dashboard__insights-card">
      <p className="section-label">Daily Calories · Last 30 Days</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={dailyCalories} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="dashboard-kcal-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColour} stopOpacity={0.35} />
              <stop offset="100%" stopColor={lineColour} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--divider)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={shortDateLabel}
            tick={{ fontSize: 11, fill: 'var(--text-colour)' }}
            axisLine={{ stroke: 'var(--divider)' }}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--text-colour)' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip contentStyle={tooltipStyle()} labelFormatter={shortDateLabel} />
          {goal && (
            <ReferenceLine y={goal} stroke={lineColour} strokeDasharray="4 4" strokeOpacity={0.6} />
          )}
          <Area
            type="monotone"
            dataKey="kcal"
            stroke={lineColour}
            strokeWidth={2.5}
            fill="url(#dashboard-kcal-fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function WeightTrendCard({ weightLogs, lineColour }) {
  return (
    <div className="glass-card dashboard__insights-card">
      <p className="section-label">Weight Trend</p>
      {weightLogs.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weightLogs} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="var(--divider)" vertical={false} />
            <XAxis
              dataKey="loggedDate"
              tickFormatter={shortDateLabel}
              tick={{ fontSize: 11, fill: 'var(--text-colour)' }}
              axisLine={{ stroke: 'var(--divider)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--text-colour)' }}
              axisLine={false}
              tickLine={false}
              width={40}
              domain={['auto', 'auto']}
            />
            <Tooltip contentStyle={tooltipStyle()} labelFormatter={shortDateLabel} />
            <Line
              type="monotone"
              dataKey="weightKg"
              stroke={lineColour}
              strokeWidth={2.5}
              dot={{ r: 3, fill: lineColour }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="dashboard__insights-empty">
          <p className="dashboard__insights-empty-title">No weight logged yet</p>
          <p className="dashboard__widget-empty">
            Log your weight to start seeing your trend over time.
          </p>
        </div>
      )}
    </div>
  )
}

function DashboardPage() {
  const { profile, logs, loading, error, totals } = useDashboardData()
  const {
    dailyCalories,
    averageMacros,
    weightLogs,
    topFoods,
    loading: insightsLoading,
    error: insightsError,
  } = useInsightsData()
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
      {insightsError && (
        <p className="dashboard__error">Couldn't load insights. {insightsError.message}</p>
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
            <Link to="/diary" className="glass-card-small dashboard__action">
              View Diary
            </Link>
          </div>
        </div>

        <div className="dashboard__right">
          {insightsLoading ? (
            <>
              <div className="glass-card dashboard__skeleton" style={{ height: 140 }} />
              <div className="glass-card dashboard__skeleton" style={{ height: 180 }} />
            </>
          ) : (
            <>
              <AverageMacrosWidget averageMacros={averageMacros} />
              <TopFoodsWidget topFoods={topFoods} />
            </>
          )}
        </div>
      </div>

      {insightsLoading ? (
        <>
          <div className="glass-card dashboard__skeleton" style={{ height: 220 }} />
          <div className="glass-card dashboard__skeleton" style={{ height: 220 }} />
        </>
      ) : (
        <>
          <CalorieHistoryCard
            dailyCalories={dailyCalories}
            goal={profile?.dailyCalorieGoal}
            lineColour={lineColour}
          />
          <WeightTrendCard weightLogs={weightLogs} lineColour={lineColour} />
        </>
      )}
    </div>
  )
}

export default DashboardPage
