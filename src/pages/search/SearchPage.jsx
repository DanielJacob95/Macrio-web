import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchFoods } from '../../lib/openFoodFacts'
import { emoji } from '../../lib/foodEmoji'
import QuantityModal from '../../components/QuantityModal.jsx'
import './SearchPage.css'

const MEAL_TYPES = [
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'snacks', label: 'Snacks' },
]

function SearchPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') ?? '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [mealType, setMealType] = useState('breakfast')
  const [selectedFood, setSelectedFood] = useState(null)
  const [toast, setToast] = useState(null)

  // Picks up a new ?q= when the TopBar's search navigates here while this
  // page is already mounted (the URL changes, but component state doesn't
  // update on its own since it isn't derived from the URL every render).
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && q !== query) setQuery(q)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Debounced search: every keystroke clears the previous timer via the
  // effect's cleanup, so only the last keystroke in a 400ms window fires.
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setResults([])
      setLoading(false)
      setSearched(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      searchFoods(trimmed)
        .then(setResults)
        .catch(() => setResults([]))
        .finally(() => {
          setLoading(false)
          setSearched(true)
        })
    }, 400)

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2000)
    return () => clearTimeout(timer)
  }, [toast])

  const mealLabel = MEAL_TYPES.find((m) => m.key === mealType)?.label ?? 'Meal'

  return (
    <div className="search-page">
      <div className="search-page__input-wrap glass-card-small">
        <span className="search-page__icon">🔍</span>
        <input
          className="search-page__input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search foods..."
        />
        {query && (
          <button
            type="button"
            className="search-page__clear"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <div className="search-page__meal-pills">
        {MEAL_TYPES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            className={`pill-button ${mealType === key ? 'pill-button--active' : ''}`}
            onClick={() => setMealType(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="search-page__results">
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="search-page__skeleton-row glass-card-small" />
          ))}

        {!loading &&
          results.map((food) => (
            <button
              key={food.id}
              type="button"
              className="search-page__result glass-card-small"
              onClick={() => setSelectedFood(food)}
            >
              <span className="search-page__result-emoji">{emoji(food.name)}</span>
              <span className="search-page__result-info">
                <span className="search-page__result-name">{food.name}</span>
                <span className="search-page__result-meta">
                  {food.brand ? `${food.brand} · ` : ''}
                  {Math.round(food.per100g.kcal)} kcal / 100g
                </span>
              </span>
              <span className="search-page__result-protein">
                {Math.round(food.per100g.protein)}g protein
              </span>
            </button>
          ))}

        {!loading && searched && query.trim() && results.length === 0 && (
          <p className="search-page__empty">No results for '{query.trim()}'</p>
        )}
      </div>

      {selectedFood && (
        <QuantityModal
          food={selectedFood}
          mealType={mealType}
          mealLabel={mealLabel}
          onClose={() => setSelectedFood(null)}
          onAdded={() => setToast(`Added to ${mealLabel} ✓`)}
        />
      )}

      {toast && <div className="search-page__toast glass-card-small">{toast}</div>}
    </div>
  )
}

export default SearchPage
