import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { ThemeContext } from '../context/ThemeContext'

const CHAINS = {
  atom: { name: 'Cosmos', symbol: 'ATOM', icon: '🌍' },
  megaeth: { name: 'MegaETH', symbol: 'METH', icon: '⚡' },
  ethereum: { name: 'Ethereum', symbol: 'ETH', icon: '🔷' },
}

export default function RightPanel({ open, section, onClose }) {
  const { activeChain, setActiveChain } = useContext(AppContext)
  const { theme, setTheme, accentColor, setAccentColor, density, setDensity, saveSettings } = useContext(ThemeContext)

  if (!open) return null

  return (
    <>
      <div className="rpanel-resize-handle" title="Drag to resize"></div>
      <aside className="right-panel" id="rightPanel">
        {/* Notifications Section */}
        {section === 'notif' && (
          <div className="rpanel-section" style={{ display: 'block' }}>
            <div className="rpanel-header">
              <span className="rpanel-title">Notifications</span>
              <button className="notif-clear" onClick={() => alert('Clear all')}>Clear all</button>
            </div>
            <div className="notif-list" id="notifList">
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--t3)' }}>
                No notifications yet
              </div>
            </div>
          </div>
        )}

        {/* Settings Section */}
        {section === 'settings' && (
          <div className="rpanel-section" style={{ display: 'block' }}>
            <div className="rpanel-header">
              <span className="rpanel-title">Settings</span>
              <button className="settings-header-save" onClick={() => {
                saveSettings()
                alert('Settings saved!')
              }}>Save</button>
            </div>
            <div className="settings-body">
              <div className="settings-accordion">
                <button className="settings-accordion-hdr open" onClick={(e) => {
                  e.currentTarget.classList.toggle('open')
                  e.currentTarget.nextElementSibling.style.display = 
                    e.currentTarget.nextElementSibling.style.display === 'none' ? 'block' : 'none'
                }}>
                  <span>Appearance</span>
                  <svg className="acc-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <div className="settings-accordion-body">
                  <div className="settings-row-label">Theme</div>
                  <div className="settings-options">
                    <button 
                      className={`settings-opt ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => setTheme('dark')}
                    >Dark</button>
                    <button 
                      className={`settings-opt ${theme === 'system' ? 'active' : ''}`}
                      onClick={() => setTheme('system')}
                    >System</button>
                    <button 
                      className={`settings-opt ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => setTheme('light')}
                    >Bright</button>
                  </div>
                  <div className="settings-row-label" style={{ marginTop: '12px' }}>Accent Color</div>
                  <div className="settings-color-row">
                    <input 
                      type="color" 
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      style={{ width: '50px', height: '40px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
                    />
                    <input 
                      type="text" 
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      maxLength="7"
                      style={{ marginLeft: '10px', padding: '8px', borderRadius: '6px', border: '1px solid var(--border)', flex: 1 }}
                    />
                  </div>
                  <div className="settings-row-label" style={{ marginTop: '12px' }}>Density</div>
                  <div className="settings-options">
                    <button 
                      className={`settings-opt ${density === 'compact' ? 'active' : ''}`}
                      onClick={() => setDensity('compact')}
                    >Compact</button>
                    <button 
                      className={`settings-opt ${density === 'normal' ? 'active' : ''}`}
                      onClick={() => setDensity('normal')}
                    >Normal</button>
                    <button 
                      className={`settings-opt ${density === 'spacious' ? 'active' : ''}`}
                      onClick={() => setDensity('spacious')}
                    >Spacious</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chain Selection Section */}
        {section === 'chain' && (
          <div className="rpanel-section" style={{ display: 'block' }}>
            <div className="rpanel-header">
              <span className="rpanel-title">Select Chain</span>
            </div>
            <div className="rpanel-chain-list">
              {Object.entries(CHAINS).map(([key, chain]) => (
                <button
                  key={key}
                  className={`rpanel-chain-opt ${activeChain === key ? 'active' : ''}`}
                  onClick={() => setActiveChain(key)}
                >
                  <span style={{ fontSize: '18px' }}>{chain.icon}</span>
                  <span>{chain.name} ({chain.symbol})</span>
                  {activeChain === key && (
                    <svg className="rpanel-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Profile Section */}
        {section === 'profile' && (
          <div className="rpanel-section" style={{ display: 'block' }}>
            <div className="rpanel-header">
              <span className="rpanel-title">Profile</span>
            </div>
            <div id="rpanelProfileBody" style={{ padding: '20px', textAlign: 'center', color: 'var(--t3)' }}>
              Connect wallet to see profile
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
