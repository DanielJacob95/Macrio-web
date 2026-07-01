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
import { useInsightsData } from '../../hooks/useInsightsData'
import { useTheme } from '../../hooks/useTheme.jsx'
import { gaugeThemeName } from '../../lib/gaugeTheme'
import '../../components/MacroGrid.css'
import './InsightsPage.css'

const AVERAGE_MACROS = [
  { key: 'protein', label: 'Protein', colour: 'protein' },
  { key: 'carbs', label: 'Carbs', colour: 'carbs' },
  { key: 'fat', label: 'Fat', colour: 'fat' },
  { key: 'fibre', label: 'Fibre', colour: 'fibre' },
]

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

function InsightsPage() {
  const { loading, error, profile, dailyCalories, averageMacros, weightLogs, topFoods } =
    useInsightsData()
  const { gaugeColour } = useTheme()
  const theme = gaugeThemeName(gaugeColour)
  const lineColour = `var(--gauge-${theme}-main)`

  if (loading) {
    return (
      <div className="insights">
        <h1 className="insights__title">Insights</h1>
        <div className="glass-card insights__skeleton" style={{ height: 220 }} />
        <div className="glass-card insights__skeleton" style={{ height: 220 }} />
        <div className="glass-card insights__skeleton" style={{ height: 120 }} />
      </div>
    )
  }

  return (
    <div className="insights">
      <h1 className="insights__title">Insights</h1>

      {error && <p className="insights__error">Couldn't load insights. {error.message}</p>}

      <div className="glass-card insights__card">
        <p className="section-label">Daily Calories · Last 30 Days</p>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dailyCalories} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="insights-kcal-fill" x1="0" y1="0" x2="0" y2="1">
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
            {profile?.dailyCalorieGoal && (
              <ReferenceLine
                y={profile.dailyCalorieGoal}
                stroke={lineColour}
                strokeDasharray="4 4"
                strokeOpacity={0.6}
              />
            )}
            <Area
              type="monotone"
              dataKey="kcal"
              stroke={lineColour}
              strokeWidth={2.5}
              fill="url(#insights-kcal-fill)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card insights__card">
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
          <div className="insights__empty">
            <p className="insights__empty-title">No weight logged yet</p>
            <p className="insights__empty-subtitle">
              Log your weight to start seeing your trend over time.
            </p>
          </div>
        )}
      </div>

      <div className="glass-card insights__card">
        <p className="section-label">Average Macros Per Day</p>
        <div className="macro-grid insights__macro-grid">
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

      <div className="glass-card insights__card">
        <p className="section-label">Most Logged This Period</p>
        {topFoods.length > 0 ? (
          <div className="insights__top-foods">
            {topFoods.map(({ foodName, count }) => (
              <div key={foodName} className="insights__top-food glass-card-small">
                <span className="insights__top-food-name">{foodName}</span>
                <span className="insights__top-food-count">×{count}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="insights__empty-subtitle">Nothing logged in the last 30 days yet.</p>
        )}
      </div>
    </div>
  )
}

export default InsightsPage
