import './MealBreakdownBar.css'

const MEALS = [
  { key: 'breakfast', label: 'Breakfast', colour: 'breakfast' },
  { key: 'lunch', label: 'Lunch', colour: 'lunch' },
  { key: 'dinner', label: 'Dinner', colour: 'dinner' },
  { key: 'snacks', label: 'Snacks', colour: 'snacks' },
]

function MealBreakdownBar({ logs }) {
  const kcalByMeal = MEALS.reduce((acc, { key }) => {
    acc[key] = 0
    return acc
  }, {})

  for (const log of logs ?? []) {
    if (kcalByMeal[log.mealType] !== undefined) {
      kcalByMeal[log.mealType] += log.kcal ?? 0
    }
  }

  const grandTotal = MEALS.reduce((sum, { key }) => sum + kcalByMeal[key], 0)

  return (
    <div className="meal-breakdown">
      <div className="meal-breakdown__labels">
        {MEALS.map(({ key, label, colour }) => (
          <span
            key={key}
            className="meal-breakdown__label"
            style={{ color: `var(--colour-${colour})` }}
          >
            {Math.round(kcalByMeal[key])} kcal · {label}
          </span>
        ))}
      </div>

      <div className="meal-breakdown__bar">
        {MEALS.map(({ key, colour }) => {
          const kcal = kcalByMeal[key]
          if (kcal <= 0) return null
          const share = grandTotal > 0 ? kcal / grandTotal : 0

          return (
            <div
              key={key}
              className="meal-breakdown__segment"
              style={{
                flexBasis: `${share * 100}%`,
                background: `var(--colour-${colour})`,
                boxShadow: `0 0 6px var(--colour-${colour})`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default MealBreakdownBar
