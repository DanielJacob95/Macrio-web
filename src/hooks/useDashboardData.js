import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './useAuth.jsx'

const EMPTY_TOTALS = { kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0, sugar: 0, salt: 0 }

// Mirrors the local-timezone date the iOS/Android apps compute for "today".
// Deliberately reads getFullYear/getMonth/getDate (local) rather than
// date.toISOString() (UTC) — toISOString() shifts the date near local
// midnight, which was the timezone bug already fixed on the native apps.
export function localDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function sumTotals(logs) {
  return logs.reduce(
    (totals, log) => ({
      kcal: totals.kcal + (log.kcal ?? 0),
      protein: totals.protein + (log.proteinG ?? 0),
      carbs: totals.carbs + (log.carbsG ?? 0),
      fat: totals.fat + (log.fatG ?? 0),
      fibre: totals.fibre + (log.fibreG ?? 0),
      sugar: totals.sugar + (log.sugarG ?? 0),
      salt: totals.salt + (log.saltG ?? 0),
    }),
    { ...EMPTY_TOTALS },
  )
}

export function useDashboardData() {
  const { user } = useAuth()
  const userId = user?.id

  const [profile, setProfile] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    if (!userId) {
      setProfile(null)
      setLogs([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const today = localDateString()

      const [profileResult, logsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase
          .from('food_logs')
          .select('*')
          .eq('userId', userId)
          .eq('loggedDate', today)
          .order('createdAt'),
      ])

      if (profileResult.error) throw profileResult.error
      if (logsResult.error) throw logsResult.error

      setProfile(profileResult.data)
      setLogs(logsResult.data ?? [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    window.addEventListener('macrio:foodLogged', fetchData)
    return () => window.removeEventListener('macrio:foodLogged', fetchData)
  }, [fetchData])

  return { profile, logs, loading, error, totals: sumTotals(logs) }
}
