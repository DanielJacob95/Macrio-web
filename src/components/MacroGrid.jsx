import './MacroGrid.css'

const MACROS = [
  { key: 'protein', label: 'Protein', unit: 'g', colour: 'protein', defaultGoal: 150 },
  { key: 'carbs', label: 'Carbs', unit: 'g', colour: 'carbs', defaultGoal: 250 },
  { key: 'fat', label: 'Fat', unit: 'g', colour: 'fat', defaultGoal: 70 },
  { key: 'fibre', label: 'Fibre', unit: 'g', colour: 'fibre', defaultGoal: 30 },
  { key: 'sugar', label: 'Sugar', unit: 'g', colour: 'sugar', defaultGoal: 50 },
  { key: 'salt', label: 'Salt', unit: 'g', colour: 'salt', defaultGoal: 6 },
]

function MacroGrid({ totals, goals = {} }) {
  return (
    <div className="macro-grid">
      {MACROS.map(({ key, label, unit, colour, defaultGoal }, index) => {
        const value = totals?.[key] ?? 0
        const goal = goals[key] ?? defaultGoal
        const pct = Math.min(value / Math.max(goal, 1), 1) * 100

        return (
          <div key={key} className="macro-grid__cell glass-card-small">
            <div className="macro-grid__row">
              <span className="macro-grid__name">{label}</span>
              <span className="macro-grid__value">
                {Math.round(value)}
                <span className="macro-grid__unit">{unit}</span>
              </span>
            </div>
            <div className="macro-grid__track">
              <div
                className="macro-grid__fill"
                style={{
                  width: `${pct}%`,
                  background: `var(--colour-${colour})`,
                  boxShadow: `0 0 6px var(--colour-${colour})`,
                  transitionDelay: `${index * 80}ms`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MacroGrid
