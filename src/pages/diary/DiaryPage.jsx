import { useState } from 'react'
import { useDiaryData } from '../../hooks/useDiaryData'
import { localDateString } from '../../hooks/useDashboardData'
import { emoji } from '../../lib/foodEmoji'
import './DiaryPage.css'

const MEALS = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snacks', label: 'Snacks' },
]

const LABEL_FORMAT = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
})

function addDays(date, delta) {
  const next = new Date(date)
  next.setDate(next.getDate() + delta)
  return next
}

function dateLabel(date) {
  const dateString = localDateString(date)
  const today = localDateString()
  const yesterday = localDateString(addDays(new Date(), -1))

  if (dateString === today) return 'Today'
  if (dateString === yesterday) return 'Yesterday'
  return LABEL_FORMAT.format(date)
}

function DiaryPage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const dateString = localDateString(selectedDate)
  const isToday = dateString === localDateString()

  const { profile, logsByMeal, totals, loading, error, deleteLog } = useDiaryData(dateString)

  if (loading) {
    return (
      <div className="diary">
        <div className="glass-card-small diary__skeleton" style={{ height: 48 }} />
        <div className="glass-card diary__skeleton" style={{ height: 140 }} />
        <div className="glass-card diary__skeleton" style={{ height: 300 }} />
      </div>
    )
  }

  const goal = profile?.dailyCalorieGoal ?? 2000
  const remaining = goal - totals.kcal

  return (
    <div className="diary">
      <div className="glass-card-small diary__nav">
        <button
          type="button"
          className="diary__nav-arrow"
          onClick={() => setSelectedDate((d) => addDays(d, -1))}
          aria-label="Previous day"
        >
          ←
        </button>
        <span className="diary__nav-label">{dateLabel(selectedDate)}</span>
        <button
          type="button"
          className="diary__nav-arrow"
          onClick={() => setSelectedDate((d) => addDays(d, 1))}
          disabled={isToday}
          aria-label="Next day"
        >
          →
        </button>
      </div>

      {error && <p className="diary__error">Couldn't load this day. {error.message}</p>}

      <div className="glass-card diary__summary">
        <div className="diary__summary-row">
          <div className="diary__summary-stat">
            <span className="diary__summary-value">{Math.round(totals.kcal)}</span>
            <span className="diary__summary-unit">kcal eaten</span>
          </div>
          <div className="diary__summary-stat">
            <span className="diary__summary-value">{Math.round(Math.abs(remaining))}</span>
            <span className="diary__summary-unit">
              {remaining >= 0 ? 'kcal left' : 'kcal over'}
            </span>
          </div>
          <div className="diary__summary-stat">
            <span className="diary__summary-value">{goal}</span>
            <span className="diary__summary-unit">kcal goal</span>
          </div>
        </div>

        <div className="diary__macro-strip">
          <span className="diary__macro-chip" style={{ color: 'var(--colour-protein)' }}>
            {Math.round(totals.protein)}g protein
          </span>
          <span className="diary__macro-chip" style={{ color: 'var(--colour-carbs)' }}>
            {Math.round(totals.carbs)}g carbs
          </span>
          <span className="diary__macro-chip" style={{ color: 'var(--colour-fat)' }}>
            {Math.round(totals.fat)}g fat
          </span>
          <span className="diary__macro-chip" style={{ color: 'var(--colour-fibre)' }}>
            {Math.round(totals.fibre)}g fibre
          </span>
        </div>
      </div>

      {MEALS.map(({ key, label }) => (
        <div key={key} className="glass-card diary__meal">
          <p className="section-label">{label}</p>
          {logsByMeal[key].length === 0 ? (
            <p className="diary__empty">Nothing logged yet</p>
          ) : (
            <div className="diary__meal-items">
              {logsByMeal[key].map((log) => (
                <div key={log.id} className="diary__item glass-card-small">
                  <span className="diary__item-emoji">{emoji(log.foodName)}</span>
                  <span className="diary__item-info">
                    <span className="diary__item-name">{log.foodName}</span>
                    <span className="diary__item-meta">
                      {Math.round(log.quantityG)}g · {Math.round(log.kcal)} kcal
                    </span>
                  </span>
                  <button
                    type="button"
                    className="diary__item-delete"
                    onClick={() => deleteLog(log.id)}
                    aria-label={`Delete ${log.foodName}`}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default DiaryPage
