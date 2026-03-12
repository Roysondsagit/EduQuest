// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const themes = {
  red:    { primary: '#ef4444', secondary: '#f97316', glow: '0 0 20px rgba(239,68,68,0.5)',    gradient: 'linear-gradient(135deg,#ef4444,#f97316)' },
  orange: { primary: '#f97316', secondary: '#facc15', glow: '0 0 20px rgba(249,115,22,0.5)',   gradient: 'linear-gradient(135deg,#f97316,#facc15)' },
  yellow: { primary: '#eab308', secondary: '#84cc16', glow: '0 0 20px rgba(234,179,8,0.5)',    gradient: 'linear-gradient(135deg,#eab308,#84cc16)' },
  green:  { primary: '#22c55e', secondary: '#10b981', glow: '0 0 20px rgba(34,197,94,0.5)',    gradient: 'linear-gradient(135deg,#22c55e,#10b981)' },
  blue:   { primary: '#3b82f6', secondary: '#6366f1', glow: '0 0 20px rgba(59,130,246,0.5)',   gradient: 'linear-gradient(135deg,#3b82f6,#6366f1)' },
  indigo: { primary: '#6366f1', secondary: '#8b5cf6', glow: '0 0 20px rgba(99,102,241,0.5)',   gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  violet: { primary: '#8b5cf6', secondary: '#ec4899', glow: '0 0 20px rgba(139,92,246,0.5)',   gradient: 'linear-gradient(135deg,#8b5cf6,#ec4899)' },
}

const ThemeContext = createContext({})

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState(() => localStorage.getItem('eq-theme') || 'indigo')

  const theme = themes[themeName] || themes.indigo

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--primary', theme.primary)
    root.style.setProperty('--secondary', theme.secondary)
    root.style.setProperty('--glow', theme.glow)
    root.style.setProperty('--gradient', theme.gradient)
    localStorage.setItem('eq-theme', themeName)
  }, [themeName, theme])

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName, theme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
