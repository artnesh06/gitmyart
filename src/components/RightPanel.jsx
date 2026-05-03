import React, { useContext, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { ThemeContext } from '../context/ThemeContext'

const CHAINS = {
  atom: { name: 'Cosmos', symbol: 'ATOM', icon: '🌍' },
  megaeth: { name: 'MegaETH', symbol: 'METH', icon: '⚡' },
  ethereum: { name: 'Ethereum', symbol: 'ETH', icon: '🔷' },
}

const NOTIFICATIONS = [
  { icon: '🎉', text: 'New raffle <b>Mega Jackpot</b> just launched!', time: '2m ago' },
  { icon: '⏰', text: 'Raffle <b>Whale Raffle</b> ending in 1 hour!', time: '15m ago' },
  { icon: '🏆', text: '<b>0xdead...eeff</b> won the Genesis Raffle!', time: '1h ago' },
  { icon: '✨', text: 'New collection <b>PixelPunk</b> added.', time: '2h ago' },
  { icon: '💰', text: '<b>0x1a2b...ef12</b> claimed 14,200 $REBEL.', time: '3h ago' },
  { icon: '🎰', text: '<b>Golden Ticket</b> raffle 45% full!', time: '4h ago' },
]

const ACCENT_PRESETS = [
  '#7c3aed', '#6d28d9', '#2563eb', '#0891b2',
  '#059669', '#d97706', '#dc2626', '#db2777',
]

export default function RightPanel({ open, section, onClose }) {
  const { activeChain, setActiveChain } = useContext(AppContext)
  const { theme, setTheme, accentColor, setAccentColor, density, setDensity } = useContext(ThemeContext)
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const [accordionOpen, setAccordionOpen] = useState({ appearance: true, font: false, layout: false })

  function toggleAccordion(key) {
    setAccordionOpen(prev => ({ ...prev, [key]: !prev[key] }))
  }

  function clearNotifs() {
    setNotifs([])
  }

  return (
    <>
      <div className={`rpanel-resize-handle${open ? ' visible' : ''}`}></div>
      <aside className={`right-panel${open ? ' open' : ''}`} id="rightPanel">

        {/* ===== NOTIFICATIONS ===== */}
        <div className={`rpanel-section${section === 'notif' && open ? ' active' : ''}`}>
          <div className="rpanel-header">
            <span className="rpanel-title">Notifications</span>
            <button className="notif-clear" onClick={clearNotifs}>Clear all</button>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifs.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--t3)', fontSize: '14px' }}>
                No notifications
              </div>
            ) : notifs.map((n, i) => (
              <div key={i} className="notif-item">
                <div className="notif-icon">{n.icon}</div>
                <div className="notif-body">
                  <div className="notif-text" dangerouslySetInnerHTML={{ __html: n.text }} />
                  <div className="notif-time">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== SETTINGS ===== */}
        <div className={`rpanel-section${section === 'settings' && open ? ' active' : ''}`}>
          <div className="rpanel-header">
            <span className="rpanel-title">Settings</span>
            <button className="settings-header-save" onClick={() => {
              // settings auto-save via context
              onClose()
            }}>Save</button>
          </div>
          <div className="settings-body">

            {/* Appearance accordion */}
            <div className="settings-accordion">
              <button
                className={`settings-accordion-hdr${accordionOpen.appearance ? ' open' : ''}`}
                onClick={() => toggleAccordion('appearance')}
              >
                <span>Appearance</span>
                <svg className="acc-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {accordionOpen.appearance && (
                <div className="settings-accordion-body" style={{ display: 'flex' }}>
                  {/* Theme */}
                  <div className="settings-row-label">Theme</div>
                  <div className="settings-options">
                    {['dark', 'system', 'light'].map(t => (
                      <button
                        key={t}
                        className={`settings-opt${theme === t ? ' active' : ''}`}
                        onClick={() => setTheme(t)}
                      >
                        {t === 'dark' ? 'Dark' : t === 'system' ? 'System' : 'Bright'}
                      </button>
                    ))}
                  </div>

                  {/* Accent color */}
                  <div className="settings-row-label" style={{ marginTop: '10px' }}>Accent Color</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '6px' }}>
                    {ACCENT_PRESETS.map(c => (
                      <button
                        key={c}
                        onClick={() => setAccentColor(c)}
                        style={{
                          width: '26px', height: '26px', borderRadius: '6px',
                          background: c, border: accentColor === c ? '2px solid #fff' : '2px solid transparent',
                          cursor: 'pointer', flexShrink: 0,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      style={{ width: '36px', height: '36px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'none' }}
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={e => setAccentColor(e.target.value)}
                      maxLength={7}
                      style={{
                        flex: 1, padding: '7px 10px', borderRadius: '8px',
                        border: '1px solid var(--border)', background: 'var(--bg)',
                        color: 'var(--t1)', fontSize: '13px', outline: 'none',
                      }}
                    />
                  </div>

                  {/* Density */}
                  <div className="settings-row-label" style={{ marginTop: '10px' }}>Density</div>
                  <div className="settings-options">
                    {['compact', 'normal', 'spacious'].map(d => (
                      <button
                        key={d}
                        className={`settings-opt${density === d ? ' active' : ''}`}
                        onClick={() => setDensity(d)}
                      >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Layout accordion */}
            <div className="settings-accordion">
              <button
                className={`settings-accordion-hdr${accordionOpen.layout ? ' open' : ''}`}
                onClick={() => toggleAccordion('layout')}
              >
                <span>Layout</span>
                <svg className="acc-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {accordionOpen.layout && (
                <div className="settings-accordion-body" style={{ display: 'flex' }}>
                  <div className="settings-row-label">Corner Style</div>
                  <div className="settings-options">
                    {['rounded', 'sharp'].map(c => (
                      <button key={c} className="settings-opt"
                        onClick={() => document.documentElement.dataset.corners = c}
                      >
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ===== CHAIN SELECTOR ===== */}
        <div className={`rpanel-section${section === 'chain' && open ? ' active' : ''}`}>
          <div className="rpanel-header">
            <span className="rpanel-title">Select Chain</span>
          </div>
          <div className="rpanel-chain-list">
            {Object.entries(CHAINS).map(([key, chain]) => (
              <button
                key={key}
                className={`rpanel-chain-opt${activeChain === key ? ' active' : ''}`}
                onClick={() => { setActiveChain(key); onClose() }}
              >
                <span style={{ fontSize: '20px', lineHeight: 1 }}>{chain.icon}</span>
                <span style={{ flex: 1 }}>{chain.name} ({chain.symbol})</span>
                {activeChain === key && (
                  <svg className="rpanel-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ display: 'block' }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ===== PROFILE ===== */}
        <div className={`rpanel-section${section === 'profile' && open ? ' active' : ''}`}>
          <div className="rpanel-header">
            <span className="rpanel-title">Profile</span>
          </div>
          <div className="rpanel-profile-card">
            <div className="rpanel-profile-avatar">
              <img src="https://picsum.photos/seed/profile/80/80" alt="avatar" />
            </div>
            <div className="rpanel-profile-wallet">Connect wallet to view profile</div>
            <div className="rpanel-profile-stats">
              <div className="rpanel-profile-stat">
                <span className="rpanel-profile-stat-l">NFTs Staked</span>
                <span className="rpanel-profile-stat-v">—</span>
              </div>
              <div className="rpanel-profile-stat">
                <span className="rpanel-profile-stat-l">Total Points</span>
                <span className="rpanel-profile-stat-v">—</span>
              </div>
              <div className="rpanel-profile-stat">
                <span className="rpanel-profile-stat-l">Raffles Entered</span>
                <span className="rpanel-profile-stat-v">—</span>
              </div>
            </div>
          </div>
        </div>

      </aside>
    </>
  )
}
