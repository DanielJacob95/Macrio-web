import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './useAuth.jsx'
import { localDateString } from './useDashboardData'

const PERIOD_DAYS = 30
const EMPTY_MACROS = { kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, sugar: 0, salt: 0 }

function daysAgoDateString(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return localDateString(date)
}

function buildDailyCalories(logs) {
  const kcalByDate = new Map()
  for (let i = PERIOD_DAYS - 1; i >= 0; i--) {
    kcalByDate.set(daysAgoDateString(i), 0)
  }

  for (const log of logs) {
    if (kcalByDate.has(log.loggedDate)) {
      kcalByDate.set(log.loggedDate, kcalByDate.get(log.loggedDate) + (log.kcal ?? 0))
    }
  }

  return Array.from(kcalByDate, ([date, kcal]) => ({ date, kcal }))
}

function buildAverageMacros(logs, dailyCalories) {
  if (logs.length === 0) return { ...EMPTY_MACROS }

  const totals = logs.reduce(
    (acc, log) => ({
      kcal: acc.kcal + (log.kcal ?? 0),
      protein: acc.protein + (log.proteinG ?? 0),
      carbs: acc.carbs + (log.carbsG ?? 0),
      fat: acc.fat + (log.fatG ?? 0),
      fibre: acc.fibre + (log.fibreG ?? 0),
      sugar: acc.sugar + (log.sugarG ?? 0),
      salt: acc.salt + (log.saltG ?? 0),
    }),
    { ...EMPTY_MACROS },
  )

  // Average over days that actually have logs, not the full 30-day window —
  // otherwise a new user's average looks artificially low.
  const activeDays = dailyCalories.filter((day) => day.kcal > 0).length || 1

  return Object.fromEntries(
    Object.entries(totals).map(([key, value]) => [key, value / activeDays]),
  )
}

function buildTopFoods(logs) {
  const counts = new Map()
  for (const log of logs) {
    counts.set(log.foodName, (counts.get(log.foodName) ?? 0) + 1)
  }
  return Array.from(counts, ([foodName, count]) => ({ foodName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

export function useInsightsData() {
  const { user } = useAuth()
  const userId = user?.id

  const [profile, setProfile] = useState(null)
  const [foodLogs, setFoodLogs] = useState([])
  const [weightLogs, setWeightLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!userId) {
      setProfile(null)
      setFoodLogs([])
      setWeightLogs([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    const since = daysAgoDateString(PERIOD_DAYS - 1)

    Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase
        .from('food_logs')
        .select('*')
        .eq('userId', userId)
        .gte('loggedDate', since)
        .order('loggedDate'),
      supabase
        .from('weight_logs')
        .select('*')
        .eq('userId', userId)
        .gte('loggedDate', since)
        .order('loggedDate'),
    ])
      .then(([profileResult, foodResult, weightResult]) => {
        if (cancelled) return
        if (profileResult.error) throw profileResult.error
        if (foodResult.error) throw foodResult.error
        if (weightResult.error) throw weightResult.error

        setProfile(profileResult.data)
        setFoodLogs(foodResult.data ?? [])
        setWeightLogs(weightResult.data ?? [])
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [userId])

  const dailyCalories = buildDailyCalories(foodLogs)

  return {
    loading,
    error,
    profile,
    dailyCalories,
    averageMacros: buildAverageMacros(foodLogs, dailyCalories),
    weightLogs,
    topFoods: buildTopFoods(foodLogs),
  }
}
