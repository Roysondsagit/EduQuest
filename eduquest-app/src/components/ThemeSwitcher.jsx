// src/components/ThemeSwitcher.jsx
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { Palette } from 'lucide-react'

const themeColors = {
  red:    '#ef4444',
  orange: '#f97316',
  yellow: '#eab308',
  green:  '#22c55e',
  blue:   '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
}

export default function ThemeSwitcher() {
  const { themeName, setThemeName } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="btn btn-ghost"
        style={{ padding: '8px 12px', position: 'relative' }}
        onClick={() => setOpen(o => !o)}
        title="Change theme"
      >
        <Palette size={18} style={{ color: 'var(--primary)' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '110%', right: 0,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14, padding: 12,
          display: 'flex', gap: 8, flexWrap: 'wrap',
          width: 172, zIndex: 200,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
        }}>
          {Object.entries(themeColors).map(([name, color]) => (
            <button
              key={name}
              onClick={() => { setThemeName(name); setOpen(false) }}
              title={name.charAt(0).toUpperCase() + name.slice(1)}
              style={{
                width: 28, height: 28, borderRadius: '50%',
                background: color, border: 'none', cursor: 'pointer',
                outline: themeName === name ? `3px solid white` : 'none',
                outlineOffset: 2,
                boxShadow: themeName === name ? `0 0 12px ${color}` : 'none',
                transition: 'all 0.2s ease',
                transform: themeName === name ? 'scale(1.2)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
