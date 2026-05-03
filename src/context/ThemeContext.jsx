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
    const saved = localStorage.getItem('dropstudio_settings')
    if (saved) {
      const settings = JSON.parse(saved)
      setTheme(settings.theme || 'system')
      setAccentColor(settings.accentColor || '#7c3aed')
      setDensity(settings.density || 'normal')
      setBgStyle(settings.bgStyle || 'solid')
      setCardStyle(settings.cardStyle || 'default')
    }
  }, [])

  // Save settings to localStorage
  const saveSettings = () => {
    const settings = { theme, accentColor, density, bgStyle, cardStyle }
    localStorage.setItem('dropstudio_settings', JSON.stringify(settings))
  }

  // Apply theme to document
  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-theme', theme)
    html.style.setProperty('--accent', accentColor)
    html.setAttribute('data-density', density)
    html.setAttribute('data-bg-style', bgStyle)
    html.setAttribute('data-card-style', cardStyle)
  }, [theme, accentColor, density, bgStyle, cardStyle])

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
