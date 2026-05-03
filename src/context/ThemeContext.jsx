import React, { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system')
  const [accentColor, setAccentColor] = useState('#7c3aed')
  const [density, setDensity] = useState('normal')
  const [bgStyle, setBgStyle] = useState('solid')
  const [cardStyle, setCardStyle] = useState('default')

  // Load settings from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dropstudio_settings')
      if (saved) {
        const settings = JSON.parse(saved)
        if (settings.theme) setTheme(settings.theme)
        if (settings.accentColor) setAccentColor(settings.accentColor)
        if (settings.density) setDensity(settings.density)
        if (settings.bgStyle) setBgStyle(settings.bgStyle)
        if (settings.cardStyle) setCardStyle(settings.cardStyle)
      }
    } catch (e) {}
  }, [])

  // Apply theme to document — CSS uses data-theme on <html> and data-density on <body>
  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    // data-theme on <html>
    html.setAttribute('data-theme', theme)

    // data-density on <body> (original CSS targets [data-density] on body)
    if (density && density !== 'normal') {
      body.setAttribute('data-density', density)
    } else {
      body.removeAttribute('data-density')
    }

    // data-bg-style and data-card-style on <html>
    html.setAttribute('data-bg-style', bgStyle)
    html.setAttribute('data-card-style', cardStyle)

    // Accent color as CSS variable
    html.style.setProperty('--accent', accentColor)
    html.style.setProperty('--accent-d', shadeColor(accentColor, -15))
  }, [theme, accentColor, density, bgStyle, cardStyle])

  // Save settings to localStorage
  const saveSettings = () => {
    try {
      const settings = { theme, accentColor, density, bgStyle, cardStyle }
      localStorage.setItem('dropstudio_settings', JSON.stringify(settings))
    } catch (e) {}
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      accentColor,
      setAccentColor,
      density,
      setDensity,
      bgStyle,
      setBgStyle,
      cardStyle,
      setCardStyle,
      saveSettings,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Simple shade helper for accent-d
function shadeColor(hex, percent) {
  try {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.min(255, Math.max(0, (num >> 16) + percent * 2.55))
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent * 2.55))
    const b = Math.min(255, Math.max(0, (num & 0xff) + percent * 2.55))
    return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('')
  } catch (e) {
    return '#6d28d9'
  }
}
