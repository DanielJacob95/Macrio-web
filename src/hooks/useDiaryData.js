import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './useAuth.jsx'
import { sumMacroLogs } from '../lib/macros'

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snacks']

export function useDiaryData(dateString) {
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
      const [profileResult, logsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase
          .from('food_logs')
          .select('*')
          .eq('userId', userId)
          .eq('loggedDate', dateString)
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
  }, [userId, dateString])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    window.addEventListener('macrio:foodLogged', fetchData)
    return () => window.removeEventListener('macrio:foodLogged', fetchData)
  }, [fetchData])

  const deleteLog = useCallback(
    async (logId) => {
      const previous = logs
      setLogs((current) => current.filter((log) => log.id !== logId))

      const { error: deleteError } = await supabase.from('food_logs').delete().eq('id', logId)

      if (deleteError) {
        setLogs(previous)
        setError(deleteError)
        return
      }

      window.dispatchEvent(new Event('macrio:foodLogged'))
    },
    [logs],
  )

  const logsByMeal = MEAL_TYPES.reduce((acc, meal) => {
    acc[meal] = logs.filter((log) => log.mealType === meal)
    return acc
  }, {})

  return {
    profile,
    logsByMeal,
    totals: sumMacroLogs(logs),
    loading,
    error,
    deleteLog,
  }
}
