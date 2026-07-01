import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../hooks/useAuth.jsx'
import { localDateString } from '../hooks/useDashboardData'
import './QuantityModal.css'

const QUANTITY_TYPES = [
  { key: 'weight', label: 'Weight (g)', step: 10 },
  { key: 'singles', label: 'Singles', step: 0.5 },
  { key: 'packets', label: 'Packets', step: 0.5 },
  { key: 'cups', label: 'Cups', step: 0.5 },
]

const CUP_GRAMS = 240
const SERVING_FALLBACK_GRAMS = 100

function gramsFor(type, value, servingGrams) {
  if (type === 'weight') return value
  if (type === 'cups') return value * CUP_GRAMS
  return value * (servingGrams || SERVING_FALLBACK_GRAMS)
}

function formatValue(value) {
  return value % 1 === 0 ? value : value.toFixed(1)
}

function QuantityModal({ food, mealType, mealLabel, onClose, onAdded }) {
  const { user } = useAuth()

  const [quantityType, setQuantityType] = useState('weight')
  const [value, setValue] = useState(100)
  const [flash, setFlash] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const grams = gramsFor(quantityType, value, food.servingGrams)

  useEffect(() => {
    setFlash(true)
    const timer = setTimeout(() => setFlash(false), 200)
    return () => clearTimeout(timer)
  }, [grams])

  const selectType = (type) => {
    setQuantityType(type)
    setValue(type === 'weight' ? 100 : 1)
  }

  const step = QUANTITY_TYPES.find((t) => t.key === quantityType).step
  const adjust = (delta) => setValue((v) => Math.max(1, v + delta))

  const scale = grams / 100
  const scaled = {
    kcal: food.per100g.kcal * scale,
    protein: food.per100g.protein * scale,
    carbs: food.per100g.carbs * scale,
    fat: food.per100g.fat * scale,
    fibre: food.per100g.fibre * scale,
    sugar: food.per100g.sugar * scale,
    salt: food.per100g.salt * scale,
  }

  const handleAdd = async () => {
    setSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase.from('food_logs').insert({
      userId: user.id,
      loggedDate: localDateString(),
      mealType,
      foodName: food.name,
      brand: food.brand || null,
      offProductId: food.id,
      quantityG: grams,
      kcal: scaled.kcal,
      proteinG: scaled.protein,
      carbsG: scaled.carbs,
      fatG: scaled.fat,
      fibreG: scaled.fibre,
      sugarG: scaled.sugar,
      saltG: scaled.salt,
    })

    if (insertError) {
      setError(insertError.message)
      setSubmitting(false)
      return
    }

    window.dispatchEvent(new Event('macrio:foodLogged'))
    onAdded()
    onClose()
  }

  return (
    <div className="quantity-modal__overlay" onClick={onClose}>
      <div
        className="quantity-modal__panel glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="quantity-modal__header">
          <div>
            <h2 className="quantity-modal__title">{food.name}</h2>
            {food.brand && <p className="quantity-modal__brand">{food.brand}</p>}
          </div>
          <button
            type="button"
            className="quantity-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="quantity-modal__type-pills">
          {QUANTITY_TYPES.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              className={`pill-button ${quantityType === key ? 'pill-button--active' : ''}`}
              onClick={() => selectType(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="quantity-modal__stepper">
          <button
            type="button"
            className="quantity-modal__step-button glass-card-small"
            onClick={() => adjust(-step)}
            aria-label="Decrease"
          >
            −
          </button>
          <span className="quantity-modal__value">{formatValue(value)}</span>
          <button
            type="button"
            className="quantity-modal__step-button glass-card-small"
            onClick={() => adjust(step)}
            aria-label="Increase"
          >
            +
          </button>
        </div>

        <p className="quantity-modal__subtitle">= {Math.round(grams)}g total</p>

        <div className="quantity-modal__chips">
          <div className={`quantity-modal__chip glass-card-small ${flash ? 'quantity-modal__chip--flash' : ''}`}>
            <span className="quantity-modal__chip-label">kcal</span>
            <span className="quantity-modal__chip-value">{Math.round(scaled.kcal)}</span>
          </div>
          <div className={`quantity-modal__chip glass-card-small ${flash ? 'quantity-modal__chip--flash' : ''}`}>
            <span className="quantity-modal__chip-label">protein</span>
            <span className="quantity-modal__chip-value">{Math.round(scaled.protein)}g</span>
          </div>
          <div className={`quantity-modal__chip glass-card-small ${flash ? 'quantity-modal__chip--flash' : ''}`}>
            <span className="quantity-modal__chip-label">carbs</span>
            <span className="quantity-modal__chip-value">{Math.round(scaled.carbs)}g</span>
          </div>
          <div className={`quantity-modal__chip glass-card-small ${flash ? 'quantity-modal__chip--flash' : ''}`}>
            <span className="quantity-modal__chip-label">fat</span>
            <span className="quantity-modal__chip-value">{Math.round(scaled.fat)}g</span>
          </div>
        </div>

        {error && <p className="quantity-modal__error">{error}</p>}

        <button
          type="button"
          className="cta-button quantity-modal__submit"
          onClick={handleAdd}
          disabled={submitting}
        >
          {submitting ? 'Adding…' : `Add to ${mealLabel}`}
        </button>
      </div>
    </div>
  )
}

export default QuantityModal
