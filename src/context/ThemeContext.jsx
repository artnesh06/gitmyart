import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system')
  const [accentColor, setAccentColor] = useState('#7c3aed')
  const [density, setDensity] = useState('normal')

  useEffect(() => {
    // Load from localStorage
    const savedTheme = localStorage.getItem('rebel_theme') || 'system'
    const savedAccent = localStorage.getItem('rebel_accent') || '#7c3aed'
    const savedDensity = localStorage.getItem('rebel_density') || 'normal'

    setTheme(savedTheme)
    setAccentColor(savedAccent)
    setDensity(savedDensity)

    applyTheme(savedTheme, savedAccent, savedDensity)
  }, [])

  const applyTheme = (t, accent, dens) => {
    const html = document.documentElement
    html.setAttribute('data-theme', t)
    html.setAttribute('data-density', dens)
    html.style.setProperty('--accent', accent)
    html.style.setProperty('--accent-d', adjustColor(accent, -0.15))
  }

  const updateTheme = (newTheme) => {
    setTheme(newTheme)
    localStorage.setItem('rebel_theme', newTheme)
    applyTheme(newTheme, accentColor, density)
  }

  const updateAccentColor = (color) => {
    setAccentColor(color)
    localStorage.setItem('rebel_accent', color)
    applyTheme(theme, color, density)
  }

  const updateDensity = (newDensity) => {
    setDensity(newDensity)
    localStorage.setItem('rebel_density', newDensity)
    applyTheme(theme, accentColor, newDensity)
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, accentColor, updateAccentColor, density, updateDensity }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}

// Helper to adjust color brightness
function adjustColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, Math.min(255, (num >> 16) + amt))
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt))
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt))
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
}
