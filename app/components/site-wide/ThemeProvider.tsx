// app/components/site-wide/ThemeProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ isDark: false, toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check local storage first
    const stored = localStorage.getItem('theme')
    if (stored) {
      setIsDark(stored === 'dark')
      document.documentElement.classList.toggle('dark', stored === 'dark')
      return
    }

    // Fall back to system preference
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(systemDark)
    document.documentElement.classList.toggle('dark', systemDark)
  }, [])

  function toggle() {
    const newMode = !isDark
    setIsDark(newMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', newMode ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)