import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

export default function RightPanel({ open, onToggle }) {
  const { theme, updateTheme, accentColor, updateAccentColor, density, updateDensity } = useTheme()
  const [activeTab, setActiveTab] = useState('settings')

  return (
    <aside className={`right-panel ${open ? 'open' : ''}`}>
      {/* SETTINGS PANEL */}
      <div className="rpanel-section" id="rpanelSettings">
        <div className="rpanel-header">
          <span className="rpanel-title">Settings</span>
        </div>
        <div className="settings-body">
          {/* APPEARANCE */}
          <div className="settings-accordion">
            <button className="settings-accordion-hdr open">
              <span>Appearance</span>
              <svg className="acc-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className="settings-accordion-body">
              <div className="settings-row-label">Theme</div>
              <div className="settings-options">
                <button
                  className={`settings-opt ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => updateTheme('dark')}
                >
                  Dark
                </button>
                <button
                  className={`settings-opt ${theme === 'system' ? 'active' : ''}`}
                  onClick={() => updateTheme('system')}
                >
                  System
                </button>
                <button
                  className={`settings-opt ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => updateTheme('light')}
                >
                  Bright
                </button>
              </div>

              <div className="settings-row-label" style={{ marginTop: '12px' }}>
                Accent Color
              </div>
              <div className="settings-accent-swatches">
                {['#7c3aed', '#2563eb', '#059669', '#dc2626', '#d97706', '#db2777', '#0891b2'].map((color) => (
                  <div
                    key={color}
                    className={`accent-swatch ${accentColor === color ? 'active' : ''}`}
                    style={{ background: color }}
                    onClick={() => updateAccentColor(color)}
                    title={color}
                  />
                ))}
              </div>

              <div className="settings-row-label" style={{ marginTop: '12px' }}>
                Density
              </div>
              <div className="settings-options">
                <button
                  className={`settings-opt ${density === 'compact' ? 'active' : ''}`}
                  onClick={() => updateDensity('compact')}
                >
                  Compact
                </button>
                <button
                  className={`settings-opt ${density === 'normal' ? 'active' : ''}`}
                  onClick={() => updateDensity('normal')}
                >
                  Normal
                </button>
                <button
                  className={`settings-opt ${density === 'spacious' ? 'active' : ''}`}
                  onClick={() => updateDensity('spacious')}
                >
                  Spacious
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
