import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './useAuth.jsx'
import { localDateString } from './useDashboardData'
import { EMPTY_MACROS, sumMacroLogs } from '../lib/macros'

function daysAgoDateString(days) {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return localDateString(date)
}

function buildDailyCalories(logs, days) {
  const kcalByDate = new Map()
  for (let i = days - 1; i >= 0; i--) {
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

  const totals = sumMacroLogs(logs)

  // Average over days that actually have logs, not the full window —
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

export function useInsightsData(days = 30) {
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

    const since = daysAgoDateString(days - 1)

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
  }, [userId, days])

  const dailyCalories = buildDailyCalories(foodLogs, days)

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
