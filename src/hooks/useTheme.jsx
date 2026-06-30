import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(undefined)

const DARK_MODE_KEY = 'macrio_darkMode'
const GAUGE_COLOUR_KEY = 'macrio_gaugeColour'

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(DARK_MODE_KEY) === 'true',
  )
  const [gaugeColour, setGaugeColour] = useState(
    () => localStorage.getItem(GAUGE_COLOUR_KEY) ?? 'green',
  )

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light',
    )
    localStorage.setItem(DARK_MODE_KEY, String(darkMode))
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem(GAUGE_COLOUR_KEY, gaugeColour)
  }, [gaugeColour])

  return (
    <ThemeContext.Provider
      value={{ darkMode, setDarkMode, gaugeColour, setGaugeColour }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
